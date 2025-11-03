<template>
  <div class="refunds-tab">
    <h2 class="text-2xl font-bold mb-6 text-white">Gestion des Remboursements</h2>
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
    <div v-if="loadingRefunds" class="text-center py-8 text-[var(--color-text-secondary)]">Chargement des remboursements...</div>
    <div v-else-if="filteredRefunds.length === 0" class="text-center py-8 text-[var(--color-text-secondary)]">Aucun remboursement trouvé</div>
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm bg-[var(--color-black-light)] rounded-xl overflow-hidden">
        <thead>
          <tr class="bg-[rgba(57,255,20,0.05)]">
            <th class="p-3 text-left">Date</th>
            <th class="p-3 text-left">Commande</th>
            <th class="p-3 text-left">Montant</th>
            <th class="p-3 text-left">Statut</th>
            <th class="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="refund in filteredRefunds" :key="refund.id" class="border-b border-[rgba(57,255,20,0.05)] hover:bg-[rgba(57,255,20,0.03)]">
            <td class="p-3">{{ formatOrderDate(refund.createdAt) }}</td>
            <td class="p-3">#{{ refund.orderId || '-' }}</td>
            <td class="p-3">{{ refund.amount ? refund.amount.toFixed(2) : '-' }}€</td>
            <td class="p-3">
              <span :class="['badge', 'badge-' + refund.status]">{{ getRefundStatusLabel(refund.status) }}</span>
            </td>
            <td class="p-3">
              <button @click="$emit('select-refund', refund)" class="btn btn-xs btn-primary">Détails</button>
            </td>
          </tr>
        </tbody>
      </table>
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
