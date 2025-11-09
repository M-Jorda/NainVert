<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div 
        class="fixed inset-0 bg-black z-[9999] flex flex-col overflow-hidden"
      >
        <div class="max-w-7xl mx-auto px-4 w-full h-full flex flex-col py-2">
          <!-- Header avec lien retour -->
          <div class="mb-2">
            <button 
              @click="$emit('close')"
              class="inline-flex items-center gap-2 text-[var(--color-neon-green)] hover:text-white transition-colors text-sm font-semibold"
            >
              <span>←</span> Retour aux vêtements
            </button>
          </div>

          <!-- Titre -->
          <div class="mb-3">
            <h2 class="text-2xl font-bold text-gradient">Choisis ta taille</h2>
          </div>

          <!-- Layout 2 colonnes -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-visible">
            <!-- Colonne gauche : Sélection de taille -->
            <div class="flex flex-col overflow-visible">
              <h3 class="text-base font-bold text-white mb-2">Sélectionne ta taille</h3>
              
              <!-- Tailles en radio - UNE SEULE LIGNE HORIZONTALE -->
              <div class="grid grid-cols-7 gap-1.5 mb-3">
                <label
                  v-for="size in sizeChart"
                  :key="size.name"
                  :class="[
                    'flex items-center justify-center p-2 rounded-lg border-2 transition-all cursor-pointer',
                    selectedSize === size.name
                      ? 'border-[var(--color-neon-green)] bg-[var(--color-neon-green)]/10'
                      : 'border-[rgba(57,255,20,0.2)] hover:border-[var(--color-neon-green)]'
                  ]"
                  :title="`${size.name} - L: ${size.length}cm, l: ${size.width}cm - ${size.description}`"
                >
                  <input
                    type="radio"
                    name="size"
                    :value="size.name"
                    v-model="selectedSize"
                    class="sr-only"
                  >
                  <div class="font-bold text-white text-xs">{{ size.name }}</div>
                </label>
              </div>

              <!-- Guide des tailles compact -->
              <div class="p-3 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg mb-3">
                <h3 class="text-sm font-bold text-white mb-2">📏 Guide des tailles</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-xs">
                    <thead>
                      <tr class="border-b border-[rgba(57,255,20,0.2)]">
                        <th class="text-left py-1 px-1 text-white font-bold text-xs">Taille</th>
                        <th class="text-center py-1 px-1 text-white font-bold text-xs">Long.</th>
                        <th class="text-center py-1 px-1 text-white font-bold text-xs">Larg.</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr 
                        v-for="size in sizeChart" 
                        :key="size.name"
                        :class="[
                          'border-b border-[rgba(57,255,20,0.1)]',
                          selectedSize === size.name ? 'bg-[var(--color-neon-green)]/5' : ''
                        ]"
                      >
                        <td class="py-1 px-1 font-bold text-white text-xs">{{ size.name }}</td>
                        <td class="py-1 px-1 text-center text-[var(--color-text-secondary)] text-xs">{{ size.length }}cm</td>
                        <td class="py-1 px-1 text-center text-[var(--color-text-secondary)] text-xs">{{ size.width }}cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Bouton d'action pleine largeur -->
              <button 
                @click="addToCart"
                :disabled="!selectedSize"
                :class="[
                  'btn w-full py-3 text-base font-bold transition-all',
                  selectedSize 
                    ? 'btn-primary hover:scale-105' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                ]"
              >
                {{ selectedSize ? '🛒 Ajouter au panier' : 'Sélectionne une taille' }}
              </button>
            </div>

            <!-- Colonne droite : Récapitulatif AVEC PRIX DÉTAILLÉ -->
            <div class="flex flex-col gap-3">
              <!-- Récapitulatif -->
              <div class="p-4 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg">
                <h3 class="text-base font-bold text-white mb-3">📋 Récapitulatif</h3>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-[var(--color-text-secondary)]">Design</span>
                    <span class="text-white font-semibold">{{ design.name }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-[var(--color-text-secondary)]">Type</span>
                    <span class="text-white font-semibold">
                      {{ selectedType === 'tshirt' ? 'T-Shirt' : 'Hoodie' }}
                    </span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-[var(--color-text-secondary)]">Taille</span>
                    <span class="text-white font-semibold">{{ selectedSize || '—' }}</span>
                  </div>
                  
                  <!-- PRIX DÉTAILLÉ -->
                  <div class="border-t border-[rgba(57,255,20,0.2)] pt-2 mt-2 space-y-1.5">
                    <div class="flex justify-between text-sm">
                      <span class="text-[var(--color-text-secondary)]">Prix {{ selectedType === 'tshirt' ? 'T-Shirt' : 'Hoodie' }}</span>
                      <span class="text-white">{{ garmentPrice.toFixed(2) }}€</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-[var(--color-text-secondary)]">TVA (20%)</span>
                      <span class="text-white">{{ tvaAmount.toFixed(2) }}€</span>
                    </div>
                    <div class="flex justify-between text-lg border-t border-[rgba(57,255,20,0.2)] pt-2 mt-2">
                      <span class="text-white font-bold">Total TTC</span>
                      <span class="text-[var(--color-neon-green)] font-bold">{{ price.toFixed(2) }}€</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Conseils de mesure -->
              <div class="p-4 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-lg">
                <div class="space-y-3 text-sm">
                  <div>
                    <h4 class="font-semibold text-white mb-1.5 text-sm">Comment mesurer ?</h4>
                    <ul class="space-y-1 text-xs text-[var(--color-text-secondary)]">
                      <li class="flex items-start gap-2">
                        <span class="text-[var(--color-neon-green)]">•</span>
                        <span><strong>Longueur :</strong> Du haut de l'épaule au bas</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span class="text-[var(--color-neon-green)]">•</span>
                        <span><strong>Largeur :</strong> D'aisselle à aisselle (à plat)</span>
                      </li>
                    </ul>
                  </div>

                  <div class="pt-1.5 border-t border-[rgba(57,255,20,0.1)]">
                    <p class="text-xs text-[var(--color-text-muted)] italic">
                      💡 En cas de doute, choisis une taille au-dessus
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCart } from '@/stores/cart'
import { useGarmentTypes } from '@/composables/useGarmentTypes'

