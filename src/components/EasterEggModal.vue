<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div 
        v-if="isOpen" 
        class="modal-overlay"
        @click="closeModal"
      >
        <div 
          class="modal-content"
          @click.stop
        >
          <!-- Bouton fermer -->
          <button 
            class="close-btn"
            @click="closeModal"
            aria-label="Fermer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Contenu de l'easter egg -->
          <div class="easter-egg-content">
            <div class="glow-circle"></div>
            <div class="easter-egg-icon">{{ content.icon }}</div>
            <h2 class="easter-egg-title">{{ content.title }}</h2>
            <p class="easter-egg-text">{{ content.text }}</p>
            <div v-if="content.author" class="easter-egg-author">— {{ content.author }}</div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  content: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

// Fermer avec la touche Escape
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal()
        document.removeEventListener('keydown', handleEscape)
      }
    }
    document.addEventListener('keydown', handleEscape)
  }
})
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Modal content */
.modal-content {
  position: relative;
  max-width: 600px;
  width: 100%;
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.95), rgba(42, 42, 42, 0.9));
  border: 1px solid rgba(57, 255, 20, 0.3);
  border-radius: 20px;
  padding: 60px 40px;
  backdrop-filter: blur(20px);
  box-shadow: 0 0 40px rgba(57, 255, 20, 0.2), inset 0 0 60px rgba(57, 255, 20, 0.05);
}

/* Bouton fermer */
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 10px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-btn:hover {
  border-color: var(--color-neon-green);
  color: var(--color-neon-green);
  transform: rotate(90deg);
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
}

/* Contenu easter egg */
.easter-egg-content {
  position: relative;
  text-align: center;
  z-index: 1;
}

.glow-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(57, 255, 20, 0.1), transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
}

.easter-egg-icon {
  font-size: 80px;
  margin-bottom: 30px;
  animation: float-icon 3s ease-in-out infinite;
}

@keyframes float-icon {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.easter-egg-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-neon-green);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 30px;
  text-shadow: 0 0 20px rgba(57, 255, 20, 0.5);
}

.easter-egg-text {
  font-size: 18px;
  line-height: 1.8;
  color: var(--color-text-primary);
  margin-bottom: 20px;
  font-weight: 400;
}

.easter-egg-author {
  font-size: 16px;
  color: var(--color-text-secondary);
  font-style: italic;
  margin-top: 20px;
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    padding: 50px 30px;
  }

  .easter-egg-icon {
    font-size: 60px;
  }

  .easter-egg-title {
    font-size: 22px;
  }

  .easter-egg-text {
    font-size: 16px;
  }
}
</style>
