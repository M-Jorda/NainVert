<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay fixed inset-0 bg-black/90 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
      <div class="modal-content w-full max-w-7xl h-[90vh] bg-[var(--color-black)] border-2 border-[var(--color-neon-green)] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(57,255,20,0.3)] flex flex-col" @click.stop>
        
        <!-- Header avec étapes -->
        <div class="modal-header p-6 border-b border-[rgba(57,255,20,0.2)] flex-shrink-0">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-[var(--color-neon-green)] m-0">Finaliser la commande</h2>
            <button 
              class="w-9 h-9 flex items-center justify-center bg-[rgba(57,255,20,0.05)] border-none rounded-lg text-[var(--color-text-secondary)] cursor-pointer transition-all duration-200 hover:bg-[var(--color-neon-green)] hover:text-black"
              @click="closeModal"
              aria-label="Fermer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <!-- Indicateur d'étapes -->
          <div class="flex items-center justify-center gap-2">
            <div 
              v-for="(step, index) in steps" 
              :key="step.id"
              class="flex items-center"
            >
              <!-- Cercle de l'étape -->
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                :class="getStepClass(index)"
              >
                <span v-if="currentStep > index">✓</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <!-- Label -->
              <span 
                class="ml-2 text-sm hidden sm:block transition-colors duration-300"
                :class="currentStep >= index ? 'text-white' : 'text-[var(--color-text-muted)]'"
              >
                {{ step.label }}
              </span>
              <!-- Ligne de connexion -->
              <div 
                v-if="index < steps.length - 1" 
                class="w-8 h-0.5 mx-3"
                :class="currentStep > index ? 'bg-[var(--color-neon-green)]' : 'bg-[var(--color-black-lighter)]'"
              ></div>
            </div>
          </div>
        </div>

        <!-- Body -->
        <div class="modal-body p-6 flex-1 overflow-y-auto">
          
          <!-- ÉTAPE 0: Informations client -->
          <div v-if="currentStep === 0" class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <!-- Colonne gauche : Formulaire -->
            <div class="flex flex-col gap-4">
              <h3 class="text-lg font-bold text-[var(--color-neon-green)] uppercase tracking-wider mb-1">Informations de livraison</h3>
              
              <!-- Nom -->
              <div class="form-group">
                <input 
                  v-model="formData.name" 
                  type="text" 
                  required
                  class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors"
                  placeholder="NOM COMPLET *"
                />
              </div>

              <!-- Email -->
              <div class="form-group">
                <input 
                  v-model="formData.email" 
                  type="email" 
                  required
                  @input="formData.email = formData.email.toLowerCase()"
                  class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors"
                  placeholder="EMAIL *"
                />
              </div>

              <!-- Téléphone -->
              <div class="form-group">
                <input 
                  v-model="formData.phone" 
                  type="tel"
                  required
                  class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors"
                  placeholder="TÉLÉPHONE * (ex: 06 12 34 56 78)"
                />
              </div>

              <!-- Adresse -->
              <div class="form-group">
                <input 
                  v-model="formData.address.street" 
                  type="text" 
                  required
                  class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors mb-3"
                  placeholder="ADRESSE DE LIVRAISON *"
                />
                <div class="grid grid-cols-2 gap-3">
                  <input 
                    v-model="formData.address.postalCode" 
                    type="text" 
                    required
                    maxlength="5"
                    class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors"
                    placeholder="CODE POSTAL *"
                  />
                  <input 
                    v-model="formData.address.city" 
                    type="text" 
                    required
                    class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors"
                    placeholder="VILLE *"
                  />
                </div>
              </div>

              <!-- Notes (optionnel) -->
              <div class="form-group">
                <textarea 
                  v-model="formData.notes" 
                  rows="2"
                  class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors resize-none"
                  placeholder="Notes pour la livraison (optionnel)"
                ></textarea>
              </div>

              <!-- Erreur -->
              <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                {{ errorMessage }}
              </div>

              <!-- Bouton continuer vers livraison -->
              <button 
                type="button" 
                class="btn btn-primary w-full py-4 text-lg mt-auto" 
                :disabled="!isFormValid"
                @click="goToShipping"
              >
                <span class="flex items-center justify-center gap-2">
                  Choisir la livraison
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </button>
            </div>

            <!-- Colonne droite : Résumé -->
            <div class="flex flex-col gap-3">
              <h3 class="text-lg font-bold text-[var(--color-neon-green)] uppercase tracking-wider mb-1">Résumé de la commande</h3>
              <OrderSummary :cart-store="cartStore" />
            </div>
          </div>

          <!-- ÉTAPE 1: Choix de livraison -->
          <div v-if="currentStep === 1" class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <!-- Colonne gauche : Sélection livraison -->
            <div class="flex flex-col gap-4">
              <h3 class="text-lg font-bold text-[var(--color-neon-green)] uppercase tracking-wider mb-1">Mode de livraison</h3>
              
              <ShippingSelector
                :cart-items="cartStore.items"
                :cart-total="cartStore.totalPrice"
                v-model="shippingMethod"
                @update:shippingCost="shippingCost = $event"
                @update:shippingMethod="shippingDetails = $event"
              />

              <!-- Erreur -->
              <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                {{ errorMessage }}
              </div>

              <!-- Boutons navigation -->
              <div class="flex gap-3 mt-auto">
                <button 
                  type="button" 
                  class="flex-1 py-3 text-[var(--color-text-secondary)] hover:text-white transition-colors flex items-center justify-center gap-2 border border-[rgba(57,255,20,0.2)] rounded-lg"
                  @click="currentStep = 0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Retour
                </button>
                <button 
                  type="button" 
                  class="btn btn-primary flex-[2] py-4 text-lg" 
                  :disabled="processing"
                  @click="goToPayment"
                >
                  <span v-if="processing">Création en cours...</span>
                  <span v-else class="flex items-center justify-center gap-2">
                    Continuer vers le paiement
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            <!-- Colonne droite : Résumé avec frais de livraison -->
            <div class="flex flex-col gap-3">
              <h3 class="text-lg font-bold text-[var(--color-neon-green)] uppercase tracking-wider mb-1">Résumé de la commande</h3>
              <OrderSummary :cart-store="cartStore" :shipping-cost="shippingCost" />
            </div>
          </div>

          <!-- ÉTAPE 2: Paiement Stripe -->
          <div v-if="currentStep === 2" class="max-w-xl mx-auto">
            <h3 class="text-lg font-bold text-[var(--color-neon-green)] uppercase tracking-wider mb-4 text-center">Paiement sécurisé</h3>
            
            <!-- Banner Mode Test -->
            <div v-if="isTestMode" class="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <div class="flex items-center gap-2 text-yellow-400 mb-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span class="font-bold">MODE TEST</span>
              </div>
              <p class="text-sm text-yellow-400/80">
                Le système de paiement Stripe n'est pas encore configuré. 
                Vous pouvez simuler un paiement pour tester le flux complet.
              </p>
            </div>
            
            <!-- Résumé compact -->
            <div class="bg-[var(--color-black-light)] rounded-lg p-6 mb-6 border border-[rgba(57,255,20,0.2)]">
              <div class="flex justify-between items-center mb-3">
                <span class="text-[var(--color-text-secondary)]">Commande</span>
                <span class="text-white font-mono">{{ orderNumber }}</span>
              </div>
              <div class="flex justify-between items-center mb-3">
                <span class="text-[var(--color-text-secondary)]">Sous-total</span>
                <span class="text-white">{{ cartStore.totalPrice.toFixed(2) }}€</span>
              </div>
              <div class="flex justify-between items-center mb-3">
                <span class="text-[var(--color-text-secondary)]">Livraison ({{ shippingDetails.name }})</span>
                <span class="text-white" :class="{ 'text-[var(--color-neon-green)]': shippingCost === 0 }">
                  {{ shippingCost === 0 ? 'GRATUIT' : shippingCost.toFixed(2) + '€' }}
                </span>
              </div>
              <div class="border-t border-[rgba(57,255,20,0.2)] pt-4 mt-2 flex justify-between items-center">
                <span class="text-[var(--color-text-secondary)]">Total à payer</span>
                <span class="text-[var(--color-neon-green)] text-xl font-bold">{{ totalWithShipping.toFixed(2) }}€</span>
              </div>
            </div>

            <!-- MODE TEST : Bouton de simulation -->
            <div v-if="isTestMode" class="space-y-4">
              <div class="bg-[var(--color-black-light)] rounded-lg p-6 border border-[rgba(57,255,20,0.2)]">
                <h4 class="text-white font-semibold mb-4 text-center">Simuler le paiement</h4>
                
                <button 
                  type="button"
                  class="btn btn-primary w-full py-4 text-lg mb-3"
                  :disabled="testPaymentProcessing"
                  @click="simulatePaymentSuccess"
                >
                  <span v-if="testPaymentProcessing" class="flex items-center justify-center gap-2">
                    <div class="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
                    Traitement...
                  </span>
                  <span v-else class="flex items-center justify-center gap-2">
                    ✅ Simuler Paiement Réussi
                  </span>
                </button>
                
                <button 
                  type="button"
                  class="w-full py-3 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors"
                  @click="simulatePaymentFailure"
                >
                  ❌ Simuler Échec de Paiement
                </button>
              </div>
              
              <p class="text-center text-xs text-[var(--color-text-muted)]">
                Ces options sont disponibles uniquement en mode test.<br>
                En production, Stripe sera utilisé pour les vrais paiements.
              </p>
            </div>

            <!-- MODE PRODUCTION : Formulaire Stripe -->
            <template v-else>
              <StripePaymentForm
                v-if="clientSecret"
                :amount="totalWithShipping"
                :client-secret="clientSecret"
                :customer-email="formData.email"
                @payment-success="handlePaymentSuccess"
                @payment-error="handlePaymentError"
              />

              <!-- Loading si pas encore de clientSecret -->
              <div v-else class="flex items-center justify-center py-12">
                <div class="animate-spin w-8 h-8 border-2 border-[var(--color-neon-green)] border-t-transparent rounded-full"></div>
                <span class="ml-3 text-[var(--color-text-secondary)]">Préparation du paiement...</span>
              </div>
            </template>

            <!-- Bouton retour -->
            <button 
              type="button" 
              class="w-full mt-6 py-3 text-[var(--color-text-secondary)] hover:text-white transition-colors flex items-center justify-center gap-2"
              @click="currentStep = 1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Modifier la livraison
            </button>
          </div>

          <!-- ÉTAPE 3: Confirmation -->
          <div v-if="currentStep === 3" class="text-center py-8 max-w-lg mx-auto">
            <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-[rgba(57,255,20,0.1)] border-2 border-[var(--color-neon-green)] flex items-center justify-center animate-bounce">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-green)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            
            <h3 class="text-3xl font-bold text-[var(--color-neon-green)] mb-4">Merci pour votre commande !</h3>
            
            <div class="bg-[var(--color-black-light)] rounded-lg p-6 mb-6 border border-[rgba(57,255,20,0.2)]">
              <p class="text-[var(--color-text-secondary)] mb-2">Numéro de commande</p>
              <p class="text-2xl font-bold text-white font-mono">{{ orderNumber }}</p>
            </div>
            
            <p class="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
              Votre paiement a été confirmé avec succès.<br>
              Un email de confirmation a été envoyé à <strong class="text-white">{{ formData.email }}</strong>
            </p>

            <div class="bg-[rgba(57,255,20,0.05)] rounded-lg p-4 mb-6">
              <h4 class="text-[var(--color-neon-green)] font-bold mb-2">Prochaines étapes</h4>
              <ul class="text-left text-[var(--color-text-secondary)] space-y-2">
                <li class="flex items-start gap-2">
                  <span class="text-[var(--color-neon-green)]">1.</span>
                  Nous préparons votre commande avec soin
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-[var(--color-neon-green)]">2.</span>
                  Vous recevrez un email avec le numéro de suivi
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-[var(--color-neon-green)]">3.</span>
                  Livraison estimée sous 5-7 jours ouvrés
                </li>
              </ul>
            </div>
            
            <button class="btn btn-primary w-full py-4 text-lg" @click="finishAndClose">
              Continuer mes achats
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useCheckout } from '@/composables/useCheckout'
import { isStripeConfigured } from '@/services/stripe'
import StripePaymentForm from './StripePaymentForm.vue'
import OrderSummary from './OrderSummary.vue'
import ShippingSelector from './ShippingSelector.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

