<template>
  <div class="stock-tab">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-white">Gestion des Stocks</h2>
      <div class="text-sm text-[var(--color-text-secondary)]">
        Gestion par dessin • 100 unités par dessin
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block w-8 h-8 border-4 border-[var(--color-neon-green)] border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-4 text-[var(--color-text-secondary)]">Chargement des stocks...</p>
    </div>

    <!-- Stock Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="design in stockData" 
        :key="design.id"
        class="stock-card"
      >
        <!-- Header with Design Name -->
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-2">
            <input 
              v-model="design.name"
              @blur="handleUpdateName(design.id, design.name)"
              class="text-2xl font-bold bg-transparent border-b-2 border-transparent hover:border-[var(--color-neon-green)] focus:border-[var(--color-neon-green)] outline-none transition-colors text-white flex-1"
              placeholder="Nom du dessin"
            >
            <span 
              :class="[
                'px-3 py-1 rounded-lg text-sm font-bold',
                getStockStatus(design).class
              ]"
            >
              {{ getStockStatus(design).label }}
            </span>
          </div>
          <p class="text-xs text-[var(--color-text-secondary)]">ID: {{ design.id }}</p>
        </div>

        <!-- Stock Progress Bar -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-semibold text-white">Stock disponible</span>
            <span class="text-sm text-[var(--color-text-secondary)]">
              {{ design.remainingUnits }} / {{ design.totalUnits }} unités
            </span>
          </div>
          <div class="h-4 bg-black/40 rounded-full overflow-hidden border border-[rgba(57,255,20,0.2)]">
            <div 
              class="h-full transition-all duration-500 rounded-full"
              :style="{
                width: `${getStockPercentage(design)}%`,
                background: getProgressBarColor(design)
              }"
            ></div>
          </div>
          <div class="text-center mt-2">
            <span class="text-3xl font-bold text-[var(--color-neon-green)]">
              {{ getStockPercentage(design) }}%
            </span>
          </div>
        </div>

        <!-- Stock Controls -->
        <div class="space-y-4">
          <!-- Quick Actions -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Actions rapides</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                @click="adjustStock(design.id, -1)"
                :disabled="design.remainingUnits <= 0"
                class="stock-btn stock-btn-danger"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                -1
              </button>
              <button 
                @click="adjustStock(design.id, -10)"
                :disabled="design.remainingUnits < 10"
                class="stock-btn stock-btn-danger"
              >
                -10
              </button>
              <button 
                @click="adjustStock(design.id, -50)"
                :disabled="design.remainingUnits < 50"
                class="stock-btn stock-btn-danger"
              >
                -50
              </button>
            </div>
          </div>

          <!-- Manual Adjustment -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Ajustement manuel</label>
            <div class="flex gap-2">
              <input 
                v-model.number="manualAdjustment[design.id]"
                type="number"
                min="0"
                :max="design.totalUnits"
                class="form-input flex-1"
                :placeholder="`0 - ${design.totalUnits}`"
              >
              <button 
                @click="setStock(design.id, manualAdjustment[design.id])"
                :disabled="!isValidAdjustment(design, manualAdjustment[design.id])"
                class="btn btn-primary whitespace-nowrap"
              >
                Définir
              </button>
            </div>
            <p class="text-xs text-[var(--color-text-secondary)] mt-1">
              Entrez un nombre entre 0 et {{ design.totalUnits }}
            </p>
          </div>

          <!-- Reset to Full Stock -->
          <div class="pt-4 border-t border-[rgba(57,255,20,0.2)]">
            <button 
              @click="resetStock(design.id)"
              :disabled="design.remainingUnits === design.totalUnits"
              class="w-full btn btn-secondary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-block mr-2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              Réinitialiser à 100 unités
            </button>
          </div>
        </div>

        <!-- Stock History Info -->
        <div class="mt-6 p-4 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg">
          <div class="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <div class="text-xs text-[var(--color-text-secondary)]">
              <p class="font-semibold text-white mb-1">À propos du stock</p>
              <p>Le stock se gère par dessin, pas par produit individuel.</p>
              <p class="mt-1">Unités vendues : <span class="font-bold text-[var(--color-neon-green)]">{{ design.totalUnits - design.remainingUnits }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Global Stats -->
    <div v-if="!loading && stockData.length > 0" class="mt-8 p-6 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-xl">
      <h3 class="text-lg font-bold text-white mb-4">📊 Statistiques globales</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-[var(--color-neon-green)]">{{ totalStock }}</div>
          <div class="text-xs text-[var(--color-text-secondary)]">Stock total</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-[var(--color-neon-green)]">{{ remainingStock }}</div>
          <div class="text-xs text-[var(--color-text-secondary)]">Unités disponibles</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-400">{{ soldUnits }}</div>
          <div class="text-xs text-[var(--color-text-secondary)]">Unités vendues</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-400">{{ globalPercentage }}%</div>
          <div class="text-xs text-[var(--color-text-secondary)]">Stock global restant</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  stockData: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-stock', 'update-name'])

const manualAdjustment = ref({})

const getStockPercentage = (design) => {
  if (!design || design.totalUnits === 0) return 0
  return Math.round((design.remainingUnits / design.totalUnits) * 100)
}

const getStockStatus = (design) => {
  const percentage = getStockPercentage(design)
  
  if (percentage === 0) {
    return { label: 'ÉPUISÉ', class: 'bg-red-500/20 text-red-400 border border-red-500/40' }
  } else if (percentage <= 10) {
    return { label: 'CRITIQUE', class: 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' }
  } else if (percentage <= 25) {
    return { label: 'FAIBLE', class: 'bg-orange-500/20 text-orange-400 border border-orange-500/40' }
  } else if (percentage <= 50) {
    return { label: 'MOYEN', class: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' }
  } else {
    return { label: 'BON', class: 'bg-green-500/20 text-green-400 border border-green-500/40' }
  }
}

const getProgressBarColor = (design) => {
  const percentage = getStockPercentage(design)
  
  if (percentage === 0) {
    return 'linear-gradient(90deg, #dc2626, #991b1b)'
  } else if (percentage <= 10) {
    return 'linear-gradient(90deg, #dc2626, #ea580c)'
  } else if (percentage <= 25) {
    return 'linear-gradient(90deg, #f59e0b, #ea580c)'
  } else if (percentage <= 50) {
    return 'linear-gradient(90deg, #eab308, #f59e0b)'
  } else {
    return 'linear-gradient(90deg, #39ff14, #00ff88)'
  }
}

const isValidAdjustment = (design, value) => {
  if (value === undefined || value === null || value === '') return false
  const num = Number(value)
  return !isNaN(num) && num >= 0 && num <= design.totalUnits
}

const adjustStock = (designId, amount) => {
  emit('update-stock', designId, amount, 'adjust')
}

const setStock = (designId, value) => {
  if (!isValidAdjustment(props.stockData.find(d => d.id === designId), value)) {
    return
  }
  emit('update-stock', designId, value, 'set')
  manualAdjustment.value[designId] = ''
}

const resetStock = (designId) => {
  if (confirm('Réinitialiser le stock à 100 unités ?')) {
    emit('update-stock', designId, 100, 'set')
  }
}

const handleUpdateName = (designId, newName) => {
  if (newName && newName.trim()) {
    emit('update-name', designId, newName.trim())
  }
}

// Global stats
const totalStock = computed(() => {
  return props.stockData.reduce((sum, design) => sum + design.totalUnits, 0)
})

const remainingStock = computed(() => {
  return props.stockData.reduce((sum, design) => sum + design.remainingUnits, 0)
})

const soldUnits = computed(() => {
  return totalStock.value - remainingStock.value
})

const globalPercentage = computed(() => {
  if (totalStock.value === 0) return 0
  return Math.round((remainingStock.value / totalStock.value) * 100)
})
</script>

<style scoped>
.stock-card {
  padding: 2rem;
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(42, 42, 42, 0.7));
  border: 1px solid rgba(57, 255, 20, 0.3);
  border-radius: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stock-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-neon-green), #00ff88);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stock-card:hover {
  border-color: var(--color-neon-green);
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.2);
}

.stock-card:hover::before {
  opacity: 1;
}

.stock-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.stock-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.stock-btn-danger {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.stock-btn-danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.25);
  border-color: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
}

.stock-btn-success {
  background: rgba(57, 255, 20, 0.15);
  color: var(--color-neon-green);
  border-color: rgba(57, 255, 20, 0.3);
}

.stock-btn-success:hover:not(:disabled) {
  background: rgba(57, 255, 20, 0.25);
  border-color: var(--color-neon-green);
  box-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
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
</style>
