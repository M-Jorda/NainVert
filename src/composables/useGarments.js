import { ref } from 'vue'
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

const garments = ref([])
const loading = ref(false)
const error = ref(null)

export function useGarments() {
  /**
   * Charge tous les vêtements depuis Firestore
   */
  const loadGarments = async () => {
    loading.value = true
    error.value = null

    try {
      const querySnapshot = await getDocs(collection(db, 'garments'))
      garments.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupère un vêtement par son type
   */
  const getGarmentByType = (type) => {
    return garments.value.find(g => g.type === type)
  }

  /**
   * Crée un nouveau vêtement
   */
  const createGarment = async (garmentData) => {
    loading.value = true
    error.value = null

    try {
      const docRef = await addDoc(collection(db, 'garments'), {
        ...garmentData,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const newGarment = {
        id: docRef.id,
        ...garmentData,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      garments.value.push(newGarment)

      return { success: true, garment: newGarment }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Met à jour un vêtement
   */
  const updateGarment = async (garmentId, updates) => {
    loading.value = true
    error.value = null

    try {
      const garmentRef = doc(db, 'garments', garmentId)
      await updateDoc(garmentRef, {
        ...updates,
        updatedAt: new Date()
      })

      // Mettre à jour localement
      const index = garments.value.findIndex(g => g.id === garmentId)
      if (index !== -1) {
        garments.value[index] = {
          ...garments.value[index],
          ...updates,
          updatedAt: new Date()
        }
      }

      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Supprime un vêtement
   */
  const deleteGarment = async (garmentId) => {
    loading.value = true
    error.value = null

    try {
      await deleteDoc(doc(db, 'garments', garmentId))

      // Supprimer localement
      garments.value = garments.value.filter(g => g.id !== garmentId)

      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    garments,
    loading,
    error,
    loadGarments,
    getGarmentByType,
    createGarment,
    updateGarment,
    deleteGarment
  }
}
