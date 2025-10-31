import { defineStore } from 'pinia'
import { ref } from 'vue'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/config/firebase'

export const useAdminStore = defineStore('admin', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)
  const error = ref(null)
  const loading = ref(false)

  // Login avec Firebase Authentication
  const login = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      isAuthenticated.value = true
      console.log('✅ Admin connecté:', user.value.email)
      return true
    } catch (err) {
      console.error('❌ Erreur de connexion:', err)
      error.value = getErrorMessage(err.code)
      isAuthenticated.value = false
      return false
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
      isAuthenticated.value = false
      console.log('✅ Admin déconnecté')
    } catch (err) {
      console.error('❌ Erreur de déconnexion:', err)
      error.value = err.message
    }
  }

  // Vérifier l'état d'authentification au chargement
  const initAuth = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          user.value = firebaseUser
          isAuthenticated.value = true
          console.log('✅ Session admin restaurée:', firebaseUser.email)
        } else {
          user.value = null
          isAuthenticated.value = false
        }
        resolve(isAuthenticated.value)
      })
    })
  }

  // Messages d'erreur en français
  const getErrorMessage = (errorCode) => {
    const messages = {
      'auth/user-not-found': 'Aucun utilisateur trouvé avec cet email',
      'auth/wrong-password': 'Mot de passe incorrect',
      'auth/invalid-email': 'Email invalide',
      'auth/user-disabled': 'Ce compte a été désactivé',
      'auth/too-many-requests': 'Trop de tentatives, réessayez plus tard',
      'auth/invalid-credential': 'Email ou mot de passe incorrect'
    }
    return messages[errorCode] || 'Erreur de connexion'
  }

  // Alias pour la compatibilité (si besoin)
  const checkAuth = initAuth

  return {
    isAuthenticated,
    user,
    error,
    loading,
    login,
    logout,
    initAuth,
    checkAuth
  }
})
