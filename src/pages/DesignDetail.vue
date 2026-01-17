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
          <!-- Image principale avec zoom Amazon-style -->
          <div class="w-[60%] aspect-square rounded-lg border-2 border-[rgba(57,255,20,0.2)] relative overflow-hidden bg-[var(--color-black-light)] p-4">
            <ImageZoom
              :src="mainImage"
              :alt="design.name"
              :zoom-level="3"
              :panel-width="450"
              :panel-height="450"
            />
          </div>

          <!-- Miniatures (seulement si un type est sélectionné ET que le type a des images) -->
          <div v-if="selectedType && garmentImages.length > 0" class="flex gap-2">
            <button
              v-for="(img, index) in garmentImages"
              :key="index"
              @click="selectedImageIndex = index"
              :class="[
                'w-16 h-16 rounded border-2 overflow-hidden transition-all bg-[var(--color-black-light)] p-1',
                selectedImageIndex === index
                  ? 'border-[var(--color-neon-green)]'
                  : 'border-[rgba(57,255,20,0.2)] hover:border-[var(--color-neon-green)]'
              ]"
            >
              <img :src="img" :alt="`Photo ${index + 1}`" class="w-full h-full object-contain rounded">
            </button>
          </div>
        </div>

        <!-- Colonne droite : Infos et sélection combinée -->
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
          <div v-if="design.story" class="mb-3 p-2 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg">
            <h3 class="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <span>📖</span> L'histoire
            </h3>
            <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {{ design.story }}
            </p>
          </div>

          <!-- Sélection combinée : Vêtement + Taille -->
          <div class="grid grid-cols-2 gap-4 mb-3">
            <!-- Colonne gauche : Sélecteur de vêtement (dropdown) -->
            <div>
              <h3 class="text-sm font-bold text-white mb-2">Vêtement</h3>
              <div class="relative">
                <select
                  v-model="selectedType"
                  class="w-full p-3 rounded-lg bg-[var(--color-black-light)] border-2 border-[rgba(57,255,20,0.3)] text-white font-semibold appearance-none cursor-pointer hover:border-[var(--color-neon-green)] focus:border-[var(--color-neon-green)] focus:outline-none transition-colors"
                >
                  <option value="tshirt">T-Shirt — {{ calculatePrice('tshirt').toFixed(2) }}€</option>
                  <option value="hoodie">Hoodie — {{ calculatePrice('hoodie').toFixed(2) }}€</option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-neon-green)]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              <!-- Caractéristiques compactes -->
              <div v-if="selectedType" class="mt-2 text-xs text-[var(--color-text-secondary)] space-y-0.5">
                <div class="flex items-center gap-1">
                  <span class="text-[var(--color-neon-green)]">✓</span>
                  <span>{{ garmentDetails.material }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span class="text-[var(--color-neon-green)]">✓</span>
                  <span>{{ garmentDetails.weight }}</span>
                </div>
              </div>
            </div>

            <!-- Colonne droite : Sélection de taille -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-bold text-white">Taille</h3>
                <a
                  href="/faq#sizes"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1 text-xs text-[var(--color-neon-green)] hover:underline hover:text-white transition-colors font-semibold"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  Guide des tailles
                </a>
              </div>
              <!-- Grille de tailles -->
              <div class="grid grid-cols-4 gap-1.5">
                <button
                  v-for="size in sizes"
                  :key="size"
                  @click="selectedSize = size"
                  :class="[
                    'py-2 px-1 rounded-lg border-2 transition-all text-xs font-bold',
                    selectedSize === size
                      ? 'border-[var(--color-neon-green)] bg-[var(--color-neon-green)]/10 text-white'
                      : 'border-[rgba(57,255,20,0.2)] text-[var(--color-text-secondary)] hover:border-[var(--color-neon-green)] hover:text-white'
                  ]"
                >
                  {{ size }}
                </button>
              </div>
            </div>
          </div>

          <!-- Message rupture de stock -->
          <div v-if="isOutOfStock" class="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p class="text-red-400 font-semibold text-center">
              Ce produit est actuellement en rupture de stock
            </p>
          </div>

          <!-- Récapitulatif prix + Bouton ajouter au panier -->
          <div class="flex items-center justify-between gap-4 p-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg">
            <div class="text-left">
              <div class="text-xs text-[var(--color-text-secondary)]">Total TTC</div>
              <div class="text-2xl font-bold text-[var(--color-neon-green)]">
                {{ calculatePrice(selectedType).toFixed(2) }}€
              </div>
            </div>
            <button
              @click="addToCart"
              :disabled="!selectedType || !selectedSize || isOutOfStock"
              :class="[
                'btn py-3 px-6 text-base font-bold transition-all',
                selectedType && selectedSize && !isOutOfStock
                  ? 'btn-primary hover:scale-105'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              ]"
            >
              <template v-if="isOutOfStock">Rupture de stock</template>
              <template v-else>{{ selectedType && selectedSize ? '🛒 Ajouter au panier' : 'Sélectionne une taille' }}</template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDesigns } from '@/composables/useDesigns'
import { useGarments } from '@/composables/useGarments'
import { useGarmentTypes } from '@/composables/useGarmentTypes'
import { useStock } from '@/composables/useStock'
import { useCart } from '@/stores/cart'
import ImageZoom from '@/components/shop/ImageZoom.vue'

const route = useRoute()
const router = useRouter()
const { getDesignBySlug } = useDesigns()
const { garments, loadGarments, getGarmentByType } = useGarments()
const { garmentTypes } = useGarmentTypes()
const { stockData, loadStock, getStockQuantity, cleanup: cleanupStock } = useStock()
const cart = useCart()

const design = ref(null)
const loading = ref(true)
const selectedType = ref('tshirt') // Par défaut T-shirt sélectionné
const selectedSize = ref('L') // Par défaut taille L
const selectedImageIndex = ref(0)

// Liste des tailles disponibles
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

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

// Vérifier si le produit est en stock
const currentStock = computed(() => {
  if (!design.value) return 0
  return getStockQuantity(design.value.slug || design.value.id)
})

const isOutOfStock = computed(() => currentStock.value <= 0)

onMounted(async () => {
  loading.value = true

  // Charger le stock en temps réel
  loadStock()

  // Charger les garments depuis la BDD
  await loadGarments()

  // Charger le design
  const slug = route.params.slug
  design.value = await getDesignBySlug(slug)

  loading.value = false
})

onUnmounted(() => {
  cleanupStock()
})

// Ajouter au panier
const addToCart = () => {
  if (!selectedType.value || !selectedSize.value || !design.value) return

  // Vérifier le stock avant d'ajouter
  if (isOutOfStock.value) {
    alert('Ce produit est actuellement en rupture de stock')
    return
  }

  const cartItem = {
    id: `${design.value.slug}-${selectedType.value}-${selectedSize.value}`,
    designId: design.value.id,
    designSlug: design.value.slug,
    designName: design.value.name,
    type: selectedType.value,
    size: selectedSize.value,
    price: calculatePrice(selectedType.value),
    image: design.value.images[0],
    quantity: 1
  }

  cart.addItem(cartItem)

  // Ouvrir le panier après un petit délai
  setTimeout(() => {
    cart.openCart()
  }, 300)
}
</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, var(--color-neon-green), var(--color-neon-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Style pour le select dropdown */
select option {
  background-color: #1a1a1a;
  color: white;
  padding: 10px;
}
</style>
