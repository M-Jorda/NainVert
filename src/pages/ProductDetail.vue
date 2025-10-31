<template>
  <div v-if="product" class="min-h-screen py-20">
    <div class="container max-w-[1200px] mx-auto px-4 md:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <!-- Image Gallery -->
        <div class="flex flex-col gap-4 lg:sticky lg:top-[100px] h-fit">
          <div class="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[rgba(57,255,20,0.05)] border-2 border-[rgba(57,255,20,0.2)]">
            <img :src="currentImage" :alt="product.name" class="w-full h-full object-cover" />
          </div>
          <div class="flex gap-3 overflow-x-auto">
            <button
              v-for="(image, index) in product.images"
              :key="index"
              :class="['thumbnail w-[calc(33.333%-0.5rem)] min-w-[100px] aspect-[4/5] rounded-lg overflow-hidden border-2 bg-[rgba(57,255,20,0.05)] cursor-pointer transition-all duration-200 p-0 hover:border-[var(--color-neon-green)]', { 'active border-[var(--color-neon-green)] shadow-[0_0_15px_rgba(57,255,20,0.4)]': currentImageIndex === index }]"
              @click="currentImageIndex = index"
            >
              <img :src="image" :alt="`${product.name} - ${index + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="flex flex-col gap-8">
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold uppercase tracking-wider text-[var(--color-neon-green)]">{{ productType }}</span>
            <span v-if="product.featured" class="px-3 py-2 bg-gradient-to-r from-[var(--color-neon-green)] to-[var(--color-cyan-green)] text-black rounded-lg text-xs font-bold uppercase tracking-wider">Nouveauté</span>
          </div>

          <h1 class="text-[clamp(2rem,4vw,3rem)] font-black m-0 leading-tight">{{ product.name }}</h1>
          
          <div class="text-5xl font-black text-[var(--color-neon-green)] drop-shadow-[0_0_15px_var(--color-neon-green)]">{{ product.price }}€</div>

          <p class="text-lg leading-relaxed text-[var(--color-text-secondary)]">{{ product.description }}</p>

          <!-- Size Selector -->
          <div class="p-8 bg-[var(--color-black-light)] rounded-xl border border-[rgba(57,255,20,0.2)]">
            <h3 class="text-base font-bold uppercase tracking-wider mb-6 text-white">Choisir une taille</h3>
            <div class="grid grid-cols-[repeat(auto-fit,minmax(60px,1fr))] gap-3">
              <button
                v-for="size in product.sizes"
                :key="size"
                :class="['size-btn', { 'active': selectedSize === size }]"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Color Display (if multiple colors) -->
          <div v-if="product.colors && product.colors.length > 1" class="p-8 bg-[var(--color-black-light)] rounded-xl border border-[rgba(57,255,20,0.2)]">
            <h3 class="text-base font-bold uppercase tracking-wider mb-6 text-white">Couleurs disponibles</h3>
            <div class="flex flex-wrap gap-3">
              <span v-for="color in product.colors" :key="color" class="px-4 py-2 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg text-[var(--color-text-secondary)] text-sm">
                {{ color }}
              </span>
            </div>
          </div>

          <!-- Add to Cart -->
          <div class="flex gap-4">
            <button
              class="btn btn-primary w-full py-4 text-lg"
              @click="addToCart"
              :disabled="!selectedSize || !product.inStock"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {{ product.inStock ? 'Ajouter au panier' : 'Rupture de stock' }}
            </button>
          </div>

          <!-- Product Details -->
          <div class="p-8 bg-[var(--color-black-light)] rounded-xl border border-[rgba(57,255,20,0.2)]">
            <h3 class="text-base font-bold uppercase tracking-wider mb-6 text-white">Détails du produit</h3>
            <ul class="list-none flex flex-col gap-3">
              <li class="text-base text-[var(--color-text-secondary)] leading-relaxed"><strong class="text-white font-semibold">Matière:</strong> {{ product.details.material }}</li>
              <li class="text-base text-[var(--color-text-secondary)] leading-relaxed"><strong class="text-white font-semibold">Grammage:</strong> {{ product.details.weight }}</li>
              <li class="text-base text-[var(--color-text-secondary)] leading-relaxed"><strong class="text-white font-semibold">Coupe:</strong> {{ product.details.fit }}</li>
              <li class="text-base text-[var(--color-text-secondary)] leading-relaxed"><strong class="text-white font-semibold">Entretien:</strong> {{ product.details.care }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-[80vh] flex items-center justify-center">
    <div class="container max-w-[1200px] mx-auto px-4 md:px-8">
      <p class="text-xl text-[var(--color-text-secondary)]">Chargement du produit...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProducts } from '@/composables/useProducts'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const { getProductBySlug } = useProducts()

const product = ref(null)
const selectedSize = ref(null)
const currentImageIndex = ref(0)

// Load product from route
const loadProduct = async () => {
  const slug = route.params.slug
  product.value = await getProductBySlug(slug)
  
  if (!product.value) {
    router.push('/products')
  }
  
  // Reset selections
  selectedSize.value = null
  currentImageIndex.value = 0
}

// Watch route changes
watch(() => route.params.slug, loadProduct, { immediate: true })

const currentImage = computed(() => {
  return product.value?.images[currentImageIndex.value] || ''
})

const productType = computed(() => {
  return product.value?.type === 'tshirt' ? 'T-Shirt' : 'Pull'
})

const addToCart = () => {
  if (!selectedSize.value || !product.value) return
  
  cartStore.addItem(product.value, selectedSize.value)
  cartStore.openCart()
}
</script>

<style scoped>
.thumbnail {
  border-color: rgba(57, 255, 20, 0.2);
}

.thumbnail.active {
  border-color: var(--color-neon-green);
}

/* Size buttons - Style futuriste */
.size-btn {
  position: relative;
  padding: 16px;
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(42, 42, 42, 0.6));
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 12px;
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.size-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(145deg, rgba(57, 255, 20, 0.3), rgba(0, 255, 136, 0.3));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.size-btn:hover {
  border-color: rgba(57, 255, 20, 0.5);
  color: var(--color-neon-green);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(57, 255, 20, 0.15);
}

.size-btn:hover::before {
  opacity: 1;
}

.size-btn.active {
  background: linear-gradient(145deg, rgba(57, 255, 20, 0.15), rgba(0, 255, 136, 0.12));
  border-color: var(--color-neon-green);
  color: var(--color-neon-green);
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.3), 0 0 40px rgba(57, 255, 20, 0.15), inset 0 0 30px rgba(57, 255, 20, 0.1);
}

.size-btn.active::before {
  opacity: 1;
  background: linear-gradient(145deg, var(--color-neon-green), var(--color-cyan-green));
}

/* Responsive */
@media (max-width: 768px) {
  .size-btn {
    min-width: 50px;
    padding: 14px;
    font-size: 14px;
  }
}
</style>
