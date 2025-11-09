<template>
  <footer class="relative bg-[var(--color-black-light)] border-t border-[rgba(57,255,20,0.2)] py-16 px-0 mt-16 overflow-hidden">
    <!-- Effet de fond animé -->
    <div class="absolute inset-0 opacity-30">
      <div class="glow-orb"></div>
      <div class="glow-orb-2"></div>
    </div>
    
    <div class="relative max-w-[1200px] mx-auto px-4 md:px-8 z-10">
      <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-8 mb-8">
        <!-- Logo & Description (50%) -->
        <div class="flex flex-col gap-3">
          <router-link to="/" class="flex gap-1 text-3xl font-black tracking-[0.1em] mb-2 logo-glow cursor-pointer hover:opacity-80 transition-opacity">
            <span class="text-white">LE NAIN</span>
            <span class="text-[var(--color-neon-green)]">VERT</span>
          </router-link>
          <p class="text-[var(--color-text-secondary)] text-[0.95rem] leading-relaxed">
            Streetwear psychédélique pour esprits libres.
          </p>
          <div class="flex gap-3 mt-3">
            <a 
              :href="emailHref" 
              class="social-link"
              aria-label="Email"
              title="Nous contacter"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
            <a 
              :href="whatsappHref" 
              target="_blank" 
              rel="noopener noreferrer"
              class="social-link"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </a>
            <a 
              href="https://instagram.com/lenainvert" 
              target="_blank" 
              rel="noopener noreferrer"
              class="social-link"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>

        <!-- Navigation (25%) -->
        <div class="flex flex-col gap-3">
          <h4 class="text-white text-base font-bold uppercase tracking-wider mb-2">Navigation</h4>
          <ul class="list-none flex flex-col gap-2">
            <li><router-link to="/" class="text-[var(--color-text-secondary)] text-[0.95rem] transition-all duration-200 hover:text-[var(--color-neon-green)] hover:pl-2">Accueil</router-link></li>
            <li><router-link to="/designs" class="text-[var(--color-text-secondary)] text-[0.95rem] transition-all duration-200 hover:text-[var(--color-neon-green)] hover:pl-2">Designs</router-link></li>
          </ul>
        </div>

        <!-- Informations (25%) -->
        <div class="flex flex-col gap-3">
          <h4 class="text-white text-base font-bold uppercase tracking-wider mb-2">Informations</h4>
          <ul class="list-none flex flex-col gap-2">
            <li><router-link to="/shipping" class="text-[var(--color-text-secondary)] text-[0.95rem] transition-all duration-200 hover:text-[var(--color-neon-green)] hover:pl-2">Livraison</router-link></li>
            <li><router-link to="/returns" class="text-[var(--color-text-secondary)] text-[0.95rem] transition-all duration-200 hover:text-[var(--color-neon-green)] hover:pl-2">Retours</router-link></li>
            <li><router-link to="/terms" class="text-[var(--color-text-secondary)] text-[0.95rem] transition-all duration-200 hover:text-[var(--color-neon-green)] hover:pl-2">CGV</router-link></li>
            <li><router-link to="/legal" class="text-[var(--color-text-secondary)] text-[0.95rem] transition-all duration-200 hover:text-[var(--color-neon-green)] hover:pl-2">Mentions légales</router-link></li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="pt-8 border-t border-[rgba(57,255,20,0.2)] text-center text-[var(--color-text-muted)] text-[0.9rem]">
        <p>
          &copy; {{ currentYear }} NainVert. 
          <router-link 
            to="/admin" 
            class="opacity-30 hover:opacity-100 hover:text-[var(--color-neon-green)] transition-all duration-300"
            title="Admin"
          >
            •
          </router-link>
          Tous droits réservés. 
          <span 
            class="easter-egg-trigger"
            @click="openEasterEgg('nainVert')"
            title="🍀"
          >
            🍀
          </span>
        </p>
        <p class="mt-2">
          Made with <span class="heart text-[var(--color-neon-green)]">♥</span> by passionate creators
          <span 
            class="easter-egg-trigger"
            @click="openEasterEgg('cosmic')"
            title="🌌"
          >
            🌌
          </span>
        </p>
      </div>
    </div>
    
    <!-- Easter Egg Modal -->
    <EasterEggModal 
      :is-open="isModalOpen"
      :content="currentContent"
      @close="closeEasterEgg"
    />
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import EasterEggModal from './EasterEggModal.vue'
import { useEasterEgg } from '../composables/useEasterEgg'

const currentYear = computed(() => new Date().getFullYear())

const { isModalOpen, currentContent, openEasterEgg, closeEasterEgg } = useEasterEgg()

// Protection anti-bot pour email et WhatsApp
const decodeEmail = () => {
  const parts = ['contact', 'lenainvert', 'com']
  return parts[0] + '@' + parts[1] + '.' + parts[2]
}

const decodePhone = () => {
  const parts = ['+33', '6', '12', '34', '56', '78']
  return parts.join('')
}

const emailHref = computed(() => 'mailto:' + decodeEmail())
const whatsappHref = computed(() => 'https://wa.me/' + decodePhone().replace(/[^0-9]/g, ''))
</script>

<style scoped>
/* Logo avec effet glow */
.logo-glow span:last-child {
  text-shadow: 0 0 10px var(--color-neon-green), 0 0 20px var(--color-neon-green);
  animation: subtle-glow 3s ease-in-out infinite;
}

@keyframes subtle-glow {
  0%, 100% { 
    text-shadow: 0 0 10px var(--color-neon-green), 0 0 20px var(--color-neon-green);
  }
  50% { 
    text-shadow: 0 0 15px var(--color-neon-green), 0 0 30px var(--color-neon-green), 0 0 40px var(--color-neon-green);
  }
}

/* Social links style futuriste */
.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(42, 42, 42, 0.6));
  border: 1px solid rgba(57, 255, 20, 0.2);
  color: var(--color-neon-green);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  position: relative;
}

.social-link::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  padding: 1px;
  background: linear-gradient(145deg, var(--color-neon-green), var(--color-cyan-green));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.4), 0 0 40px rgba(57, 255, 20, 0.2);
  border-color: var(--color-neon-green);
}

.social-link:hover::before {
  opacity: 1;
}

/* Orbes lumineux animés en fond */
.glow-orb {
  position: absolute;
  top: 20%;
  left: 10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(57, 255, 20, 0.15), transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
  animation: float-orb 20s ease-in-out infinite;
}

.glow-orb-2 {
  position: absolute;
  bottom: 20%;
  right: 10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 255, 136, 0.12), transparent 70%);
  border-radius: 50%;
  filter: blur(50px);
  animation: float-orb-2 25s ease-in-out infinite;
}

@keyframes float-orb {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-30px, 20px) scale(0.9); }
}

@keyframes float-orb-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 30px) scale(1.15); }
  66% { transform: translate(20px, -25px) scale(0.85); }
}

.heart {
  display: inline-block;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* Easter egg triggers */
.easter-egg-trigger {
  display: inline-block;
  margin: 0 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.easter-egg-trigger:hover {
  transform: scale(1.3) rotate(10deg);
  opacity: 1;
  filter: drop-shadow(0 0 8px rgba(57, 255, 20, 0.6));
}
</style>
