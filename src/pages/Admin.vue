import { useRefunds } from '../composables/useRefunds'
// Refunds management
const {
  refunds,
  loading: loadingRefunds,
  loadRefunds,
  updateRefundStatus,
  addRefundNote,
  deleteRefund,
  refundStats: _refundStats
} = useRefunds() || {}

const refundStats = _refundStats || { total: 0, requested: 0, approved: 0, rejected: 0, processed: 0 }
const refundFilter = ref('all')
const selectedRefund = ref(null)
const refundNoteInput = ref('')
const refundStatusInput = ref('requested')
const filteredRefunds = computed(() => {
  if (refundFilter.value === 'all') return refunds.value
  return refunds.value.filter(r => r.status === refundFilter.value)
})
const getRefundStatusLabel = (status) => {
  const labels = {
    requested: 'Demandé',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    processed: 'Traité'
  }
  return labels[status] || status
}
const selectRefund = (refund) => {
  selectedRefund.value = refund
  refundNoteInput.value = refund.notes || ''
  refundStatusInput.value = refund.status
  if (refund.orderId) {
    linkedOrder.value = orders.value.find(o => o.id === refund.orderId) || null
  } else {
    linkedOrder.value = null
  }
}
const handleUpdateRefundStatus = async (refundId, newStatus) => {
  const result = await updateRefundStatus(refundId, newStatus)
  if (result.success) {
    selectedRefund.value.status = newStatus
  } else {
    alert('Erreur lors de la mise à jour du statut')
  }
}
const handleUpdateRefundNote = async (refundId, note) => {
  const result = await addRefundNote(refundId, note)
  if (!result.success) {
    alert('Erreur lors de la mise à jour de la note')
  }
}
const handleDeleteRefund = async (refundId) => {
  if (!confirm('Supprimer ce remboursement ?')) return
  const result = await deleteRefund(refundId)
  if (!result.success) {
    alert('Erreur lors de la suppression')
  }
}
const linkedOrder = ref(null)
onMounted(() => {
  loadRefunds()
})
<template>
  <div class="min-h-screen py-20">
    <!-- Admin Dashboard -->
    <div v-if="adminStore.isAuthenticated || activeTab === 'security'" class="container max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-4xl font-bold">
          <span class="text-gradient">Admin Panel</span>
        </h1>
        <div class="flex gap-3">
          <button 
            v-if="failedAttempts > 0" 
            @click="resetFailedAttempts" 
            class="btn btn-ghost text-sm relative"
            title="Réinitialiser les tentatives échouées"
          >
            🔓 Reset sécurité
            <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              {{ failedAttempts }}
            </span>
          </button>
          <button @click="adminStore.logout" class="btn btn-ghost">
            Déconnexion
          </button>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="sticky top-20 z-40 bg-[var(--color-background)] py-4 mb-8 border-b border-[rgba(57,255,20,0.2)] backdrop-blur-md bg-opacity-95">
        <div class="flex gap-2 overflow-x-auto">
        <button :class="['tab-btn', { active: activeTab === 'products' }]" @click="activeTab = 'products'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
          Produits
        </button>
        <button :class="['tab-btn', { active: activeTab === 'content' }]" @click="activeTab = 'content'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Contenu
        </button>
        <button :class="['tab-btn', { active: activeTab === 'orders' }]" @click="activeTab = 'orders'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Commandes
          <span v-if="orderStats.pending > 0" class="intrusion-badge">{{ orderStats.pending }}</span>
        </button>
        <button :class="['tab-btn', { active: activeTab === 'refunds' }]" @click="activeTab = 'refunds'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 19c.88 0 1.75-.39 2.36-1.09l6.36-7.09A2 2 0 0 0 19.36 8H4.64a2 2 0 0 0-1.36 3.82l6.36 7.09A3.001 3.001 0 0 0 12 19z"></path>
          </svg>
          Remboursements
          <span v-if="refundStats && refundStats.requested > 0" class="intrusion-badge">{{ refundStats.requested }}</span>
        </button>
        <button :class="['tab-btn', { active: activeTab === 'messages' }]" @click="activeTab = 'messages'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Messages
          <span v-if="unreadMessages > 0" class="intrusion-badge">{{ unreadMessages }}</span>
        </button>
        <button :class="['tab-btn', { active: activeTab === 'security' }]" @click="activeTab = 'security'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Sécurité
        </button>
        <span v-if="honeypotLogs.length > 0" class="ml-auto flex items-center text-red-500 text-xl" title="Tentatives d'intrusion">
          🍯
        </span>
        </div>
      </div>
      
      <!-- Onglet Remboursements -->
      <div v-show="activeTab === 'refunds'" class="refunds-tab">
        <h2 class="text-2xl font-bold mb-6 text-white">Gestion des Remboursements</h2>
        <!-- Statistiques -->
        <div class="flex gap-4 mb-6">
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
            <button @click="refundFilter = 'all'" :class="['filter-btn', { active: refundFilter === 'all' }]">Tous</button>
            <button @click="refundFilter = 'requested'" :class="['filter-btn', { active: refundFilter === 'requested' }]">Demandés</button>
            <button @click="refundFilter = 'approved'" :class="['filter-btn', { active: refundFilter === 'approved' }]">Approuvés</button>
            <button @click="refundFilter = 'rejected'" :class="['filter-btn', { active: refundFilter === 'rejected' }]">Rejetés</button>
            <button @click="refundFilter = 'processed'" :class="['filter-btn', { active: refundFilter === 'processed' }]">Traités</button>
          </div>
        </div>
        <!-- Liste des remboursements -->
        <div v-if="loadingRefunds" class="text-center py-8 text-[var(--color-text-secondary)]">Chargement des remboursements...</div>
        <div v-else>
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
                <!-- ...existing code for refund rows... -->
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Modal détail remboursement -->
        <!-- Modal détail remboursement -->
        <div v-if="selectedRefund" class="modal-overlay">
          <div class="modal">
            <h3 class="text-xl font-bold mb-4">Détail du remboursement</h3>
            <div class="mb-2"><b>ID:</b> {{ selectedRefund.id }}</div>
            <div class="mb-2"><b>Statut:</b> <span :class="['badge', 'badge-' + selectedRefund.status]">{{ getRefundStatusLabel(selectedRefund.status) }}</span></div>
            <div class="mb-2"><b>Montant:</b> {{ selectedRefund.amount ? selectedRefund.amount.toFixed(2) : '-' }}€</div>
            <div class="mb-2"><b>Date:</b> {{ formatOrderDate(selectedRefund.createdAt) }}</div>
            <div class="mb-2"><b>Commande liée:</b> <span v-if="selectedRefund.orderId">#{{ selectedRefund.orderId }}</span><span v-else>-</span></div>
            <div v-if="linkedOrder" class="mb-2 p-2 bg-[rgba(57,255,20,0.05)] rounded">
              <div><b>Client:</b> {{ linkedOrder.customerName || '-' }}</div>
              <div><b>Email:</b> {{ linkedOrder.customerEmail || '-' }}</div>
              <div><b>Montant commande:</b> {{ linkedOrder.total ? linkedOrder.total.toFixed(2) : '-' }}€</div>
              <div><b>Statut commande:</b> {{ getStatusLabel(linkedOrder.status) }}</div>
            </div>
            <div class="mb-2"><b>Motif:</b> {{ selectedRefund.reason || '-' }}</div>
            <div class="mb-2"><b>Note admin:</b>
              <textarea v-model="refundNoteInput" class="form-input w-full" rows="2"></textarea>
              <button class="btn btn-xs btn-primary mt-2" @click="handleUpdateRefundNote(selectedRefund.id, refundNoteInput)">Enregistrer la note</button>
            </div>
            <div class="mb-2">
              <b>Changer le statut:</b>
              <select v-model="refundStatusInput" class="form-input">
                <option value="requested">Demandé</option>
                <option value="approved">Approuvé</option>
                <option value="rejected">Rejeté</option>
                <option value="processed">Traité</option>
              </select>
              <button class="btn btn-xs btn-primary ml-2" @click="handleUpdateRefundStatus(selectedRefund.id, refundStatusInput)">Mettre à jour</button>
            </div>
            <div class="flex justify-end mt-4">
              <button class="btn btn-secondary" @click="selectedRefund = null">Fermer</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Tab -->
      <ProductsTab 
        v-if="activeTab === 'products'" 
        :products="products"
        @update-product="updateProduct"
        @open-image-modal="openImageModal"
      />

      <!-- Content Tab -->
      <ContentTab
        v-if="activeTab === 'content' && siteContent"
        :siteContent="siteContent"
        :easterEggsList="easterEggsList"
        @auto-save="autoSaveContent"
        @update-easter-egg="updateEasterEgg"
      />

      <!-- Security Tab -->
      <SecurityTab
        v-show="activeTab === 'security'"
        :honeypotLogs="honeypotLogs"
        :sortedHoneypotLogs="sortedHoneypotLogs"
        :loadingLogs="loadingLogs"
        :isAuthenticated="adminStore.isAuthenticated"
        :loginData="{ email, password, showCaptcha, captchaQuestion, captchaAnswer, isBlocked, blockRemainingTime, failedAttempts, loginError }"
        :passwordForm="passwordForm"
        :passwordMessage="passwordMessage"
        @delete-log="deleteLog"
        @clear-honeypot-logs="clearHoneypotLogs"
        @handle-login="handleLogin"
        @update-login-field="(field, value) => { if (field === 'email') email = value; else if (field === 'password') password = value; else if (field === 'captchaAnswer') captchaAnswer = value; }"
        @handle-change-password="handleChangePassword"
        @update-password-field="(field, value) => passwordForm[field] = value"
      />

      <!-- Intrusions Tab -->
      <div v-show="activeTab === 'intrusions'">
        <div class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gradient">🍯 Tentatives d'intrusion</h2>
            <button 
              v-if="honeypotLogs.length > 0"
              @click="clearHoneypotLogs" 
              class="btn btn-ghost text-sm"
            >
              Effacer tout
            </button>
          </div>

          <div v-if="loadingLogs" class="text-center py-8 text-[var(--color-text-secondary)]">
            Chargement des logs...
          </div>

          <div v-else-if="honeypotLogs.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 mx-auto mb-4 text-[var(--color-text-secondary)] opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <p class="text-[var(--color-text-secondary)]">Aucune tentative d'intrusion détectée</p>
            <p class="text-sm text-[var(--color-text-secondary)] mt-2">Le honeypot est actif sur /admin</p>
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="log in sortedHoneypotLogs" 
              :key="log.id"
              class="p-4 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg hover:border-[var(--color-neon-green)] transition-colors"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="text-[var(--color-neon-green)] font-mono text-sm">
                      {{ log.email }}
                    </span>
                    <span class="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                      Tentative #{{ log.attemptNumber }}
                    </span>
                  </div>
                  <div class="text-sm text-[var(--color-text-secondary)] space-y-1">
                    <div class="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      <span>Mot de passe: {{ log.password }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>{{ formatDate(log.timestamp) }}</span>
                    </div>
                    <div class="text-xs opacity-70 truncate">
                      {{ log.userAgent }}
                    </div>
                  </div>
                </div>
                <button 
                  @click="deleteLog(log.id)"
                  class="text-red-400 hover:text-red-300 transition-colors"
                  title="Supprimer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div v-if="honeypotLogs.length > 0" class="mt-6 p-4 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-[var(--color-neon-green)]">{{ honeypotLogs.length }}</div>
                <div class="text-xs text-[var(--color-text-secondary)]">Tentatives totales</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-[var(--color-neon-green)]">{{ uniqueEmails }}</div>
                <div class="text-xs text-[var(--color-text-secondary)]">Emails uniques</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-[var(--color-neon-green)]">{{ todayAttempts }}</div>
                <div class="text-xs text-[var(--color-text-secondary)]">Aujourd'hui</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-[var(--color-neon-green)]">{{ lastAttemptTime }}</div>
                <div class="text-xs text-[var(--color-text-secondary)]">Dernière tentative</div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- Orders Tab -->
      <OrdersTab
        v-show="activeTab === 'orders'"
        :orderStats="orderStats"
        :orderFilter="orderFilter"
        :filteredOrders="filteredOrders"
        :loadingOrders="loadingOrders"
        @update-filter="value => orderFilter = value"
        @select-order="order => selectedOrder = order"
      />

      <!-- Order Detail Modal -->
      <teleport to="body">
        <transition name="modal-fade">
          <div 
            v-if="selectedOrder" 
            class="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            @click="selectedOrder = null"
          >
            <div 
              class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto"
              @click.stop
            >
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gradient">
                  Commande {{ selectedOrder.orderId }}
                </h2>
                <button 
                  @click="selectedOrder = null"
                  class="w-10 h-10 flex items-center justify-center border border-[rgba(57,255,20,0.2)] rounded-lg text-[var(--color-text-secondary)] hover:border-[var(--color-neon-green)] hover:text-[var(--color-neon-green)] transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <!-- Informations client -->
                <div class="p-6 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg">
                  <h3 class="text-lg font-bold text-white mb-4">👤 Client</h3>
                  <div class="space-y-2 text-sm">
                    <p><strong>Nom:</strong> {{ selectedOrder.customer?.firstName }} {{ selectedOrder.customer?.lastName }}</p>
                    <p><strong>Email:</strong> {{ selectedOrder.customer?.email }}</p>
                    <p><strong>Téléphone:</strong> {{ selectedOrder.customer?.phone || '-' }}</p>
                  </div>
                </div>

                <!-- Informations livraison -->
                <div class="p-6 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg">
                  <h3 class="text-lg font-bold text-white mb-4">📦 Livraison</h3>
                  <div class="space-y-2 text-sm">
                    <p><strong>Adresse:</strong> {{ selectedOrder.shipping?.address }}</p>
                    <p><strong>Ville:</strong> {{ selectedOrder.shipping?.city }} {{ selectedOrder.shipping?.postalCode }}</p>
                    <p><strong>Pays:</strong> {{ selectedOrder.shipping?.country }}</p>
                    <p><strong>Méthode:</strong> {{ selectedOrder.shipping?.method }}</p>
                    <p v-if="selectedOrder.shipping?.trackingNumber">
                      <strong>Tracking:</strong> {{ selectedOrder.shipping.trackingNumber }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Produits commandés -->
              <div class="mb-6 p-6 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg">
                <h3 class="text-lg font-bold text-white mb-4">🛍️ Produits</h3>
                <div class="space-y-3">
                  <div 
                    v-for="(item, index) in selectedOrder.items" 
                    :key="index"
                    class="flex justify-between items-center p-3 bg-black/30 rounded"
                  >
                    <div>
                      <p class="font-semibold text-white">{{ item.name }}</p>
                      <p class="text-sm text-[var(--color-text-secondary)]">
                        Taille: {{ item.size }} | Quantité: {{ item.quantity }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-[var(--color-neon-green)]">{{ item.total?.toFixed(2) }}€</p>
                      <p class="text-xs text-[var(--color-text-secondary)]">{{ item.price?.toFixed(2) }}€ / unité</p>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t border-[rgba(57,255,20,0.2)] space-y-2">
                  <div class="flex justify-between text-sm">
                    <span>Sous-total:</span>
                    <span>{{ selectedOrder.subtotal?.toFixed(2) }}€</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span>Livraison:</span>
                    <span>{{ selectedOrder.shippingCost?.toFixed(2) }}€</span>
                  </div>
                  <div class="flex justify-between text-lg font-bold text-[var(--color-neon-green)]">
                    <span>Total:</span>
                    <span>{{ selectedOrder.total?.toFixed(2) }}€</span>
                  </div>
                </div>
              </div>

              <!-- Actions admin -->
              <div class="p-6 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg">
                <h3 class="text-lg font-bold text-white mb-4">⚙️ Actions</h3>
                
                <!-- Changer statut -->
                <div class="mb-4">
                  <label class="block text-sm font-semibold text-white mb-2">Statut de la commande</label>
                  <select 
                    v-model="selectedOrder.status"
                    @change="handleStatusChange(selectedOrder.id, selectedOrder.status)"
                    class="form-input w-full"
                  >
                    <option value="pending">En attente</option>
                    <option value="paid">Payée</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </div>

                <!-- Ajouter tracking -->
                <div v-if="selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered'" class="mb-4">
                  <label class="block text-sm font-semibold text-white mb-2">Numéro de suivi</label>
                  <div class="flex gap-2">
                    <input 
                      v-model="trackingInput"
                      type="text"
                      placeholder="FR123456789"
                      class="form-input flex-1"
                    >
                    <button 
                      @click="handleAddTracking(selectedOrder.id)"
                      class="btn btn-primary"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                <!-- Notes internes -->
                <div>
                  <label class="block text-sm font-semibold text-white mb-2">Notes internes</label>
                  <textarea 
                    v-model="selectedOrder.notes"
                    @blur="handleUpdateNote(selectedOrder.id, selectedOrder.notes)"
                    rows="3"
                    placeholder="Notes pour l'équipe..."
                    class="form-input w-full"
                  ></textarea>
                </div>
              </div>

              <!-- Danger zone -->
              <div class="mt-6 p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
                <h3 class="text-lg font-bold text-red-400 mb-4">⚠️ Zone dangereuse</h3>
                <button 
                  @click="handleDeleteOrder(selectedOrder.id)"
                  class="btn btn-danger"
                >
                  Supprimer la commande
                </button>
                <p class="text-xs text-red-400 mt-2">Cette action est irréversible !</p>
              </div>
            </div>
          </div>
        </transition>
      </teleport>

      <!-- Messages Tab -->
      <MessagesTab
        v-show="activeTab === 'messages'"
        :contactMessages="contactMessages"
        :unreadMessages="unreadMessages"
        :loadingMessages="loadingMessages"
        @toggle-message-status="toggleMessageStatus"
        @delete-message="deleteMessage"
      />
    </div>

    <!-- Image Upload Modal -->
    <teleport to="body">
      <transition name="modal-fade">
        <div 
          v-if="showImageModal" 
          class="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          @click="closeImageModal"
        >
          <div 
            class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gradient">
                Modifier les images - {{ selectedProduct?.name }}
              </h2>
              <button 
                @click="closeImageModal"
                class="w-10 h-10 flex items-center justify-center border border-[rgba(57,255,20,0.2)] rounded-lg text-[var(--color-text-secondary)] hover:border-[var(--color-neon-green)] hover:text-[var(--color-neon-green)] transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Current Images -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4 text-white">Images actuelles :</h3>
              <div class="grid grid-cols-3 gap-4">
                <div 
                  v-for="(image, idx) in selectedProduct?.images" 
                  :key="idx"
                  class="relative aspect-square rounded-lg overflow-hidden border-2 border-[rgba(57,255,20,0.2)] group"
                >
                  <img 
                    :src="image" 
                    :alt="`Image ${idx + 1}`"
                    class="w-full h-full object-cover"
                  >
                  <div class="absolute bottom-2 left-2 right-2 flex gap-2">
                    <button 
                      @click="removeImage(idx)"
                      class="flex-1 bg-red-500/90 hover:bg-red-500 text-white text-xs py-1 px-2 rounded transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Upload New Image -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4 text-white">Ajouter une nouvelle image :</h3>
              
              <div class="border-2 border-dashed border-[rgba(57,255,20,0.3)] rounded-xl p-8 text-center hover:border-[var(--color-neon-green)] transition-colors cursor-pointer">
                <input 
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden"
                >
                <button 
                  @click="$refs.fileInput.click()"
                  class="btn btn-secondary"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Choisir une image
                </button>
                <p class="text-sm text-[var(--color-text-secondary)] mt-4">
                  Formats acceptés : JPG, PNG, WebP
                </p>
              </div>

              <!-- Preview -->
              <div v-if="newImagePreview" class="mt-4">
                <img 
                  :src="newImagePreview" 
                  alt="Aperçu"
                  class="max-w-full h-48 object-contain mx-auto rounded-lg border border-[rgba(57,255,20,0.2)]"
                >
                <button 
                  @click="confirmImageUpload"
                  class="btn btn-primary w-full mt-4"
                >
                  Confirmer l'ajout
                </button>
              </div>
            </div>

            <!-- URL Method (alternative) -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-white">Ou ajouter par URL :</h3>
              <div class="flex gap-2">
                <input 
                  v-model="imageUrl"
                  type="url"
                  class="form-input flex-1"
                  placeholder="https://exemple.com/image.jpg"
                >
                <button 
                  @click="addImageByUrl"
                  class="btn btn-primary whitespace-nowrap"
                >
                  Ajouter
                </button>
              </div>
            </div>

            <div class="mt-6 p-4 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg">
              <p class="text-sm text-[var(--color-text-secondary)]">
                <strong class="text-[var(--color-neon-green)]">💡 Astuce :</strong> 
                Les changements sont enregistrés automatiquement dans le localStorage. 
                Pour une solution permanente, contactez votre développeur.
              </p>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
// Sauvegarde automatique champ par champ pour le contenu home/contact
function autoSaveContent(section, key, value) {
  const data = {}
  data[section] = { ...siteContent.value[section], [key]: value }
  updateSiteContent(data)
}
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import { useProducts } from '../composables/useProducts'
import { useSiteContent } from '../composables/useSiteContent'
import { useEasterEggsFirestore } from '../composables/useEasterEggsFirestore'
import { useOrders } from '../composables/useOrders'
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

// Composants admin tabs
import ProductsTab from '../components/admin/ProductsTab.vue'
import ContentTab from '../components/admin/ContentTab.vue'
import OrdersTab from '../components/admin/OrdersTab.vue'
import RefundsTab from '../components/admin/RefundsTab.vue'
import MessagesTab from '../components/admin/MessagesTab.vue'
import SecurityTab from '../components/admin/SecurityTab.vue'

const adminStore = useAdminStore()
const { products, loadProducts, updateProduct } = useProducts()
const { siteContent, loadSiteContent, updateSiteContent } = useSiteContent()

// Easter Eggs from Firestore
const { easterEggs, loadEasterEggs, updateEasterEgg } = useEasterEggsFirestore()
const easterEggsList = easterEggs

// Orders from Firestore
const { 
  orders, 
  loading: loadingOrders, 
  loadOrders, 
  updateOrderStatus, 
  addTrackingNumber, 
  addOrderNote,
  deleteOrder,
  orderStats 
} = useOrders()


const email = ref('')
const password = ref('')
const loginError = ref(false)
const activeTab = ref(adminStore.isAuthenticated ? 'products' : 'security')

// Password change form
const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})
const passwordMessage = ref({
  type: '',
  text: ''
})

