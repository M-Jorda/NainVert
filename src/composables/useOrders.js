import { ref, computed } from 'vue'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc, where, getDocs, serverTimestamp, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

// État global partagé
const orders = ref([])
const loading = ref(false)
let unsubscribe = null

export function useOrders() {
  /**
   * Charge toutes les commandes depuis Firestore
   */
  const loadOrders = () => {
    loading.value = true
    
    if (unsubscribe) {
      unsubscribe()
    }

    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    )

    unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      orders.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      loading.value = false
    }, (error) => {
      console.error('Erreur chargement commandes:', error)
      loading.value = false
    })
  }

  /**
   * Met à jour le statut d'une commande
   * Si le statut passe à 'delivered', décrémente automatiquement le stock
   */
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId)
      
      const orderSnap = await getDoc(orderRef)
      if (!orderSnap.exists()) {
        return { success: false, error: 'Commande non trouvée' }
      }
      
      const orderData = orderSnap.data()
      const previousStatus = orderData.status
      
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      })
      
      if (newStatus === 'delivered' && previousStatus !== 'delivered') {
        console.log('📦 Commande livrée - Décrémentation du stock...')
        await decrementStockForDeliveredOrder(orderData.items || [])
      }
      
      return { success: true }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error)
      return { success: false, error: error.message }
    }
  }

  const decrementStockForDeliveredOrder = async (orderItems) => {
    try {
      const stockRef = doc(db, 'settings', 'stock')
      const docSnap = await getDoc(stockRef)
      
      if (!docSnap.exists()) {
        console.warn('⚠️ Stock non initialisé - impossible de décrémenter')
        return
      }

      const data = docSnap.data()
      const designs = data.designs || []
      let updated = false

      for (const item of orderItems) {
        if (item.designId) {
          const designIndex = designs.findIndex(d => d.id === item.designId)
          
          if (designIndex !== -1) {
            const quantity = item.quantity || 1
            const currentRemaining = designs[designIndex].remainingUnits
            const newRemaining = Math.max(0, currentRemaining - quantity)
            
            designs[designIndex].remainingUnits = newRemaining
            updated = true
            
            console.log(`✅ Stock décrémenté: ${item.designId} (-${quantity}) -> ${newRemaining} unités restantes`)
          } else {
            console.warn(`⚠️ Dessin non trouvé pour l'article: ${item.designId}`)
          }
        } else {
          console.warn(`⚠️ Article sans designId:`, item.name)
        }
      }

      if (updated) {
        await updateDoc(stockRef, {
          designs: designs,
          lastUpdated: serverTimestamp()
        })
        
        console.log('✅ Stock mis à jour suite à livraison')
      }
    } catch (error) {
      console.error('❌ Erreur décrémentation stock:', error)
    }
  }

  /**
   * Ajoute un numéro de tracking
   */
  const addTrackingNumber = async (orderId, trackingNumber) => {
    try {
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        'shipping.trackingNumber': trackingNumber,
        status: 'shipped',
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error('Erreur ajout tracking:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Ajoute une note interne
   */
  const addOrderNote = async (orderId, note) => {
    try {
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        notes: note,
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error('Erreur ajout note:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Crée une nouvelle commande (pour tests ou admin)
   */
  const createOrder = async (orderData) => {
    try {
      const newOrder = {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      const docRef = await addDoc(collection(db, 'orders'), newOrder)
      return { success: true, orderId: docRef.id }
    } catch (error) {
      console.error('Erreur création commande:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Supprime une commande (admin seulement, avec précaution)
   */
  const deleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId))
      return { success: true }
    } catch (error) {
      console.error('Erreur suppression commande:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Filtre les commandes par statut
   */
  const getOrdersByStatus = (status) => {
    return computed(() => {
      if (!status || status === 'all') {
        return orders.value
      }
      return orders.value.filter(order => order.status === status)
    })
  }

  /**
   * Recherche de commandes par email client
   */
  const searchOrdersByEmail = async (email) => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('customer.email', '==', email),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Erreur recherche commandes:', error)
      return []
    }
  }

  /**
   * Statistiques
   */
  const orderStats = computed(() => {
    const stats = {
      total: orders.value.length,
      pending: 0,
      paid: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0
    }

    orders.value.forEach(order => {
      stats[order.status] = (stats[order.status] || 0) + 1
      if (order.status !== 'cancelled') {
        stats.totalRevenue += order.total || 0
      }
    })

    return stats
  })

  /**
   * Nettoie le listener
   */
  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  return {
    orders,
    loading,
    loadOrders,
    updateOrderStatus,
    addTrackingNumber,
    addOrderNote,
    createOrder,
    deleteOrder,
    getOrdersByStatus,
    searchOrdersByEmail,
    orderStats,
    cleanup
  }
}
