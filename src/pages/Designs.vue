<template>
  <div class="designs-page min-h-screen bg-black pt-24 pb-16 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gradient mb-4">
          🎨 Nos Designs
        </h1>
        <p class="text-lg text-[var(--color-text-secondary)]">
          Découvre notre collection de designs psychédéliques exclusifs
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-neon-green)] mx-auto mb-4"></div>
        <p class="text-[var(--color-text-secondary)]">Chargement des designs...</p>
      </div>

      <!-- Grille de designs -->
      <div v-else-if="featuredDesigns.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
import DesignCard from '@/components/shop/DesignCard.vue'

const { designs, loading, loadDesigns } = useDesigns()

// Filtrer uniquement les designs featured
const featuredDesigns = computed(() => {
  return designs.value.filter(design => design.featured === true && design.inStock === true)
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
