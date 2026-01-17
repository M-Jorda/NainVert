import { ref } from 'vue'
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useStock } from './useStock'
import { useClients } from './useClients'
import { formatAmountForStripe } from '@/services/stripe'

const processing = ref(false)
const error = ref(null)

export function useCheckout() {
  const { decrementStockForOrder } = useStock()
  const { getClientId } = useClients()

  /**
   * Récupère les tags et notes d'un client depuis Firestore
   * @param {string} email - Email du client
   * @returns {Object} - { tag, privateNote }
   */
  const getClientTags = async (email) => {
    try {
      const clientId = getClientId(email)
      if (!clientId) return { tag: '', privateNote: '' }

      const clientRef = doc(db, 'clients', clientId)
      const clientSnap = await getDoc(clientRef)

      if (clientSnap.exists()) {
        const data = clientSnap.data()
        return {
          tag: data.tag || '',
          privateNote: data.privateNote || ''
        }
      }

      return { tag: '', privateNote: '' }
    } catch (err) {
      return { tag: '', privateNote: '' }
    }
  }

  /**
   * Vérifie la disponibilité du stock pour tous les articles
   * Fetch directement depuis Firestore pour garantir des données à jour
   * @param {Array} items - Articles du panier
   * @returns {Object} - { available: boolean, outOfStockItems: Array }
   */
  const validateStockForItems = async (items) => {
    const outOfStockItems = []

    for (const item of items) {
      const designId = item.designSlug || item.designId
      if (!designId) continue

      // Fetch le stock directement depuis Firestore pour garantir des données à jour
      const stockRef = doc(db, 'stock', designId)
      const stockSnap = await getDoc(stockRef)

      let stockQty = 0
      if (stockSnap.exists()) {
        stockQty = stockSnap.data().quantity || 0
      }

      const requestedQty = item.quantity || 1

      if (stockQty < requestedQty) {
        outOfStockItems.push({
          name: item.designName || item.name,
          designId,
          requested: requestedQty,
          available: stockQty
        })
      }
    }

    return {
      available: outOfStockItems.length === 0,
      outOfStockItems
    }
  }

  /**
   * Crée une nouvelle commande en BDD
   * @param {Object} params - Paramètres de la commande
   * @param {Array} params.items - Articles du panier
   * @param {Object} params.customer - Informations client
   * @param {Number} params.total - Montant total
   * @returns {Object} - { success, orderId, error }
   */
  const createOrder = async ({ items, customer, total, shipping }) => {
    processing.value = true
    error.value = null

    try {
      // Validation des données
      if (!items || items.length === 0) {
        throw new Error('Le panier est vide')
      }

      if (!customer || !customer.email || !customer.name) {
        throw new Error('Informations client manquantes')
      }

      // Vérifier la disponibilité du stock AVANT de créer la commande
      const stockValidation = await validateStockForItems(items)
      if (!stockValidation.available) {
        const outOfStockNames = stockValidation.outOfStockItems.map(item => {
          if (item.available === 0) {
            return `${item.name} (rupture de stock)`
          }
          return `${item.name} (seulement ${item.available} disponible${item.available > 1 ? 's' : ''})`
        }).join(', ')
        throw new Error(`Produit(s) en rupture de stock : ${outOfStockNames}`)
      }

      // Récupérer les tags du client
      const clientTags = await getClientTags(customer.email)

      // Préparer les données de la commande
      const orderData = {
        // Numéro de commande unique
        orderNumber: generateOrderNumber(),
        
        // Statut initial
        status: 'pending', // pending, paid, shipped, delivered, cancelled
        
        // Articles
        items: items.map(item => ({
          id: item.id,
          name: item.designName || item.name, // Support ancien et nouveau format
          slug: item.designSlug || item.slug, // Support ancien et nouveau format
          type: item.type || null, // Type de vêtement (tshirt, hoodie)
          price: item.price,
          size: item.size,
          quantity: item.quantity,
          image: item.image,
          designId: item.designId || null // Important pour la gestion du stock
        })),
        
        // Montants
        subtotal: total,
        shipping: shipping?.cost || 0,
        total: total + (shipping?.cost || 0),
        
        // Informations client (avec tags récupérés de la fiche client)
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone || '',
          address: customer.address || {},
          tag: clientTags.tag,
          privateNote: clientTags.privateNote
        },
        
        // Informations de livraison
        shipping: {
          method: shipping?.method || 'standard',
          address: shipping?.address || customer.address || {},
          trackingNumber: null,
          estimatedDelivery: shipping?.estimatedDelivery || null
        },
        
        // Paiement
        payment: {
          method: 'pending', // À mettre à jour quand le paiement est effectué
          status: 'pending',
          transactionId: null
        },
        
        // Métadonnées
        notes: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      // Créer la commande dans Firestore
      const docRef = await addDoc(collection(db, 'orders'), orderData)

      // Décrémenter le stock immédiatement après la création de la commande
      await decrementStockForOrder(orderData.items)

      processing.value = false
      return { 
        success: true, 
        orderId: docRef.id,
        orderNumber: orderData.orderNumber
      }

    } catch (err) {
      error.value = err.message
      processing.value = false
      return { 
        success: false, 
        error: err.message 
      }
    }
  }

  /**
   * Génère un numéro de commande unique
   * Format: NV-YYYYMMDD-XXXXX
   */
  const generateOrderNumber = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const random = String(Math.floor(Math.random() * 99999)).padStart(5, '0')
    
    return `NV-${year}${month}${day}-${random}`
  }

  /**
   * Processus de checkout complet
   * Cette fonction peut être étendue pour inclure le paiement
   */
  const processCheckout = async (cartItems, customerInfo, shippingInfo) => {
    try {
      // Calculer le total
      const subtotal = cartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity)
      }, 0)

      // Créer la commande
      const result = await createOrder({
        items: cartItems,
        customer: customerInfo,
        total: subtotal,
        shipping: shippingInfo
      })

      return result

    } catch (err) {
      return {
        success: false,
        error: err.message
      }
    }
  }

  /**
   * Crée un PaymentIntent Stripe pour une commande
   * @param {Object} params
   * @param {number} params.amount - Montant en euros
   * @param {string} params.orderNumber - Numéro de commande
   * @param {Object} params.customer - Infos client
   * @returns {Promise<{clientSecret: string, paymentIntentId: string}>}
   */
  const createPaymentIntent = async ({ amount, orderNumber, customer }) => {
    processing.value = true
    error.value = null

    try {
      const FUNCTION_URL = import.meta.env.VITE_STRIPE_FUNCTION_URL

      if (!FUNCTION_URL || FUNCTION_URL.includes('VOTRE_PROJECT_ID')) {
        throw new Error('URL de la fonction Stripe non configurée. Voir .env')
      }

      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: formatAmountForStripe(amount),
          currency: 'eur',
          orderId: orderNumber,
          customer: {
            email: customer.email,
            name: customer.name
          },
          metadata: {
            orderId: orderNumber,
            customerEmail: customer.email
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur création paiement')
      }

      const data = await response.json()
      return data

    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      processing.value = false
    }
  }

  /**
   * Met à jour le statut de paiement d'une commande
   * @param {string} orderId - ID du document Firestore
   * @param {Object} paymentData - Données de paiement
   */
  const updatePaymentStatus = async (orderId, paymentData) => {
    try {
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        status: paymentData.status === 'succeeded' ? 'paid' : 'pending',
        'payment.status': paymentData.status,
        'payment.method': 'stripe',
        'payment.transactionId': paymentData.paymentIntentId,
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      // Silent error handling for payment status update
    }
  }

  return {
    processing,
    error,
    createOrder,
    processCheckout,
    createPaymentIntent,
    updatePaymentStatus,
    generateOrderNumber
  }
}
