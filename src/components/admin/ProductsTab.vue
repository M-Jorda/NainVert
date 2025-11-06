<template>
  <div class="products-tab">
    <h2 class="text-2xl font-bold mb-6 text-white">Gestion des Produits</h2>
    
    <!-- Tableau des produits -->
    <div v-if="products.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-[var(--color-text-secondary)] opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      </svg>
      <p class="text-[var(--color-text-secondary)]">Aucun produit trouvé</p>
    </div>
    
    <div v-else>
      <table class="w-full text-sm bg-[var(--color-black-light)] rounded-xl overflow-hidden">
        <thead>
          <tr class="bg-[rgba(57,255,20,0.05)]">
            <th class="p-3 text-left">Image</th>
            <th class="p-3 text-left">Nom</th>
            <th class="p-3 text-left">Prix</th>
            <th class="p-3 text-left">Type</th>
            <th class="p-3 text-left">Stock</th>
            <th class="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="product in products" 
            :key="product.id" 
            class="border-b border-[rgba(57,255,20,0.05)] hover:bg-[rgba(57,255,20,0.03)] cursor-pointer" 
            @click="selectedProduct = product"
          >
            <td class="p-3">
              <img :src="product.images[0]" :alt="product.name" class="w-12 h-12 object-cover rounded-lg">
            </td>
            <td class="p-3 font-semibold">{{ product.name }}</td>
            <td class="p-3 font-bold text-[var(--color-neon-green)]">{{ product.price }}€</td>
            <td class="p-3">{{ product.type }}</td>
            <td class="p-3">
              <span :class="[
                'px-2 py-1 text-xs font-bold rounded',
                product.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              ]">
                {{ product.inStock ? 'En stock' : 'Rupture' }}
              </span>
            </td>
            <td class="p-3">
              <button @click.stop="selectedProduct = product" class="btn btn-xs btn-primary">Détails</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal de détail produit -->
    <teleport to="body">
      <transition name="modal-fade">
        <div 
          v-if="selectedProduct" 
          class="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          @click="selectedProduct = null"
        >
          <div 
            class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gradient">
                Éditer le produit
              </h2>
              <button 
                @click="selectedProduct = null"
                class="w-10 h-10 flex items-center justify-center border border-[rgba(57,255,20,0.2)] rounded-lg text-[var(--color-text-secondary)] hover:border-[var(--color-neon-green)] hover:text-[var(--color-neon-green)] transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Images du produit -->
            <div class="mb-6 p-6 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg">
              <h3 class="text-lg font-bold text-white mb-4">📷 Images</h3>
              <div class="grid grid-cols-3 gap-4 mb-4">
                <div 
                  v-for="(image, idx) in selectedProduct.images" 
                  :key="idx"
                  class="aspect-square rounded-lg overflow-hidden border-2 border-[rgba(57,255,20,0.2)]"
                >
                  <img :src="image" :alt="`Image ${idx + 1}`" class="w-full h-full object-cover">
                </div>
              </div>
              <button 
                @click="$emit('open-image-modal', selectedProduct)"
                class="btn btn-secondary w-full"
              >
                Gérer les images
              </button>
            </div>

            <!-- Informations du produit -->
            <div class="mb-6 p-6 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg">
              <h3 class="text-lg font-bold text-white mb-4">ℹ️ Informations</h3>
              
              <!-- Nom -->
              <div class="mb-4">
                <label class="block text-sm font-semibold text-white mb-2">Nom du produit</label>
                <input 
                  v-model="selectedProduct.name"
                  @blur="$emit('update-product', selectedProduct.slug, { name: selectedProduct.name })"
                  class="form-input w-full"
                >
              </div>

              <!-- Prix et Stock -->
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-semibold text-white mb-2">Prix (€)</label>
                  <div class="flex items-stretch gap-2">
                    <button
                      @click="decrementPrice(selectedProduct)"
                      class="price-control-btn-compact"
                      :disabled="selectedProduct.price <= 1"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                    <input 
                      v-model.number="selectedProduct.price"
                      @blur="$emit('update-product', selectedProduct.slug, { price: selectedProduct.price })"
                      type="number"
                      min="1"
                      class="form-input flex-1 text-center"
                    >
                    <button
                      @click="incrementPrice(selectedProduct)"
                      class="price-control-btn-compact"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-white mb-2">Disponibilité</label>
                  <label class="inline-flex items-center cursor-pointer h-[42px] px-4 bg-[var(--color-black-lighter)] rounded-lg border border-[rgba(57,255,20,0.2)] w-full justify-center">
                    <input 
                      v-model="selectedProduct.inStock"
                      @change="$emit('update-product', selectedProduct.slug, { inStock: selectedProduct.inStock })"
                      type="checkbox"
                      class="w-5 h-5 rounded border-2 border-[rgba(57,255,20,0.3)] bg-transparent checked:bg-[var(--color-neon-green)] transition-all"
                    >
                    <span class="ml-2 text-sm font-semibold">
                      {{ selectedProduct.inStock ? '✓ En stock' : '✗ En rupture' }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Description -->
              <div class="mb-4">
                <label class="block text-sm font-semibold text-white mb-2">Description</label>
                <textarea 
                  v-model="selectedProduct.description"
                  @blur="$emit('update-product', selectedProduct.slug, { description: selectedProduct.description })"
                  class="form-textarea w-full"
                  rows="4"
                ></textarea>
              </div>

              <!-- Informations supplémentaires -->
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-white mb-2">Type</label>
                  <div class="px-3 py-2 bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.2)] rounded text-[var(--color-neon-green)]">
                    {{ selectedProduct.type }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-white mb-2">Tailles</label>
                  <div class="px-3 py-2 bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.2)] rounded text-[var(--color-neon-green)]">
                    {{ selectedProduct.sizes.join(', ') }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-white mb-2">Images</label>
                  <div class="px-3 py-2 bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.2)] rounded text-[var(--color-neon-green)]">
                    {{ selectedProduct.images.length }} image{{ selectedProduct.images.length > 1 ? 's' : '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  products: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update-product', 'open-image-modal'])

const selectedProduct = ref(null)

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
  width: 3rem;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-black-lighter);
  border: 1px solid rgba(57,255,20,0.2);
  border-radius: 0.5rem;
  transition: all 0.3s;
  color: var(--color-neon-green);
}

.price-control-btn-compact:hover:not(:disabled) {
  border-color: var(--color-neon-green);
  background: rgba(57,255,20,0.05);
}

.price-control-btn-compact:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from > div,
.modal-fade-leave-to > div {
  transform: scale(0.9) translateY(20px);
}
</style>
