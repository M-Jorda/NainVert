import { ref } from 'vue'
import { collection, doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/config/firebase'

const stockData = ref([])
const loading = ref(false)

export function useStock() {
  
  const loadStock = () => {
    loading.value = true
    
    const stockRef = doc(db, 'settings', 'stock')
    
    const unsubscribe = onSnapshot(stockRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        stockData.value = data.designs || []
      } else {
        console.log('📦 Initialisation du stock...')
        initializeStock()
      }
      loading.value = false
    }, (error) => {
      console.error('❌ Erreur chargement stock:', error)
      loading.value = false
    })
    
    return unsubscribe
  }

  const initializeStock = async () => {
    const initialStock = {
      designs: [
        {
          id: 'design-1',
          name: 'Dessin 1',
          totalUnits: 100,
          remainingUnits: 100,
          products: []
        },
        {
          id: 'design-2',
          name: 'Dessin 2',
          totalUnits: 100,
          remainingUnits: 100,
          products: []
        }
      ],
      lastUpdated: new Date()
    }

    try {
      await setDoc(doc(db, 'settings', 'stock'), initialStock)
      console.log('✅ Stock initialisé')
      stockData.value = initialStock.designs
    } catch (error) {
      console.error('❌ Erreur initialisation stock:', error)
    }
  }

  const updateDesignStock = async (designId, newRemainingUnits) => {
    try {
      const stockRef = doc(db, 'settings', 'stock')
      const docSnap = await getDoc(stockRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        const designs = data.designs || []
        const designIndex = designs.findIndex(d => d.id === designId)
        
        if (designIndex !== -1) {
          designs[designIndex].remainingUnits = newRemainingUnits
          
          await updateDoc(stockRef, {
            designs: designs,
            lastUpdated: new Date()
          })
          
          console.log('✅ Stock mis à jour pour', designId)
          return { success: true }
        }
      }
      
      return { success: false, error: 'Dessin non trouvé' }
    } catch (error) {
      console.error('❌ Erreur mise à jour stock:', error)
      return { success: false, error: error.message }
    }
  }

  const updateDesignName = async (designId, newName) => {
    try {
      const stockRef = doc(db, 'settings', 'stock')
      const docSnap = await getDoc(stockRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        const designs = data.designs || []
        const designIndex = designs.findIndex(d => d.id === designId)
        
        if (designIndex !== -1) {
          designs[designIndex].name = newName
          
          await updateDoc(stockRef, {
            designs: designs,
            lastUpdated: new Date()
          })
          
          console.log('✅ Nom mis à jour pour', designId)
          return { success: true }
        }
      }
      
      return { success: false, error: 'Dessin non trouvé' }
    } catch (error) {
      console.error('❌ Erreur mise à jour nom:', error)
      return { success: false, error: error.message }
    }
  }

  const decrementStock = async (designId, quantity = 1) => {
    try {
      const stockRef = doc(db, 'settings', 'stock')
      const docSnap = await getDoc(stockRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        const designs = data.designs || []
        const designIndex = designs.findIndex(d => d.id === designId)
        
        if (designIndex !== -1) {
          const currentRemaining = designs[designIndex].remainingUnits
          const newRemaining = Math.max(0, currentRemaining - quantity)
          
          designs[designIndex].remainingUnits = newRemaining
          
          await updateDoc(stockRef, {
            designs: designs,
            lastUpdated: new Date()
          })
          
          console.log(`✅ Stock décrémenté: ${designId} (-${quantity})`)
          return { success: true, newRemaining }
        }
      }
      
      return { success: false, error: 'Dessin non trouvé' }
    } catch (error) {
      console.error('❌ Erreur décrémentation stock:', error)
      return { success: false, error: error.message }
    }
  }

  const checkStockAvailable = (designId, quantity = 1) => {
    const design = stockData.value.find(d => d.id === designId)
    if (!design) return false
    return design.remainingUnits >= quantity
  }

  const getStockPercentage = (designId) => {
    const design = stockData.value.find(d => d.id === designId)
    if (!design || design.totalUnits === 0) return 0
    return Math.round((design.remainingUnits / design.totalUnits) * 100)
  }

  const decrementStockForOrder = async (orderItems) => {
    try {
      const stockRef = doc(db, 'settings', 'stock')
      const docSnap = await getDoc(stockRef)
      
      if (!docSnap.exists()) {
        console.warn('⚠️ Stock non initialisé')
        return { success: false, error: 'Stock non initialisé' }
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
            
            console.log(`📦 Stock décrémenté: ${item.designId} (-${quantity}) -> ${newRemaining} unités restantes`)
          } else {
            console.warn(`⚠️ Dessin non trouvé: ${item.designId}`)
          }
        }
      }

      if (updated) {
        await updateDoc(stockRef, {
          designs: designs,
          lastUpdated: new Date()
        })
        
        console.log('✅ Stock mis à jour suite à livraison')
        return { success: true }
      }

      return { success: false, error: 'Aucun article avec designId trouvé' }
    } catch (error) {
      console.error('❌ Erreur décrémentation stock pour commande:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    stockData,
    loading,
    loadStock,
    initializeStock,
    updateDesignStock,
    updateDesignName,
    decrementStock,
    checkStockAvailable,
    getStockPercentage,
    decrementStockForOrder
  }
}
