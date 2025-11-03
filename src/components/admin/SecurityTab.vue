<template>
  <div>
    <!-- Connexions hackers (logs honeypot) -->
    <div class="content-section mt-8">
      <h2 class="text-2xl font-bold mb-4 text-white flex items-center gap-2">
        <span>🍯</span> Tentatives d'intrusion (Honeypot)
      </h2>
      <div v-if="loadingLogs" class="text-center py-4 text-[var(--color-text-secondary)]">Chargement des logs...</div>
      <div v-else-if="honeypotLogs.length === 0" class="text-center py-4 text-[var(--color-text-secondary)]">Aucune tentative détectée.</div>
      <div v-else>
        <table class="w-full text-sm bg-[var(--color-black-light)] rounded-xl overflow-hidden mb-4">
          <thead>
            <tr class="bg-[rgba(255,0,0,0.05)]">
              <th class="p-3 text-left">Date</th>
              <th class="p-3 text-left">Email</th>
              <th class="p-3 text-left">IP</th>
              <th class="p-3 text-left">User-Agent</th>
              <th class="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in sortedHoneypotLogs" :key="log.id" class="border-b border-[rgba(255,0,0,0.05)] hover:bg-[rgba(255,0,0,0.03)]">
              <td class="p-3">{{ formatDate(log.timestamp) }}</td>
              <td class="p-3">{{ log.email || '-' }}</td>
              <td class="p-3">{{ log.ip || '-' }}</td>
              <td class="p-3 truncate max-w-[200px]">{{ log.userAgent || '-' }}</td>
              <td class="p-3">
                <button @click="$emit('delete-log', log.id)" class="btn btn-xs btn-danger">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="$emit('clear-honeypot-logs')" class="btn btn-danger">Tout supprimer</button>
      </div>
    </div>
    
    <!-- Bloc Connexion -->
    <div v-if="!isAuthenticated" class="container max-w-md mx-auto px-4 mb-8">
      <div class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl p-8">
        <h1 class="text-3xl font-bold text-center mb-8">
          <span class="text-gradient">Connexion Admin</span>
        </h1>
        <form @submit.prevent="$emit('handle-login')" class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Email</label>
            <input :value="loginData.email" @input="$emit('update-login-field', 'email', $event.target.value)" type="email" class="form-input" placeholder="admin@nainvert.com" required>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Mot de passe</label>
            <input :value="loginData.password" @input="$emit('update-login-field', 'password', $event.target.value)" type="password" class="form-input" placeholder="Entrez le mot de passe" required :disabled="loginData.isBlocked">
          </div>
          <div v-if="loginData.showCaptcha && !loginData.isBlocked" class="p-4 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.3)] rounded-lg">
            <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">🤖 Vérification anti-robot</label>
            <div class="flex items-center gap-3">
              <span class="text-2xl font-bold text-[var(--color-neon-green)] font-mono">{{ loginData.captchaQuestion.num1 }} + {{ loginData.captchaQuestion.num2 }} = ?</span>
              <input :value="loginData.captchaAnswer" @input="$emit('update-login-field', 'captchaAnswer', $event.target.value)" type="number" class="form-input w-24" placeholder="?" required :disabled="loginData.isBlocked">
            </div>
          </div>
          <div v-if="loginData.isBlocked" class="p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <div class="flex items-center gap-3 mb-2">
              <svg class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <div>
                <div class="text-red-500 font-bold">Compte temporairement bloqué</div>
                <div class="text-red-400 text-sm">Trop de tentatives échouées</div>
              </div>
            </div>
            <div class="text-center text-2xl font-mono font-bold text-red-500 mt-3">{{ loginData.blockRemainingTime }}</div>
          </div>
          <div v-if="loginData.failedAttempts > 0 && !loginData.isBlocked" class="p-3 bg-orange-500/10 border border-orange-500 rounded-lg text-orange-500 text-sm">
            <div class="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>{{ loginData.failedAttempts }} tentative(s) échouée(s)</span>
            </div>
          </div>
          <div v-if="loginData.error" class="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {{ loginData.error }}
          </div>
          <button type="submit" class="btn btn-primary" :disabled="loginData.loading || loginData.isBlocked">
            {{ loginData.isBlocked ? 'Bloqué' : (loginData.loading ? 'Connexion...' : 'Se connecter') }}
          </button>
        </form>
      </div>
    </div>
    
    <!-- Changement de mot de passe -->
    <div v-if="isAuthenticated" class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl p-8 max-w-2xl">
      <h2 class="text-2xl font-bold mb-6 text-gradient">Changer le mot de passe</h2>
      
      <form @submit.prevent="$emit('handle-change-password')" class="flex flex-col gap-6">
        <div>
          <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">
            Mot de passe actuel
          </label>
          <input 
            :value="passwordForm.current"
            @input="$emit('update-password-field', 'current', $event.target.value)"
            type="password"
            class="form-input"
            placeholder="Entrez votre mot de passe actuel"
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
            placeholder="Minimum 6 caractères"
            required
            minlength="6"
          >
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">
            Confirmer le nouveau mot de passe
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

        <!-- Messages -->
        <div v-if="passwordMessage.text" 
             :class="[
               'p-4 rounded-lg border',
               passwordMessage.type === 'success' 
                 ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)]'
                 : 'bg-red-500/10 border-red-500 text-red-500'
             ]"
        >
          {{ passwordMessage.text }}
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loginData.loading">
          {{ loginData.loading ? 'Modification...' : 'Changer le mot de passe' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
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

function formatDate(timestamp) {
  if (!timestamp) return '-'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>
