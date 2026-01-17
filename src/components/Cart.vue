<template>
  <transition name="cart-slide">
    <div v-if="cartStore.isOpen" class="fixed inset-0 bg-black/80 backdrop-blur-[5px] z-[2000] flex justify-end" @click="handleOverlayClick">
      <div class="w-full max-w-[450px] h-screen bg-[var(--color-black)] border-l border-[rgba(57,255,20,0.2)] flex flex-col overflow-hidden" @click.stop>
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-[rgba(57,255,20,0.2)]">
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-bold m-0 text-[var(--color-neon-green)]">Mon Panier</h2>
            <button 
              @click="cartStore.clearCart" 
              class="btn btn-ghost text-xs px-2 py-1"
            >
              🗑️ Vider
            </button>
          </div>
          <button 
            class="flex items-center justify-center w-8 h-8 bg-[rgba(57,255,20,0.05)] border-none rounded-lg text-[var(--color-text-secondary)] cursor-pointer transition-all duration-200 hover:bg-[var(--color-neon-green)] hover:text-black" 
            @click="closeAndGoToDesigns"
            aria-label="Fermer le panier"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Empty Cart -->
        <div v-if="cartStore.isEmpty" class="flex-1 flex flex-col items-center justify-center gap-8 p-8 text-[var(--color-text-muted)]">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p class="text-xl text-[var(--color-text-secondary)]">Votre panier est vide</p>
          <router-link to="/designs" class="btn btn-primary" @click="cartStore.closeCart">
            Voir les designs
          </router-link>
        </div>

        <!-- Cart Items -->
        <div v-else class="flex-1 flex flex-col overflow-hidden">
          <!-- Message articles retirés -->
          <transition name="fade">
            <div v-if="removedItemsMessage" class="mx-4 mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p class="text-yellow-400 text-sm m-0">{{ removedItemsMessage }}</p>
            </div>
          </transition>

          <div class="cart-items flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            <div
              v-for="item in cartStore.items"
              :key="`${item.id}-${item.size}`"
              class="cart-item flex gap-3 p-2 bg-[var(--color-black-light)] rounded-lg border cursor-pointer transition-colors"
              :class="getItemStockStatus(item).exceeded
                ? 'border-red-500/50 bg-red-500/5'
                : 'border-[rgba(57,255,20,0.2)] hover:border-[rgba(57,255,20,0.4)]'"
              @click="openEditModal(item)"
            >
              <div class="w-14 h-14 rounded-lg overflow-hidden bg-[var(--color-black-lighter)] flex-shrink-0 p-1.5">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-contain rounded" />
              </div>

              <div class="flex-1 flex flex-col justify-center">
                <h3 class="text-sm font-semibold m-0 text-white leading-tight">{{ item.designName || item.name }}</h3>
                <p class="text-xs text-[var(--color-text-muted)] m-0">{{ item.type === 'tshirt' ? 'T-Shirt' : 'Hoodie' }} - {{ item.size }}</p>
                <div class="flex items-center gap-2">
                  <p class="text-sm font-bold text-[var(--color-neon-green)] m-0">{{ item.price }}€</p>
                  <!-- Stock indicator -->
                  <span
                    class="text-xs px-1.5 py-0.5 rounded"
                    :class="getItemStockStatus(item).exceeded
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-[rgba(57,255,20,0.1)] text-[var(--color-text-muted)]'"
                  >
                    {{ getItemStockStatus(item).available }} dispo
                  </span>
                </div>
                <!-- Warning if quantity exceeds stock -->
                <p v-if="getItemStockStatus(item).exceeded" class="text-xs text-red-400 m-0 mt-1">
                  Seulement {{ getItemStockStatus(item).available }} disponible{{ getItemStockStatus(item).available > 1 ? 's' : '' }}
                </p>
              </div>

              <div class="flex flex-col gap-2 items-end justify-center" @click.stop>
                <div class="flex items-center gap-1 rounded px-1"
                     :class="getItemStockStatus(item).exceeded
                       ? 'bg-red-500/10'
                       : 'bg-[rgba(57,255,20,0.05)]'">
                  <button
                    @click="cartStore.decrementQuantity(item.id, item.size)"
                    class="qty-btn-small"
                  >
                    -
                  </button>
                  <span class="min-w-[20px] text-center text-xs font-semibold"
                        :class="getItemStockStatus(item).exceeded ? 'text-red-400' : 'text-white'">
                    {{ item.quantity }}
                  </span>
                  <button
                    @click="cartStore.incrementQuantity(item.id, item.size)"
                    class="qty-btn-small"
                    :class="{ 'opacity-50 cursor-not-allowed': item.quantity >= getItemStockStatus(item).available }"
                    :disabled="item.quantity >= getItemStockStatus(item).available"
                  >
                    +
                  </button>
                </div>

                <button
                  @click="cartStore.removeItem(item.id, item.size)"
                  class="remove-btn-small"
                  aria-label="Supprimer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer with Total & Checkout -->
          <div class="p-4 border-t border-[rgba(57,255,20,0.2)] bg-[var(--color-black-light)] flex flex-col gap-3">
            <!-- Indicateur livraison gratuite -->
            <div v-if="shippingInfo"
                 class="p-3 rounded-lg text-sm"
                 :class="shippingInfo.isFree
                   ? 'bg-[rgba(57,255,20,0.1)] border border-[var(--color-neon-green)] text-[var(--color-neon-green)]'
                   : 'bg-[rgba(255,193,7,0.1)] border border-yellow-500/30 text-yellow-400'">
              <div class="flex items-center gap-2">
                <span class="font-medium">{{ shippingInfo.message }}</span>
              </div>
              <!-- Barre de progression -->
              <div v-if="!shippingInfo.isFree" class="mt-2 h-1.5 bg-[var(--color-black)] rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-yellow-500 to-[var(--color-neon-green)] transition-all duration-500"
                     :style="{ width: progressPercentage + '%' }"></div>
              </div>
            </div>

            <!-- Warning if stock issues -->
            <div v-if="!cartStockValidation.isValid" class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p class="text-red-400 text-sm m-0 font-medium">
                {{ checkoutDisabledReason }}
              </p>
              <p class="text-red-400/70 text-xs m-0 mt-1">
                Réduisez les quantités pour continuer
              </p>
            </div>

            <div class="flex justify-between items-center">
              <span class="text-base font-semibold text-white">Total</span>
              <span class="text-xl font-black text-[var(--color-neon-green)]">{{ cartStore.totalPrice.toFixed(2) }}€</span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button
                class="btn text-sm py-2 transition-all"
                :class="canCheckout
                  ? 'btn-primary'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'"
                :disabled="!canCheckout"
                @click="canCheckout && openCheckout()"
                :title="checkoutDisabledReason || 'Procéder au paiement'"
              >
                Procéder au paiement
              </button>

              <button
                @click="continueAndGoToDesigns"
                class="btn btn-ghost text-sm py-2"
              >
                Continuer les achats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Checkout Modal avec Stripe -->
  <CheckoutModalStripe :isOpen="showCheckoutModal" @close="showCheckoutModal = false" />

  <!-- Edit Item Modal -->
  <CartItemEdit
    v-if="editingItem"
    :item="editingItem"
    @close="closeEditModal"
    @updated="closeEditModal"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useStock } from '@/composables/useStock'
