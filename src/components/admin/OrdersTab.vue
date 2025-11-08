<template>
  <div class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl p-8">
    <!-- Header avec statistiques -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gradient mb-6">🛒 Gestion des Commandes</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="stat-card">
          <div class="stat-value">{{ orderStats.total }}</div>
          <div class="stat-label">Total</div>
        </div>
        <div class="stat-card stat-pending">
          <div class="stat-value">{{ orderStats.pending }}</div>
          <div class="stat-label">En attente</div>
        </div>
        <div class="stat-card stat-shipped">
          <div class="stat-value">{{ orderStats.shipped }}</div>
          <div class="stat-label">Expédiées</div>
        </div>
        <div class="stat-card stat-delivered">
          <div class="stat-value">{{ orderStats.delivered }}</div>
          <div class="stat-label">Livrées</div>
        </div>
        <div class="stat-card stat-revenue">
          <div class="stat-value">{{ orderStats.totalRevenue.toFixed(2) }}€</div>
          <div class="stat-label">CA Total</div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="mb-6">
      <div class="flex gap-2 flex-wrap">
        <button 
          @click="$emit('update-filter', 'all')"
          :class="['filter-btn', { active: orderFilter === 'all' }]"
        >
          Toutes
        </button>
        <button 
          @click="$emit('update-filter', 'pending')"
          :class="['filter-btn', { active: orderFilter === 'pending' }]"
        >
          En attente
        </button>
        <button 
          @click="$emit('update-filter', 'paid')"
          :class="['filter-btn', { active: orderFilter === 'paid' }]"
        >
          Payées
        </button>
        <button 
          @click="$emit('update-filter', 'shipped')"
          :class="['filter-btn', { active: orderFilter === 'shipped' }]"
        >
          Expédiées
        </button>
        <button 
          @click="$emit('update-filter', 'delivered')"
          :class="['filter-btn', { active: orderFilter === 'delivered' }]"
        >
          Livrées
        </button>
        <button 
          @click="$emit('update-filter', 'cancelled')"
          :class="['filter-btn', { active: orderFilter === 'cancelled' }]"
        >
          Annulées
        </button>
        <button 
          @click="$emit('toggle-archived')"
          :class="['filter-btn', { active: showArchived }]"
        >
          {{ showArchived ? '📦 Masquer archivées' : '📦 Voir archivées' }}
        </button>
      </div>
    </div>

    <!-- Liste des commandes -->
    <div v-if="loadingOrders" class="text-center py-8 text-[var(--color-text-secondary)]">
      Chargement des commandes...
    </div>

    <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-[var(--color-text-secondary)] opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      <p class="text-[var(--color-text-secondary)]">Aucune commande trouvée</p>
    </div>

    <div v-else>
      <!-- Vue desktop (tableau) -->
      <table class="hidden md:table w-full table-fixed text-sm bg-[var(--color-black-light)] rounded-xl overflow-hidden">
        <thead>
          <tr class="bg-[rgba(57,255,20,0.05)]">
            <th class="p-3 text-left" style="width: 20%">N° Commande</th>
            <th class="p-3 text-left" style="width: 28%">Client</th>
            <th class="p-3 text-left" style="width: 18%">Date</th>
            <th class="p-3 text-left" style="width: 12%">Montant</th>
            <th class="p-3 text-left" style="width: 22%">Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="order in filteredOrders" 
            :key="order.id" 
            class="border-b border-[rgba(57,255,20,0.05)] hover:bg-[rgba(57,255,20,0.03)] cursor-pointer" 
            @click="$emit('select-order', order)"
          >
            <td class="p-3 font-mono text-[var(--color-neon-green)] truncate" style="width: 20%">{{ order.orderNumber || order.orderId || '-' }}</td>
            <td class="p-3" style="width: 28%">
              <div class="flex items-center gap-2">
                <span :title="order.customer?.name || order.customer?.firstName + ' ' + order.customer?.lastName || '-'">
                  {{ truncateName(order.customer?.name || order.customer?.firstName + ' ' + order.customer?.lastName || '-') }}
                </span>
                <span 
                  v-if="order.customer?.tag === 'vip'" 
                  class="px-1.5 py-0.5 text-xs font-bold rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  title="Client VIP"
                >
                  ⭐
                </span>
                <span 
                  v-else-if="order.customer?.tag === 'watch'" 
                  class="px-1.5 py-0.5 text-xs font-bold rounded bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  title="Client à surveiller"
                >
                  ⚠️
                </span>
                <span 
                  v-else-if="order.customer?.tag === 'problematic'" 
                  class="px-1.5 py-0.5 text-xs font-bold rounded bg-red-500/20 text-red-400 border border-red-500/30"
                  title="Client problématique"
                >
                  🚫
                </span>
              </div>
            </td>
            <td class="p-3 text-sm" style="width: 18%">{{ formatOrderDate(order.createdAt) }}</td>
            <td class="p-3 font-bold text-[var(--color-neon-green)]" style="width: 12%">{{ order.total?.toFixed(2) }}€</td>
            <td class="p-3" style="width: 22%">
              <div class="flex items-center gap-2">
                <span :class="[
                  'px-2 py-1 text-xs font-bold rounded',
                  order.status === 'pending' && 'bg-yellow-500/20 text-yellow-400',
                  order.status === 'paid' && 'bg-blue-500/20 text-blue-400',
                  order.status === 'shipped' && 'bg-cyan-500/20 text-cyan-400',
                  order.status === 'delivered' && 'bg-green-500/20 text-green-400',
                  order.status === 'cancelled' && 'bg-red-500/20 text-red-400'
                ]">
                  {{ getStatusLabel(order.status) }}
                </span>
                <span v-if="order.isArchived" class="px-2 py-1 text-xs font-bold rounded bg-orange-500/20 text-orange-400" title="Commande archivée">
                  📦
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Vue mobile/tablette (cartes) -->
      <div class="md:hidden space-y-3">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="p-4 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg cursor-pointer hover:border-[var(--color-neon-green)] transition-all"
          @click="$emit('select-order', order)"
        >
          <!-- Header de la carte -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <p class="text-xs text-[var(--color-text-muted)] mb-1">N° Commande</p>
              <p class="font-mono text-sm font-bold text-[var(--color-neon-green)]">{{ order.orderNumber || order.orderId || '-' }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span :class="[
                'px-2 py-1 text-xs font-bold rounded whitespace-nowrap',
                order.status === 'pending' && 'bg-yellow-500/20 text-yellow-400',
                order.status === 'paid' && 'bg-blue-500/20 text-blue-400',
                order.status === 'shipped' && 'bg-cyan-500/20 text-cyan-400',
                order.status === 'delivered' && 'bg-green-500/20 text-green-400',
                order.status === 'cancelled' && 'bg-red-500/20 text-red-400'
              ]">
                {{ getStatusLabel(order.status) }}
              </span>
              <span v-if="order.isArchived" class="px-2 py-1 text-xs font-bold rounded bg-orange-500/20 text-orange-400" title="Commande archivée">
                📦
              </span>
            </div>
          </div>

          <!-- Infos client -->
          <div class="mb-2">
            <p class="text-xs text-[var(--color-text-muted)] mb-1">Client</p>
            <div class="flex items-center gap-2">
              <p class="text-sm font-semibold text-white">{{ order.customer?.name || order.customer?.firstName + ' ' + order.customer?.lastName || '-' }}</p>
              <span 
                v-if="order.customer?.tag === 'vip'" 
                class="px-1.5 py-0.5 text-xs font-bold rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                title="Client VIP"
              >
                ⭐
              </span>
              <span 
                v-else-if="order.customer?.tag === 'watch'" 
                class="px-1.5 py-0.5 text-xs font-bold rounded bg-orange-500/20 text-orange-400 border border-orange-500/30"
                title="Client à surveiller"
              >
                ⚠️
              </span>
              <span 
                v-else-if="order.customer?.tag === 'problematic'" 
                class="px-1.5 py-0.5 text-xs font-bold rounded bg-red-500/20 text-red-400 border border-red-500/30"
                title="Client problématique"
              >
                🚫
              </span>
            </div>
          </div>

          <!-- Date et montant -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-[var(--color-text-muted)] mb-1">Date</p>
              <p class="text-sm text-[var(--color-text-secondary)]">{{ formatOrderDate(order.createdAt) }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-[var(--color-text-muted)] mb-1">Montant</p>
              <p class="text-lg font-bold text-[var(--color-neon-green)]">{{ order.total?.toFixed(2) }}€</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  orderStats: {
    type: Object,
    required: true
  },
  orderFilter: {
    type: String,
    required: true
  },
  filteredOrders: {
    type: Array,
    required: true
  },
  loadingOrders: {
    type: Boolean,
    default: false
  },
  showArchived: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-filter', 'select-order', 'toggle-archived'])

function truncateName(name, maxLength = 20) {
  if (!name) return '-'
  if (name.length <= maxLength) return name
  return name.substring(0, maxLength) + '...'
}

function getStatusLabel(status) {
  const labels = {
    pending: 'En attente',
    paid: 'Payée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

function formatOrderDate(timestamp) {
  if (!timestamp) return '-'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} à ${hours}:${minutes}`
}
</script>

<style scoped>
.filter-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid rgba(57, 255, 20, 0.3);
  border-radius: 8px;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: rgba(57, 255, 20, 0.5);
  color: var(--color-neon-green);
  background: rgba(57, 255, 20, 0.05);
}

.filter-btn.active {
  background: rgba(57, 255, 20, 0.15);
  border-color: var(--color-neon-green);
  color: var(--color-neon-green);
  font-weight: 700;
  box-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
}
</style>
