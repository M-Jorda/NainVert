import { ref, computed } from 'vue'
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/config/firebase'

// Global state shared across components
const clients = ref([])
const loading = ref(false)
let unsubscribe = null

/**
 * Composable for centralized client/tag management
 * Clients are identified by their email address (normalized to lowercase)
 */
export function useClients() {

  /**
   * Generate a client ID from email (normalized)
   */
  const getClientId = (email) => {
    if (!email) return null
    return email.toLowerCase().trim().replace(/[.#$[\]]/g, '_')
  }

  /**
   * Load all clients from Firestore
   */
  const loadClients = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }

    loading.value = true

    const q = query(collection(db, 'clients'), orderBy('lastOrderAt', 'desc'))

    unsubscribe = onSnapshot(q, (snapshot) => {
      clients.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      loading.value = false
    }, () => {
      // Silently handle Firestore errors
      loading.value = false
    })

    return unsubscribe
  }

  /**
   * Get or create a client document
   */
  const getOrCreateClient = async (email, customerData = {}) => {
    const clientId = getClientId(email)
    if (!clientId) return null

    const clientRef = doc(db, 'clients', clientId)
    const clientSnap = await getDoc(clientRef)

    if (clientSnap.exists()) {
      return { id: clientId, ...clientSnap.data() }
    }

    // Create new client
    const newClient = {
      email: email.toLowerCase().trim(),
      name: customerData.name || '',
      phone: customerData.phone || '',
      tag: '',
      tagComment: '',
      privateNote: '',
      orderCount: 0,
      totalSpent: 0,
      firstOrderAt: serverTimestamp(),
      lastOrderAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    await setDoc(clientRef, newClient)
    return { id: clientId, ...newClient }
  }

  /**
   * Update client tag and propagate to all orders
   */
  const updateClientTag = async (email, tag, privateNote = '') => {
    const clientId = getClientId(email)
    if (!clientId) {
      return { success: false, error: 'Email invalide' }
    }

    try {
      const clientRef = doc(db, 'clients', clientId)
      const clientSnap = await getDoc(clientRef)

      // Get current tag for comparison
      let previousTag = ''
      if (clientSnap.exists()) {
        previousTag = clientSnap.data().tag || ''
      }

      // Update client document
      const updateData = {
        tag,
        privateNote,
        tagUpdatedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      if (clientSnap.exists()) {
        await updateDoc(clientRef, updateData)
      } else {
        // Create client if doesn't exist
        await setDoc(clientRef, {
          email: email.toLowerCase().trim(),
          name: '',
          tag,
          privateNote,
          orderCount: 0,
          totalSpent: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          tagUpdatedAt: serverTimestamp()
        })
      }

      // Propagate tag to all orders from this client
      await propagateTagToOrders(email, tag)

      // Also propagate note to all orders
      if (privateNote) {
        await propagateNoteToOrders(email, privateNote)
      }

      return {
        success: true,
        previousTag,
        newTag: tag,
        isNewTag: !previousTag && tag,
        isTagChanged: previousTag !== tag
      }

    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Update client private note
   */
  const updateClientNote = async (email, privateNote) => {
    const clientId = getClientId(email)
    if (!clientId) {
      return { success: false, error: 'Email invalide' }
    }

    try {
      const clientRef = doc(db, 'clients', clientId)
      const clientSnap = await getDoc(clientRef)

      if (clientSnap.exists()) {
        await updateDoc(clientRef, {
          privateNote,
          updatedAt: serverTimestamp()
        })
      } else {
        await setDoc(clientRef, {
          email: email.toLowerCase().trim(),
          name: '',
          tag: '',
          tagComment: '',
          privateNote,
          orderCount: 0,
          totalSpent: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }

      // Propagate note to all orders
      await propagateNoteToOrders(email, privateNote)

      return { success: true }

    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Propagate tag to all orders from a client
   */
  const propagateTagToOrders = async (email, tag) => {
    try {
      const ordersRef = collection(db, 'orders')
      const q = query(ordersRef, where('customer.email', '==', email.toLowerCase().trim()))
      const snapshot = await getDocs(q)

      if (snapshot.empty) return

      const batch = writeBatch(db)

      snapshot.docs.forEach((docSnap) => {
        batch.update(docSnap.ref, {
          'customer.tag': tag,
          updatedAt: serverTimestamp()
        })
      })

      await batch.commit()
    } catch (error) {
      // Silently handle propagation errors
    }
  }

  /**
   * Propagate private note to all orders from a client
   */
  const propagateNoteToOrders = async (email, privateNote) => {
    try {
      const ordersRef = collection(db, 'orders')
      const q = query(ordersRef, where('customer.email', '==', email.toLowerCase().trim()))
      const snapshot = await getDocs(q)

      if (snapshot.empty) return

      const batch = writeBatch(db)

      snapshot.docs.forEach((docSnap) => {
        batch.update(docSnap.ref, {
          'customer.privateNote': privateNote,
          updatedAt: serverTimestamp()
        })
      })

      await batch.commit()
    } catch (error) {
      // Silently handle propagation errors
    }
  }

  /**
   * Get client by email
   */
  const getClientByEmail = (email) => {
    const clientId = getClientId(email)
    return clients.value.find(c => c.id === clientId) || null
  }

  /**
   * Update client stats when an order is created/updated
   */
  const updateClientStats = async (email, orderData) => {
    const clientId = getClientId(email)
    if (!clientId) return

    try {
      const clientRef = doc(db, 'clients', clientId)
      const clientSnap = await getDoc(clientRef)

      if (clientSnap.exists()) {
        const currentData = clientSnap.data()
        await updateDoc(clientRef, {
          name: orderData.customer?.name || currentData.name,
          phone: orderData.customer?.phone || currentData.phone,
          orderCount: (currentData.orderCount || 0) + 1,
          totalSpent: (currentData.totalSpent || 0) + (orderData.total || 0),
          lastOrderAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      } else {
        // Create new client from order
        await setDoc(clientRef, {
          email: email.toLowerCase().trim(),
          name: orderData.customer?.name || '',
          phone: orderData.customer?.phone || '',
          tag: '',
          tagComment: '',
          privateNote: '',
          orderCount: 1,
          totalSpent: orderData.total || 0,
          firstOrderAt: serverTimestamp(),
          lastOrderAt: serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
    } catch (error) {
      // Silently handle stats update errors
    }
  }

  /**
   * Get available tag options
   */
  const tagOptions = [
    { value: '', label: 'Aucun tag', icon: '' },
    { value: 'vip', label: 'VIP - Client premium', icon: '⭐' },
    { value: 'good', label: 'Bon client', icon: '👍' },
    { value: 'neutral', label: 'Neutre', icon: '😐' },
    { value: 'watch', label: 'À surveiller', icon: '⚠️' },
    { value: 'problematic', label: 'Problématique', icon: '🚫' }
  ]

  /**
   * Get tag display info
   */
  const getTagInfo = (tag) => {
    return tagOptions.find(t => t.value === tag) || tagOptions[0]
  }

  /**
   * Cleanup listener
   */
  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  return {
    clients,
    loading,
    tagOptions,
    loadClients,
    getOrCreateClient,
    getClientByEmail,
    getClientId,
    updateClientTag,
    updateClientNote,
    updateClientStats,
    propagateTagToOrders,
    propagateNoteToOrders,
    getTagInfo,
    cleanup
  }
}