// Rate limiting / Anti-bot
const failedAttempts = ref(0)
const isBlocked = ref(false)
const blockUntil = ref(null)
const blockRemainingTime = ref('')
const showCaptcha = ref(false)
const captchaAnswer = ref('')
const captchaQuestion = ref({ num1: 0, num2: 0, answer: 0 })

const showImageModal = ref(false)
const selectedProduct = ref(null)
const newImagePreview = ref(null)
const newImageFile = ref(null)
const imageUrl = ref('')

// Honeypot logs
const honeypotLogs = ref([])
const loadingLogs = ref(false)

// Contact messages
const contactMessages = ref([])
const loadingMessages = ref(false)
const unreadMessages = computed(() => {
  return contactMessages.value.filter(msg => msg.status === 'unread').length
})

// Orders management
const orderFilter = ref('all')
const selectedOrder = ref(null)
const trackingInput = ref('')

const filteredOrders = computed(() => {
  if (orderFilter.value === 'all') {
    return orders.value
  }
  return orders.value.filter(order => order.status === orderFilter.value)
})

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    paid: 'Payée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

const formatOrderDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const handleStatusChange = async (orderId, newStatus) => {
  const result = await updateOrderStatus(orderId, newStatus)
  if (result.success) {
    console.log('✅ Statut mis à jour')
  } else {
    console.error('❌ Erreur mise à jour statut:', result.error)
    alert('Erreur lors de la mise à jour du statut')
  }
}