// Mode test (sans Stripe)
const isTestMode = computed(() => !isStripeConfigured())

const emit = defineEmits(['close'])

const cartStore = useCartStore()
const { processCheckout, createPaymentIntent, processing } = useCheckout()

// État
const currentStep = ref(0)
const orderNumber = ref('')
const orderId = ref('')
const clientSecret = ref('')
const errorMessage = ref('')

// Étapes
const steps = [
  { id: 'info', label: 'Informations' },
  { id: 'shipping', label: 'Livraison' },
  { id: 'payment', label: 'Paiement' },
  { id: 'confirmation', label: 'Confirmation' }
]

// Livraison
const shippingMethod = ref('colissimo')
const shippingCost = ref(0)
const shippingDetails = ref({
  id: 'colissimo',
  name: 'Colissimo',
  zone: 'france'
})

// Formulaire
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  notes: '',
  address: {
    street: '',
    postalCode: '',
    city: '',
    country: 'France'
  }
})

// Validation
const isPhoneValid = computed(() => {
  if (!formData.phone) return false
  return /^[\d\s+\-()]+$/.test(formData.phone)
})

const isPostalCodeValid = computed(() => {
  if (!formData.address.postalCode) return false
  return /^\d{5}$/.test(formData.address.postalCode.trim())
})

