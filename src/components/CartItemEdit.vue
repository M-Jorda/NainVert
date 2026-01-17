<template>
  <teleport to="body">
    <div class="edit-modal-backdrop" @click="$emit('close')">
      <div class="edit-modal" @click.stop>
        <header class="edit-modal__header">
          <h3>Modifier l'article</h3>
          <button @click="$emit('close')" class="edit-modal__close" aria-label="Fermer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <div class="edit-modal__body">
          <!-- Left column: Design selection -->
          <div class="edit-modal__designs">
            <div class="section-label">Design</div>
            <div class="design-content">
              <!-- Preview area -->
              <div class="design-preview">
                <img :src="previewImage" :alt="previewName" />
              </div>
              <div class="design-preview__name">{{ previewName }}</div>

              <!-- Design grid -->
              <div class="design-grid">
                <button
                  v-for="design in availableDesigns"
                  :key="design.slug"
                  type="button"
                  :class="['design-option', { 'design-option--selected': editData.designSlug === design.slug }]"
                  @click="editData.designSlug = design.slug"
                  @mouseenter="hoveredDesign = design"
                  @mouseleave="hoveredDesign = null"
                >
                  <img :src="design.images?.[0]" :alt="design.name" />
                </button>
              </div>
            </div>
          </div>

          <!-- Right column: Type, Size, Quantity -->
          <div class="edit-modal__options">
            <!-- Type selection -->
            <fieldset class="option-group">
              <legend class="section-label">Type</legend>
              <div class="type-grid">
                <label
                  v-for="type in garmentTypes"
                  :key="type.id"
                  :class="['type-option', { 'type-option--selected': editData.type === type.id }]"
                >
                  <input type="radio" :value="type.id" v-model="editData.type" />
                  <span class="type-option__label">{{ type.label }}</span>
                  <span class="type-option__price">{{ type.price.toFixed(2) }}€</span>
                </label>
              </div>
            </fieldset>

            <!-- Size selection -->
            <fieldset class="option-group">
              <legend class="section-label">Taille</legend>
              <div class="size-grid">
                <label
                  v-for="size in sizes"
                  :key="size"
                  :class="['size-option', { 'size-option--selected': editData.size === size }]"
                >
                  <input type="radio" :value="size" v-model="editData.size" />
                  <span>{{ size }}</span>
                </label>
              </div>
            </fieldset>

            <!-- Quantity and Total row -->
            <div class="bottom-row">
              <fieldset class="option-group option-group--inline">
                <legend class="section-label">Quantité</legend>
                <div class="quantity-control">
                  <button
                    type="button"
                    @click="decrementQty"
                    :disabled="editData.quantity <= 1"
                    class="quantity-btn"
                  >-</button>
                  <span class="quantity-value">{{ editData.quantity }}</span>
                  <button
                    type="button"
                    @click="editData.quantity++"
                    class="quantity-btn"
                  >+</button>
                </div>
              </fieldset>

              <div class="total-display">
                <span class="total-label">Total</span>
                <span class="total-price">{{ totalPrice.toFixed(2) }}€</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="edit-modal__actions">
              <button type="button" @click="confirmChanges" class="btn btn-primary">
                Confirmer
              </button>
              <button type="button" @click="removeFromCart" class="btn-delete">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useGarments } from '@/composables/useGarments'
import { useDesigns } from '@/composables/useDesigns'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const cartStore = useCartStore()
const { garments, loadGarments, getGarmentByType } = useGarments()
const { designs, loadDesigns } = useDesigns()

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const hoveredDesign = ref(null)

const editData = ref({
  designSlug: props.item.designSlug,
  designName: props.item.designName,
  designId: props.item.designId,
  image: props.item.image,
  type: props.item.type,
  size: props.item.size,
  quantity: props.item.quantity
})

const availableDesigns = computed(() => {
  return designs.value.filter(d => d.featured && d.inStock !== false && !d.archived)
})

const garmentTypes = computed(() => {
  const tshirt = getGarmentByType('tshirt')
  const hoodie = getGarmentByType('hoodie')
  return [
    { id: 'tshirt', label: 'T-Shirt', price: tshirt?.basePrice || 35 },
    { id: 'hoodie', label: 'Hoodie', price: hoodie?.basePrice || 75 }
  ]
})

const selectedDesign = computed(() => {
  return designs.value.find(d => d.slug === editData.value.designSlug)
})

const previewImage = computed(() => {
  if (hoveredDesign.value) return hoveredDesign.value.images?.[0]
  if (selectedDesign.value) return selectedDesign.value.images?.[0]
  return props.item.image
})

