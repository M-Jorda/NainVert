<template>
  <div class="min-h-screen py-12 pb-20">
    <div class="container max-w-[1200px] mx-auto px-4 md:px-8">
      <!-- Page Header -->
      <header class="text-center mb-20 py-12">
        <h1 class="text-[clamp(2.5rem,5vw,4rem)] mb-6">
          <span class="text-gradient">Nos Articles</span>
        </h1>
        <p class="text-[clamp(1rem,2vw,1.3rem)] text-[var(--color-text-secondary)] max-w-[600px] mx-auto leading-relaxed">
          Découvrez notre collection exclusive de streetwear psychédélique
        </p>
      </header>

      <!-- Product Grid with Filters -->
      <ProductGrid />
    </div>
  </div>
</template>

<script setup>
import ProductGrid from '@/components/ProductGrid.vue'
</script>

<style scoped>
/* Pas de styles personnalisés nécessaires - tout en Tailwind */
</style>
