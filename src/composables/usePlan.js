import { ref } from 'vue'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'

const plan = ref(null)
const loading = ref(false)
const error = ref(null)

export function usePlan() {

  const loadPlan = async () => {
    if (plan.value) {
      return plan.value
    }

    loading.value = true
    error.value = null

    try {
      const docRef = doc(db, 'plans', 'main')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        plan.value = { id: docSnap.id, ...docSnap.data() }
      } else {
        plan.value = null
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }

    return plan.value
  }

  const savePlan = async (planData) => {
    loading.value = true
    error.value = null

    try {
      const docRef = doc(db, 'plans', 'main')
      const docSnap = await getDoc(docRef)

      const dataToSave = {
        ...planData,
        updatedAt: serverTimestamp()
      }

      if (docSnap.exists()) {
        await updateDoc(docRef, dataToSave)
      } else {
        dataToSave.createdAt = serverTimestamp()
        await setDoc(docRef, dataToSave)
      }

      plan.value = { id: 'main', ...planData }
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const addHotspot = async (hotspot) => {
    if (!plan.value) {
      return { success: false, error: 'Aucun plan chargé' }
    }

    const newHotspot = {
      id: `hotspot_${Date.now()}`,
      ...hotspot,
      isVisible: true
    }

    const updatedHotspots = [...(plan.value.hotspots || []), newHotspot]

    try {
      const docRef = doc(db, 'plans', 'main')
      await updateDoc(docRef, {
        hotspots: updatedHotspots,
        updatedAt: serverTimestamp()
      })

      plan.value.hotspots = updatedHotspots
      return { success: true, hotspot: newHotspot }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  const updateHotspot = async (hotspotId, updates) => {
    if (!plan.value?.hotspots) {
      return { success: false, error: 'Aucun hotspot' }
    }

    const updatedHotspots = plan.value.hotspots.map(h =>
      h.id === hotspotId ? { ...h, ...updates } : h
    )

    try {
      const docRef = doc(db, 'plans', 'main')
      await updateDoc(docRef, {
        hotspots: updatedHotspots,
        updatedAt: serverTimestamp()
      })

      plan.value.hotspots = updatedHotspots
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  const deleteHotspot = async (hotspotId) => {
    if (!plan.value?.hotspots) {
      return { success: false, error: 'Aucun hotspot' }
    }

    const updatedHotspots = plan.value.hotspots.filter(h => h.id !== hotspotId)

    try {
      const docRef = doc(db, 'plans', 'main')
      await updateDoc(docRef, {
        hotspots: updatedHotspots,
        updatedAt: serverTimestamp()
      })

      plan.value.hotspots = updatedHotspots
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  const togglePlanActive = async () => {
    if (!plan.value) {
      return { success: false, error: 'Aucun plan' }
    }

    const newActiveState = !plan.value.isActive

    try {
      const docRef = doc(db, 'plans', 'main')
      await updateDoc(docRef, {
        isActive: newActiveState,
        updatedAt: serverTimestamp()
      })

      plan.value.isActive = newActiveState
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  const refreshPlan = async () => {
    plan.value = null
    return await loadPlan()
  }

  return {
    plan,
    loading,
    error,
    loadPlan,
    savePlan,
    addHotspot,
    updateHotspot,
    deleteHotspot,
    togglePlanActive,
    refreshPlan
  }
}
