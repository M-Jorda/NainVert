<template>
  <div class="product-card bg-[var(--color-black-light)] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border border-[rgba(57,255,20,0.2)] flex flex-col hover:shadow-[0_15px_40px_rgba(57,255,20,0.15)]" @click="goToProduct">
    <!-- Image -->
    <div class="relative w-full pt-[125%] bg-[rgba(57,255,20,0.05)] overflow-hidden">
      <img :src="product.images[0]" :alt="product.name" class="card-img absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500" />
      <div v-if="product.featured" class="absolute top-3 left-3 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider z-10 bg-gradient-to-r from-[var(--color-neon-green)] to-[var(--color-cyan-green)] text-black">Nouveauté</div>
      <div v-if="!product.inStock" class="absolute top-3 left-3 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider z-10 bg-red-500/90 text-white">Rupture de stock</div>
      
      <!-- Quick Actions -->
      <div v-if="!compact" class="card-actions absolute top-3 right-3 flex gap-2 opacity-0 -translate-y-2 transition-all duration-300">
        <button 
          class="flex items-center justify-center w-9 h-9 bg-black/80 backdrop-blur-[10px] border border-[var(--color-neon-green)] rounded-lg text-[var(--color-neon-green)] cursor-pointer transition-all duration-200 hover:bg-[var(--color-neon-green)] hover:text-black hover:scale-110"
          @click.stop="toggleQuickView"
          aria-label="Vue rapide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col gap-2 flex-1">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wider text-[var(--color-neon-green)]">
          {{ productType }}
          <span 
            v-if="product.featured && !compact"
            class="easter-egg-mini"
            @click.stop="openRandomEasterEgg"
            title="✨"
          >
            ✨
          </span>
        </span>
      </div>
      
      <h3 class="text-lg font-bold text-white m-0 leading-tight">{{ product.name }}</h3>
      
      <p v-if="!compact" class="text-sm text-[var(--color-text-secondary)] leading-normal m-0 flex-1">{{ truncatedDescription }}</p>
      
      <div :class="['flex items-center gap-3 mt-3', compact ? 'flex-col items-start' : 'justify-between']">
        <span class="text-2xl font-black text-[var(--color-neon-green)] drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">{{ product.price }}€</span>
        <button 
          v-if="!compact"
          class="btn btn-primary text-sm px-4 py-2 gap-2"
          @click.stop="emit('add-to-cart', product)"
          :disabled="!product.inStock"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Ajouter
        </button>
      </div>
    </div>
  </div>
  
  <!-- Easter Egg Modal -->
  <EasterEggModal 
    :is-open="isModalOpen"
    :content="currentContent"
    @close="closeEasterEgg"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import EasterEggModal from './EasterEggModal.vue'
import { useEasterEgg } from '../composables/useEasterEgg'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add-to-cart', 'quick-view'])

const router = useRouter()
const { isModalOpen, currentContent, openEasterEgg, closeEasterEgg } = useEasterEgg()

const productType = computed(() => {
  return props.product.type === 'tshirt' ? 'T-Shirt' : 'Pull'
})

const truncatedDescription = computed(() => {
  const maxLength = 80
  if (props.product.description.length <= maxLength) {
    return props.product.description
  }
  return props.product.description.substring(0, maxLength) + '...'
})

const goToProduct = () => {
  router.push(`/products/${props.product.slug}`)
}

const toggleQuickView = () => {
  emit('quick-view', props.product)
}

// Easter egg aléatoire pour les produits featured
const openRandomEasterEgg = () => {
  const easterEggKeys = ['energy', 'creativity', 'rebel', 'dream']
  const randomKey = easterEggKeys[Math.floor(Math.random() * easterEggKeys.length)]
  openEasterEgg(randomKey)
}
</script>

<style scoped>
.product-card:hover {
  transform: translateY(-8px);
  border-color: var(--color-neon-green);
}

.product-card:hover .card-img {
  transform: scale(1.08);
}

.product-card:hover .card-actions {
  opacity: 1;
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Easter egg mini */
.easter-egg-mini {
  display: inline-block;
  cursor: pointer;
  font-size: 0.85em;
  margin-left: 4px;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.easter-egg-mini:hover {
  transform: scale(1.4) rotate(20deg);
  opacity: 1;
  filter: drop-shadow(0 0 6px rgba(57, 255, 20, 0.8));
}

/* Responsive */
@media (max-width: 768px) {
  .card-actions {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
