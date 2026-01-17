import { ref } from 'vue'
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, onSnapshot, query } from 'firebase/firestore'
import { db } from '@/config/firebase'

const stockData = ref([])
const loading = ref(false)
let unsubscribe = null

export function useStock() {

  const loadStock = () => {
    // Clean up previous listener if exists
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }

    loading.value = true

    const stockCollectionRef = collection(db, 'stock')

    unsubscribe = onSnapshot(query(stockCollectionRef), (snapshot) => {
      stockData.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      loading.value = false
    }, () => {
      loading.value = false
    })

    return unsubscribe
  }

  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  const updateDesignStock = async (designId, stockUpdate) => {
    try {
      const stockRef = doc(db, 'stock', designId)

      await setDoc(stockRef, {
        quantity: stockUpdate.quantity || 0,
        lastUpdated: new Date()
      }, { merge: true })

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const decrementStock = async (designId, quantity = 1, garmentType = null) => {
    try {
      const stockRef = doc(db, 'stock', designId)
      const docSnap = await getDoc(stockRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        const currentQuantity = data.quantity || 0
        const salesStats = data.salesStats || { tshirt: 0, hoodie: 0, total: 0 }

        const newQuantity = Math.max(0, currentQuantity - quantity)

        // Mettre à jour les stats de ventes
        if (garmentType === 'tshirt' || garmentType === 'hoodie') {
          salesStats[garmentType] = (salesStats[garmentType] || 0) + quantity
        }
        salesStats.total = (salesStats.total || 0) + quantity

        await updateDoc(stockRef, {
          quantity: newQuantity,
          salesStats: salesStats,
          lastUpdated: new Date()
        })

        return { success: true, newQuantity }
      }

      return { success: false, error: 'Stock non trouvé' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const checkStockAvailable = (designId, quantity = 1) => {
    const stock = stockData.value.find(s => s.id === designId)
    if (!stock) return false
    return (stock.quantity || 0) >= quantity
  }

  const getStockQuantity = (designId) => {
    const stock = stockData.value.find(s => s.id === designId)
    return stock?.quantity || 0
  }

  const decrementStockForOrder = async (orderItems) => {
    try {
      const updates = []

      for (const item of orderItems) {
        if (item.designSlug || item.designId) {
          const designId = item.designSlug || item.designId
          const quantity = item.quantity || 1
          const garmentType = item.type // 'tshirt' ou 'hoodie'

          updates.push(decrementStock(designId, quantity, garmentType))
        }
      }

      await Promise.all(updates)

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return {
    stockData,
    loading,
    loadStock,
    updateDesignStock,
    decrementStock,
    checkStockAvailable,
    getStockQuantity,
    decrementStockForOrder,
    cleanup
  }
}
