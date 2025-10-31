<template>
  <header class="fixed top-0 left-0 right-0 z-[1000] bg-[rgba(10,10,10,0.95)] backdrop-blur-[10px] border-b border-[var(--color-black)]">
    <div class="max-w-[1200px] mx-auto px-4 md:px-8">
      <nav class="flex items-center justify-between h-20 gap-8">
        <!-- Logo -->
        <div class="logo flex items-center gap-1 text-2xl font-black no-underline tracking-[0.1em]">
          <router-link to="/" class="text-white transition-all duration-200 hover:text-[var(--color-neon-green)]">NAIN</router-link>
          <span 
            class="logo-accent text-[var(--color-neon-green)] cursor-pointer transition-all duration-200 hover:scale-110"
            @click="openEasterEgg('nainVert')"
            title="Découvrir le secret 🍀"
          >
            VERT
          </span>
        </div>

        <!-- Navigation Links -->
        <div 
          class="nav-links flex items-center gap-8 ml-auto mr-8 md:flex"
          :class="{ 'nav-links-open': mobileMenuOpen }"
        >
          <router-link to="/" class="nav-link relative text-gray-400 font-semibold text-sm uppercase tracking-wider transition-colors duration-200" @click="closeMobileMenu">
            Accueil
          </router-link>
          <router-link to="/products" class="nav-link relative text-gray-400 font-semibold text-sm uppercase tracking-wider transition-colors duration-200" @click="closeMobileMenu">
            Articles
          </router-link>
          <router-link to="/contact" class="nav-link relative text-gray-400 font-semibold text-sm uppercase tracking-wider transition-colors duration-200" @click="closeMobileMenu">
            Contact
          </router-link>
        </div>

        <!-- Cart Icon -->
        <CartIcon />

        <!-- Mobile Menu Button -->
        <button 
          class="hidden md:hidden bg-transparent border-none cursor-pointer p-2 z-[1001] mobile-menu-btn" 
          @click="toggleMobileMenu"
          aria-label="Menu"
        >
          <span class="hamburger block w-[25px] h-[2px] bg-[var(--color-neon-green)] relative transition-all duration-300" :class="{ 'hamburger-open': mobileMenuOpen }"></span>
        </button>
      </nav>
    </div>
    
    <!-- Easter Egg Modal -->
    <EasterEggModal 
      :is-open="isModalOpen"
      :content="currentContent"
      @close="closeEasterEgg"
    />
  </header>
</template>

<script setup>
import { ref } from 'vue'
import CartIcon from './CartIcon.vue'
import EasterEggModal from './EasterEggModal.vue'
import { useEasterEgg } from '../composables/useEasterEgg'

const mobileMenuOpen = ref(false)
const { isModalOpen, currentContent, openEasterEgg, closeEasterEgg } = useEasterEgg()

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<style scoped>
/* Logo hover animation */
.logo:hover .logo-accent {
  animation: glow 1s ease-in-out infinite;
  text-shadow: 0 0 10px var(--color-neon-green),
               0 0 20px var(--color-neon-green),
               0 0 30px var(--color-neon-green);
}

/* Navigation link underline animation */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-neon-green);
  transition: width 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-neon-green);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

/* Hamburger menu animations */
.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 2px;
  background: var(--color-neon-green);
  transition: all 0.3s ease;
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}

.hamburger-open {
  background: transparent;
}

.hamburger-open::before {
  top: 0;
  transform: rotate(45deg);
}

.hamburger-open::after {
  bottom: 0;
  transform: rotate(-45deg);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }

  .nav-links {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(10, 10, 10, 0.98);
    backdrop-filter: blur(10px);
    padding: 2rem;
    gap: 1rem;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    border-bottom: 1px solid rgba(57, 255, 20, 0.2);
  }

  .nav-links-open {
    transform: translateX(0);
  }

  .nav-link {
    width: 100%;
    padding: 0.75rem;
    text-align: center;
  }
}
</style>
