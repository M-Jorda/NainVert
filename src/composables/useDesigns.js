import { ref, computed } from 'vue'
import { collection, getDocs, doc, getDoc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

const designs = ref([])
const loading = ref(false)
const error = ref(null)

export function useDesigns() {

  const loadDesigns = async () => {
    if (designs.value.length > 0) {
      return designs.value
    }

    loading.value = true
    error.value = null

    try {
      const querySnapshot = await getDocs(collection(db, 'designs'))
      designs.value = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
    } catch (err) {
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
        return null
      }
    } catch (err) {
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

      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  const createDesign = async (designData) => {
    try {
      const docRef = doc(db, 'designs', designData.slug)
      await setDoc(docRef, designData)

      designs.value.push({ id: designData.slug, ...designData })

      // Initialiser le stock à 100
      const stockRef = doc(db, 'stock', designData.slug)
      await setDoc(stockRef, {
        quantity: 100,
        salesStats: {
          tshirt: 0,
          hoodie: 0,
          total: 0
        },
        lastUpdated: new Date(),
        createdAt: new Date()
      })

      return { success: true }
    } catch (err) {
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

      return { success: true }
    } catch (err) {
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
