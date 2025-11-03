<template>
  <div class="products-tab">
    <h2 class="text-2xl font-bold mb-6 text-white">Gestion des Produits</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="product in products" 
        :key="product.id"
        class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-xl hover:border-[var(--color-neon-green)] transition-all duration-300"
      >
        <div class="flex gap-4 p-4">
          <!-- Product Image (compact) -->
          <div class="relative w-32 h-32 flex-shrink-0 bg-[rgba(57,255,20,0.05)] rounded-lg overflow-hidden group">
            <img 
              :src="product.images[0]" 
              :alt="product.name"
              class="w-full h-full object-cover"
            >
            
            <!-- Edit Image Button -->
            <div class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button 
                @click="$emit('open-image-modal', product)"
                class="px-3 py-2 bg-[var(--color-neon-green)] text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline mr-1">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Images
              </button>
            </div>
          </div>

          <!-- Product Fields -->
          <div class="flex-1 flex flex-col gap-2 min-w-0">
            <!-- Nom -->
            <div>
              <label class="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)]">Nom</label>
              <input 
                v-model="product.name"
                @blur="$emit('update-product', product.slug, { name: product.name })"
                class="form-input text-sm py-2"
              >
            </div>

            <!-- Prix et Stock -->
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)]">Prix (€)</label>
                <div class="flex items-stretch gap-1">
                  <button
                    @click="decrementPrice(product)"
                    class="price-control-btn-compact"
                    :disabled="product.price <= 1"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <input 
                    v-model.number="product.price"
                    @blur="$emit('update-product', product.slug, { price: product.price })"
                    type="number"
                    min="1"
                    class="form-input text-sm py-2 flex-1 text-center"
                  >
                  <button
                    @click="incrementPrice(product)"
                    class="price-control-btn-compact"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)]">En stock</label>
                <label class="inline-flex items-center cursor-pointer h-[38px] px-3 bg-[var(--color-black-lighter)] rounded-lg border border-[rgba(57,255,20,0.2)]">
                  <input 
                    v-model="product.inStock"
                    @change="$emit('update-product', product.slug, { inStock: product.inStock })"
                    type="checkbox"
                    class="w-4 h-4 rounded border-2 border-[rgba(57,255,20,0.3)] bg-transparent checked:bg-[var(--color-neon-green)] transition-all"
                  >
                  <span class="ml-2 text-xs text-[var(--color-text-secondary)]">
                    {{ product.inStock ? '✓ Dispo' : '✗ Rupture' }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)]">Description</label>
              <textarea 
                v-model="product.description"
                @blur="$emit('update-product', product.slug, { description: product.description })"
                class="form-textarea text-sm py-2"
                rows="2"
              ></textarea>
            </div>

            <!-- Info badges -->
            <div class="flex gap-1 flex-wrap text-xs">
              <span class="px-2 py-1 bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.2)] rounded text-[var(--color-neon-green)]">
                {{ product.images.length }} image{{ product.images.length > 1 ? 's' : '' }}
              </span>
              <span class="px-2 py-1 bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.2)] rounded text-[var(--color-neon-green)]">
                {{ product.type }}
              </span>
              <span class="px-2 py-1 bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.2)] rounded text-[var(--color-neon-green)]">
                {{ product.sizes.join(', ') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  products: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update-product', 'open-image-modal'])

function incrementPrice(product) {
  product.price += 1
  emit('update-product', product.slug, { price: product.price })
}

function decrementPrice(product) {
  if (product.price > 1) {
    product.price -= 1
    emit('update-product', product.slug, { price: product.price })
  }
}
</script>

<style scoped>
.price-control-btn-compact {
  width: 2.5rem;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-black-lighter);
  border: 1px solid rgba(57,255,20,0.2);
  border-radius: 0.5rem;
  transition: all 0.3s;
}

.price-control-btn-compact:hover:not(:disabled) {
  border-color: var(--color-neon-green);
  background: rgba(57,255,20,0.05);
}

.price-control-btn-compact:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