const props = defineProps({
  design: {
    type: Object,
    required: true
  },
  selectedType: {
    type: String,
    required: true,
    validator: (value) => ['tshirt', 'hoodie'].includes(value)
  },
  price: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'add-to-cart'])

const cart = useCart()
const { garmentTypes } = useGarmentTypes()

const selectedSize = ref('L') // Taille L par défaut

// Le prix du vêtement est déjà dans props.price (35€ pour T-shirt, 75€ pour Hoodie)
const garmentPrice = computed(() => {
  return props.price
})

// Calcul du montant HT (prix TTC / 1.20)
const priceHT = computed(() => {
  return Number((props.price / 1.20).toFixed(2))
})

// Calcul de la TVA (20%)
const tvaAmount = computed(() => {
  return Number((props.price - priceHT.value).toFixed(2))
})

// Désactiver le scroll du body quand le modal est ouvert
onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

// Tableau des tailles avec descriptions
const sizeChart = [
  { 
    name: 'XS', 
    length: 68, 
    width: 49,
    description: 'Pour un tour de poitrine de 81-86cm'
  },
  { 
    name: 'S', 
    length: 71, 
    width: 52,
    description: 'Pour un tour de poitrine de 86-91cm'
  },
  { 
    name: 'M', 
    length: 74, 
    width: 55,
    description: 'Pour un tour de poitrine de 91-97cm'
  },
  { 
    name: 'L', 
    length: 77, 
    width: 58,
    description: 'Pour un tour de poitrine de 97-102cm'
  },
  { 
    name: 'XL', 
    length: 80, 
    width: 61,
    description: 'Pour un tour de poitrine de 102-107cm'
  },
  { 
    name: 'XXL', 
    length: 83, 
    width: 64,
    description: 'Pour un tour de poitrine de 107-112cm'
  },
  { 
    name: 'XXXL', 
    length: 86, 
    width: 67,
    description: 'Pour un tour de poitrine de 112-117cm'
  }
]

const addToCart = () => {
  if (!selectedSize.value) return

  // Créer l'item pour le panier
  const cartItem = {
    id: `${props.design.slug}-${props.selectedType}-${selectedSize.value}`,
    designId: props.design.id,
    designSlug: props.design.slug,
    designName: props.design.name,
    type: props.selectedType,
    size: selectedSize.value,
    price: props.price,
    image: props.design.images[0],
    quantity: 1
  }

  cart.addItem(cartItem)
  
  // Fermer le size selector
  emit('close')
  
  // Ouvrir le panier après un petit délai
  setTimeout(() => {
    cart.openCart()
  }, 300)
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.text-gradient {
  background: linear-gradient(135deg, var(--color-neon-green), var(--color-neon-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
