import { ref } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useStock } from './useStock'

const processing = ref(false)
const error = ref(null)

export function useCheckout() {
  const { decrementStockForOrder } = useStock()

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
        
        // Informations client
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone || '',
          address: customer.address || {}
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
      
      console.log('✅ Commande créée avec succès:', docRef.id)
      
      // Décrémenter le stock immédiatement après la création de la commande
      // (ou tu peux le faire seulement quand le paiement est confirmé)
      const stockResult = await decrementStockForOrder(orderData.items)
      
      if (!stockResult.success) {
        console.warn('⚠️ Attention: Stock non décrémenté:', stockResult.error)
        // La commande est créée mais le stock n'a pas été mis à jour
        // Tu peux choisir de gérer ça différemment
      }

      processing.value = false
      return { 
        success: true, 
        orderId: docRef.id,
        orderNumber: orderData.orderNumber
      }

    } catch (err) {
      console.error('❌ Erreur création commande:', err)
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
      console.error('❌ Erreur processus checkout:', err)
      return {
        success: false,
        error: err.message
      }
    }
  }

  return {
    processing,
    error,
    createOrder,
    processCheckout,
    generateOrderNumber
  }
}