const isFormValid = computed(() => {
  return (
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    isPhoneValid.value &&
    formData.address.street.trim() !== '' &&
    isPostalCodeValid.value &&
    formData.address.city.trim() !== ''
  )
})

// Total avec livraison
const totalWithShipping = computed(() => {
  return cartStore.totalPrice + shippingCost.value
})

// Classes pour les étapes
const getStepClass = (index) => {
  if (currentStep.value > index) {
    return 'bg-[var(--color-neon-green)] text-black'
  } else if (currentStep.value === index) {
    return 'bg-[var(--color-neon-green)] text-black shadow-[0_0_15px_rgba(57,255,20,0.5)]'
  }
  return 'bg-[var(--color-black-lighter)] text-[var(--color-text-muted)]'
}

// Désactiver le scroll quand ouvert
watch(() => props.isOpen, (newValue) => {
  document.body.style.overflow = newValue ? 'hidden' : ''
  if (newValue) {
    // Reset au premier step quand on ouvre
    currentStep.value = 0
    clientSecret.value = ''
  }
})

// Passer à l'étape livraison
const goToShipping = () => {
  if (isFormValid.value) {
    currentStep.value = 1
  }
}

// Passer à l'étape paiement
const goToPayment = async () => {
  errorMessage.value = ''

  // Créer la commande d'abord
  const customerInfo = {
    name: formData.name.trim(),
    email: formData.email.toLowerCase().trim(),
    phone: formData.phone.trim(),
    address: {
      street: formData.address.street.trim(),
      postalCode: formData.address.postalCode.trim(),
      city: formData.address.city.trim(),
      country: formData.address.country
    }
  }

  const shippingInfoData = {
    method: shippingDetails.value.id,
    carrier: shippingDetails.value.name,
    zone: shippingDetails.value.zone,
    cost: shippingCost.value,
    address: customerInfo.address
  }

  // Créer la commande en statut pending
  const result = await processCheckout(cartStore.items, customerInfo, shippingInfoData)

  if (!result.success) {
    errorMessage.value = result.error || 'Erreur lors de la création de la commande'
    return
  }

  orderNumber.value = result.orderNumber
  orderId.value = result.orderId

  // En mode test, passer directement à l'étape paiement sans Stripe
  if (isTestMode.value) {
    currentStep.value = 2
    return
  }

  // Créer le PaymentIntent Stripe (mode production)
  try {
    const paymentData = await createPaymentIntent({
      amount: totalWithShipping.value,
      orderNumber: result.orderNumber,
      customer: customerInfo
    })

    clientSecret.value = paymentData.clientSecret
    currentStep.value = 2

  } catch (err) {
    errorMessage.value = 'Erreur lors de la préparation du paiement: ' + err.message
  }
}