const handleAddTracking = async (orderId) => {
  if (!trackingInput.value.trim()) {
    alert('Veuillez entrer un numéro de suivi')
    return
  }
  
  const result = await addTrackingNumber(orderId, trackingInput.value.trim())
  if (result.success) {
    console.log('✅ Tracking ajouté')
    trackingInput.value = ''
  } else {
    console.error('❌ Erreur ajout tracking:', result.error)
    alert('Erreur lors de l\'ajout du numéro de suivi')
  }
}

const handleUpdateNote = async (orderId, note) => {
  const result = await addOrderNote(orderId, note)
  if (result.success) {
    console.log('✅ Note mise à jour')
  }
}

const handleDeleteOrder = async (orderId) => {
  if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible !')) {
    return
  }
  
  const result = await deleteOrder(orderId)
  if (result.success) {
    console.log('✅ Commande supprimée')
    selectedOrder.value = null
  } else {
    console.error('❌ Erreur suppression:', result.error)
    alert('Erreur lors de la suppression de la commande')
  }
}

onMounted(async () => {
  await adminStore.initAuth()
  if (!adminStore.isAuthenticated) {
    activeTab.value = 'security'
  }
  await loadProducts()
  await loadSiteContent()
  await loadEasterEggs()
  loadHoneypotLogs()
  loadContactMessages()
  loadOrders()
  checkBlockStatus()
  loadFailedAttempts()
})

