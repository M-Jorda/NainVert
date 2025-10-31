import { ref, computed } from 'vue'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc, where, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

const refunds = ref([])
const loading = ref(false)
let unsubscribe = null

export function useRefunds() {
  const loadRefunds = () => {
    loading.value = true
    if (unsubscribe) unsubscribe()
    const refundsQuery = query(collection(db, 'refunds'), orderBy('createdAt', 'desc'))
    unsubscribe = onSnapshot(refundsQuery, (snapshot) => {
      refunds.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      loading.value = false
    }, (error) => {
      console.error('Erreur chargement remboursements:', error)
      loading.value = false
    })
  }

  const createRefund = async (refundData) => {
    try {
      const newRefund = {
        ...refundData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      const docRef = await addDoc(collection(db, 'refunds'), newRefund)
      return { success: true, refundId: docRef.id }
    } catch (error) {
      console.error('Erreur création remboursement:', error)
      return { success: false, error: error.message }
    }
  }

  const updateRefundStatus = async (refundId, newStatus) => {
    try {
      const refundRef = doc(db, 'refunds', refundId)
      await updateDoc(refundRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error('Erreur mise à jour statut remboursement:', error)
      return { success: false, error: error.message }
    }
  }

  const addRefundNote = async (refundId, note) => {
    try {
      const refundRef = doc(db, 'refunds', refundId)
      await updateDoc(refundRef, {
        notes: note,
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error('Erreur ajout note remboursement:', error)
      return { success: false, error: error.message }
    }
  }

  const deleteRefund = async (refundId) => {
    try {
      await deleteDoc(doc(db, 'refunds', refundId))
      return { success: true }
    } catch (error) {
      console.error('Erreur suppression remboursement:', error)
      return { success: false, error: error.message }
    }
  }

  const getRefundsByStatus = (status) => {
    return computed(() => {
      if (!status || status === 'all') return refunds.value
      return refunds.value.filter(refund => refund.status === status)
    })
  }

  const searchRefundsByOrder = async (orderId) => {
    try {
      const q = query(collection(db, 'refunds'), where('orderId', '==', orderId), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Erreur recherche remboursements:', error)
      return []
    }
  }

  const refundStats = computed(() => {
    const stats = { total: refunds.value.length, requested: 0, approved: 0, rejected: 0, processed: 0 }
    refunds.value.forEach(refund => {
      stats[refund.status] = (stats[refund.status] || 0) + 1
    })
    return stats
  })

  const cleanup = () => { if (unsubscribe) { unsubscribe(); unsubscribe = null } }

  return {
    refunds,
    loading,
    loadRefunds,
    createRefund,
    updateRefundStatus,
    addRefundNote,
    deleteRefund,
    getRefundsByStatus,
    searchRefundsByOrder,
    refundStats,
    cleanup
  }
}
