<template>
  <div>
    <!-- Minimal Login Form (not authenticated) -->
    <div v-if="!isAuthenticated" class="min-h-[60vh] flex items-center justify-center">
      <div class="w-full max-w-sm">
        <form @submit.prevent="$emit('handle-login')" class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Email</label>
            <input
              :value="loginData.email"
              @input="$emit('update-login-field', 'email', $event.target.value)"
              type="email"
              class="form-input"
              placeholder="admin@nainvert.com"
              required
              :disabled="loginData.isBlocked"
            >
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Mot de passe</label>
            <input
              :value="loginData.password"
              @input="$emit('update-login-field', 'password', $event.target.value)"
              type="password"
              class="form-input"
              placeholder="Entrez le mot de passe"
              required
              :disabled="loginData.isBlocked"
            >
          </div>

          <!-- Captcha verification -->
          <div v-if="loginData.showCaptcha && !loginData.isBlocked" class="p-4 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.3)] rounded-lg">
            <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Verification</label>
            <div class="flex items-center gap-3">
              <span class="text-xl font-bold text-[var(--color-neon-green)] font-mono">{{ loginData.captchaQuestion.num1 }} + {{ loginData.captchaQuestion.num2 }} = ?</span>
              <input
                :value="loginData.captchaAnswer"
                @input="$emit('update-login-field', 'captchaAnswer', $event.target.value)"
                type="number"
                class="form-input w-20"
                placeholder="?"
                required
                :disabled="loginData.isBlocked"
              >
            </div>
          </div>

          <!-- Block message -->
          <div v-if="loginData.isBlocked" class="p-4 bg-red-500/10 border border-red-500 rounded-lg text-center">
            <div class="text-red-500 font-bold mb-1">Compte bloque</div>
            <div class="text-2xl font-mono font-bold text-red-500">{{ loginData.blockRemainingTime }}</div>
          </div>

          <!-- Failed attempts warning -->
          <div v-if="loginData.failedAttempts > 0 && !loginData.isBlocked" class="p-2 bg-orange-500/10 border border-orange-500 rounded-lg text-orange-500 text-sm text-center">
            {{ loginData.failedAttempts }} tentative(s) echouee(s)
          </div>

          <!-- Error message -->
          <div v-if="loginData.loginError" class="p-2 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm text-center">
            Identifiants invalides
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loginData.loading || loginData.isBlocked">
            {{ loginData.isBlocked ? 'Bloque' : (loginData.loading ? 'Connexion...' : 'Se connecter') }}
          </button>
        </form>
      </div>
    </div>

    <!-- Authenticated: Two-column layout -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left Column: Password Change -->
      <div class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl p-6">
        <h2 class="text-xl font-bold mb-6 text-gradient">Changer le mot de passe</h2>

        <form @submit.prevent="$emit('handle-change-password')" class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">
              Mot de passe actuel
            </label>
            <input
              :value="passwordForm.current"
              @input="$emit('update-password-field', 'current', $event.target.value)"
              type="password"
              class="form-input"
              placeholder="Mot de passe actuel"
              required
            >
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">
              Nouveau mot de passe
            </label>
            <input
              :value="passwordForm.new"
              @input="$emit('update-password-field', 'new', $event.target.value)"
              type="password"
              class="form-input"
              placeholder="Minimum 6 caracteres"
              required
              minlength="6"
            >
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">
              Confirmer
            </label>
            <input
              :value="passwordForm.confirm"
              @input="$emit('update-password-field', 'confirm', $event.target.value)"
              type="password"
              class="form-input"
              placeholder="Retapez le nouveau mot de passe"
              required
              minlength="6"
            >
          </div>

          <!-- Password change messages -->
          <div v-if="passwordMessage.text"
               :class="[
                 'p-3 rounded-lg border text-sm',
                 passwordMessage.type === 'success'
                   ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]'
                   : 'bg-red-500/10 border-red-500 text-red-500'
               ]"
          >
            {{ passwordMessage.text }}
          </div>

          <button type="submit" class="btn btn-primary">
            Changer le mot de passe
          </button>
        </form>
      </div>

      <!-- Right Column: Honeypot (Collapsible) -->
      <div class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl p-6">
        <button
          @click="honeypotExpanded = !honeypotExpanded"
          class="w-full flex items-center justify-between text-left"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">{{ honeypotLogs.length > 0 ? '🍯' : '🛡️' }}</span>
            <div>
              <h2 class="text-xl font-bold text-white">Honeypot</h2>
              <p class="text-sm text-[var(--color-text-secondary)]">
                {{ honeypotLogs.length }} tentative{{ honeypotLogs.length !== 1 ? 's' : '' }} d'intrusion
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span v-if="honeypotLogs.length > 0" class="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">
              {{ honeypotLogs.length }}
            </span>
            <svg
              :class="['w-5 h-5 text-[var(--color-text-secondary)] transition-transform duration-300', honeypotExpanded ? 'rotate-180' : '']"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>

        <!-- Expanded Honeypot Content -->
        <transition name="expand">
          <div v-if="honeypotExpanded" class="mt-4 pt-4 border-t border-[rgba(57,255,20,0.2)]">
            <div v-if="loadingLogs" class="text-center py-4 text-[var(--color-text-secondary)]">
              Chargement...
            </div>

            <div v-else-if="honeypotLogs.length === 0" class="text-center py-6">
              <svg class="w-12 h-12 mx-auto mb-3 text-[var(--color-text-secondary)] opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <p class="text-[var(--color-text-secondary)] text-sm">Aucune tentative detectee</p>
              <p class="text-xs text-[var(--color-text-muted)] mt-1">Le honeypot est actif sur /admin</p>
            </div>

            <div v-else>
              <!-- Compact log list -->
              <div class="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <div
                  v-for="log in sortedHoneypotLogs.slice(0, 10)"
                  :key="log.id"
                  class="p-3 bg-[rgba(255,0,0,0.03)] border border-[rgba(255,0,0,0.1)] rounded-lg text-sm hover:border-[rgba(255,0,0,0.3)] transition-colors"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                      <div class="font-mono text-[var(--color-neon-green)] truncate">{{ log.email || '-' }}</div>
                      <div class="text-xs text-[var(--color-text-muted)] mt-1">{{ formatDate(log.timestamp) }}</div>
                    </div>
                    <button
                      @click.stop="$emit('delete-log', log.id)"
                      class="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                      title="Supprimer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Show more if there are more than 10 logs -->
              <p v-if="honeypotLogs.length > 10" class="text-xs text-[var(--color-text-muted)] text-center mt-3">
                + {{ honeypotLogs.length - 10 }} autre{{ honeypotLogs.length - 10 > 1 ? 's' : '' }} tentative{{ honeypotLogs.length - 10 > 1 ? 's' : '' }}
              </p>

              <!-- Clear all button -->
              <button
                @click="$emit('clear-honeypot-logs')"
                class="mt-4 w-full btn text-sm bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
              >
                Tout supprimer
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  honeypotLogs: {
    type: Array,
    required: true
  },
  sortedHoneypotLogs: {
    type: Array,
    required: true
  },
  loadingLogs: {
    type: Boolean,
    default: false
  },
  isAuthenticated: {
    type: Boolean,
    required: true
  },
  loginData: {
    type: Object,
    required: true
  },
  passwordForm: {
    type: Object,
    required: true
  },
  passwordMessage: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'delete-log',
  'clear-honeypot-logs',
  'handle-login',
  'update-login-field',
  'handle-change-password',
  'update-password-field'
])

// Honeypot section expansion state
const honeypotExpanded = ref(false)

function formatDate(timestamp) {
  if (!timestamp) return '-'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<style scoped>
/* Expand transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* Custom scrollbar for honeypot logs */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(57, 255, 20, 0.05);
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(57, 255, 20, 0.3);
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(57, 255, 20, 0.5);
}
</style>
