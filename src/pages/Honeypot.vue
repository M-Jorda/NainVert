<template>
  <div class="min-h-screen py-20 honeypot-container">
    <div class="container max-w-md mx-auto px-4">
      <div class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl p-8">
        <h1 class="text-3xl font-bold text-center mb-8">
          <span class="text-gradient">Admin Panel</span>
        </h1>
        
        <form @submit.prevent="handleFakeLogin" class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">
              Email
            </label>
            <input 
              v-model="fakeEmail"
              type="email"
              class="form-input"
              placeholder="admin@nainvert.com"
              required
              :disabled="isLoading"
            >
          </div>
          
          <div>
            <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">
              Mot de passe
            </label>
            <input 
              v-model="fakePassword"
              type="password"
              class="form-input"
              placeholder="Entrez le mot de passe"
              required
              :disabled="isLoading"
            >
          </div>
          
          <!-- Fake error messages -->
          <div v-if="showError" class="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm animate-pulse">
            {{ errorMessage }}
          </div>

          <!-- Fake success message -->
          <div v-if="showSuccess" class="p-3 bg-[var(--color-primary)]/10 border border-[var(--color-primary)] rounded-lg text-[var(--color-primary)] text-sm">
            ✓ Vérification en cours...
          </div>
          
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            <span v-if="!isLoading">Se connecter</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Vérification...
            </span>
          </button>
        </form>

        <!-- Fake loading bar -->
        <div v-if="isLoading" class="mt-4">
          <div class="h-2 bg-[rgba(57,255,20,0.1)] rounded-full overflow-hidden">
            <div class="h-full bg-[var(--color-neon-green)] loading-bar"></div>
          </div>
        </div>
      </div>

      <!-- Fake "Forgot password" link -->
      <div class="mt-4 text-center">
        <button 
          @click="showForgotMessage = true"
          class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-neon-green)] transition-colors"
        >
          Mot de passe oublié ?
        </button>
      </div>

      <!-- Fake forgot password message -->
      <div v-if="showForgotMessage" class="mt-4 p-4 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-lg text-sm text-[var(--color-text-secondary)]">
        Un email de récupération a été envoyé à votre adresse.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'

const fakeEmail = ref('')
const fakePassword = ref('')
const isLoading = ref(false)
const showError = ref(false)
const showSuccess = ref(false)
const showForgotMessage = ref(false)
const errorMessage = ref('')
const attemptCount = ref(0)

const errorMessages = [
  'Email ou mot de passe incorrect',
  'Trop de tentatives. Veuillez réessayer dans 5 minutes.',
  'Compte temporairement verrouillé pour des raisons de sécurité',
  'Vérification en cours...',
  'Authentification échouée. Veuillez vérifier vos identifiants.',
  'Session expirée. Veuillez vous reconnecter.'
]

const logAttempt = async () => {
  try {
    await addDoc(collection(db, 'honeypot_logs'), {
      email: fakeEmail.value,
      password: fakePassword.value.substring(0, 3) + '***', // Partial password for logging
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      attemptNumber: attemptCount.value,
      ip: 'client-side' // Note: Real IP would need server-side
    })
    console.log('🍯 Honeypot: Tentative loggée')
  } catch (error) {
    console.error('Erreur logging honeypot:', error)
  }
}

const handleFakeLogin = async () => {
  attemptCount.value++
  showError.value = false
  showSuccess.value = false
  isLoading.value = true

  // Log the attempt
  await logAttempt()

  // Simulate authentication delay (5-10 seconds to waste bot time)
  const delay = 5000 + Math.random() * 5000
  
  await new Promise(resolve => setTimeout(resolve, delay))

  // Randomly show success or error
  if (Math.random() > 0.3) {
    // Most of the time: show error
    errorMessage.value = errorMessages[Math.floor(Math.random() * errorMessages.length)]
    showError.value = true
    isLoading.value = false
    
    // Hide error after 3 seconds
    setTimeout(() => {
      showError.value = false
    }, 3000)
  } else {
    // Sometimes: show fake success then reload
    showSuccess.value = true
    isLoading.value = false
    
    // After 3 seconds, reload the page (infinite loop)
    setTimeout(() => {
      window.location.reload()
    }, 3000)
  }
}
</script>

<style scoped>
.honeypot-container {
  background: var(--color-background);
  position: relative;
}

/* Subtle visual differences that bots won't notice but humans might */
.honeypot-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(57,255,20,0.03), transparent 70%);
  pointer-events: none;
}

@keyframes loading-bar {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

.loading-bar {
  animation: loading-bar 2s ease-in-out infinite;
}
</style>
