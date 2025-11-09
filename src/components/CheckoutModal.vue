<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay fixed inset-0 bg-black/90 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
      <div class="modal-content w-full max-w-7xl h-[90vh] bg-[var(--color-black)] border-2 border-[var(--color-neon-green)] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(57,255,20,0.3)] flex flex-col" @click.stop>
        <!-- Header -->
        <div class="modal-header p-6 border-b border-[rgba(57,255,20,0.2)] flex items-center justify-between flex-shrink-0">
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

        <!-- Body -->
        <div class="modal-body p-6 flex-1 overflow-y-auto">
          <!-- Success Message -->
          <div v-if="orderCreated" class="text-center py-8">
            <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-[rgba(57,255,20,0.1)] border-2 border-[var(--color-neon-green)] flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-green)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-[var(--color-neon-green)] mb-4">Commande créée !</h3>
            <p class="text-[var(--color-text-secondary)] mb-2">Numéro de commande:</p>
            <p class="text-xl font-bold text-white mb-6">{{ orderNumber }}</p>
            <p class="text-sm text-[var(--color-text-secondary)]">
              Votre commande est en attente de paiement. Vous recevrez un email de confirmation.
            </p>
            <button class="btn btn-primary mt-6 w-full" @click="finishAndClose">
              Terminer
            </button>
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="submitOrder" class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <!-- Colonne gauche : Formulaire client -->
            <div class="flex flex-col gap-4 checkout-left-column justify-between">
              <h3 class="text-lg font-bold text-[var(--color-neon-green)] uppercase tracking-wider mb-1">Informations client</h3>
              
              <!-- Nom -->
              <div class="form-group relative">
                <div v-if="formData.name && formData.name.trim() === ''" class="absolute left-0 -top-8 bg-red-500/20 border border-red-500 rounded-lg px-3 py-1 text-xs text-red-400 z-20 whitespace-nowrap">
                  ⚠️ Le nom est requis
                </div>
                <input 
                  id="name"
                  v-model="formData.name" 
                  type="text" 
                  required
                  class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors"
                  :class="{ 'border-red-500': formData.name && formData.name.trim() === '' }"
                  placeholder="NOM COMPLET *"
                />
              </div>

              <!-- Email -->
              <div class="form-group relative">
                <div v-if="formData.email && formData.email.trim() === ''" class="absolute left-0 -top-8 bg-red-500/20 border border-red-500 rounded-lg px-3 py-1 text-xs text-red-400 z-20 whitespace-nowrap">
                  ⚠️ L'email est requis
                </div>
                <input 
                  id="email"
                  v-model="formData.email" 
                  type="email" 
                  required
                  @input="formData.email = formData.email.toLowerCase()"
                  class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors"
                  :class="{ 'border-red-500': formData.email && formData.email.trim() === '' }"
                  placeholder="EMAIL *"
                />
              </div>

              <!-- Téléphone -->
              <div class="form-group relative">
                <div v-if="formData.phone && !isPhoneValid" class="absolute left-0 -top-8 bg-red-500/20 border border-red-500 rounded-lg px-3 py-1 text-xs text-red-400 z-20 whitespace-nowrap">
                  ⚠️ Format invalide (chiffres, espaces, +, -, ( ) uniquement)
                </div>
                <input 
                  id="phone"
                  v-model="formData.phone" 
                  type="tel"
                  required
                  class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors peer"
                  :class="{ 'border-red-500': formData.phone && !isPhoneValid }"
                  placeholder="TÉLÉPHONE * (ex: 06 12 34 56 78)"
                />
                <div class="absolute left-0 -top-20 bg-[var(--color-black-light)] border border-[var(--color-neon-green)] rounded-lg p-3 text-xs text-white shadow-lg opacity-0 invisible peer-focus:opacity-100 peer-focus:visible transition-all duration-200 z-10 w-full">
                  <p class="font-bold text-[var(--color-neon-green)] mb-1">✓ Format accepté :</p>
                  <p class="text-[var(--color-text-secondary)]">Chiffres, espaces, +, -, ( )</p>
                  <p class="text-[var(--color-text-muted)] text-[10px] mt-1">Ex: 06 12 34 56 78 ou +33 6 12 34 56 78</p>
                </div>
              </div>

              <!-- Adresse -->
              <div class="form-group">
                <div class="relative">
                  <div v-if="formData.address.street && formData.address.street.trim() === ''" class="absolute left-0 -top-8 bg-red-500/20 border border-red-500 rounded-lg px-3 py-1 text-xs text-red-400 z-20 whitespace-nowrap">
                    ⚠️ L'adresse est requise
                  </div>
                  <input 
                    id="address"
                    v-model="formData.address.street" 
                    type="text" 
                    required
                    class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors mb-3"
                    :class="{ 'border-red-500': formData.address.street && formData.address.street.trim() === '' }"
                    placeholder="ADRESSE DE LIVRAISON *"
                  />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="relative">
                    <div v-if="formData.address.postalCode && !isPostalCodeValid" class="absolute left-0 -top-8 bg-red-500/20 border border-red-500 rounded-lg px-3 py-1 text-xs text-red-400 z-20 whitespace-nowrap">
                      ⚠️ 5 chiffres requis
                    </div>
                    <input 
                      v-model="formData.address.postalCode" 
                      type="text" 
                      required
                      maxlength="5"
                      class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors peer"
                      :class="{ 'border-red-500': formData.address.postalCode && !isPostalCodeValid }"
                      placeholder="CODE POSTAL *"
                    />
                    <div class="absolute left-0 -top-16 bg-[var(--color-black-light)] border border-[var(--color-neon-green)] rounded-lg p-3 text-xs text-white shadow-lg opacity-0 invisible peer-focus:opacity-100 peer-focus:visible transition-all duration-200 z-10 w-48">
                      <p class="font-bold text-[var(--color-neon-green)] mb-1">✓ Format requis :</p>
                      <p class="text-[var(--color-text-secondary)]">Exactement 5 chiffres</p>
                      <p class="text-[var(--color-text-muted)] text-[10px] mt-1">Ex: 75001, 13000</p>
                    </div>
                  </div>
                  <div class="relative">
                    <div v-if="formData.address.city && formData.address.city.trim() === ''" class="absolute left-0 -top-8 bg-red-500/20 border border-red-500 rounded-lg px-3 py-1 text-xs text-red-400 z-20 whitespace-nowrap">
                      ⚠️ La ville est requise
                    </div>
                    <input 
                      v-model="formData.address.city" 
                      type="text" 
                      required
                      class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors"
                      :class="{ 'border-red-500': formData.address.city && formData.address.city.trim() === '' }"
                      placeholder="VILLE *"
                    />
                  </div>
                </div>
              </div>

              <!-- Spacer pour pousser le bouton vers le bas -->
              <div class="flex-1"></div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
                {{ errorMessage }}
              </div>

              <!-- Submit Button -->
              <button 
                type="submit" 
                class="btn btn-primary w-full py-4 text-lg" 
                :disabled="processing || !isFormValid"
              >
                <span v-if="processing">Création en cours...</span>
                <span v-else>Créer la commande</span>
              </button>

              <p class="text-xs text-center text-[var(--color-text-muted)]">
                En créant la commande, vous acceptez nos CGV.
              </p>
            </div>

            <!-- Colonne droite : Résumé financier -->
            <div class="flex flex-col gap-3 h-full">
              <h3 class="text-lg font-bold text-[var(--color-neon-green)] uppercase tracking-wider mb-1 flex-shrink-0">Résumé de la commande</h3>
              
              <!-- Résumé financier -->
              <div class="bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg p-4 flex flex-col checkout-summary flex-1">
                <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-3 flex-shrink-0">Articles ({{ cartStore.itemCount }})</h4>
                <div class="space-y-3 mb-4 overflow-y-auto pr-2 custom-scrollbar checkout-items-list max-h-[120px]">
                  <div 
                    v-for="item in cartStore.items" 
                    :key="item.id" 
                    class="flex gap-3 p-2 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.1)] rounded-lg flex-shrink-0"
                  >
                    <!-- Image miniature -->
                    <div class="w-12 h-12 rounded overflow-hidden bg-[rgba(57,255,20,0.05)] flex-shrink-0">
                      <img :src="item.image" :alt="item.designName" class="w-full h-full object-cover" />
                    </div>
                    
                    <!-- Infos -->
                    <div class="flex-1 flex flex-col justify-center min-w-0">
                      <div class="text-white font-semibold text-sm leading-tight truncate">{{ item.designName }}</div>
                      <div class="text-[var(--color-text-secondary)] text-xs">
                        {{ item.type === 'tshirt' ? 'T-Shirt' : 'Hoodie' }} • Taille {{ item.size }}
                      </div>
                    </div>
                    
                    <!-- Quantité et prix -->
                    <div class="flex flex-col items-end justify-center flex-shrink-0">
                      <div class="text-white font-bold text-sm">{{ (item.price * item.quantity).toFixed(2) }}€</div>
                      <div class="text-[var(--color-text-muted)] text-xs">Qté: {{ item.quantity }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="border-t border-[rgba(57,255,20,0.2)] pt-3 space-y-2 flex-shrink-0">
                  <div class="flex justify-between text-[var(--color-text-secondary)] text-sm">
                    <span>Sous-total</span>
                    <span>{{ cartStore.totalPrice.toFixed(2) }}€</span>
                  </div>
                  <div class="flex justify-between text-[var(--color-text-secondary)] text-sm">
                    <span>Livraison</span>
                    <span class="text-[var(--color-neon-green)]">Gratuite</span>
                  </div>
                  <div class="flex justify-between text-[var(--color-text-secondary)] text-sm">
                    <span>TVA (20%)</span>
                    <span>{{ (cartStore.totalPrice * 0.2).toFixed(2) }}€</span>
                  </div>
                  <div class="pt-3 border-t border-[rgba(57,255,20,0.2)]">
                    <div class="flex justify-between items-center">
                      <span class="text-lg font-bold text-white">Total TTC</span>
                      <span class="text-2xl font-black text-[var(--color-neon-green)]">{{ cartStore.totalPrice.toFixed(2) }}€</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useCheckout } from '@/composables/useCheckout'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

