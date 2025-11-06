<template>
  <div class="min-h-screen bg-[var(--color-background)] py-12 px-4">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-4xl font-bold mb-2 text-center">
        <span class="text-gradient">Outils de développement</span>
      </h1>
      <p class="text-center text-[var(--color-text-secondary)] mb-12">
        Outils pour générer des données de test
      </p>
      
      <div class="space-y-6">
        <SeedRefunds />
        <SeedMessages />
      </div>
      
      <div class="mt-8 text-center">
        <router-link to="/rho" class="text-[var(--color-primary)] hover:underline">
          ← Retour à l'admin
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import SeedRefunds from '../components/SeedRefunds.vue'
import SeedMessages from '../components/SeedMessages.vue'
</script>