// Load contact messages with real-time updates
const loadContactMessages = () => {
  loadingMessages.value = true
  const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'))
  
  onSnapshot(q, (snapshot) => {
    contactMessages.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    loadingMessages.value = false
  }, (error) => {
    console.error('Erreur chargement messages:', error)
    loadingMessages.value = false
  })
}

// Load failed attempts from localStorage
const loadFailedAttempts = () => {
  const stored = localStorage.getItem('admin_failed_attempts')
  if (stored) {
    const data = JSON.parse(stored)
    failedAttempts.value = data.count || 0
    blockUntil.value = data.blockUntil ? new Date(data.blockUntil) : null
  }
}

// Save failed attempts to localStorage
const saveFailedAttempts = () => {
  localStorage.setItem('admin_failed_attempts', JSON.stringify({
    count: failedAttempts.value,
    blockUntil: blockUntil.value ? blockUntil.value.toISOString() : null
  }))
}

// Check if user is currently blocked
const checkBlockStatus = () => {
  if (blockUntil.value) {
    const now = new Date()
    if (now < blockUntil.value) {
      isBlocked.value = true
      updateBlockTimer()
    } else {
      // Block expired
      isBlocked.value = false
      blockUntil.value = null
      // Reduce attempts after block expires
      failedAttempts.value = Math.max(0, failedAttempts.value - 2)
      saveFailedAttempts()
    }
  }
}

