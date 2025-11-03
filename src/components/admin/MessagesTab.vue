<template>
  <div class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl p-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gradient">📬 Messages de contact</h2>
      <div class="text-sm text-[var(--color-text-secondary)]">
        {{ unreadMessages }} non lu(s)
      </div>
    </div>

    <div v-if="loadingMessages" class="text-center py-8 text-[var(--color-text-secondary)]">
      Chargement des messages...
    </div>

    <div v-else-if="contactMessages.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-[var(--color-text-secondary)] opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
      <p class="text-[var(--color-text-secondary)]">Aucun message reçu</p>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="message in contactMessages" 
        :key="message.id"
        :class="[
          'p-6 border-2 rounded-lg transition-all',
          message.status === 'unread' 
            ? 'bg-[rgba(57,255,20,0.1)] border-[var(--color-neon-green)]' 
            : 'bg-[rgba(57,255,20,0.05)] border-[rgba(57,255,20,0.2)]'
        ]"
      >
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-bold text-white">{{ message.name }}</h3>
              <span 
                :class="[
                  'px-2 py-0.5 text-xs font-bold rounded',
                  message.status === 'unread' 
                    ? 'bg-[var(--color-neon-green)] text-black' 
                    : 'bg-gray-500/20 text-gray-400'
                ]"
              >
                {{ message.status === 'unread' ? 'NOUVEAU' : 'Lu' }}
              </span>
              <span class="px-2 py-0.5 bg-[rgba(57,255,20,0.1)] text-[var(--color-neon-green)] text-xs rounded">
                {{ message.subject }}
              </span>
            </div>
            <a :href="`mailto:${message.email}`" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-neon-green)] transition-colors">
              {{ message.email }}
            </a>
          </div>
          <div class="flex gap-2">
            <button 
              @click="$emit('toggle-message-status', message.id, message.status)"
              class="p-2 border border-[rgba(57,255,20,0.3)] rounded-lg hover:border-[var(--color-neon-green)] hover:bg-[rgba(57,255,20,0.1)] transition-all"
              :title="message.status === 'read' ? 'Marquer comme non lu' : 'Marquer comme lu'"
            >
              <svg v-if="message.status === 'unread'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </button>
            <button 
              @click="$emit('delete-message', message.id)"
              class="p-2 text-red-400 border border-red-500/30 rounded-lg hover:border-red-500 hover:bg-red-500/10 transition-all"
              title="Supprimer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Message -->
        <div class="p-4 bg-black/30 rounded-lg mb-4">
          <p class="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap">{{ message.message }}</p>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
          <span>{{ formatDate(message.timestamp) }}</span>
          <span class="font-mono">{{ message.source }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  contactMessages: {
    type: Array,
    required: true
  },
  unreadMessages: {
    type: Number,
    required: true
  },
  loadingMessages: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-message-status', 'delete-message'])

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
