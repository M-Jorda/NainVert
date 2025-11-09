<template>
  <div class="design-detail min-h-screen bg-black pt-24 pb-16">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-neon-green)] mx-auto mb-4"></div>
      <p class="text-[var(--color-text-secondary)]">Chargement du design...</p>
    </div>

    <!-- Design not found -->
    <div v-else-if="!design" class="text-center py-20 px-4">
      <h2 class="text-3xl font-bold text-white mb-4">Design introuvable</h2>
      <p class="text-[var(--color-text-secondary)] mb-8">Ce design n'existe pas ou n'est plus disponible</p>
      <router-link to="/designs" class="btn btn-primary">
        ← Retour aux designs
      </router-link>
    </div>

    <!-- Design content -->
    <div v-else class="max-w-7xl mx-auto px-4">
      <!-- Breadcrumb -->
      <nav class="mb-8 text-sm">
        <router-link to="/" class="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-green)]">
          Accueil
        </router-link>
        <span class="text-[var(--color-text-secondary)] mx-2">/</span>
        <router-link to="/designs" class="text-[var(--color-text-secondary)] hover:text-[var(--color-neon-green)]">
          Designs
        </router-link>
        <span class="text-[var(--color-text-secondary)] mx-2">/</span>
        <span class="text-white">{{ design.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Colonne gauche : Images -->
        <div>
          <!-- Image principale -->
          <div class="aspect-square mb-4 rounded-xl overflow-hidden border-2 border-[rgba(57,255,20,0.2)]">
            <img 
              :src="selectedImage" 
              :alt="design.name"
              class="w-full h-full object-cover"
            >
          </div>

          <!-- Miniatures -->
          <div class="grid grid-cols-4 gap-4">
            <button
              v-for="(image, index) in design.images"
              :key="index"
              @click="selectedImage = image"
              :class="[
                'aspect-square rounded-lg overflow-hidden border-2 transition-all',
                selectedImage === image 
                  ? 'border-[var(--color-neon-green)] scale-105' 
                  : 'border-[rgba(57,255,20,0.2)] hover:border-[var(--color-neon-green)]'
              ]"
            >
              <img 
                :src="image" 
                :alt="`${design.name} - Vue ${index + 1}`"
                class="w-full h-full object-cover"
              >
            </button>
          </div>
        </div>

        <!-- Colonne droite : Infos et sélection -->
        <div>
          <!-- Nom et tagline -->
          <h1 class="text-4xl md:text-5xl font-bold text-gradient mb-4">
            {{ design.name }}
          </h1>
          <p class="text-xl text-[var(--color-text-secondary)] mb-8">
            {{ design.tagline }}
          </p>

          <!-- Description -->
          <div class="mb-8 p-6 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-xl">
            <p class="text-[var(--color-text-secondary)] leading-relaxed">
              {{ design.description }}
            </p>
          </div>

          <!-- Histoire -->
          <div v-if="design.story" class="mb-8 p-6 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-xl">
            <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span>📖</span> L'histoire
            </h3>
            <p class="text-[var(--color-text-secondary)] leading-relaxed">
              {{ design.story }}
            </p>
          </div>

          <!-- Sélecteur de type de vêtement -->
          <div class="mb-8">
            <h3 class="text-lg font-bold text-white mb-4">Choisis ton style</h3>
            <div class="grid grid-cols-2 gap-4">
              <button
                @click="selectedType = 'tshirt'"
                :class="[
                  'p-6 rounded-xl border-2 transition-all',
                  selectedType === 'tshirt'
                    ? 'border-[var(--color-neon-green)] bg-[var(--color-neon-green)]/10'
                    : 'border-[rgba(57,255,20,0.2)] hover:border-[var(--color-neon-green)]'
                ]"
              >
                <div class="text-4xl mb-2">👕</div>
                <div class="font-bold text-white mb-1">T-Shirt</div>
                <div class="text-2xl font-bold text-[var(--color-neon-green)]">{{ calculatePrice('tshirt') }}€</div>
              </button>

              <button
                @click="selectedType = 'hoodie'"
                :class="[
                  'p-6 rounded-xl border-2 transition-all',
                  selectedType === 'hoodie'
                    ? 'border-[var(--color-neon-green)] bg-[var(--color-neon-green)]/10'
                    : 'border-[rgba(57,255,20,0.2)] hover:border-[var(--color-neon-green)]'
                ]"
              >
                <div class="text-4xl mb-2">🧥</div>
                <div class="font-bold text-white mb-1">Hoodie</div>
                <div class="text-2xl font-bold text-[var(--color-neon-green)]">{{ calculatePrice('hoodie') }}€</div>
              </button>
            </div>
          </div>

          <!-- Détails du vêtement sélectionné -->
          <div v-if="selectedType" class="mb-8 p-6 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-xl">
            <h3 class="text-lg font-bold text-white mb-4">Caractéristiques</h3>
            <div class="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <div class="flex items-start gap-2">
                <span class="text-[var(--color-neon-green)]">✓</span>
                <span>{{ garmentDetails.material }}</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="text-[var(--color-neon-green)]">✓</span>
                <span>{{ garmentDetails.weight }}</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="text-[var(--color-neon-green)]">✓</span>
                <span>{{ garmentDetails.fit }}</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="text-[var(--color-neon-green)]">✓</span>
                <span>{{ garmentDetails.care }}</span>
              </div>
            </div>
          </div>

          <!-- Bouton choisir la taille -->
          <button 
            @click="openSizeSelector"
            :disabled="!selectedType"
            :class="[
              'btn w-full py-4 text-lg font-bold transition-all',
              selectedType 
                ? 'btn-primary hover:scale-105' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            ]"
          >
            {{ selectedType ? 'Choisir ma taille →' : 'Sélectionne un type de vêtement' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal sélection de taille -->
    <SizeSelector
      v-if="showSizeSelector"
      :design="design"
      :selectedType="selectedType"
      :price="calculatePrice(selectedType)"
      @close="showSizeSelector = false"
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDesigns } from '@/composables/useDesigns'
import { useGarmentTypes } from '@/composables/useGarmentTypes'
import SizeSelector from '@/components/shop/SizeSelector.vue'

const route = useRoute()
const { getDesignBySlug } = useDesigns()
const { garmentTypes } = useGarmentTypes()

const design = ref(null)
const loading = ref(true)
const selectedImage = ref(null)
const selectedType = ref(null)
const showSizeSelector = ref(false)

// Calcul du prix total (design + vêtement)
const calculatePrice = (type) => {
  if (!design.value) return 0
  const garmentPrice = garmentTypes[type].basePrice
  return (design.value.designPrice + garmentPrice).toFixed(2)
}

// Détails du vêtement sélectionné
const garmentDetails = computed(() => {
  if (!selectedType.value) return {}
  return garmentTypes[selectedType.value].details
})

onMounted(async () => {
  loading.value = true
  const slug = route.params.slug
  design.value = await getDesignBySlug(slug)
  
  if (design.value && design.value.images && design.value.images.length > 0) {
    selectedImage.value = design.value.images[0]
  }
  
  loading.value = false
})

const openSizeSelector = () => {
  if (selectedType.value) {
    showSizeSelector.value = true
  }
}

const handleAddToCart = (item) => {
  showSizeSelector.value = false
  // La logique d'ajout au panier sera dans SizeSelector
}
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, var(--color-neon-green), var(--color-neon-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
