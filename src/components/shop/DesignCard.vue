<template>
  <router-link 
    :to="`/designs/${design.slug}`"
    class="design-card group relative bg-[var(--color-black-light)] border-2 border-[rgba(57,255,20,0.2)] rounded-xl overflow-hidden hover:border-[var(--color-neon-green)] transition-all hover:scale-105 hover:shadow-neon"
  >
    <!-- Image principale avec effet loupe qui suit la souris -->
    <div class="aspect-square overflow-hidden bg-[var(--color-black-light)] relative p-3">
      <img 
        :src="design.images[0]" 
        :alt="design.name"
        :style="zoomStyle"
        class="w-full h-full object-contain transition-transform duration-100 cursor-zoom-in rounded-lg"
        @mousemove="handleMouseMove"
        @mouseleave="resetZoom"
      >
    </div>

    <!-- Contenu -->
    <div class="p-4">
      <!-- Nom et tagline -->
      <h3 class="text-lg font-bold text-white mb-1 group-hover:text-[var(--color-neon-green)] transition-colors">
        {{ design.name }}
      </h3>
      <p class="text-xs text-[var(--color-text-secondary)] mb-3 line-clamp-2">
        {{ design.tagline }}
      </p>

      <!-- CTA -->
      <div class="btn btn-primary w-full text-center text-sm py-2">
        Voir le design →
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  design: {
    type: Object,
    required: true
  }
})

const zoomStyle = ref({})

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  
  zoomStyle.value = {
    transform: 'scale(2)',
    transformOrigin: `${x}% ${y}%`,
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  }
}

const resetZoom = () => {
  zoomStyle.value = {
    transform: 'scale(1)',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  }
}
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