const previewName = computed(() => {
  if (hoveredDesign.value) return hoveredDesign.value.name
  if (selectedDesign.value) return selectedDesign.value.name
  return props.item.designName
})

const currentPrice = computed(() => {
  const garment = garmentTypes.value.find(g => g.id === editData.value.type)
  return garment?.price || props.item.price
})

const totalPrice = computed(() => {
  return currentPrice.value * editData.value.quantity
})

const decrementQty = () => {
  if (editData.value.quantity > 1) {
    editData.value.quantity--
  }
}

const confirmChanges = () => {
  const design = selectedDesign.value
  cartStore.updateItem(props.item.id, props.item.size, {
    designSlug: editData.value.designSlug,
    designName: design?.name || editData.value.designName,
    designId: design?.id || editData.value.designId,
    image: design?.images?.[0] || editData.value.image,
    type: editData.value.type,
    size: editData.value.size,
    quantity: editData.value.quantity,
    price: currentPrice.value
  })
  emit('updated')
  emit('close')
}

const removeFromCart = () => {
  cartStore.removeItem(props.item.id, props.item.size)
  emit('close')
}

onMounted(async () => {
  document.body.style.overflow = 'hidden'
  if (garments.value.length === 0) await loadGarments()
  if (designs.value.length === 0) await loadDesigns()
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.edit-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: hidden;
}

.edit-modal {
  background: var(--color-black-light);
  border: 1px solid rgba(57, 255, 20, 0.25);
  border-radius: 12px;
  width: 100%;
  max-width: 880px;
  display: flex;
  flex-direction: column;
}

.edit-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(57, 255, 20, 0.15);
}

.edit-modal__header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.edit-modal__close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 6px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-modal__close:hover {
  border-color: var(--color-neon-green);
  color: #fff;
}

.edit-modal__body {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 1.25rem;
  padding: 1.25rem;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

/* Design column */
.edit-modal__designs {
  display: flex;
  flex-direction: column;
}

.design-content {
  background: var(--color-black);
  border: 1px solid rgba(57, 255, 20, 0.15);
  border-radius: 8px;
  padding: 0.75rem;
}

.design-preview {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.3);
}

.design-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.design-preview__name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
  padding: 0.5rem 0;
}

.design-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.35rem;
}

.design-option {
  aspect-ratio: 1;
  padding: 0.25rem;
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(57, 255, 20, 0.12);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.design-option img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 3px;
  transition: transform 0.25s ease;
}

.design-option:hover {
  border-color: rgba(57, 255, 20, 0.5);
}

.design-option:hover img {
  transform: scale(1.1);
}

.design-option--selected {
  border-color: var(--color-neon-green);
  background: rgba(57, 255, 20, 0.1);
}

/* Options column */
.edit-modal__options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-group {
  border: none;
  padding: 0;
  margin: 0;
}

.option-group legend {
  padding: 0;
}

.type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.type-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--color-black);
  border: 1px solid rgba(57, 255, 20, 0.15);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.type-option__label {
  font-size: 0.9rem;
  color: #fff;
}

.type-option__price {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.type-option:hover {
  border-color: rgba(57, 255, 20, 0.4);
}

.type-option--selected {
  border-color: var(--color-neon-green);
  background: rgba(57, 255, 20, 0.08);
}

.type-option--selected .type-option__price {
  color: var(--color-neon-green);
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.35rem;
}

.size-option {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 0;
  background: var(--color-black);
  border: 1px solid rgba(57, 255, 20, 0.15);
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.size-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.size-option:hover {
  border-color: rgba(57, 255, 20, 0.4);
  color: #fff;
}

.size-option--selected {
  border-color: var(--color-neon-green);
  background: rgba(57, 255, 20, 0.08);
  color: #fff;
}

.bottom-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.5rem;
}

.option-group--inline {
  flex: 0 0 auto;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-black);
  border: 1px solid rgba(57, 255, 20, 0.25);
  border-radius: 6px;
  color: var(--color-neon-green);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: rgba(57, 255, 20, 0.1);
  border-color: var(--color-neon-green);
}

.quantity-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.quantity-value {
  min-width: 2.5rem;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}

.total-display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.total-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.total-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-neon-green);
}

.edit-modal__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.edit-modal__actions .btn {
  padding: 0.7rem 1rem;
}

.btn-delete {
  padding: 0.7rem 1rem;
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 8px;
  color: #ef4444;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

/* Mobile responsive */
@media (max-width: 700px) {
  .edit-modal {
    max-height: 90vh;
    overflow-y: auto;
  }

  .edit-modal__body {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }

  .design-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .size-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .bottom-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .total-display {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: var(--color-black);
    border-radius: 6px;
  }
}
</style>
