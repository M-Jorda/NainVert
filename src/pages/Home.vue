<template>
  <div>
    <!-- Hero Section -->
    <section class="hero relative min-h-[90vh] flex items-center overflow-hidden py-20">
      <div class="container max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
        <div class="max-w-[700px] text-center mx-auto">
          <h1 class="text-[clamp(3rem,8vw,6rem)] font-black mb-6 flex flex-col gap-2">
            <span class="text-gradient">NAIN</span>
            <span class="neon-text">VERT</span>
          </h1>
          <p class="text-[clamp(1.2rem,2vw,1.5rem)] font-semibold text-[var(--color-text-secondary)] uppercase tracking-[0.1em] mb-6">
            {{ content.home?.subtitle || 'Collection exclusive de vêtements streetwear psychédéliques' }}
            <span 
              class="easter-egg-trigger"
              @click="openEasterEgg('psychedelic')"
              title="🌈"
            >
              🌈
            </span>
            <span 
              class="easter-egg-trigger"
              @click="openEasterEgg('freedom')"
              title="🦋"
            >
              🦋
            </span>
          </p>
          <p class="text-[clamp(1rem,1.5vw,1.2rem)] text-[var(--color-text-secondary)] leading-relaxed mb-12">
            Découvre notre collection unique de streetwear psychédélique
          </p>
          <div class="flex gap-4 justify-center flex-wrap">
            <router-link to="/products" class="btn btn-primary">
              {{ content.home?.cta || 'Découvrir la collection' }}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </router-link>
            <a 
              href="https://instagram.com/nainvert" 
              target="_blank" 
              rel="noopener noreferrer"
              class="btn btn-secondary"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Suivre sur Instagram
            </a>
          </div>
        </div>
        
        <!-- Hero Visual -->
        <div class="hero-visual absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] pointer-events-none z-0">
          <div class="visual-circle circle-1 absolute rounded-full opacity-10"></div>
          <div class="visual-circle circle-2 absolute rounded-full opacity-10"></div>
          <div class="visual-circle circle-3 absolute rounded-full opacity-10"></div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-20 bg-[var(--color-black-light)]">
      <div class="container max-w-[1200px] mx-auto px-4 md:px-8">
        <div class="text-center mb-12">
          <h2 class="text-[clamp(2rem,4vw,3rem)] mb-3">Nouveautés</h2>
          <p class="text-xl text-[var(--color-text-secondary)]">Nos derniers drops exclusifs</p>
        </div>
        
        <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 mb-12">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            @add-to-cart="handleAddToCart"
          />
        </div>
        
        <div class="text-center">
          <router-link to="/products" class="btn btn-ghost">
            Voir tous les produits
          </router-link>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-20 bg-[var(--color-black)]">
      <div class="container max-w-[1200px] mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 class="text-[clamp(2rem,4vw,3rem)] mb-8">
              L'Univers <span class="neon-text">NainVert</span>
            </h2>
            <p class="text-lg leading-relaxed mb-4">
              Né d'une vision audacieuse, NainVert fusionne l'art psychédélique avec 
              la culture streetwear. Chaque pièce raconte une histoire, chaque design 
              est une invitation au voyage.
            </p>
            <p class="text-lg leading-relaxed mb-4">
              Nos créations limitées sont conçues pour ceux qui osent se démarquer, 
              qui embrassent l'originalité et refusent la banalité.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              <div class="text-center p-4 bg-[var(--color-black-light)] rounded-xl border border-[rgba(57,255,20,0.2)]">
                <span class="block text-2xl font-black text-[var(--color-neon-green)] mb-2">100%</span>
                <span class="block text-sm text-[var(--color-text-secondary)] uppercase tracking-wider">Coton Bio</span>
              </div>
              <div class="text-center p-4 bg-[var(--color-black-light)] rounded-xl border border-[rgba(57,255,20,0.2)]">
                <span class="block text-2xl font-black text-[var(--color-neon-green)] mb-2">Édition</span>
                <span class="block text-sm text-[var(--color-text-secondary)] uppercase tracking-wider">Limitée</span>
              </div>
              <div class="text-center p-4 bg-[var(--color-black-light)] rounded-xl border border-[rgba(57,255,20,0.2)]">
                <span class="block text-2xl font-black text-[var(--color-neon-green)] mb-2">Unique</span>
                <span class="block text-sm text-[var(--color-text-secondary)] uppercase tracking-wider">Design</span>
              </div>
            </div>
          </div>
          
          <div class="relative h-[500px] md:h-[500px]">
            <div class="w-full h-full bg-gradient-to-br from-[rgba(57,255,20,0.1)] to-[rgba(0,255,136,0.1)] rounded-3xl border-2 border-[var(--color-neon-green)] shadow-[0_0_30px_rgba(57,255,20,0.3)]"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Instagram CTA -->
    <section class="py-20 bg-[var(--color-black-light)]">
      <div class="container max-w-[1200px] mx-auto px-4 md:px-8">
        <div class="text-center max-w-[600px] mx-auto p-20 bg-[var(--color-black)] rounded-3xl border-2 border-[var(--color-neon-green)]">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-[var(--color-neon-green)] mx-auto mb-6">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <h2 class="text-3xl mb-6">Rejoignez la Tribu</h2>
          <p class="text-lg mb-8">Suivez-nous sur Instagram pour découvrir nos coulisses, nos nouveautés et participer à notre communauté.</p>
          <a 
            href="https://instagram.com/nainvert" 
            target="_blank" 
            rel="noopener noreferrer"
            class="btn btn-primary"
          >
            @nainvert
          </a>
        </div>
      </div>
    </section>
    
    <!-- Easter Egg Modal -->
    <EasterEggModal 
      :is-open="isModalOpen"
      :content="currentContent"
      @close="closeEasterEgg"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import EasterEggModal from '@/components/EasterEggModal.vue'
import { useProducts } from '@/composables/useProducts'
import { useSiteContent } from '@/composables/useSiteContent'
import { useCartStore } from '@/stores/cart'
import { useEasterEgg } from '@/composables/useEasterEgg'

const cartStore = useCartStore()
const { products, loadProducts, getFeaturedProducts } = useProducts()
const { siteContent, loadSiteContent } = useSiteContent()

const featuredProducts = getFeaturedProducts
const content = computed(() => siteContent.value || {})

onMounted(async () => {
  await loadProducts()
  await loadSiteContent()
})

const handleAddToCart = (product) => {
  const defaultSize = product.sizes[1] // 'M'
  cartStore.addItem(product, defaultSize)
  cartStore.openCart()
}

const { isModalOpen, currentContent, openEasterEgg, closeEasterEgg } = useEasterEgg()
</script>

<style scoped>
/* Hero Visual Circles */
.circle-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--color-neon-green), transparent);
  top: 10%;
  left: 10%;
  animation: float 20s infinite ease-in-out;
  animation-delay: 0s;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--color-cyan-green), transparent);
  bottom: 20%;
  right: 15%;
  animation: float 20s infinite ease-in-out;
  animation-delay: 5s;
}

.circle-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, var(--color-lime-green), transparent);
  top: 40%;
  right: 30%;
  animation: float 20s infinite ease-in-out;
  animation-delay: 10s;
}

/* Easter egg triggers */
.easter-egg-trigger {
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.easter-egg-trigger:hover {
  transform: scale(1.3) rotate(10deg);
  opacity: 1;
  filter: drop-shadow(0 0 8px rgba(57, 255, 20, 0.6));
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    min-height: 80vh;
  }
}
</style>
