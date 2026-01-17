<template>
  <div class="stripe-payment-form">
    <!-- Loader pendant le chargement -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin w-8 h-8 border-2 border-[var(--color-neon-green)] border-t-transparent rounded-full"></div>
      <span class="ml-3 text-[var(--color-text-secondary)]">Chargement du paiement sécurisé...</span>
    </div>
    
    <!-- Message si Stripe non configuré -->
    <div v-else-if="!stripeReady" class="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4 text-yellow-400 text-sm">
      <p class="font-bold mb-2">⚠️ Paiement non disponible</p>
      <p>Le système de paiement n'est pas encore configuré. Veuillez contacter le support.</p>
    </div>
    
    <!-- Formulaire Stripe -->
    <div v-else>
      <!-- Montant à payer -->
      <div class="mb-6 p-4 bg-[var(--color-black-light)] rounded-lg border border-[rgba(57,255,20,0.2)]">
        <div class="flex justify-between items-center">
          <span class="text-[var(--color-text-secondary)]">Montant à payer :</span>
          <span class="text-2xl font-bold text-[var(--color-neon-green)]">{{ formatPrice(amount) }} €</span>
        </div>
      </div>
      
      <!-- Stripe Elements Container -->
      <div
        ref="paymentElementContainer"
        class="stripe-element-container p-6 bg-[var(--color-black-lighter)] rounded-lg border border-[rgba(57,255,20,0.2)] min-h-[150px] space-y-4"
      ></div>
      
      <!-- Erreur de paiement -->
      <div v-if="paymentError" class="mt-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
        <p class="font-bold">❌ Erreur de paiement</p>
        <p>{{ paymentError }}</p>
      </div>
      
      <!-- Bouton de paiement -->
      <button 
        type="button"
        class="btn btn-primary w-full mt-6 py-4 text-lg font-bold"
        :disabled="paymentLoading || !elementsReady"
        @click="handlePayment"
      >
        <span v-if="paymentLoading" class="flex items-center justify-center gap-2">
          <span class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
          Traitement en cours...
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
          Payer {{ formatPrice(amount) }} €
        </span>
      </button>
      
      <!-- Badge sécurité -->
      <div class="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        Paiement 100% sécurisé par Stripe
      </div>
    </div>
    
    <!-- Succès du paiement -->
    <div v-if="paymentSuccess" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div class="text-center p-8">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-[rgba(57,255,20,0.1)] border-2 border-[var(--color-neon-green)] flex items-center justify-center animate-bounce">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-green)" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-[var(--color-neon-green)] mb-4">Paiement réussi !</h3>
        <p class="text-[var(--color-text-secondary)]">Votre commande est confirmée.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { getStripe, isStripeConfigured } from '@/services/stripe'
import { useStripePayment } from '@/composables/useStripePayment'

const props = defineProps({
  amount: {
    type: Number,
    required: true
  },
  clientSecret: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['payment-success', 'payment-error'])

// Refs
const paymentElementContainer = ref(null)
const loading = ref(true)
const elementsReady = ref(false)

// Stripe instances
let stripe = null
let elements = null
let paymentElement = null

// Composable
const { 
  paymentLoading, 
  paymentError, 
  paymentSuccess,
  confirmPayment,
  resetPayment 
} = useStripePayment()

// Computed
const stripeReady = computed(() => isStripeConfigured())

// Formatage prix
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

// Initialisation Stripe Elements
onMounted(async () => {
  if (!stripeReady.value) {
    loading.value = false
    return
  }
  
  try {
    stripe = await getStripe()
    
    // Options de style pour correspondre au thème NainVert
    const appearance = {
      theme: 'night',
      variables: {
        colorPrimary: '#39FF14',
        colorBackground: '#1a1a1a',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'Montserrat, sans-serif',
        borderRadius: '8px',
        spacingUnit: '4px'
      },
      rules: {
        '.Input': {
          backgroundColor: '#2a2a2a',
          border: '2px solid rgba(57, 255, 20, 0.2)',
          color: '#ffffff'
        },
        '.Input:focus': {
          border: '2px solid #39FF14',
          boxShadow: '0 0 10px rgba(57, 255, 20, 0.3)'
        },
        '.Label': {
          color: '#b0b0b0'
        },
        '.Tab': {
          backgroundColor: '#1a1a1a',
          border: '1px solid rgba(57, 255, 20, 0.2)'
        },
        '.Tab--selected': {
          backgroundColor: '#2a2a2a',
          border: '2px solid #39FF14'
        }
      }
    }
    
    // Créer Elements avec le clientSecret
    elements = stripe.elements({
      clientSecret: props.clientSecret,
      appearance,
      locale: 'fr'
    })
    
    // Créer le Payment Element
    paymentElement = elements.create('payment', {
      layout: 'tabs',
      defaultValues: {
        billingDetails: {
          email: props.customerEmail
        }
      }
    })
    
    // Monter le Payment Element
    paymentElement.mount(paymentElementContainer.value)
    
    // Écouter quand l'élément est prêt
    paymentElement.on('ready', () => {
      loading.value = false
      elementsReady.value = true
    })
    
    paymentElement.on('change', (event) => {
      if (event.error) {
        paymentError.value = event.error.message
      } else {
        paymentError.value = null
      }
    })
    
  } catch (err) {
    console.error('❌ Erreur initialisation Stripe:', err)
    loading.value = false
    paymentError.value = 'Impossible de charger le formulaire de paiement'
  }
})

// Nettoyage
onUnmounted(() => {
  if (paymentElement) {
    paymentElement.unmount()
  }
  resetPayment()
})

// Gestion du paiement
const handlePayment = async () => {
  if (!elements || paymentLoading.value) return
  
  const result = await confirmPayment({
    elements,
    returnUrl: window.location.origin + '/confirmation'
  })
  
  if (result.success) {
    emit('payment-success', {
      paymentIntentId: result.paymentIntentId,
      status: result.status
    })
  } else if (result.error) {
    emit('payment-error', result.error)
  }
}
</script>

<style scoped>
.stripe-element-container {
  transition: all 0.3s ease;
}

.stripe-element-container:focus-within {
  border-color: var(--color-neon-green);
  box-shadow: 0 0 15px rgba(57, 255, 20, 0.2);
}

/* Add spacing for Stripe injected elements */
.stripe-element-container :deep(iframe) {
  min-height: 45px;
}

.stripe-element-container :deep(.p-Input) {
  padding: 12px 16px;
}
</style>
