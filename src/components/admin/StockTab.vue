<template>
  <div class="stock-tab">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-bold text-gradient">📦 Gestion des Stocks</h2>
    </div>

    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-neon-green)] mx-auto mb-4"></div>
      <p class="text-[var(--color-text-secondary)]">Chargement des stocks...</p>
    </div>

    <div v-else>
      <div class="flex items-center justify-between mb-4">
        <div class="flex gap-2">
          <div class="stat-card-mini">
            <span class="stat-icon-mini">🎨</span>
            <span class="stat-value-mini">{{ designs.length }}</span>
          </div>
          <div class="stat-card-mini">
            <span class="stat-icon-mini">✅</span>
            <span class="stat-value-mini">{{ designsInStock }}</span>
          </div>
          <div class="stat-card-mini">
            <span class="stat-icon-mini">⚠️</span>
            <span class="stat-value-mini">{{ designsLowStock }}</span>
          </div>
        </div>
        
        <button 
          @click="showArchived = !showArchived"
          :class="[
            'btn text-sm py-2 px-4',
            showArchived ? 'btn-primary' : 'btn-ghost'
          ]"
        >
          {{ showArchived ? '👁️ Afficher actifs' : '📦 Afficher archivés' }}
        </button>
      </div>

      <div class="overflow-hidden border border-[rgba(57,255,20,0.2)] rounded-xl">
        <table class="stock-table">
          <thead>
            <tr>
              <th>Design</th>
              <th>Stock</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="design in filteredDesigns"
              :key="design.id"
              class="hover:bg-[rgba(57,255,20,0.05)]"
            >
              <td @click="openDesignStock(design)" class="cursor-pointer">
                <div class="flex items-center gap-3">
                  <img
                    v-if="design.images && design.images[0]"
                    :src="design.images[0]"
                    :alt="design.name"
                    class="w-12 h-12 rounded object-cover border border-[rgba(57,255,20,0.2)]"
                  >
                  <div>
                    <div class="font-bold text-white">{{ design.name }}</div>
                    <div class="text-xs text-[var(--color-text-secondary)]">{{ design.slug }}</div>
                  </div>
                </div>
              </td>
              <td @click="openDesignStock(design)" class="cursor-pointer">
                <div class="text-center">
                  <div class="font-bold text-white text-2xl">{{ getDesignStock(design) }}</div>
                  <div class="text-xs text-[var(--color-text-secondary)]">unités</div>
                </div>
              </td>
              <td @click="openDesignStock(design)" class="cursor-pointer">
                <span :class="['status-badge', getStockStatusClass(design)]">
                  {{ getStockStatusLabel(design) }}
                </span>
              </td>
              <td>
                <button
                  @click="toggleArchiveDesign(design)"
                  :class="[
                    'btn text-xs py-1 px-3',
                    design.archived ? 'btn-primary' : 'btn-ghost'
                  ]"
                >
                  {{ design.archived ? '📂 Désarchiver' : '📦 Archiver' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="selectedDesign"
          class="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-hidden"
          @click="closeModal"
        >
          <div
            class="bg-[var(--color-black-light)] border-2 border-[var(--color-neon-green)] rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-y-auto p-6"
            @click.stop
          >
            <div class="flex items-start justify-between mb-6">
              <div class="flex items-center gap-4">
                <img
                  v-if="selectedDesign.images && selectedDesign.images[0]"
                  :src="selectedDesign.images[0]"
                  :alt="selectedDesign.name"
                  class="w-16 h-16 rounded-lg object-cover border-2 border-[rgba(57,255,20,0.2)]"
                >
                <div>
                  <h2 class="text-xl font-bold text-white mb-1">{{ selectedDesign.name }}</h2>
                  <p class="text-xs text-[var(--color-text-secondary)]">{{ selectedDesign.slug }}</p>
                </div>
              </div>
              <button @click="closeModal" class="text-[var(--color-text-secondary)] hover:text-white text-2xl leading-none">
                ×
              </button>
            </div>

            <!-- Layout 2 colonnes -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- COLONNE GAUCHE: Gestion du stock -->
              <div class="stock-control-section">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  📦 Gestion du stock
                </h3>
                
                <div class="current-stock-display mb-4">
                  <span class="text-sm text-[var(--color-text-secondary)]">Stock actuel</span>
                  <span class="text-4xl font-bold text-[var(--color-neon-green)]">{{ currentStock }}</span>
                  <span class="text-sm text-[var(--color-text-secondary)]">unités</span>
                </div>
                
                <div class="stock-input-group mb-4">
                  <button @click="adjustStock(-10)" class="stock-btn stock-btn-danger-lg">−10</button>
                  <button @click="adjustStock(-1)" class="stock-btn stock-btn-danger">−1</button>
                  <input
                    v-model.number="currentStock"
                    type="number"
                    min="0"
                    class="stock-input-lg"
                    placeholder="0"
                  >
                  <button @click="adjustStock(1)" class="stock-btn stock-btn-success">+1</button>
                  <button @click="adjustStock(10)" class="stock-btn stock-btn-success-lg">+10</button>
                </div>

                <div class="stock-status-preview">
                  <span class="text-sm">Statut :</span>
                  <span :class="['status-badge-lg', getStockStatusClassByValue(currentStock)]">
                    {{ getStockStatusLabelByValue(currentStock) }}
                  </span>
                </div>
              </div>

              <!-- COLONNE DROITE: Statistiques de ventes -->
              <div class="sales-stats-section">
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  📊 Statistiques de ventes
                </h3>
                
                <div class="grid grid-cols-3 gap-2 mb-4">
                  <div class="stat-card-compact">
                    <div class="text-2xl">👕</div>
                    <div class="text-xl font-bold text-white">{{ getSalesStats().tshirt }}</div>
                    <div class="text-xs text-[var(--color-text-secondary)]">T-Shirts</div>
                  </div>
                  <div class="stat-card-compact">
                    <div class="text-2xl">🧥</div>
                    <div class="text-xl font-bold text-white">{{ getSalesStats().hoodie }}</div>
                    <div class="text-xs text-[var(--color-text-secondary)]">Hoodies</div>
                  </div>
                  <div class="stat-card-compact">
                    <div class="text-2xl">📦</div>
                    <div class="text-xl font-bold text-[var(--color-neon-green)]">{{ getSalesStats().total }}</div>
                    <div class="text-xs text-[var(--color-text-secondary)]">Total</div>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <div class="stock-info-item-compact">
                    <span class="stock-info-label">Stock initial</span>
                    <span class="stock-info-value">100</span>
                  </div>
                  <div class="stock-info-item-compact">
                    <span class="stock-info-label">Créé le</span>
                    <span class="stock-info-value">{{ formatDate(getStockCreatedAt()) }}</span>
                  </div>
                  <div class="stock-info-item-compact">
                    <span class="stock-info-label">Dernière MAJ</span>
                    <span class="stock-info-value">{{ formatDate(getStockLastUpdated()) }}</span>
                  </div>
                </div>
              </div>

            </div>

            <div class="flex gap-4 mt-6 pt-4 border-t border-[rgba(57,255,20,0.2)]">
              <button @click="closeModal" class="btn btn-ghost flex-1">Annuler</button>
              <button @click="saveStock" class="btn btn-primary flex-1">💾 Sauvegarder</button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDesigns } from '@/composables/useDesigns'
import { useStock } from '@/composables/useStock'

const { designs, loading: loadingDesigns, loadDesigns } = useDesigns()
const { stockData, loading: loadingStock, loadStock, updateDesignStock } = useStock()

const loading = computed(() => loadingDesigns.value || loadingStock.value)
const selectedDesign = ref(null)
const currentStock = ref(0)
const showArchived = ref(false)

onMounted(async () => {
  await loadDesigns()
  await loadStock()
})

const filteredDesigns = computed(() => {
  return designs.value.filter(d => {
    if (showArchived.value) {
      return d.archived === true
    }
    return !d.archived
  })
})

const designsInStock = computed(() => {
  return designs.value.filter(d => {
    const stock = getDesignStock(d)
    return stock > 10
  }).length
})

const designsLowStock = computed(() => {
  return designs.value.filter(d => {
    const stock = getDesignStock(d)
    return stock > 0 && stock <= 10
  }).length
})

const getDesignStock = (design) => {
  const stock = stockData.value.find(s => s.id === design.id)
  return stock?.quantity || 0
}

const getStockStatusLabel = (design) => {
  const stock = getDesignStock(design)
  if (stock === 0) return 'Rupture'
  if (stock <= 10) return 'Faible'
  return 'Disponible'
}

const getStockStatusClass = (design) => {
  const stock = getDesignStock(design)
  if (stock === 0) return 'status-out'
  if (stock <= 10) return 'status-low'
  return 'status-ok'
}

const getStockStatusLabelByValue = (value) => {
  if (value === 0) return 'Rupture'
  if (value <= 10) return 'Faible'
  return 'Disponible'
}

const getStockStatusClassByValue = (value) => {
  if (value === 0) return 'status-out'
  if (value <= 10) return 'status-low'
  return 'status-ok'
}

const openDesignStock = (design) => {
  selectedDesign.value = design
  currentStock.value = getDesignStock(design)
  // Désactiver le scroll en arrière-plan
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedDesign.value = null
  currentStock.value = 0
  // Réactiver le scroll
  document.body.style.overflow = ''
}

const adjustStock = (amount) => {
  currentStock.value = Math.max(0, currentStock.value + amount)
}

const getSalesStats = () => {
  if (!selectedDesign.value) return { tshirt: 0, hoodie: 0, total: 0 }
  const stock = stockData.value.find(s => s.id === selectedDesign.value.id)
  return stock?.salesStats || { tshirt: 0, hoodie: 0, total: 0 }
}

const getStockCreatedAt = () => {
  if (!selectedDesign.value) return null
  const stock = stockData.value.find(s => s.id === selectedDesign.value.id)
  return stock?.createdAt?.toDate ? stock.createdAt.toDate() : stock?.createdAt
}

const getStockLastUpdated = () => {
  if (!selectedDesign.value) return null
  const stock = stockData.value.find(s => s.id === selectedDesign.value.id)
  return stock?.lastUpdated?.toDate ? stock.lastUpdated.toDate() : stock?.lastUpdated
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const saveStock = async () => {
  if (!selectedDesign.value) return
  
  const result = await updateDesignStock(selectedDesign.value.id, { quantity: currentStock.value })
  
  if (result.success) {
    alert('Stock mis à jour avec succès !')
    closeModal()
  } else {
    alert('Erreur lors de la mise à jour: ' + result.error)
  }
}

const toggleArchiveDesign = async (design) => {
  const { updateDesign } = useDesigns()
  const newArchivedState = !design.archived
  
  const result = await updateDesign(design.slug, { archived: newArchivedState })
  
  if (result.success) {
    await loadDesigns()
  } else {
    alert('Erreur lors de l\'archivage')
  }
}

</script>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, var(--color-neon-green), var(--color-neon-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 1rem;
}
.stat-icon {
  font-size: 2.5rem;
}
.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-neon-green);
}
.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
.stock-table {
  width: 100%;
  border-collapse: collapse;
}
.stock-table thead {
  background: rgba(26, 26, 26, 0.8);
}
.stock-table th {
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-neon-green);
  border-bottom: 2px solid rgba(57, 255, 20, 0.3);
}
.stock-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(57, 255, 20, 0.1);
}
.stock-table tbody tr {
  transition: all 0.2s;
}
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
}
.status-ok {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}
.status-low {
  background: rgba(234, 179, 8, 0.2);
  color: #eab308;
  border: 1px solid rgba(234, 179, 8, 0.3);
}
.status-out {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
.stock-section {
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 1rem;
}
.stock-control-section {
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 1rem;
}
.current-stock-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.75rem;
  text-align: center;
}
.stock-control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(57, 255, 20, 0.2);
}
.current-stock {
  display: flex;
  align-items: center;
}
.stock-input-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.stock-input-lg {
  width: 100px;
  padding: 0.75rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(57, 255, 20, 0.3);
  border-radius: 0.75rem;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}
