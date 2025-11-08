import { ref, computed } from 'vue'
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

const designs = ref([])
const loading = ref(false)
const error = ref(null)

export function useDesigns() {
  
  const loadDesigns = async () => {
    if (designs.value.length > 0) {
      console.log('✅ Designs déjà en cache:', designs.value.length)
      return designs.value
    }

    loading.value = true
    error.value = null

    try {
      console.log('🔄 Chargement des designs depuis Firestore...')
      const querySnapshot = await getDocs(collection(db, 'designs'))
      designs.value = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      console.log('✅ Designs chargés depuis Firestore:', designs.value.length)
      console.log('🎨 Designs:', designs.value)
    } catch (err) {
      console.error('❌ Erreur lors du chargement des designs:', err)
      console.error('❌ Détails:', err.code, err.message)
      error.value = err.message
    } finally {
      loading.value = false
    }

    return designs.value
  }

  const getDesignBySlug = async (slug) => {
    try {
      const docRef = doc(db, 'designs', slug)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        }
      } else {
        console.warn(`⚠️ Design non trouvé: ${slug}`)
        return null
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement du design:', err)
      error.value = err.message
      return null
    }
  }

  const getFeaturedDesigns = computed(() => {
    return designs.value.filter(design => design.featured === true)
  })

  const updateDesign = async (slug, data) => {
    try {
      const docRef = doc(db, 'designs', slug)
      await updateDoc(docRef, data)
      
      const index = designs.value.findIndex(d => d.slug === slug)
      if (index !== -1) {
        designs.value[index] = { ...designs.value[index], ...data }
      }
      
      console.log('✅ Design mis à jour:', slug)
      return { success: true }
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour du design:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  const createDesign = async (designData) => {
    try {
      const docRef = doc(db, 'designs', designData.slug)
      await setDoc(docRef, designData)
      
      designs.value.push({ id: designData.slug, ...designData })
      
      console.log('✅ Design créé:', designData.slug)
      return { success: true }
    } catch (err) {
      console.error('❌ Erreur lors de la création du design:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  const deleteDesign = async (slug) => {
    try {
      await deleteDoc(doc(db, 'designs', slug))
      
      const index = designs.value.findIndex(d => d.slug === slug)
      if (index !== -1) {
        designs.value.splice(index, 1)
      }
      
      console.log('✅ Design supprimé:', slug)
      return { success: true }
    } catch (err) {
      console.error('❌ Erreur lors de la suppression du design:', err)
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  const refreshDesigns = async () => {
    designs.value = []
    return await loadDesigns()
  }

  return {
    designs,
    loading,
    error,
    loadDesigns,
    getDesignBySlug,
    getFeaturedDesigns,
    updateDesign,
    createDesign,
    deleteDesign,
    refreshDesigns
  }
}
