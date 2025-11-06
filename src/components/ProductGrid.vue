<template>
  <div class="w-full">
    <!-- Filters -->
    <div class="flex gap-4 mb-12 flex-wrap justify-center">
      <button 
        :class="['filter-btn', { active: activeFilter === 'all' }]"
        @click="setFilter('all')"
      >
        TOUS
        <span class="count">{{ products.length }}</span>
      </button>
      <button 
        :class="['filter-btn', { active: activeFilter === 'tshirt' }]"
        @click="setFilter('tshirt')"
      >
        T-SHIRTS
        <span class="count">{{ tshirtCount }}</span>
      </button>
      <button 
        :class="['filter-btn', { active: activeFilter === 'hoodie' }]"
        @click="setFilter('hoodie')"
      >
        PULLS
        <span class="count">{{ hoodieCount }}</span>
      </button>
    </div>

    <!-- Grid responsive - adapté au nombre d'articles -->
    <div 
      :class="[
        'grid gap-6 w-full mx-auto',
        filteredProducts.length === 1 ? 'grid-cols-1 max-w-md' : '',
        filteredProducts.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl' : '',
        filteredProducts.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : '',
        filteredProducts.length >= 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : ''
      ]"
    >
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        :compact="filteredProducts.length >= 4"
        @add-to-cart="handleAddToCart"
        @quick-view="handleQuickView"
        class="product-fade"
      />
    </div>

    <!-- Empty State -->
    <div v-if="filteredProducts.length === 0" class="col-[1/-1] text-center py-20 text-[var(--color-text-muted)]">
      <p>Aucun produit trouvé dans cette catégorie.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from './ProductCard.vue'
import { useProducts } from '@/composables/useProducts'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const { products, loadProducts } = useProducts()
const activeFilter = ref('all')

onMounted(async () => {
  await loadProducts()
})

const tshirtCount = computed(() => {
  return products.value.filter(p => p.type === 'tshirt').length
})

const hoodieCount = computed(() => {
  return products.value.filter(p => p.type === 'hoodie').length
})

const filteredProducts = computed(() => {
  if (activeFilter.value === 'all') {
    return products.value
  }
  return products.value.filter(p => p.type === activeFilter.value)
})

const setFilter = (filter) => {
  activeFilter.value = filter
}

const handleAddToCart = (product) => {
  // Ouvre une modal pour sélectionner la taille
  // Pour l'instant, on ajoute avec une taille par défaut
  const defaultSize = product.sizes[1] // 'M'
  cartStore.addItem(product, defaultSize)
  cartStore.openCart()
}

const handleQuickView = (product) => {
  // TODO: Implémenter la modal de vue rapide
  console.log('Quick view:', product)
}
</script>

<style scoped>
/* Boutons filtres - Style futuriste NainVert */
.filter-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 28px;
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(42, 42, 42, 0.6));
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 12px;
  color: var(--color-text-secondary);
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}

.filter-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(145deg, rgba(57, 255, 20, 0.3), rgba(0, 255, 136, 0.3));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.filter-btn:hover {
  border-color: rgba(57, 255, 20, 0.5);
  color: var(--color-neon-green);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(57, 255, 20, 0.15), 0 0 20px rgba(57, 255, 20, 0.1);
}

.filter-btn:hover::before {
  opacity: 1;
}

.filter-btn.active {
  background: linear-gradient(145deg, rgba(57, 255, 20, 0.15), rgba(0, 255, 136, 0.12));
  border-color: var(--color-neon-green);
  color: var(--color-neon-green);
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.3), 0 0 40px rgba(57, 255, 20, 0.15), inset 0 0 30px rgba(57, 255, 20, 0.1);
}

.filter-btn.active::before {
  opacity: 1;
  background: linear-gradient(145deg, var(--color-neon-green), var(--color-cyan-green));
}

.filter-btn .count {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  background: rgba(57, 255, 20, 0.1);
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  transition: all 0.3s ease;
}

.filter-btn:hover .count {
  background: rgba(57, 255, 20, 0.2);
  box-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
}

.filter-btn.active .count {
  background: rgba(57, 255, 20, 0.25);
  color: var(--color-neon-green);
  box-shadow: 0 0 15px rgba(57, 255, 20, 0.4);
}

/* Pas d'animations de glissement */
.product-fade {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive - Grille 1 colonne sur mobile */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr !important;
    max-width: 100% !important;
  }

  .filter-btn {
    padding: 12px 18px;
    font-size: 11px;
    gap: 8px;
  }
}
</style>
