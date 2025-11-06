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

    <div v-else>
      <table class="w-full text-sm bg-[var(--color-black-light)] rounded-xl overflow-hidden">
        <thead>
          <tr class="bg-[rgba(57,255,20,0.05)]">
            <th class="p-3 text-left">Date</th>
            <th class="p-3 text-left">Nom</th>
            <th class="p-3 text-left">Email</th>
            <th class="p-3 text-left">Sujet</th>
            <th class="p-3 text-left">Statut</th>
            <th class="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="message in contactMessages" 
            :key="message.id" 
            :class="[
              'border-b border-[rgba(57,255,20,0.05)] hover:bg-[rgba(57,255,20,0.03)] cursor-pointer',
              message.status === 'unread' && 'bg-[rgba(57,255,20,0.08)]'
            ]" 
            @click="$emit('select-message', message)"
          >
            <td class="p-3">{{ formatDate(message.timestamp) }}</td>
            <td class="p-3 font-semibold">{{ message.name }}</td>
            <td class="p-3 text-[var(--color-neon-green)]">{{ message.email }}</td>
            <td class="p-3">{{ message.subject }}</td>
            <td class="p-3">
              <span 
                :class="[
                  'px-2 py-1 text-xs font-bold rounded',
                  message.status === 'unread' 
                    ? 'bg-[var(--color-neon-green)] text-black' 
                    : 'bg-gray-500/20 text-gray-400'
                ]"
              >
                {{ message.status === 'unread' ? 'NOUVEAU' : 'Lu' }}
              </span>
            </td>
            <td class="p-3">
              <button @click.stop="$emit('select-message', message)" class="btn btn-xs btn-primary">Détails</button>
            </td>
          </tr>
        </tbody>
      </table>
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

const emit = defineEmits(['select-message', 'toggle-message-status', 'delete-message'])

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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
