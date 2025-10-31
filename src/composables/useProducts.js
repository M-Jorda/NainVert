import { ref, computed } from 'vue'
import { collection, getDocs, doc, getDoc, updateDoc, query, where } from 'firebase/firestore'
import { db } from '@/config/firebase'

// État global des produits (partagé entre tous les composants)
const products = ref([])
const loading = ref(false)
const error = ref(null)

export function useProducts() {
  
  // Charger tous les produits depuis Firestore
  const loadProducts = async () => {
    if (products.value.length > 0) {
      console.log('✅ Produits déjà en cache:', products.value.length)
      return products.value // Déjà chargés
    }

    loading.value = true
    error.value = null

    try {
      console.log('🔄 Chargement des produits depuis Firestore...')
      const querySnapshot = await getDocs(collection(db, 'products'))
      products.value = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      console.log('✅ Produits chargés depuis Firestore:', products.value.length)
      console.log('📦 Produits:', products.value)
    } catch (err) {
      console.error('❌ Erreur lors du chargement des produits:', err)
      console.error('❌ Détails:', err.code, err.message)
      error.value = err.message
    } finally {
      loading.value = false
    }

    return products.value
  }

  // Obtenir un produit par slug
  const getProductBySlug = async (slug) => {
    try {
      const docRef = doc(db, 'products', slug)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        }
      } else {
        console.warn(`⚠️ Produit non trouvé: ${slug}`)
        return null
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement du produit:', err)
      error.value = err.message
      return null
    }
  }

  // Obtenir les produits par type
  const getProductsByType = computed(() => (type) => {
    return products.value.filter(product => product.type === type)
  })

  // Obtenir les produits en vedette
  const getFeaturedProducts = computed(() => {
    return products.value.filter(product => product.featured === true)
  })

  // Mettre à jour un produit (pour l'admin)
  const updateProduct = async (slug, data) => {
    try {
      const docRef = doc(db, 'products', slug)
      await updateDoc(docRef, data)
      
      // Mettre à jour le cache local
      const index = products.value.findIndex(p => p.slug === slug)
      if (index !== -1) {
        products.value[index] = { ...products.value[index], ...data }
      }
      
      console.log('✅ Produit mis à jour:', slug)
      return true
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour du produit:', err)
      error.value = err.message
      return false
    }
  }

  // Rafraîchir les produits (force reload)
  const refreshProducts = async () => {
    products.value = []
    return await loadProducts()
  }

  return {
    products,
    loading,
    error,
    loadProducts,
    getProductBySlug,
    getProductsByType,
    getFeaturedProducts,
    updateProduct,
    refreshProducts
  }
}