import CheckoutModalStripe from './CheckoutModalStripe.vue'
import CartItemEdit from './CartItemEdit.vue'
import { FREE_SHIPPING_THRESHOLD, getFreeShippingMessage } from '@/services/shipping'

const cartStore = useCartStore()
const { stockData, loadStock, getStockQuantity, cleanup: cleanupStock } = useStock()
const router = useRouter()
const showCheckoutModal = ref(false)
const editingItem = ref(null)
const removedItemsMessage = ref('')

// Charger le stock au montage
onMounted(() => {
  loadStock()
})

onUnmounted(() => {
  cleanupStock()
})

// Vérifier les articles en rupture de stock quand le panier s'ouvre
watch(() => cartStore.isOpen, (isOpen) => {
  if (isOpen && stockData.value.length > 0) {
    checkAndRemoveOutOfStockItems()
  }
})

// Vérifier aussi quand les données de stock changent
watch(stockData, () => {
  if (cartStore.isOpen) {
    checkAndRemoveOutOfStockItems()
  }
}, { deep: true })

const checkAndRemoveOutOfStockItems = () => {
  const removedItems = cartStore.removeOutOfStockItems(getStockQuantity)
  if (removedItems.length > 0) {
    const names = removedItems.map(item => item.designName || item.name).join(', ')
    removedItemsMessage.value = `Article(s) retiré(s) (rupture de stock) : ${names}`
    // Effacer le message après 5 secondes
    setTimeout(() => {
      removedItemsMessage.value = ''
    }, 5000)
  }
}

