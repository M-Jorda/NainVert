<template>
  <router-link 
    :to="`/designs/${design.slug}`"
    class="design-card group relative bg-[var(--color-black-light)] border-2 border-[rgba(57,255,20,0.2)] rounded-xl overflow-hidden hover:border-[var(--color-neon-green)] transition-all hover:scale-105 hover:shadow-neon"
  >
    <!-- Image principale -->
    <div class="aspect-square overflow-hidden bg-black relative">
      <img 
        :src="design.images[0]" 
        :alt="design.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      >
      
      <!-- Badge Featured (optionnel) -->
      <div v-if="design.featured" class="absolute top-4 right-4 bg-yellow-500/90 text-black px-3 py-1 rounded-full text-xs font-bold">
        ⭐ Featured
      </div>
    </div>

    <!-- Contenu -->
    <div class="p-6">
      <!-- Nom et tagline -->
      <h3 class="text-xl font-bold text-white mb-2 group-hover:text-[var(--color-neon-green)] transition-colors">
        {{ design.name }}
      </h3>
      <p class="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
        {{ design.tagline }}
      </p>

      <!-- Prix -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex gap-4 text-sm">
          <div class="flex items-center gap-1">
            <span class="text-[var(--color-text-secondary)]">👕</span>
            <span class="text-[var(--color-neon-green)] font-bold">{{ (design.designPrice + 20).toFixed(2) }}€</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-[var(--color-text-secondary)]">🧥</span>
            <span class="text-[var(--color-neon-green)] font-bold">{{ (design.designPrice + 55).toFixed(2) }}€</span>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="btn btn-primary w-full text-center">
        Voir le design →
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  design: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.shadow-neon {
  box-shadow: 0 0 30px rgba(57, 255, 20, 0.3);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
