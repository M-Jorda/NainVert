<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  product: Object,
  availableSizes: Array
})

const emit = defineEmits(['close', 'add-to-cart'])

// Step 1: Design selection (keep as-is)
// Step 2: Type + Size combined
const currentStep = ref(1)
const selectedType = ref(null)
const selectedSize = ref(null)

const canProceed = computed(() => selectedType.value && selectedSize.value)

const handleTypeSelection = (type) => {
  selectedType.value = type
  // Don't auto-advance to step 3 anymore
}

const handleSizeSelection = (size) => {
  selectedSize.value = size
}








const addToCart = () => {
  emit('add-to-cart', {
    type: selectedType.value,
    size: selectedSize.value
  })
}
</script>

<template>
  <!-- Step 1: Design (unchanged) -->

  <!-- Step 2: Type + Size Combined -->
  <div v-if="currentStep === 2" class="space-y-6">
    <div>
      <h3 class="text-xl font-bold mb-4">Choisissez le type et la taille</h3>
      <div class="grid grid-cols-2 gap-4 mb-6">
        <button
          @click="handleTypeSelection('tshirt')"
          :class="[
            'p-4 rounded-lg border-2 transition-all',
            selectedType === 'tshirt'
              ? 'border-neon-green bg-neon-green/10'
              : 'border-black-lighter hover:border-neon-green/50'
          ]"
        >
          <span class="text-lg font-semibold">T-Shirt</span>
          <span class="block text-sm text-gray-400">€35</span>
        </button>
        <button
          @click="handleTypeSelection('hoodie')"
          :class="[
            'p-4 rounded-lg border-2 transition-all',
            selectedType === 'hoodie'
              ? 'border-neon-green bg-neon-green/10'
              : 'border-black-lighter hover:border-neon-green/50'
          ]"
        >
          <span class="text-lg font-semibold">Hoodie</span>
          <span class="block text-sm text-gray-400">€55</span>
        </button>
      </div>

      <div v-if="selectedType" class="pt-4 border-t border-black-lighter">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold">Choisissez la taille</h3>
          <a
            href="/faq#sizes"
            target="_blank"
            class="text-sm text-neon-green hover:text-neon-cyan transition-colors flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Guide des tailles
          </a>
        </div>
        <div class="grid grid-cols-5 gap-3">
          <button
            v-for="size in availableSizes"
            :key="size"
            @click="handleSizeSelection(size)"
            :class="[
              'py-3 rounded-lg border-2 font-semibold transition-all',
              selectedSize === size
                ? 'border-neon-green bg-neon-green/10 text-neon-green'
                : 'border-black-lighter hover:border-neon-green/50'
            ]"
          >
            {{ size }}
          </button>
        </div>
      </div>
    </div>
    <div class="flex gap-3 pt-4">
      <button
        @click="currentStep = 1"
        class="flex-1 py-3 border-2 border-black-lighter rounded-lg hover:border-neon-green/50 transition-all"
      >
        Retour
      </button>
      <button
        @click="addToCart"
        :disabled="!canProceed"
        :class="[
          'flex-1 py-3 rounded-lg font-semibold transition-all',
          canProceed
            ? 'bg-gradient-to-r from-neon-green to-neon-cyan text-black-deep hover:shadow-neon'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        ]"
      >
        Ajouter au panier
      </button>
    </div>
  </div>
</template>


