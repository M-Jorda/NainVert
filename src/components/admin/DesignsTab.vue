<template>
  <div class="designs-tab">
    <!-- Header avec bouton créer -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gradient">🎨 Gestion des Designs</h2>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">
          {{ designs.length }} design{{ designs.length > 1 ? 's' : '' }} disponible{{ designs.length > 1 ? 's' : '' }}
        </p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Nouveau Design
      </button>
    </div>

    <!-- Liste des designs -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-[var(--color-text-secondary)]">Chargement des designs...</p>
    </div>

    <div v-else-if="designs.length === 0" class="text-center py-12 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-xl">
      <svg class="w-16 h-16 mx-auto mb-4 text-[var(--color-text-secondary)] opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
      <p class="text-[var(--color-text-secondary)] mb-4">Aucun design pour le moment</p>
      <button @click="openCreateModal" class="btn btn-primary">
        Créer le premier design
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="design in designs" 
        :key="design.id"
        class="design-card bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-xl overflow-hidden hover:border-[var(--color-neon-green)] transition-all"
      >
        <!-- Image principale -->
        <div class="aspect-square overflow-hidden bg-black">
          <img 
            :src="design.images[0]" 
            :alt="design.name"
            class="w-full h-full object-cover"
          >
        </div>

        <!-- Contenu -->
        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-bold text-white">{{ design.name }}</h3>
            <span 
              :class="[
                'px-2 py-1 text-xs font-bold rounded',
                design.inStock 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              ]"
            >
              {{ design.inStock ? '🟢 En stock' : '🔴 Rupture' }}
            </span>
          </div>

          <p class="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">
            {{ design.tagline || design.description }}
          </p>

          <!-- Disponibilité -->
          <div class="flex gap-2 mb-3">
            <span 
              v-for="type in design.availableOn" 
              :key="type"
              class="px-2 py-1 text-xs bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.2)] rounded text-[var(--color-neon-green)]"
            >
              {{ type === 'tshirt' ? '👕 T-Shirt' : '🧥 Hoodie' }}
            </span>
            <span 
              v-if="design.featured"
              class="px-2 py-1 text-xs bg-yellow-500/20 border border-yellow-500/40 rounded text-yellow-400"
            >
              ⭐ Featured
            </span>
          </div>

          <!-- Prix -->
          <div class="flex gap-3 mb-4 text-sm">
            <div v-if="design.availableOn.includes('tshirt')">
              <span class="text-[var(--color-text-secondary)]">T-shirt:</span>
              <span class="text-[var(--color-neon-green)] font-bold ml-1">{{ design.prices.tshirt }}€</span>
            </div>
            <div v-if="design.availableOn.includes('hoodie')">
              <span class="text-[var(--color-text-secondary)]">Hoodie:</span>
              <span class="text-[var(--color-neon-green)] font-bold ml-1">{{ design.prices.hoodie }}€</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button 
              @click="editDesign(design)" 
              class="btn btn-secondary flex-1 text-sm py-2"
            >
              ✏️ Éditer
            </button>
            <button 
              @click="toggleStock(design)" 
              :class="[
                'btn flex-1 text-sm py-2',
                design.inStock ? 'btn-ghost' : 'btn-primary'
              ]"
            >
              {{ design.inStock ? '📦 Désactiver' : '✅ Activer' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Create/Edit Design -->
    <teleport to="body">
      <transition name="modal-fade">
        <div 
          v-if="showModal" 
          class="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto"
          @click="closeModal"
        >
          <div 
            class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gradient">
                {{ isEditMode ? '✏️ Éditer le design' : '➕ Nouveau design' }}
              </h2>
              <button 
                @click="closeModal"
                class="w-10 h-10 flex items-center justify-center border border-[rgba(57,255,20,0.2)] rounded-lg text-[var(--color-text-secondary)] hover:border-[var(--color-neon-green)] hover:text-[var(--color-neon-green)] transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form @submit.prevent="saveDesign" class="space-y-6">
              <!-- Nom & Slug -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-white mb-2">Nom du design *</label>
                  <input 
                    v-model="formData.name" 
                    type="text" 
                    required
                    class="form-input w-full"
                    placeholder="Neon Dreams"
                    @input="generateSlug"
                  >
                </div>
                <div>
                  <label class="block text-sm font-semibold text-white mb-2">Slug (URL) *</label>
                  <input 
                    v-model="formData.slug" 
                    type="text" 
                    required
                    class="form-input w-full"
                    placeholder="neon-dreams"
                  >
                </div>
              </div>

              <!-- Tagline & Description -->
              <div>
                <label class="block text-sm font-semibold text-white mb-2">Tagline</label>
                <input 
                  v-model="formData.tagline" 
                  type="text" 
                  class="form-input w-full"
                  placeholder="Plongez dans l'univers psychédélique"
                >
              </div>

              <div>
                <label class="block text-sm font-semibold text-white mb-2">Description courte *</label>
                <textarea 
                  v-model="formData.description" 
                  rows="3"
                  required
                  class="form-input w-full"
                  placeholder="Design psychédélique avec motifs néon vibrants..."
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-semibold text-white mb-2">Histoire (optionnel)</label>
                <textarea 
                  v-model="formData.story" 
                  rows="4"
                  class="form-input w-full"
                  placeholder="Inspiré par les néons qui illuminent les rues de Tokyo la nuit..."
                ></textarea>
              </div>

              <!-- Disponibilité & Prix -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-white mb-2">Disponible sur *</label>
                  <div class="space-y-2">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        value="tshirt"
                        v-model="formData.availableOn"
                        class="form-checkbox"
                      >
                      <span>👕 T-Shirt</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        value="hoodie"
                        v-model="formData.availableOn"
                        class="form-checkbox"
                      >
                      <span>🧥 Hoodie</span>
                    </label>
                  </div>
                </div>

                <div class="space-y-3">
                  <div v-if="formData.availableOn.includes('tshirt')">
                    <label class="block text-sm font-semibold text-white mb-2">Prix T-Shirt (€)</label>
                    <input 
                      v-model.number="formData.prices.tshirt" 
                      type="number" 
                      min="0"
                      class="form-input w-full"
                    >
                  </div>
                  <div v-if="formData.availableOn.includes('hoodie')">
                    <label class="block text-sm font-semibold text-white mb-2">Prix Hoodie (€)</label>
                    <input 
                      v-model.number="formData.prices.hoodie" 
                      type="number" 
                      min="0"
                      class="form-input w-full"
                    >
                  </div>
                </div>
              </div>

              <!-- Options -->
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="formData.featured"
                    class="form-checkbox"
                  >
                  <span>⭐ Design en vedette</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    v-model="formData.inStock"
                    class="form-checkbox"
                  >
                  <span>🟢 En stock</span>
                </label>
              </div>

              <!-- Images -->
              <div>
                <label class="block text-sm font-semibold text-white mb-2">Images (URLs séparées par des virgules)</label>
                <textarea 
                  v-model="imageUrls" 
                  rows="3"
                  class="form-input w-full"
                  placeholder="/products/design-1.jpg, /products/design-2.jpg"
                ></textarea>
                <p class="text-xs text-[var(--color-text-muted)] mt-1">
                  💡 Entrez les URLs des images séparées par des virgules
                </p>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-4 border-t border-[rgba(57,255,20,0.2)]">
                <button type="submit" class="btn btn-primary flex-1">
                  {{ isEditMode ? '💾 Sauvegarder' : '✅ Créer le design' }}
                </button>
                <button type="button" @click="closeModal" class="btn btn-ghost">
                  Annuler
                </button>
                <button 
                  v-if="isEditMode" 
                  type="button" 
                  @click="deleteDesignConfirm" 
                  class="btn bg-red-500/20 hover:bg-red-500/30 border-red-500/40 text-red-300"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDesigns } from '@/composables/useDesigns'

const { designs, loading, loadDesigns, updateDesign, createDesign, deleteDesign } = useDesigns()

const showModal = ref(false)
const isEditMode = ref(false)
const currentDesign = ref(null)
const imageUrls = ref('')

const formData = ref({
  name: '',
  slug: '',
  tagline: '',
  description: '',
  story: '',
  availableOn: ['tshirt'],
  prices: {
    tshirt: 35,
    hoodie: 75
  },
  featured: false,
  inStock: true,
  images: [],
  colors: ['Noir']
})

onMounted(async () => {
  await loadDesigns()
})

const generateSlug = () => {
  if (!isEditMode.value) {
    formData.value.slug = formData.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

const openCreateModal = () => {
  isEditMode.value = false
  currentDesign.value = null
  formData.value = {
    name: '',
    slug: '',
    tagline: '',
    description: '',
    story: '',
    availableOn: ['tshirt'],
    prices: { tshirt: 35, hoodie: 75 },
    featured: false,
    inStock: true,
    images: [],
    colors: ['Noir']
  }
  imageUrls.value = ''
  showModal.value = true
}

const editDesign = (design) => {
  isEditMode.value = true
  currentDesign.value = design
  formData.value = {
    ...design,
    availableOn: [...design.availableOn],
    prices: { ...design.prices },
    images: [...design.images]
  }
  imageUrls.value = design.images.join(', ')
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveDesign = async () => {
  const images = imageUrls.value
    .split(',')
    .map(url => url.trim())
    .filter(url => url)
  
  const designData = {
    ...formData.value,
    images,
    createdAt: isEditMode.value ? currentDesign.value.createdAt : new Date()
  }

  let result
  if (isEditMode.value) {
    result = await updateDesign(formData.value.slug, designData)
  } else {
    result = await createDesign(designData)
  }

  if (result.success) {
    console.log('✅ Design sauvegardé')
    closeModal()
    await loadDesigns()
  } else {
    alert('Erreur lors de la sauvegarde du design')
  }
}

const toggleStock = async (design) => {
  const result = await updateDesign(design.slug, { inStock: !design.inStock })
  if (result.success) {
    console.log('✅ Stock mis à jour')
  }
}

const deleteDesignConfirm = async () => {
  if (!confirm(`Supprimer définitivement le design "${currentDesign.value.name}" ?`)) {
    return
  }

  const result = await deleteDesign(currentDesign.value.slug)
  if (result.success) {
    console.log('✅ Design supprimé')
    closeModal()
    await loadDesigns()
  } else {
    alert('Erreur lors de la suppression du design')
  }
}
</script>

<style scoped>
.design-card {
  transition: all 0.3s ease;
}

.design-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(57, 255, 20, 0.2);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.form-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(57, 255, 20, 0.3);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  accent-color: var(--color-neon-green);
}
</style>
