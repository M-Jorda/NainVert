<template>
  <div class="min-h-screen py-20">
    <div class="container max-w-[1200px] mx-auto px-4 md:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 lg:gap-20">
        <!-- Contact Info -->
        <div class="flex flex-col gap-12">
          <h1 class="text-[clamp(2.5rem,5vw,4rem)] mb-6">
            <span class="text-gradient">{{ content.contact?.title || 'Contactez-nous' }}</span>
          </h1>
          <p class="text-lg leading-relaxed text-[var(--color-text-secondary)]">
            {{ content.contact?.subtitle || 'Une question ? N\'hésitez pas à nous contacter' }}
            <span 
              class="easter-egg-trigger"
              @click="openEasterEgg('present')"
              title="🧘"
            >
              🧘
            </span>
          </p>

          <div class="flex flex-col gap-4">
            <div class="info-card flex gap-4 p-4 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-xl transition-all duration-300 hover:border-[var(--color-neon-green)] hover:translate-x-1">
              <div class="flex items-center justify-center w-12 h-12 bg-[rgba(57,255,20,0.1)] rounded-lg text-[var(--color-neon-green)] flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div>
                <h3 class="text-base font-bold mb-1 text-white">Email</h3>
                <p class="text-sm text-[var(--color-text-secondary)] m-0">{{ content.contact?.email || 'contact@nainvert.com' }}</p>
              </div>
            </div>

            <div class="info-card flex gap-4 p-4 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-xl transition-all duration-300 hover:border-[var(--color-neon-green)] hover:translate-x-1">
              <div class="flex items-center justify-center w-12 h-12 bg-[rgba(57,255,20,0.1)] rounded-lg text-[var(--color-neon-green)] flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div>
                <h3 class="text-base font-bold mb-1 text-white">Instagram</h3>
                <a href="https://instagram.com/nainvert" target="_blank" rel="noopener noreferrer" class="text-sm text-[var(--color-text-secondary)] m-0 hover:text-[var(--color-neon-green)]">
                  {{ content.contact?.instagram || '@nainvert' }}
                </a>
              </div>
            </div>

            <div class="info-card flex gap-4 p-4 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-xl transition-all duration-300 hover:border-[var(--color-neon-green)] hover:translate-x-1">
              <div class="flex items-center justify-center w-12 h-12 bg-[rgba(57,255,20,0.1)] rounded-lg text-[var(--color-neon-green)] flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div>
                <h3 class="text-base font-bold mb-1 text-white">Horaires</h3>
                <p class="text-sm text-[var(--color-text-secondary)] m-0">{{ content.contact?.hours || 'Lun-Ven: 9h-18h' }}</p>
              </div>
            </div>
          </div>

          <div class="p-8 bg-[var(--color-black-light)] border-2 border-[var(--color-neon-green)] rounded-xl text-center">
            <h3 class="text-xl mb-3 text-[var(--color-neon-green)]">Suivez-nous</h3>
            <p class="mb-6 text-[var(--color-text-secondary)]">Rejoignez notre communauté pour ne rien manquer de nos nouveautés</p>
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
              Suivez-nous sur Instagram
            </a>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-3xl p-8 lg:p-20">
          <form @submit.prevent="handleSubmit">
            <h2 class="text-3xl font-bold mb-12 text-center">Envoyez-nous un message</h2>

            <div class="mb-6">
              <label for="name" class="block text-sm font-semibold text-white uppercase tracking-wider mb-2">Nom complet *</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                class="form-input"
                placeholder="John Doe"
                required
              />
            </div>

            <div class="mb-6">
              <label for="email" class="block text-sm font-semibold text-white uppercase tracking-wider mb-2">Email *</label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="form-input"
                placeholder="john@example.com"
                required
              />
            </div>

            <div class="mb-6">
              <label for="subject" class="block text-sm font-semibold text-white uppercase tracking-wider mb-2">Sujet *</label>
              <select
                id="subject"
                v-model="formData.subject"
                class="form-select"
                required
              >
                <option value="">Choisissez un sujet</option>
                <option value="order">Question sur une commande</option>
                <option value="product">Question sur un produit</option>
                <option value="delivery">Livraison</option>
                <option value="return">Retour / Échange</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div class="mb-6">
              <label for="message" class="block text-sm font-semibold text-white uppercase tracking-wider mb-2">Message *</label>
              <textarea
                id="message"
                v-model="formData.message"
                class="form-textarea"
                placeholder="Votre message..."
                rows="6"
                required
              ></textarea>
            </div>

            <!-- Honeypot field (hidden from humans, visible to bots) -->
            <div class="honeypot-field" aria-hidden="true">
              <label for="website">Website (ne pas remplir)</label>
              <input
                id="website"
                v-model="formData.honeypot"
                type="text"
                name="website"
                tabindex="-1"
                autocomplete="off"
              />
            </div>

            <button type="submit" class="btn btn-primary w-full py-4 text-lg" :disabled="isSubmitting">
              <svg v-if="!isSubmitting" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              <span v-if="isSubmitting">Envoi en cours...</span>
              <span v-else>Envoyer le message</span>
            </button>

            <!-- Success Message -->
            <div v-if="submitSuccess" class="success-message mt-6 p-4 rounded-lg text-center font-semibold bg-[rgba(0,255,136,0.1)] border-2 border-[var(--color-cyan-green)] text-[var(--color-cyan-green)]">
              ✓ Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
            </div>

            <!-- Error Message -->
            <div v-if="submitError" class="error-message mt-6 p-4 rounded-lg text-center font-semibold bg-[rgba(255,68,68,0.1)] border-2 border-[#ff4444] text-[#ff4444]">
              ✗ Une erreur est survenue. Veuillez réessayer plus tard.
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Easter Egg Modal -->
    <EasterEggModal 
      :is-open="isModalOpen"
      :content="currentContent"
      @close="closeEasterEgg"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import EasterEggModal from '../components/EasterEggModal.vue'
