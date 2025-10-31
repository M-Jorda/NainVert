import { ref } from 'vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

// État global du contenu du site
const siteContent = ref(null)
const loading = ref(false)
const error = ref(null)

// Contenu par défaut en cas d'erreur
const defaultContent = {
  home: {
    title: "Bienvenue chez NainVert",
    subtitle: "Collection exclusive de vêtements streetwear psychédéliques",
    cta: "Découvrir la collection"
  },
  contact: {
    title: "Contactez-nous",
    subtitle: "Une question ? N'hésitez pas à nous contacter",
    email: "contact@nainvert.com",
    instagram: "@nainvert",
    hours: "Lun-Ven: 9h-18h"
  },
  footer: {
    tagline: "NainVert - L'authenticité psychédélique"
  }
}

export function useSiteContent() {
  
  // Charger le contenu du site depuis Firestore
  const loadSiteContent = async () => {
    if (siteContent.value) {
      return siteContent.value // Déjà chargé
    }

    loading.value = true
    error.value = null

    try {
      const docRef = doc(db, 'siteContent', 'global')
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        siteContent.value = docSnap.data()
        console.log('✅ Contenu du site chargé depuis Firestore')
      } else {
        console.warn('⚠️ Document siteContent/global non trouvé, utilisation du contenu par défaut')
        siteContent.value = defaultContent
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement du contenu:', err)
      error.value = err.message
      siteContent.value = defaultContent
    } finally {
      loading.value = false
    }

    return siteContent.value
  }

  // Mettre à jour le contenu du site (pour l'admin)
  const updateSiteContent = async (data) => {
    try {
      const docRef = doc(db, 'siteContent', 'global')
      await updateDoc(docRef, data)
      
      // Mettre à jour le cache local
      siteContent.value = { ...siteContent.value, ...data }
      
      console.log('✅ Contenu du site mis à jour')
      return true
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour du contenu:', err)
      error.value = err.message
      return false
    }
  }

  // Rafraîchir le contenu (force reload)
  const refreshSiteContent = async () => {
    siteContent.value = null
    return await loadSiteContent()
  }

  return {
    siteContent,
    loading,
    error,
    loadSiteContent,
    updateSiteContent,
    refreshSiteContent
  }
}