// Vérifier si un article est en rupture de stock
const isItemOutOfStock = (item) => {
  const designId = item.designSlug || item.designId
  if (!designId) return false
  return getStockQuantity(designId) <= 0
}

// Vérifier si un article a un stock insuffisant
const getItemStockStatus = (item) => {
  const designId = item.designSlug || item.designId
  if (!designId) return { inStock: true, available: 999, exceeded: false }
  const available = getStockQuantity(designId)
  return {
    inStock: available >= item.quantity,
    available,
    exceeded: item.quantity > available
  }
}

// Vérifier si tous les articles sont en stock (pour le bouton checkout)
const cartStockValidation = computed(() => {
  const itemsWithIssues = []

  for (const item of cartStore.items) {
    const status = getItemStockStatus(item)
    if (status.exceeded) {
      itemsWithIssues.push({
        name: item.designName || item.name,
        requested: item.quantity,
        available: status.available
      })
    }
  }

  return {
    isValid: itemsWithIssues.length === 0,
    itemsWithIssues
  }
})

// Message d'erreur pour le bouton checkout
const checkoutDisabledReason = computed(() => {
  if (cartStore.isEmpty) return ''
  if (!cartStockValidation.value.isValid) {
    const count = cartStockValidation.value.itemsWithIssues.length
    return `${count} article${count > 1 ? 's' : ''} dépasse${count > 1 ? 'nt' : ''} le stock disponible`
  }
  return ''
})

// Peut-on procéder au paiement ?
const canCheckout = computed(() => {
  return !cartStore.isEmpty && cartStockValidation.value.isValid
})

const openEditModal = (item) => {
  editingItem.value = item
}

const closeEditModal = () => {
  editingItem.value = null
}

// Livraison gratuite
const shippingInfo = computed(() => getFreeShippingMessage(cartStore.totalPrice))
const progressPercentage = computed(() => {
  if (shippingInfo.value.isFree) return 100
  return Math.min((cartStore.totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)
})

const openCheckout = () => {
  showCheckoutModal.value = true
}

const continueAndGoToDesigns = () => {
  cartStore.closeCart()
  router.push('/designs')
}

const closeAndGoToDesigns = () => {
  cartStore.closeCart()
  router.push('/designs')
}

const handleOverlayClick = () => {
  cartStore.closeCart()
  router.push('/designs')
}
</script>

<style scoped>
/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.cart-slide-enter-active,
.cart-slide-leave-active {
  transition: opacity 0.3s ease;
}

.cart-slide-enter-from,
.cart-slide-leave-to {
  opacity: 0;
}

.cart-slide-enter-active > div,
.cart-slide-leave-active > div {
  transition: transform 0.3s ease;
}

.cart-slide-enter-from > div,
.cart-slide-leave-to > div {
  transform: translateX(100%);
}

/* Scrollbar for cart items */
.cart-items::-webkit-scrollbar {
  width: 6px;
}

.cart-items::-webkit-scrollbar-track {
  background: var(--color-black);
}

.cart-items::-webkit-scrollbar-thumb {
  background: var(--color-neon-green);
  border-radius: 3px;
}

/* Boutons quantité - Style compact */
.qty-btn-small {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: transparent;
  border: 1px solid rgba(57, 255, 20, 0.3);
  border-radius: 4px;
  color: var(--color-neon-green);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.qty-btn-small:hover {
  background: rgba(57, 255, 20, 0.15);
  border-color: var(--color-neon-green);
}

/* Bouton supprimer - Style compact */
.remove-btn-small {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 4px;
  color: #ff3b30;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-btn-small:hover {
  background: rgba(255, 59, 48, 0.2);
  border-color: #ff3b30;
}

/* Anciens boutons conservés pour compatibilité */
.qty-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid rgba(57, 255, 20, 0.3);
  border-radius: 8px;
  color: var(--color-neon-green);
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.qty-btn:hover {
  background: rgba(57, 255, 20, 0.15);
  border-color: var(--color-neon-green);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(57, 255, 20, 0.3);
}

.qty-btn:active {
  transform: scale(0.95);
}

/* Bouton supprimer - Style futuriste */
.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 10px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.remove-btn:hover {
  border-color: #ff4444;
  background: rgba(255, 68, 68, 0.1);
  color: #ff4444;
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(255, 68, 68, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .cart-slide-enter-active > div,
  .cart-slide-leave-active > div {
    max-width: 100%;
  }
}
</style>
