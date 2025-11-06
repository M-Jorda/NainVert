<template>
  <transition name="cart-slide">
    <div v-if="cartStore.isOpen" class="fixed inset-0 bg-black/80 backdrop-blur-[5px] z-[2000] flex justify-end" @click="cartStore.closeCart">
      <div class="w-full max-w-[450px] h-screen bg-[var(--color-black)] border-l border-[rgba(57,255,20,0.2)] flex flex-col overflow-hidden" @click.stop>
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-[rgba(57,255,20,0.2)]">
          <h2 class="text-2xl font-bold m-0 text-[var(--color-neon-green)]">Mon Panier</h2>
          <button 
            class="flex items-center justify-center w-9 h-9 bg-[rgba(57,255,20,0.05)] border-none rounded-lg text-[var(--color-text-secondary)] cursor-pointer transition-all duration-200 hover:bg-[var(--color-neon-green)] hover:text-black" 
            @click="cartStore.closeCart"
            aria-label="Fermer le panier"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          <router-link to="/products" class="btn btn-primary" @click="cartStore.closeCart">
            Voir les articles
          </router-link>
        </div>

        <!-- Cart Items -->
        <div v-else class="flex-1 flex flex-col overflow-hidden">
          <div class="cart-items flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            <div 
              v-for="item in cartStore.items" 
              :key="`${item.id}-${item.size}`"
              class="flex gap-4 p-4 bg-[var(--color-black-light)] rounded-xl border border-[rgba(57,255,20,0.2)]"
            >
              <div class="w-20 h-20 rounded-lg overflow-hidden bg-[rgba(57,255,20,0.05)] flex-shrink-0">
                <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
              </div>
              
              <div class="flex-1 flex flex-col gap-1">
                <h3 class="text-base font-semibold m-0 text-white">{{ item.name }}</h3>
                <p class="text-[0.85rem] text-[var(--color-text-muted)] m-0">Taille: {{ item.size }}</p>
                <p class="text-base font-bold text-[var(--color-neon-green)] m-0">{{ item.price }}€</p>
              </div>

              <div class="flex flex-col gap-3 items-end">
                <div class="flex items-center gap-2 bg-[rgba(57,255,20,0.05)] rounded-lg p-1 backdrop-blur-sm">
                  <button 
                    @click="cartStore.decrementQuantity(item.id, item.size)"
                    class="qty-btn"
                  >
                    -
                  </button>
                  <span class="min-w-[30px] text-center font-semibold text-white">{{ item.quantity }}</span>
                  <button 
                    @click="cartStore.incrementQuantity(item.id, item.size)"
                    class="qty-btn"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  @click="cartStore.removeItem(item.id, item.size)"
                  class="remove-btn"
                  aria-label="Supprimer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer with Total & Checkout -->
          <div class="p-6 border-t border-[rgba(57,255,20,0.2)] bg-[var(--color-black-light)] flex flex-col gap-4">
            <div class="flex justify-between items-center py-4">
              <span class="text-xl font-semibold text-white uppercase tracking-wider">Total</span>
              <span class="text-3xl font-black text-[var(--color-neon-green)] drop-shadow-[0_0_10px_var(--color-neon-green)]">{{ cartStore.totalPrice.toFixed(2) }}€</span>
            </div>
            
            <button class="btn btn-primary w-full" @click="openCheckout">
              Procéder au paiement
            </button>
            
            <button 
              @click="cartStore.clearCart" 
              class="btn btn-ghost w-full"
            >
              Vider le panier
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Checkout Modal -->
  <CheckoutModal :isOpen="showCheckoutModal" @close="showCheckoutModal = false" />
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import CheckoutModal from './CheckoutModal.vue'

const cartStore = useCartStore()
const showCheckoutModal = ref(false)

const openCheckout = () => {
  showCheckoutModal.value = true
}
</script>

<style scoped>
/* Animations */
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

/* Boutons quantité - Style futuriste */
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
