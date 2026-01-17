import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth'
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
      return true
    } catch (err) {
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
      isAuthenticated.value = false
      user.value = null
    } catch (err) {
      // Silent logout error handling
    }
  }

  // Changement de mot de passe sécurisé
  const changePassword = async (currentPassword, newPassword) => {
    loading.value = true
    error.value = null

    try {
      const currentUser = auth.currentUser
      if (!currentUser || !currentUser.email) {
        throw new Error('Aucun utilisateur connecté')
      }

      // 1. Ré-authentification obligatoire pour sécurité
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
      await reauthenticateWithCredential(currentUser, credential)

      // 2. Changement du mot de passe
      await updatePassword(currentUser, newPassword)

      return { success: true, message: 'Mot de passe modifié avec succès' }
    } catch (err) {
      const errorMsg = getErrorMessage(err.code) || 'Erreur lors du changement de mot de passe'
      error.value = errorMsg
      return { 
        success: false, 
        message: errorMsg
      }
    } finally {
      loading.value = false
    }
  }

  // Vérifier l'état d'authentification au chargement
  const initAuth = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          user.value = firebaseUser
          isAuthenticated.value = true
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
      'auth/invalid-credential': 'Email ou mot de passe incorrect',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
      'auth/requires-recent-login': 'Pour des raisons de sécurité, reconnectez-vous'
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
    changePassword,
    initAuth,
    checkAuth
  }
})