// Update remaining block time
const updateBlockTimer = () => {
  if (!blockUntil.value) return
  
  const interval = setInterval(() => {
    const now = new Date()
    const diff = blockUntil.value - now
    
    if (diff <= 0) {
      isBlocked.value = false
      blockUntil.value = null
      blockRemainingTime.value = ''
      clearInterval(interval)
      // Reduce attempts after block
      failedAttempts.value = Math.max(0, failedAttempts.value - 2)
      saveFailedAttempts()
    } else {
      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      blockRemainingTime.value = minutes > 0 
        ? `${minutes}m ${seconds}s` 
        : `${seconds}s`
    }
  }, 1000)
}

// Calculate block duration based on failed attempts
const getBlockDuration = (attempts) => {
  if (attempts >= 10) return 30 * 60 * 1000 // 30 minutes
  if (attempts >= 6) return 5 * 60 * 1000   // 5 minutes
  if (attempts >= 3) return 30 * 1000        // 30 seconds
  return 0
}

// Generate simple math captcha
const generateCaptcha = () => {
  captchaQuestion.value.num1 = Math.floor(Math.random() * 10) + 1
  captchaQuestion.value.num2 = Math.floor(Math.random() * 10) + 1
  captchaQuestion.value.answer = captchaQuestion.value.num1 + captchaQuestion.value.num2
  captchaAnswer.value = ''
}