import { useEasterEgg } from '../composables/useEasterEgg'
import { useSiteContent } from '../composables/useSiteContent'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'

const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  honeypot: '' // Honeypot field
})

const { siteContent, loadSiteContent } = useSiteContent()
const content = computed(() => siteContent.value || {})
const { isModalOpen, currentContent, openEasterEgg, closeEasterEgg } = useEasterEgg()

onMounted(async () => {
  await loadSiteContent()
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = false

  try {
    // 🍯 Honeypot check: if filled, it's a bot
    if (formData.honeypot) {
      console.log('🤖 Bot détecté via honeypot')
      // Silently fail for bots (they think it succeeded)
      await new Promise(resolve => setTimeout(resolve, 1500))
      submitSuccess.value = true
      // Reset form
      formData.name = ''
      formData.email = ''
      formData.subject = ''
      formData.message = ''
      formData.honeypot = ''
      setTimeout(() => { submitSuccess.value = false }, 5000)
      return
    }

    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      throw new Error('Tous les champs sont requis')
    }

    // Save to Firestore
    await addDoc(collection(db, 'messages'), {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      timestamp: serverTimestamp(),
      status: 'unread',
      userAgent: navigator.userAgent,
      source: 'contact-form'
    })
    
    console.log('✅ Message enregistré dans Firestore')
    
    submitSuccess.value = true
    
    // Reset form
    formData.name = ''
    formData.email = ''
    formData.subject = ''
    formData.message = ''
    formData.honeypot = ''
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      submitSuccess.value = false
    }, 5000)
  } catch (error) {
    console.error('❌ Erreur envoi formulaire:', error)
    submitError.value = true
    
    // Hide error message after 5 seconds
    setTimeout(() => {
      submitError.value = false
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Animation for messages */
.success-message,
.error-message {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Easter egg trigger */
.easter-egg-trigger {
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.7;
  margin: 0 4px;
}

.easter-egg-trigger:hover {
  transform: scale(1.3) rotate(10deg);
  opacity: 1;
  filter: drop-shadow(0 0 8px rgba(57, 255, 20, 0.6));
}

/* Honeypot field (hidden from humans) */
.honeypot-field {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
</style>
