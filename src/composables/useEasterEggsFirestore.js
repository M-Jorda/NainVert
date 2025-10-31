import { ref } from 'vue'
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

const easterEggs = ref([])
const loading = ref(false)

export function useEasterEggsFirestore() {
  const isModalOpen = ref(false)
  const currentContent = ref(null)

  // Load Easter Eggs from Firestore
  const loadEasterEggs = async () => {
    if (easterEggs.value.length > 0) {
      console.log('✅ Easter Eggs déjà en cache')
      return easterEggs.value
    }

    loading.value = true
    try {
      const q = query(collection(db, 'easterEggs'), orderBy('order', 'asc'))
      const snapshot = await getDocs(q)
      
      easterEggs.value = snapshot.docs.map(doc => ({
        id: doc.id,
        key: doc.id,
        ...doc.data()
      }))
      
      console.log(`✅ ${easterEggs.value.length} Easter Eggs chargés depuis Firestore`)
      return easterEggs.value
    } catch (error) {
      console.error('❌ Erreur chargement Easter Eggs:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  // Update an Easter Egg
  const updateEasterEgg = async (eggKey, data) => {
    try {
      const docRef = doc(db, 'easterEggs', eggKey)
      await updateDoc(docRef, data)
      
      // Update cache
      const index = easterEggs.value.findIndex(egg => egg.key === eggKey)
      if (index !== -1) {
        easterEggs.value[index] = { ...easterEggs.value[index], ...data }
      }
      
      console.log(`✅ Easter Egg mis à jour: ${eggKey}`)
      return true
    } catch (error) {
      console.error('❌ Erreur mise à jour Easter Egg:', error)
      return false
    }
  }

  // Get Easter Egg by key
  const getEasterEggByKey = (key) => {
    return easterEggs.value.find(egg => egg.key === key)
  }

  // Open Easter Egg modal
  const openEasterEgg = (contentKey) => {
    const egg = getEasterEggByKey(contentKey)
    if (egg && egg.active) {
      currentContent.value = egg
      isModalOpen.value = true
    }
  }

  // Close Easter Egg modal
  const closeEasterEgg = () => {
    isModalOpen.value = false
  }

  return {
    easterEggs,
    loading,
    isModalOpen,
    currentContent,
    loadEasterEggs,
    updateEasterEgg,
    getEasterEggByKey,
    openEasterEgg,
    closeEasterEgg
  }
}
