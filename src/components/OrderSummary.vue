<template>
  <div class="bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg p-4 flex flex-col h-full">
    <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-3">
      Articles ({{ cartStore.itemCount }})
    </h4>
    
    <!-- Liste des articles -->
    <div class="space-y-3 mb-4 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[300px]">
      <div 
        v-for="item in cartStore.items" 
        :key="item.id" 
        class="flex gap-3 p-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.1)] rounded-lg"
      >
        <!-- Image miniature -->
        <div class="w-16 h-16 rounded overflow-hidden bg-[rgba(57,255,20,0.05)] flex-shrink-0">
          <img 
            :src="item.image" 
            :alt="item.designName" 
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        <!-- Infos -->
        <div class="flex-1 flex flex-col justify-center min-w-0">
          <div class="text-white font-semibold text-sm leading-tight truncate">
            {{ item.designName }}
          </div>
          <div class="text-[var(--color-text-secondary)] text-xs mt-1">
            {{ item.type === 'tshirt' ? 'T-Shirt' : 'Hoodie' }} • Taille {{ item.size }}
          </div>
          <div class="text-[var(--color-text-muted)] text-xs mt-1">
            {{ item.price.toFixed(2) }}€ × {{ item.quantity }}
          </div>
        </div>
        
        <!-- Prix total -->
        <div class="flex flex-col items-end justify-center flex-shrink-0">
          <div class="text-[var(--color-neon-green)] font-bold text-sm">
            {{ (item.price * item.quantity).toFixed(2) }}€
          </div>
        </div>
      </div>
    </div>
    
    <!-- Totaux -->
    <div class="border-t border-[rgba(57,255,20,0.2)] pt-4 space-y-2 mt-auto">
      <div class="flex justify-between text-[var(--color-text-secondary)] text-sm">
        <span>Sous-total</span>
        <span class="text-white">{{ cartStore.totalPrice.toFixed(2) }}€</span>
      </div>
      
      <div class="flex justify-between text-[var(--color-text-secondary)] text-sm">
        <span>Livraison</span>
        <span v-if="!hasShippingCost" class="text-[var(--color-text-muted)] italic">À calculer</span>
        <span v-else-if="isFreeShipping" class="text-[var(--color-neon-green)] font-semibold">GRATUIT</span>
        <span v-else class="text-white">{{ shippingCost.toFixed(2) }}€</span>
      </div>
      
      <div class="flex justify-between text-[var(--color-text-secondary)] text-sm">
        <span>TVA incluse (20%)</span>
        <span>{{ tvaWithShipping.toFixed(2) }}€</span>
      </div>
      
      <div class="pt-3 border-t border-[rgba(57,255,20,0.2)]">
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold text-white">Total TTC</span>
          <span class="text-2xl font-black text-[var(--color-neon-green)]">
            {{ totalWithShipping.toFixed(2) }}€
          </span>
        </div>
      </div>
    </div>

    <!-- Badge sécurité -->
    <div class="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
      Paiement 100% sécurisé
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cartStore: {
    type: Object,
    required: true
  },
  shippingCost: {
    type: Number,
    default: null
  }
})

// Si shippingCost est passé, l'utiliser, sinon afficher "À calculer"
const hasShippingCost = computed(() => props.shippingCost !== null)
const isFreeShipping = computed(() => props.shippingCost === 0)
const totalWithShipping = computed(() => {
  return hasShippingCost.value 
    ? props.cartStore.totalPrice + props.shippingCost 
    : props.cartStore.totalPrice
})
const tvaWithShipping = computed(() => {
  return totalWithShipping.value * 0.2
})
</script>

<style scoped>
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
</style>