// Verify captcha
const verifyCaptcha = () => {
  return parseInt(captchaAnswer.value) === captchaQuestion.value.answer
}

// Reset failed attempts (only accessible when logged in)
const resetFailedAttempts = () => {
  if (confirm('Réinitialiser les tentatives échouées et débloquer le compte ?')) {
    failedAttempts.value = 0
    isBlocked.value = false
    blockUntil.value = null
    showCaptcha.value = false
    blockRemainingTime.value = ''
    localStorage.removeItem('admin_failed_attempts')
    console.log('✅ Tentatives réinitialisées')
  }
}

// Load honeypot logs with real-time updates
const loadHoneypotLogs = () => {
  loadingLogs.value = true
  const q = query(collection(db, 'honeypot_logs'), orderBy('timestamp', 'desc'))
  
  onSnapshot(q, (snapshot) => {
    honeypotLogs.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    loadingLogs.value = false
  }, (error) => {
    console.error('Erreur chargement logs honeypot:', error)
    loadingLogs.value = false
  })
}

// Sorted logs (most recent first)
const sortedHoneypotLogs = computed(() => {
  return [...honeypotLogs.value].sort((a, b) => {
    const timeA = a.timestamp?.toMillis() || 0
    const timeB = b.timestamp?.toMillis() || 0
    return timeB - timeA
  })
})

// Stats
const uniqueEmails = computed(() => {
  const emails = new Set(honeypotLogs.value.map(log => log.email))
  return emails.size
})

const todayAttempts = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return honeypotLogs.value.filter(log => {
    const logDate = log.timestamp?.toDate()
    return logDate && logDate >= today
  }).length
})

const lastAttemptTime = computed(() => {
  if (honeypotLogs.value.length === 0) return '-'
  const lastLog = sortedHoneypotLogs.value[0]
  if (!lastLog.timestamp) return '-'
  
  const now = new Date()
  const logTime = lastLog.timestamp.toDate()
  const diffMs = now - logTime
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'À l\'instant'
  if (diffMins < 60) return `${diffMins}min`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}j`
})

// Format date for display
const formatDate = (timestamp) => {
  if (!timestamp) return 'Date inconnue'
  const date = timestamp.toDate()
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'medium'
  }).format(date)
}

// Delete single log
const deleteLog = async (logId) => {
  if (!confirm('Supprimer cette tentative ?')) return
  try {
    await deleteDoc(doc(db, 'honeypot_logs', logId))
    console.log('✅ Log supprimé')
  } catch (error) {
    console.error('Erreur suppression log:', error)
    alert('Erreur lors de la suppression')
  }
}

// Clear all logs
const clearHoneypotLogs = async () => {
  if (!confirm(`Supprimer toutes les ${honeypotLogs.value.length} tentatives d'intrusion ?`)) return
  
  try {
    const q = query(collection(db, 'honeypot_logs'))
    const snapshot = await getDocs(q)
    
    const deletePromises = snapshot.docs.map(docSnapshot => 
      deleteDoc(doc(db, 'honeypot_logs', docSnapshot.id))
    )
    
    await Promise.all(deletePromises)
    console.log('✅ Tous les logs honeypot supprimés')
  } catch (error) {
    console.error('Erreur suppression logs:', error)
    alert('Erreur lors de la suppression')
  }
}