// Mode test : simulation paiement
const testPaymentProcessing = ref(false)

const simulatePaymentSuccess = async () => {
  testPaymentProcessing.value = true
  
  // Simuler un délai de traitement
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  console.log('✅ [MODE TEST] Paiement simulé réussi pour commande:', orderNumber.value)
  testPaymentProcessing.value = false
  currentStep.value = 3
  cartStore.clearCart()
}

const simulatePaymentFailure = () => {
  errorMessage.value = '[MODE TEST] Simulation d\'un échec de paiement. En production, cela pourrait être une carte refusée ou une erreur réseau.'
}

// Gestion du succès du paiement
const handlePaymentSuccess = (data) => {
  console.log('✅ Paiement réussi:', data)
  currentStep.value = 3
  cartStore.clearCart()
}

// Gestion des erreurs de paiement
const handlePaymentError = (error) => {
  console.error('❌ Erreur paiement:', error)
  errorMessage.value = error
}

// Fermer le modal
const closeModal = () => {
  if (!processing.value) {
    emit('close')
    setTimeout(resetForm, 300)
  }
}

// Terminer et fermer
const finishAndClose = () => {
  emit('close')
  cartStore.closeCart()
  setTimeout(resetForm, 300)
}

// Reset du formulaire
const resetForm = () => {
  formData.name = ''
  formData.email = ''
  formData.phone = ''
  formData.notes = ''
  formData.address.street = ''
  formData.address.postalCode = ''
  formData.address.city = ''
  currentStep.value = 0
  orderNumber.value = ''
  orderId.value = ''
  clientSecret.value = ''
  errorMessage.value = ''
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.9);
}

.input-field:focus {
  box-shadow: 0 0 0 2px rgba(57, 255, 20, 0.2);
}

.input-field:-webkit-autofill,
.input-field:-webkit-autofill:hover,
.input-field:-webkit-autofill:focus,
.input-field:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px var(--color-black-light) inset !important;
  -webkit-text-fill-color: white !important;
  transition: background-color 5000s ease-in-out 0s;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: var(--color-black);
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--color-neon-green);
  border-radius: 3px;
}
</style>
