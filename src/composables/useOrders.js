import { ref, computed } from 'vue'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc, where, getDocs, serverTimestamp } from 'firebase/firestore'
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
   */
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId)
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error)
      return { success: false, error: error.message }
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
