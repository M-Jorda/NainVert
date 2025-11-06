<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay fixed inset-0 bg-black/90 backdrop-blur-sm z-[3000] flex items-center justify-center p-4" @click="closeModal">
      <div class="modal-content w-full max-w-[500px] bg-[var(--color-black)] border-2 border-[var(--color-neon-green)] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(57,255,20,0.3)]" @click.stop>
        <!-- Header -->
        <div class="modal-header p-6 border-b border-[rgba(57,255,20,0.2)] flex items-center justify-between">
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
        <div class="modal-body p-6 overflow-y-auto max-h-[60vh]">
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
          <form v-else @submit.prevent="submitOrder" class="flex flex-col gap-4">
            <!-- Nom -->
            <div class="form-group">
              <label for="name" class="block text-sm font-semibold text-white mb-2 uppercase tracking-wider">Nom complet *</label>
              <input 
                id="name"
                v-model="formData.name" 
                type="text" 
                required
                class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors"
                placeholder="Jean Dupont"
              />
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email" class="block text-sm font-semibold text-white mb-2 uppercase tracking-wider">Email *</label>
              <input 
                id="email"
                v-model="formData.email" 
                type="email" 
                required
                class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors"
                placeholder="jean.dupont@email.com"
              />
            </div>

            <!-- Téléphone -->
            <div class="form-group">
              <label for="phone" class="block text-sm font-semibold text-white mb-2 uppercase tracking-wider">Téléphone</label>
              <input 
                id="phone"
                v-model="formData.phone" 
                type="tel"
                class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors"
                placeholder="06 12 34 56 78"
              />
            </div>

            <!-- Adresse -->
            <div class="form-group">
              <label for="address" class="block text-sm font-semibold text-white mb-2 uppercase tracking-wider">Adresse de livraison *</label>
              <input 
                id="address"
                v-model="formData.address.street" 
                type="text" 
                required
                class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors mb-3"
                placeholder="123 rue de la Paix"
              />
              <div class="grid grid-cols-2 gap-3">
                <input 
                  v-model="formData.address.postalCode" 
                  type="text" 
                  required
                  class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors"
                  placeholder="Code postal"
                />
                <input 
                  v-model="formData.address.city" 
                  type="text" 
                  required
                  class="input-field w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors"
                  placeholder="Ville"
                />
              </div>
            </div>

            <!-- Résumé commande -->
            <div class="bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg p-4 mt-4">
              <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-3">Résumé</h4>
              <div class="flex justify-between text-[var(--color-text-secondary)] mb-2">
                <span>{{ cartStore.itemCount }} article(s)</span>
                <span>{{ cartStore.totalPrice.toFixed(2) }}€</span>
              </div>
              <div class="flex justify-between text-[var(--color-text-secondary)] mb-3">
                <span>Livraison</span>
                <span>Gratuite</span>
              </div>
              <div class="flex justify-between items-center pt-3 border-t border-[rgba(57,255,20,0.2)]">
                <span class="text-lg font-bold text-white">Total</span>
                <span class="text-2xl font-black text-[var(--color-neon-green)]">{{ cartStore.totalPrice.toFixed(2) }}€</span>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              class="btn btn-primary w-full mt-4" 
              :disabled="processing"
            >
              <span v-if="processing">Création en cours...</span>
              <span v-else>Créer la commande</span>
            </button>

            <p class="text-xs text-center text-[var(--color-text-muted)] mt-2">
              En créant la commande, vous serez redirigé vers le paiement.
            </p>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive } from 'vue'
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

const submitOrder = async () => {
  errorMessage.value = ''
  
  // Validation
  if (!formData.name || !formData.email || !formData.address.street || !formData.address.postalCode || !formData.address.city) {
    errorMessage.value = 'Veuillez remplir tous les champs obligatoires'
    return
  }

  // Préparer les données client
  const customerInfo = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    address: formData.address
  }

  // Préparer les données de livraison
  const shippingInfo = {
    method: 'standard',
    cost: 0, // Livraison gratuite
    address: formData.address,
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

/* Scrollbar */
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
