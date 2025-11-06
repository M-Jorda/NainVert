<template>
  <div class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl p-8">
    <h2 class="text-2xl font-bold text-gradient mb-6">💰 Gestion des Remboursements</h2>
    <!-- Statistiques -->
    <div class="flex gap-4 mb-6 flex-wrap">
      <div class="stat-card stat-total">
        <div class="stat-value">{{ refundStats && refundStats.total !== undefined ? refundStats.total : 0 }}</div>
        <div class="stat-label">Total</div>
      </div>
      <div class="stat-card stat-requested">
        <div class="stat-value">{{ refundStats && refundStats.requested !== undefined ? refundStats.requested : 0 }}</div>
        <div class="stat-label">Demandés</div>
      </div>
      <div class="stat-card stat-approved">
        <div class="stat-value">{{ refundStats && refundStats.approved !== undefined ? refundStats.approved : 0 }}</div>
        <div class="stat-label">Approuvés</div>
      </div>
      <div class="stat-card stat-rejected">
        <div class="stat-value">{{ refundStats && refundStats.rejected !== undefined ? refundStats.rejected : 0 }}</div>
        <div class="stat-label">Rejetés</div>
      </div>
      <div class="stat-card stat-processed">
        <div class="stat-value">{{ refundStats && refundStats.processed !== undefined ? refundStats.processed : 0 }}</div>
        <div class="stat-label">Traités</div>
      </div>
    </div>
    <!-- Filtres -->
    <div class="mb-6">
      <div class="flex gap-2 flex-wrap">
        <button @click="$emit('update-filter', 'all')" :class="['filter-btn', { active: refundFilter === 'all' }]">Tous</button>
        <button @click="$emit('update-filter', 'requested')" :class="['filter-btn', { active: refundFilter === 'requested' }]">Demandés</button>
        <button @click="$emit('update-filter', 'approved')" :class="['filter-btn', { active: refundFilter === 'approved' }]">Approuvés</button>
        <button @click="$emit('update-filter', 'rejected')" :class="['filter-btn', { active: refundFilter === 'rejected' }]">Rejetés</button>
        <button @click="$emit('update-filter', 'processed')" :class="['filter-btn', { active: refundFilter === 'processed' }]">Traités</button>
      </div>
    </div>
    <!-- Liste des remboursements -->
    <div v-if="loadingRefunds" class="text-center py-8 text-[var(--color-text-secondary)]">
      Chargement des remboursements...
    </div>
    
    <div v-else-if="filteredRefunds.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-[var(--color-text-secondary)] opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 19c.88 0 1.75-.39 2.36-1.09l6.36-7.09A2 2 0 0 0 19.36 8H4.64a2 2 0 0 0-1.36 3.82l6.36 7.09A3.001 3.001 0 0 0 12 19z"></path>
      </svg>
      <p class="text-[var(--color-text-secondary)]">Aucun remboursement trouvé</p>
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="refund in filteredRefunds" 
        :key="refund.id"
        :class="[
          'p-6 border-2 rounded-lg hover:shadow-lg transition-all cursor-pointer',
          refund.status === 'rejected' 
            ? 'bg-[rgba(239,68,68,0.05)] border-[rgba(239,68,68,0.3)] hover:border-red-400' 
            : 'bg-[rgba(57,255,20,0.05)] border-[rgba(57,255,20,0.2)] hover:border-[var(--color-neon-green)]'
        ]"
        @click="$emit('select-refund', refund)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <h3 class="text-lg font-bold text-white">Remboursement #{{ refund.orderId || refund.id.substring(0, 8) }}</h3>
              <span 
                :class="[
                  'px-2 py-1 text-xs font-bold rounded',
                  refund.status === 'requested' ? 'bg-yellow-500/20 text-yellow-400' :
                  refund.status === 'approved' ? 'bg-blue-500/20 text-blue-400' :
                  refund.status === 'processed' ? 'bg-green-500/20 text-green-400' :
                  'bg-red-500/20 text-red-400'
                ]"
              >
                {{ getRefundStatusLabel(refund.status) }}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-[var(--color-text-secondary)]">Montant:</span>
                <span class="ml-2 text-white font-bold">{{ refund.amount ? refund.amount.toFixed(2) : '-' }}€</span>
              </div>
              <div>
                <span class="text-[var(--color-text-secondary)]">Date:</span>
                <span class="ml-2 text-white">{{ formatOrderDate(refund.createdAt) }}</span>
              </div>
            </div>
            <div v-if="refund.reason" class="mt-3 text-sm text-[var(--color-text-secondary)] line-clamp-2">
              <span class="font-semibold">Raison:</span> {{ refund.reason }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  refundStats: {
    type: Object,
    required: true
  },
  refundFilter: {
    type: String,
    required: true
  },
  filteredRefunds: {
    type: Array,
    required: true
  },
  loadingRefunds: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-filter', 'select-refund'])

function getRefundStatusLabel(status) {
  const labels = {
    requested: 'Demandé',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    processed: 'Traité'
  }
  return labels[status] || status
}

function formatOrderDate(timestamp) {
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
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