.stock-input-lg:focus {
  outline: none;
  border-color: var(--color-neon-green);
  box-shadow: 0 0 0 3px rgba(57, 255, 20, 0.2);
}
.stock-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 50px;
}
.stock-btn-danger,
.stock-btn-danger-lg {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.4);
}
.stock-btn-danger:hover,
.stock-btn-danger-lg:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: #ef4444;
  transform: scale(1.05);
}
.stock-btn-success,
.stock-btn-success-lg {
  background: rgba(57, 255, 20, 0.2);
  color: var(--color-neon-green);
  border-color: rgba(57, 255, 20, 0.4);
}
.stock-btn-success:hover,
.stock-btn-success-lg:hover {
  background: rgba(57, 255, 20, 0.3);
  border-color: var(--color-neon-green);
  transform: scale(1.05);
}
.stock-status-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}
.sales-stats-section {
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(57, 255, 20, 0.1);
  border-radius: 1rem;
}
.stat-card-mini {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 0.375rem;
}
.stat-icon-mini {
  font-size: 1rem;
}
.stat-value-mini {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-neon-green);
  line-height: 1;
}
.stat-card-compact {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 0.5rem;
}
.stat-icon-compact {
  font-size: 1.25rem;
}
.stat-value-compact {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-neon-green);
  line-height: 1;
}
.stat-label-compact {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.stock-info-item-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  border: 1px solid rgba(57, 255, 20, 0.1);
  font-size: 0.8rem;
}
.stock-info-item-compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  border: 1px solid rgba(57, 255, 20, 0.1);
  font-size: 0.8rem;
}
.status-badge-lg {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
}
.stock-info-label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}
.stock-info-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