// Mark message as read/unread
const toggleMessageStatus = async (messageId, currentStatus) => {
  try {
    const newStatus = currentStatus === 'read' ? 'unread' : 'read'
    await updateDoc(doc(db, 'messages', messageId), { status: newStatus })
    console.log(`✅ Message ${newStatus}`)
  } catch (error) {
    console.error('Erreur mise à jour statut:', error)
  }
}

// Delete message
const deleteMessage = async (messageId) => {
  if (!confirm('Supprimer ce message ?')) return
  try {
    await deleteDoc(doc(db, 'messages', messageId))
    console.log('✅ Message supprimé')
  } catch (error) {
    console.error('Erreur suppression message:', error)
    alert('Erreur lors de la suppression')
  }
}

const saveProducts = async () => {
  // Les produits sont déjà sauvegardés via updateProduct()
  console.log('✅ Produits sauvegardés')
}

const saveSiteContent = async () => {
  const success = await updateSiteContent(siteContent.value)
  if (success) {
    alert('Contenu sauvegardé avec succès !')
  } else {
    alert('Erreur lors de la sauvegarde')
  }
}

const incrementPrice = async (product) => {
  product.price += 1
  await updateProduct(product.slug, { price: product.price })
}

const decrementPrice = async (product) => {
  if (product.price > 1) {
    product.price -= 1
    await updateProduct(product.slug, { price: product.price })
  }
}

const handleLogin = async () => {
  loginError.value = false

  // Check if blocked
  if (isBlocked.value) {
    loginError.value = true
    return
  }

  // Check captcha if needed
  if (showCaptcha.value) {
    if (!verifyCaptcha()) {
      adminStore.error = 'Captcha incorrect'
      loginError.value = true
      generateCaptcha() // New captcha
      return
    }
  }

  // Attempt login
  const success = await adminStore.login(email.value, password.value)
  
  if (success) {
    // Reset on successful login
    failedAttempts.value = 0
    isBlocked.value = false
    blockUntil.value = null
    showCaptcha.value = false
    saveFailedAttempts()
  } else {
    // Increment failed attempts
    failedAttempts.value++
    loginError.value = true
    saveFailedAttempts()

    // Show captcha after 2 failed attempts
    if (failedAttempts.value >= 2) {
      showCaptcha.value = true
      generateCaptcha()
    }

    // Block after thresholds
    const blockDuration = getBlockDuration(failedAttempts.value)
    if (blockDuration > 0) {
      isBlocked.value = true
      blockUntil.value = new Date(Date.now() + blockDuration)
      saveFailedAttempts()
      updateBlockTimer()
      
      // Custom error message based on block level
      if (failedAttempts.value >= 10) {
        adminStore.error = 'Trop de tentatives. Compte bloqué 30 minutes.'
      } else if (failedAttempts.value >= 6) {
        adminStore.error = 'Trop de tentatives. Compte bloqué 5 minutes.'
      } else if (failedAttempts.value >= 3) {
        adminStore.error = 'Trop de tentatives. Compte bloqué 30 secondes.'
      }
    }
  }
}

const handleChangePassword = async () => {
  // Reset messages
  passwordMessage.value = { type: '', text: '' }

  // Validation
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    passwordMessage.value = {
      type: 'error',
      text: 'Les deux mots de passe ne correspondent pas'
    }
    return
  }

  if (passwordForm.value.new.length < 6) {
    passwordMessage.value = {
      type: 'error',
      text: 'Le mot de passe doit contenir au moins 6 caractères'
    }
    return
  }

  // Attempt password change
  const result = await adminStore.changePassword(
    passwordForm.value.current,
    passwordForm.value.new
  )

  if (result.success) {
    passwordMessage.value = {
      type: 'success',
      text: result.message
    }
    // Reset form
    passwordForm.value = { current: '', new: '', confirm: '' }
  } else {
    passwordMessage.value = {
      type: 'error',
      text: result.message
    }
  }
}

const openImageModal = (product) => {
  selectedProduct.value = { ...product }
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  selectedProduct.value = null
  newImagePreview.value = null
  newImageFile.value = null
  imageUrl.value = ''
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    newImageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      newImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const confirmImageUpload = async () => {
  if (newImagePreview.value && selectedProduct.value) {
    // Add the base64 image to the product
    const productIndex = products.value.findIndex(p => p.id === selectedProduct.value.id)
    if (productIndex !== -1) {
      const updatedImages = [...products.value[productIndex].images, newImagePreview.value]
      await updateProduct(products.value[productIndex].slug, { images: updatedImages })
      
      products.value[productIndex].images.push(newImagePreview.value)
      selectedProduct.value.images.push(newImagePreview.value)
      
      // Reset
      newImagePreview.value = null
      newImageFile.value = null
    }
  }
}

const addImageByUrl = async () => {
  if (imageUrl.value && selectedProduct.value) {
    const productIndex = products.value.findIndex(p => p.id === selectedProduct.value.id)
    if (productIndex !== -1) {
      const updatedImages = [...products.value[productIndex].images, imageUrl.value]
      await updateProduct(products.value[productIndex].slug, { images: updatedImages })
      
      products.value[productIndex].images.push(imageUrl.value)
      selectedProduct.value.images.push(imageUrl.value)
      imageUrl.value = ''
    }
  }
}

const removeImage = async (imageIndex) => {
  if (selectedProduct.value && confirm('Supprimer cette image ?')) {
    const productIndex = products.value.findIndex(p => p.id === selectedProduct.value.id)
    if (productIndex !== -1) {
      const updatedImages = [...products.value[productIndex].images]
      updatedImages.splice(imageIndex, 1)
      await updateProduct(products.value[productIndex].slug, { images: updatedImages })
      
      products.value[productIndex].images.splice(imageIndex, 1)
      selectedProduct.value.images.splice(imageIndex, 1)
    }
  }
}
</script>

<style scoped>
/* Tabs */
.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: var(--color-neon-green);
}

