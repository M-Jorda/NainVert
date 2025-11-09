<template>
  <div class="designs-page min-h-screen bg-black pt-4 pb-16 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header avec panier -->
      <div class="mb-8">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          Nos Designs
        </h1>
        <div class="flex items-center justify-between gap-4">
          <p class="text-lg text-[var(--color-text-secondary)]">
            Découvre notre collection de designs psychédéliques exclusifs
          </p>
          
          <!-- Icône panier (à droite) -->
          <button 
            @click="cart.openCart()"
            class="p-2 rounded-lg bg-[var(--color-surface-dark)] hover:bg-[var(--color-surface-light)] transition-colors border border-[var(--color-border)] flex-shrink-0"
          >
            <div class="relative">
              <svg class="w-6 h-6 text-[var(--color-neon-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span v-if="cartItemsCount > 0" class="absolute -top-2 -right-2 bg-[var(--color-neon-purple)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {{ cartItemsCount }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-neon-green)] mx-auto mb-4"></div>
        <p class="text-[var(--color-text-secondary)]">Chargement des designs...</p>
      </div>

      <!-- Grille de designs (2 colonnes mobile, 3 tablette, 4 desktop) -->
      <div v-else-if="featuredDesigns.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <DesignCard 
          v-for="design in featuredDesigns" 
          :key="design.id"
          :design="design"
        />
      </div>

      <!-- Aucun design -->
      <div v-else class="text-center py-20">
        <p class="text-[var(--color-text-secondary)] mb-4">Aucun design disponible pour le moment</p>
        <router-link to="/" class="btn btn-primary">
          Retour à l'accueil
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDesigns } from '@/composables/useDesigns'
import { useCart } from '@/stores/cart'
import DesignCard from '@/components/shop/DesignCard.vue'

const { designs, loading, loadDesigns } = useDesigns()
const cart = useCart()

// Filtrer uniquement les designs featured, en stock ET non archivés
const featuredDesigns = computed(() => {
  return designs.value.filter(design => 
    design.featured === true && 
    design.inStock === true &&
    design.archived !== true  // Exclure les designs archivés
  )
})

// Nombre d'articles dans le panier
const cartItemsCount = computed(() => {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
})

onMounted(async () => {
  await loadDesigns()
})
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, var(--color-neon-green), var(--color-neon-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
