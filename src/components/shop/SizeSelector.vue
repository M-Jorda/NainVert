<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div 
        class="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      >
        <div 
          class="bg-[var(--color-black-light)] border-2 border-[var(--color-neon-green)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-white mb-1">Choisis ta taille</h2>
              <p class="text-sm text-[var(--color-text-secondary)]">
                {{ design.name }} - {{ selectedType === 'tshirt' ? 'T-Shirt' : 'Hoodie' }}
              </p>
            </div>
            <button 
              @click="$emit('close')"
              class="text-[var(--color-text-secondary)] hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <!-- Grille de tailles -->
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-6">
            <button
              v-for="size in availableSizes"
              :key="size"
              @click="selectedSize = size"
              :class="[
                'aspect-square rounded-lg border-2 font-bold text-lg transition-all',
                selectedSize === size
                  ? 'border-[var(--color-neon-green)] bg-[var(--color-neon-green)]/20 scale-110'
                  : 'border-[rgba(57,255,20,0.3)] hover:border-[var(--color-neon-green)] hover:scale-105'
              ]"
            >
              {{ size }}
            </button>
          </div>

          <!-- Guide des tailles -->
          <div class="mb-6 p-4 bg-black/50 border border-[rgba(57,255,20,0.2)] rounded-lg">
            <button 
              @click="showSizeGuide = !showSizeGuide"
              class="flex items-center justify-between w-full text-left"
            >
              <span class="text-sm font-semibold text-white">📏 Guide des tailles</span>
              <span class="text-[var(--color-neon-green)]">{{ showSizeGuide ? '−' : '+' }}</span>
            </button>
            
            <div v-if="showSizeGuide" class="mt-4 overflow-x-auto">
              <table class="w-full text-xs text-[var(--color-text-secondary)]">
                <thead>
                  <tr class="border-b border-[rgba(57,255,20,0.2)]">
                    <th class="text-left py-2">Taille</th>
                    <th class="text-center py-2">Longueur (cm)</th>
                    <th class="text-center py-2">Largeur (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="size in sizeChart" :key="size.name" class="border-b border-[rgba(57,255,20,0.1)]">
                    <td class="py-2 font-semibold text-white">{{ size.name }}</td>
                    <td class="text-center">{{ size.length }}</td>
                    <td class="text-center">{{ size.width }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Récapitulatif -->
          <div class="mb-6 p-6 bg-black/50 border border-[rgba(57,255,20,0.2)] rounded-lg">
            <h3 class="text-sm font-semibold text-white mb-4">Récapitulatif</h3>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-[var(--color-text-secondary)]">Design</span>
                <span class="text-white font-semibold">{{ design.name }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-[var(--color-text-secondary)]">Type</span>
                <span class="text-white font-semibold">
                  {{ selectedType === 'tshirt' ? '👕 T-Shirt' : '🧥 Hoodie' }}
                </span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-[var(--color-text-secondary)]">Taille</span>
                <span class="text-white font-semibold">{{ selectedSize || '—' }}</span>
              </div>
              <div class="flex justify-between text-lg border-t border-[rgba(57,255,20,0.2)] pt-3">
                <span class="text-white font-bold">Total</span>
                <span class="text-[var(--color-neon-green)] font-bold">{{ price }}€</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4">
            <button 
              @click="$emit('close')"
              class="btn btn-ghost flex-1"
            >
              Annuler
            </button>
            <button 
              @click="addToCart"
              :disabled="!selectedSize"
              :class="[
                'btn flex-1',
                selectedSize ? 'btn-primary' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              ]"
            >
              🛒 Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCart } from '@/stores/cart'
import { useGarmentTypes } from '@/composables/useGarmentTypes'

const props = defineProps({
  design: {
    type: Object,
    required: true
  },
  selectedType: {
    type: String,
    required: true,
    validator: (value) => ['tshirt', 'hoodie'].includes(value)
  },
  price: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'add-to-cart'])

const cart = useCart()
const { garmentTypes } = useGarmentTypes()

const selectedSize = ref(null)
const showSizeGuide = ref(false)

// Désactiver le scroll du body quand le modal est ouvert
onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

// Tailles disponibles selon le type
const availableSizes = computed(() => {
  return garmentTypes[props.selectedType]?.sizes || []
})

// Tableau des tailles (exemple)
const sizeChart = [
  { name: 'XS', length: 68, width: 49 },
  { name: 'S', length: 71, width: 52 },
  { name: 'M', length: 74, width: 55 },
  { name: 'L', length: 77, width: 58 },
  { name: 'XL', length: 80, width: 61 },
  { name: 'XXL', length: 83, width: 64 },
  { name: 'XXXL', length: 86, width: 67 }
]

const addToCart = () => {
  if (!selectedSize.value) return

  // Créer l'item pour le panier
  const cartItem = {
    id: `${props.design.slug}-${props.selectedType}-${selectedSize.value}`,
    designId: props.design.id,
    designSlug: props.design.slug,
    designName: props.design.name,
    type: props.selectedType,
    size: selectedSize.value,
    price: props.price,
    image: props.design.images[0],
    quantity: 1
  }

  cart.addItem(cartItem)
  
  emit('add-to-cart', cartItem)
  emit('close')
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
</style>