.tab-btn.active {
  color: var(--color-neon-green);
  border-bottom-color: var(--color-neon-green);
}

.intrusion-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: var(--color-neon-green);
  color: var(--color-background);
  font-size: 11px;
  font-weight: 700;
  border-radius: 10px;
  animation: pulse-badge 2s infinite;
}

/* Sticky tabs bar */
.sticky {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

@keyframes pulse-badge {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(57, 255, 20, 0.7);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(57, 255, 20, 0);
  }
}

/* Content Cards */
.content-card {
  padding: 24px;
  background: var(--color-black-light);
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.content-card:hover {
  border-color: rgba(57, 255, 20, 0.4);
}

/* Remove number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Price Control Buttons (compact version) */
.price-control-btn-compact {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  padding: 0 8px;
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(42, 42, 42, 0.6));
  border: 1px solid rgba(57, 255, 20, 0.3);
  border-radius: 8px;
  color: var(--color-neon-green);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.price-control-btn-compact:hover:not(:disabled) {
  border-color: var(--color-neon-green);
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(57, 255, 20, 0.3);
}

.price-control-btn-compact:active:not(:disabled) {
  transform: scale(0.95);
}

.price-control-btn-compact:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: rgba(57, 255, 20, 0.1);
}

.price-control-btn-compact svg {
  filter: drop-shadow(0 0 3px rgba(57, 255, 20, 0.5));
}

/* Price Control Buttons (original size - kept for modal if needed) */
.price-control-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  padding: 0 20px;
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(42, 42, 42, 0.6));
  border: 1px solid rgba(57, 255, 20, 0.3);
  border-radius: 12px;
  color: var(--color-neon-green);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.price-control-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(145deg, rgba(57, 255, 20, 0.3), rgba(0, 255, 136, 0.3));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.price-control-btn:hover:not(:disabled) {
  border-color: var(--color-neon-green);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
}

.price-control-btn:hover:not(:disabled)::before {
  opacity: 1;
}

.price-control-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.price-control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: rgba(57, 255, 20, 0.1);
}

.price-control-btn svg {
  filter: drop-shadow(0 0 4px rgba(57, 255, 20, 0.5));
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from > div,
.modal-fade-leave-to > div {
  transform: scale(0.9) translateY(20px);
}

/* Orders Tab Styles */
.stat-card {
  padding: 1.5rem;
  background: rgba(57, 255, 20, 0.05);
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: rgba(57, 255, 20, 0.4);
  transform: translateY(-2px);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-neon-green);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-pending {
  border-color: rgba(255, 165, 0, 0.3);
}

.stat-pending .stat-value {
  color: #ffa500;
}

.stat-shipped {
  border-color: rgba(0, 191, 255, 0.3);
}

.stat-shipped .stat-value {
  color: #00bfff;
}

.stat-delivered {
  border-color: rgba(57, 255, 20, 0.3);
}

.stat-revenue {
  border-color: rgba(255, 215, 0, 0.3);
}

.stat-revenue .stat-value {
  color: #ffd700;
  font-size: 1.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid rgba(57, 255, 20, 0.3);
  border-radius: 8px;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: rgba(57, 255, 20, 0.5);
  color: var(--color-neon-green);
}

.filter-btn.active {
  background: rgba(57, 255, 20, 0.1);
  border-color: var(--color-neon-green);
  color: var(--color-neon-green);
}

.order-card {
  padding: 1.5rem;
  background: rgba(57, 255, 20, 0.03);
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.order-card:hover {
  border-color: var(--color-neon-green);
  background: rgba(57, 255, 20, 0.05);
  transform: translateX(5px);
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-pending {
  background: rgba(255, 165, 0, 0.2);
  color: #ffa500;
  border: 1px solid rgba(255, 165, 0, 0.4);
}

.status-paid {
  background: rgba(0, 191, 255, 0.2);
  color: #00bfff;
  border: 1px solid rgba(0, 191, 255, 0.4);
}

.status-shipped {
  background: rgba(138, 43, 226, 0.2);
  color: #8a2be2;
  border: 1px solid rgba(138, 43, 226, 0.4);
}

.status-delivered {
  background: rgba(57, 255, 20, 0.2);
  color: var(--color-neon-green);
  border: 1px solid rgba(57, 255, 20, 0.4);
}

.status-cancelled {
  background: rgba(255, 0, 0, 0.2);
  color: #ff4444;
  border: 1px solid rgba(255, 0, 0, 0.4);
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-danger {
  background: rgba(255, 0, 0, 0.2);
  color: #ff4444;
  border: 1px solid rgba(255, 0, 0, 0.4);
}

.btn-danger:hover {
  background: rgba(255, 0, 0, 0.3);
  border-color: #ff4444;
}
</style>
