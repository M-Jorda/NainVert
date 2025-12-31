<template>
  <div class="shipping-selector">
    <!-- Message livraison gratuite -->
    <div v-if="freeShippingMessage" class="mb-4 p-3 rounded-lg border text-sm"
         :class="isFreeShipping ? 'bg-[rgba(57,255,20,0.1)] border-[var(--color-neon-green)] text-[var(--color-neon-green)]' : 'bg-[rgba(255,193,7,0.1)] border-yellow-500/30 text-yellow-400'">
      <div class="flex items-center gap-2">
        <svg v-if="isFreeShipping" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
        <span>{{ freeShippingMessage }}</span>
      </div>
      <!-- Barre de progression vers livraison gratuite -->
      <div v-if="!isFreeShipping && progressPercentage > 0" class="mt-2 h-1.5 bg-[var(--color-black-lighter)] rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-yellow-500 to-[var(--color-neon-green)] transition-all duration-300"
             :style="{ width: progressPercentage + '%' }"></div>
      </div>
    </div>

    <!-- Sélection pays -->
    <div class="mb-4">
      <label class="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
        Zone de livraison
      </label>
      <select
        v-model="selectedZone"
        class="w-full px-4 py-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg text-white focus:outline-none focus:border-[var(--color-neon-green)] transition-colors"
      >
        <option value="france">France métropolitaine</option>
        <option value="domtom">DOM-TOM</option>
        <option value="europe">Europe</option>
      </select>
    </div>

    <!-- Options de livraison -->
    <div class="space-y-3">
      <label
        v-for="option in availableOptions"
        :key="option.id"
        class="block cursor-pointer"
      >
        <div
          class="shipping-option p-4 rounded-lg border-2 transition-all duration-200"
          :class="selectedMethod === option.id
            ? 'border-[var(--color-neon-green)] bg-[rgba(57,255,20,0.05)]'
            : 'border-[rgba(57,255,20,0.2)] hover:border-[rgba(57,255,20,0.4)] bg-[var(--color-black-light)]'"
        >
          <div class="flex items-center gap-3">
            <!-- Radio button custom -->
            <div
              class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
              :class="selectedMethod === option.id
                ? 'border-[var(--color-neon-green)] bg-[var(--color-neon-green)]'
                : 'border-[var(--color-text-muted)]'"
            >
              <div v-if="selectedMethod === option.id" class="w-2 h-2 rounded-full bg-black"></div>
            </div>

            <input
              type="radio"
              :value="option.id"
              v-model="selectedMethod"
              class="sr-only"
              @change="emitChange"
            />

            <!-- Icône transporteur -->
            <div class="flex-shrink-0">
              <component :is="getCarrierIcon(option.id)" class="w-8 h-8" />
            </div>

            <!-- Infos -->
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-2">
                <span class="font-semibold text-white">{{ option.name }}</span>
                <span v-if="option.id === 'mondial-relay'" class="text-xs px-2 py-0.5 rounded-full bg-[rgba(57,255,20,0.1)] text-[var(--color-neon-green)]">
                  Économique
                </span>
              </div>
              <p class="text-sm text-[var(--color-text-secondary)]">{{ option.delay }}</p>
            </div>

            <!-- Prix -->
            <div class="text-right flex-shrink-0">
              <div v-if="isFreeShipping" class="text-[var(--color-neon-green)] font-bold">
                GRATUIT
              </div>
              <div v-else>
                <span class="text-lg font-bold text-white">{{ getOptionPrice(option.id).toFixed(2) }}€</span>
              </div>
            </div>
          </div>
        </div>
      </label>
    </div>

    <!-- Info Mondial Relay -->
    <div v-if="selectedMethod === 'mondial-relay'" class="mt-4 p-3 rounded-lg bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)]">
      <p class="text-sm text-[var(--color-text-secondary)]">
        <span class="text-[var(--color-neon-green)]">📍</span>
        Le point relais sera sélectionné après votre commande. Nous vous enverrons un email avec le lien de suivi.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, h } from 'vue'
import { calculateShippingOptions, calculateShippingCost, FREE_SHIPPING_THRESHOLD, getFreeShippingMessage } from '@/services/shipping'

const props = defineProps({
  cartItems: {
    type: Array,
    required: true
  },
  cartTotal: {
    type: Number,
    required: true
  },
  modelValue: {
    type: String,
    default: 'colissimo'
  }
})

const emit = defineEmits(['update:modelValue', 'update:shippingCost', 'update:shippingMethod'])

// État local
const selectedZone = ref('france')
const selectedMethod = ref(props.modelValue)

// Calculs
const isFreeShipping = computed(() => props.cartTotal >= FREE_SHIPPING_THRESHOLD)

const freeShippingMessage = computed(() => getFreeShippingMessage(props.cartTotal))

const progressPercentage = computed(() => {
  if (isFreeShipping.value) return 100
  return Math.min((props.cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
})

const availableOptions = computed(() => {
  return calculateShippingOptions(props.cartItems, selectedZone.value)
})

const getOptionPrice = (methodId) => {
  if (isFreeShipping.value) return 0
  const option = availableOptions.value.find(o => o.id === methodId)
  return option ? option.price : 0
}

const currentShippingCost = computed(() => {
  if (isFreeShipping.value) return 0
  return calculateShippingCost(props.cartItems, selectedMethod.value, selectedZone.value)
})

const shippingCost = computed(() => {
  // Ensure it's an array
  const items = Array.isArray(props.cartItems) ? props.cartItems : []
  return calculateShippingCost(props.cartItems, props.cartTotal, selectedMethod.value)
})

// Watcher pour émettre les changements
watch(selectedMethod, (newValue) => {
  emit('update:modelValue', newValue)
  emit('update:shippingMethod', {
    id: newValue,
    name: availableOptions.value.find(o => o.id === newValue)?.name || newValue,
    zone: selectedZone.value
  })
  emit('update:shippingCost', currentShippingCost.value)
})

watch([selectedZone, () => props.cartTotal], () => {
  emit('update:shippingCost', currentShippingCost.value)
})

// Émettre le coût initial
emit('update:shippingCost', currentShippingCost.value)

const emitChange = () => {
  emit('update:shippingCost', currentShippingCost.value)
}

// Icônes des transporteurs (composants simples)
const getCarrierIcon = (carrierId) => {
  const icons = {
    'colissimo': {
      render() {
        return h('div', {
          class: 'w-8 h-8 rounded-lg bg-[#0055a4] flex items-center justify-center text-white font-bold text-xs'
        }, 'LP')
      }
    },
    'chronopost': {
      render() {
        return h('div', {
          class: 'w-8 h-8 rounded-lg bg-[#e31937] flex items-center justify-center text-white font-bold text-xs'
        }, 'CP')
      }
    },
    'mondial-relay': {
      render() {
        return h('div', {
          class: 'w-8 h-8 rounded-lg bg-[#e4002b] flex items-center justify-center text-white font-bold text-xs'
        }, 'MR')
      }
    }
  }
  return icons[carrierId] || icons['colissimo']
}
</script>

<style scoped>
.shipping-option:hover {
  transform: translateY(-1px);
}
</style>