const cartStore = useCartStore()
const { processCheckout, processing } = useCheckout()

const orderCreated = ref(false)
const orderNumber = ref('')
const errorMessage = ref('')

// Désactiver le scroll de la page quand la modale est ouverte
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  address: {
    street: '',
    postalCode: '',
    city: '',
    country: 'France'
  }
})

// Validation en temps réel
const isPhoneValid = computed(() => {
  if (!formData.phone) return false
  const phoneRegex = /^[\d\s+\-()]+$/
  return phoneRegex.test(formData.phone)
})

const isPostalCodeValid = computed(() => {
  if (!formData.address.postalCode) return false
  const postalCodeRegex = /^\d{5}$/
  return postalCodeRegex.test(formData.address.postalCode.trim())
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

const submitOrder = async () => {
  errorMessage.value = ''
  
  // Validation des champs obligatoires
  if (!formData.name || !formData.email || !formData.phone || !formData.address.street || !formData.address.postalCode || !formData.address.city) {
    errorMessage.value = 'Veuillez remplir tous les champs obligatoires'
    return
  }

  // Validation du téléphone (chiffres, espaces, +, -, parenthèses autorisés)
  const phoneRegex = /^[\d\s+\-()]+$/
  if (!phoneRegex.test(formData.phone)) {
    errorMessage.value = 'Le numéro de téléphone contient des caractères invalides'
    return
  }

  // Validation du code postal français (exactement 5 chiffres)
  const postalCodeRegex = /^\d{5}$/
  if (!postalCodeRegex.test(formData.address.postalCode.trim())) {
    errorMessage.value = 'Le code postal doit contenir exactement 5 chiffres'
    return
  }

  // Normaliser les données (minuscules pour email, capitalisation pour nom)
  const normalizedEmail = formData.email.toLowerCase().trim()
  const normalizedName = formData.name.trim()
  const normalizedCity = formData.address.city.trim()
  const normalizedStreet = formData.address.street.trim()

  // Préparer les données client
  const customerInfo = {
    name: normalizedName,
    email: normalizedEmail,
    phone: formData.phone.trim(),
    address: {
      street: normalizedStreet,
      postalCode: formData.address.postalCode.trim(),
      city: normalizedCity,
      country: formData.address.country
    }
  }

  // Préparer les données de livraison
  const shippingInfo = {
    method: 'standard',
    cost: 0, // Livraison gratuite
    address: customerInfo.address,
    estimatedDelivery: null
  }

  // Créer la commande
  const result = await processCheckout(
    cartStore.items,
    customerInfo,
    shippingInfo
  )

  if (result.success) {
    orderCreated.value = true
    orderNumber.value = result.orderNumber
    
    // Vider le panier après succès
    setTimeout(() => {
      cartStore.clearCart()
    }, 500)
  } else {
    errorMessage.value = result.error || 'Une erreur est survenue'
  }
}

const closeModal = () => {
  if (!processing.value) {
    emit('close')
    // Reset après fermeture
    setTimeout(() => {
      resetForm()
    }, 300)
  }
}

const finishAndClose = () => {
  emit('close')
  cartStore.closeCart()
  setTimeout(() => {
    resetForm()
  }, 300)
}

const resetForm = () => {
  formData.name = ''
  formData.email = ''
  formData.phone = ''
  formData.address.street = ''
  formData.address.postalCode = ''
  formData.address.city = ''
  orderCreated.value = false
  orderNumber.value = ''
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

/* Forcer le style sur l'auto-remplissage du navigateur */
.input-field:-webkit-autofill,
.input-field:-webkit-autofill:hover,
.input-field:-webkit-autofill:focus,
.input-field:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px var(--color-black-light) inset !important;
  -webkit-text-fill-color: white !important;
  box-shadow: 0 0 0 30px var(--color-black-light) inset !important;
  border: 1px solid rgba(57, 255, 20, 0.2) !important;
  caret-color: white;
  transition: background-color 5000s ease-in-out 0s;
}

.input-field:-webkit-autofill:focus {
  border: 1px solid var(--color-neon-green) !important;
}

/* Scrollbar personnalisée pour la liste des articles */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(57, 255, 20, 0.05);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-neon-green);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(57, 255, 20, 0.8);
}

/* Scrollbar pour le body de la modale */
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

/* Égalisation des hauteurs des colonnes checkout */
@media (min-width: 1024px) {
  form {
    display: grid;
    grid-auto-rows: 1fr;
  }
  
  .checkout-summary {
    max-height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .checkout-items-list {
    max-height: 250px;
    overflow-y: auto;
  }
}
</style>
