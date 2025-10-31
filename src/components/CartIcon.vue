<template>
  <button 
    class="relative flex items-center justify-center w-11 h-11 bg-[rgba(57,255,20,0.05)] border-2 border-[rgba(57,255,20,0.2)] rounded-lg text-[var(--color-neon-green)] cursor-pointer transition-all duration-300 hover:border-[var(--color-neon-green)] hover:bg-[rgba(57,255,20,0.1)] hover:scale-105" 
    @click="cartStore.toggleCart"
    aria-label="Panier"
  >
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
    <span v-if="cartStore.itemCount > 0" class="cart-badge absolute -top-2 -right-2 flex items-center justify-center min-w-5 h-5 px-1.5 bg-[var(--color-neon-green)] text-black rounded-full text-xs font-bold shadow-[0_0_10px_var(--color-neon-green)]">
      {{ cartStore.itemCount }}
    </span>
  </button>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
</script>

<style scoped>
.cart-badge {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
