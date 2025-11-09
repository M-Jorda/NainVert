<template>
  <div class="design-detail h-screen bg-black pt-12 pb-3 overflow-hidden">
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
    <div v-else class="max-w-7xl mx-auto px-4 h-full flex flex-col">
      <!-- Back button -->
      <div class="mb-2">
        <router-link to="/designs" class="inline-flex items-center gap-2 text-[var(--color-neon-green)] hover:text-white transition-colors text-sm font-semibold">
          <span>←</span> Retour aux designs
        </router-link>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <!-- Colonne gauche : Images avec loupe qui suit la souris -->
        <div class="flex flex-col items-center justify-center gap-3">
          <!-- Image principale avec effet loupe suivant la souris -->
          <div 
            class="w-[60%] aspect-square rounded-lg border-2 border-[rgba(57,255,20,0.2)] relative overflow-hidden"
            @mousemove="handleMouseMove"
            @mouseleave="resetZoom"
          >
            <img 
              :src="mainImage" 
              :alt="design.name"
              class="w-full h-full object-cover cursor-zoom-in"
              :style="zoomStyle"
              ref="zoomImage"
            >
          </div>
          
          <!-- Miniatures (seulement si un type est sélectionné ET que le type a des images) -->
          <div v-if="selectedType && garmentImages.length > 0" class="flex gap-2">
            <button
              v-for="(img, index) in garmentImages"
              :key="index"
              @click="selectedImageIndex = index"
              :class="[
                'w-16 h-16 rounded border-2 overflow-hidden transition-all',
                selectedImageIndex === index 
                  ? 'border-[var(--color-neon-green)]' 
                  : 'border-[rgba(57,255,20,0.2)] hover:border-[var(--color-neon-green)]'
              ]"
            >
              <img :src="img" :alt="`Photo ${index + 1}`" class="w-full h-full object-cover">
            </button>
          </div>
        </div>

        <!-- Colonne droite : Infos et sélection -->
        <div class="flex flex-col justify-center">
          <!-- Nom et tagline -->
          <h1 class="text-3xl font-bold text-gradient mb-2">
            {{ design.name }}
          </h1>
          <p class="text-base text-[var(--color-text-secondary)] mb-2">
            {{ design.tagline }}
          </p>

          <!-- Description -->
          <div class="mb-2 p-2 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg">
            <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {{ design.description }}
            </p>
          </div>

          <!-- Histoire -->
          <div v-if="design.story" class="mb-2 p-2 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg">
            <h3 class="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <span>📖</span> L'histoire
            </h3>
            <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {{ design.story }}
            </p>
          </div>

          <!-- Sélecteur de type de vêtement (Radio - Horizontal) -->
          <div class="mb-2">
            <h3 class="text-base font-bold text-white mb-2">Choisis ton style</h3>
            <div class="grid grid-cols-2 gap-2">
              <label
                :class="[
                  'flex flex-col items-center justify-center gap-1 p-3 rounded-lg border-2 transition-all cursor-pointer',
                  selectedType === 'tshirt'
                    ? 'border-[var(--color-neon-green)] bg-[var(--color-neon-green)]/10'
                    : 'border-[rgba(57,255,20,0.2)] hover:border-[var(--color-neon-green)]'
                ]"
              >
                <input
                  type="radio"
                  name="garmentType"
                  value="tshirt"
                  v-model="selectedType"
                  class="w-4 h-4 accent-[var(--color-neon-green)]"
                >
                <div class="font-bold text-white text-sm">T-Shirt</div>
                <div class="text-[var(--color-neon-green)] font-bold text-lg">{{ calculatePrice('tshirt').toFixed(2) }}€</div>
              </label>

              <label
                :class="[
                  'flex flex-col items-center justify-center gap-1 p-3 rounded-lg border-2 transition-all cursor-pointer',
                  selectedType === 'hoodie'
                    ? 'border-[var(--color-neon-green)] bg-[var(--color-neon-green)]/10'
                    : 'border-[rgba(57,255,20,0.2)] hover:border-[var(--color-neon-green)]'
                ]"
              >
                <input
                  type="radio"
                  name="garmentType"
                  value="hoodie"
                  v-model="selectedType"
                  class="w-4 h-4 accent-[var(--color-neon-green)]"
                >
                <div class="font-bold text-white text-sm">Hoodie</div>
                <div class="text-[var(--color-neon-green)] font-bold text-lg">{{ calculatePrice('hoodie').toFixed(2) }}€</div>
              </label>
            </div>
          </div>

          <!-- Détails du vêtement sélectionné -->
          <div v-if="selectedType" class="mb-2 p-2 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg">
            <h3 class="text-sm font-bold text-white mb-2">Caractéristiques</h3>
            <div class="space-y-1 text-xs text-[var(--color-text-secondary)]">
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
            @click.prevent="openSizeSelector"
            :disabled="!selectedType || !design"
            :class="[
              'btn w-full py-3 text-base font-bold transition-all relative z-10',
              selectedType && design
                ? 'btn-primary hover:scale-105' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            ]"
            style="position: relative; z-index: 10; pointer-events: auto;"
          >
            {{ selectedType && design ? 'Choisir ma taille →' : 'Sélectionne un type de vêtement' }}
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDesigns } from '@/composables/useDesigns'
import { useGarments } from '@/composables/useGarments'
import { useGarmentTypes } from '@/composables/useGarmentTypes'
import SizeSelector from '@/components/shop/SizeSelector.vue'

const route = useRoute()
const { getDesignBySlug } = useDesigns()
const { garments, loadGarments, getGarmentByType } = useGarments()
const { garmentTypes } = useGarmentTypes()

const design = ref(null)
const loading = ref(true)
const selectedType = ref('tshirt') // Par défaut T-shirt sélectionné
const showSizeSelector = ref(false)
const selectedImageIndex = ref(0)
const zoomImage = ref(null)
const zoomStyle = ref({})

// Images du vêtement sélectionné depuis la BDD
const garmentImages = computed(() => {
  if (!selectedType.value) return []
  
  const garment = getGarmentByType(selectedType.value)
  if (!garment || !garment.photos) return []
  
  // Retourner les photos 0 et 1
  return [garment.photos[0], garment.photos[1]].filter(Boolean)
})

// Image principale affichée
const mainImage = computed(() => {
  if (selectedType.value && garmentImages.value.length > 0) {
    return garmentImages.value[selectedImageIndex.value]
  }
  return design.value?.images?.[0] || ''
})

// Réinitialiser l'index quand on change de type
watch(selectedType, () => {
  selectedImageIndex.value = 0
})

// Calcul du prix (uniquement le vêtement, le design est gratuit)
const calculatePrice = (type) => {
  if (!design.value) return 0
  const garment = getGarmentByType(type)
  const garmentPrice = garment?.basePrice || garmentTypes.value[type]?.basePrice || 0
  return Number(garmentPrice.toFixed(2))
}

// Détails du vêtement sélectionné
const garmentDetails = computed(() => {
  if (!selectedType.value) return {}
  const garment = getGarmentByType(selectedType.value)
  return garment?.details || garmentTypes.value[selectedType.value]?.details || {}
})

// Effet loupe qui suit la souris
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

onMounted(async () => {
  loading.value = true
  
  // Charger les garments depuis la BDD
  await loadGarments()
  
  // Charger le design
  const slug = route.params.slug
  design.value = await getDesignBySlug(slug)
  
  loading.value = false
})

const openSizeSelector = () => {
  if (selectedType.value && design.value) {
    showSizeSelector.value = true
  }
}

const handleAddToCart = (item) => {
  showSizeSelector.value = false
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
