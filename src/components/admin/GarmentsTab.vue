<template>
  <div class="garments-tab">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-bold text-gradient">👕 Gestion des Vêtements</h2>
      <button @click="openCreateModal" class="btn btn-primary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Ajouter un vêtement
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-neon-green)] mx-auto mb-4"></div>
      <p class="text-[var(--color-text-secondary)]">Chargement des vêtements...</p>
    </div>

    <!-- Garments Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="garment in garments"
        :key="garment.id"
        class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-xl p-6 hover:border-[var(--color-neon-green)] transition-all"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-2xl font-bold text-white mb-2">
              {{ garment.type === 'tshirt' ? '👕 T-Shirt' : '🧥 Hoodie' }}
            </h3>
            <p class="text-lg font-bold text-[var(--color-neon-green)]">{{ garment.basePrice }}€</p>
          </div>
          <div class="flex gap-2">
            <button @click="openEditModal(garment)" class="btn btn-ghost text-sm">
              ✏️ Modifier
            </button>
            <button @click="confirmDelete(garment)" class="btn btn-ghost text-sm text-red-500">
              🗑️ Supprimer
            </button>
          </div>
        </div>

        <!-- Photos -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div
            v-for="(photo, index) in garment.photos"
            :key="index"
            class="aspect-square rounded-lg overflow-hidden border-2 border-[rgba(57,255,20,0.2)]"
          >
            <img
              v-if="photo"
              :src="photo"
              :alt="`${garment.type} photo ${index + 1}`"
              class="w-full h-full object-cover"
            >
            <div v-else class="w-full h-full bg-black/50 flex items-center justify-center text-[var(--color-text-secondary)]">
              Pas de photo
            </div>
          </div>
        </div>

        <!-- Caractéristiques -->
        <div class="text-sm text-[var(--color-text-secondary)] space-y-1">
          <p><strong class="text-white">Matière:</strong> {{ garment.details?.material || 'Non défini' }}</p>
          <p><strong class="text-white">Poids:</strong> {{ garment.details?.weight || 'Non défini' }}</p>
          <p><strong class="text-white">Coupe:</strong> {{ garment.details?.fit || 'Non défini' }}</p>
          <p><strong class="text-white">Entretien:</strong> {{ garment.details?.care || 'Non défini' }}</p>
        </div>
      </div>
    </div>

    <!-- Modal Create/Edit -->
    <teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        >
          <div
            class="bg-[var(--color-black-light)] border-2 border-[var(--color-neon-green)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-start justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold text-white mb-1">
                  {{ editMode ? 'Modifier le vêtement' : 'Nouveau vêtement' }}
                </h2>
              </div>
              <button
                @click="closeModal"
                class="text-[var(--color-text-secondary)] hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="saveGarment" class="space-y-6">
              <!-- Type -->
              <div>
                <label class="block text-sm font-semibold text-white mb-2">Type de vêtement *</label>
                <select
                  v-model="formData.type"
                  class="form-input w-full"
                  required
                  :disabled="editMode"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="tshirt">👕 T-Shirt</option>
                  <option value="hoodie">🧥 Hoodie</option>
                </select>
              </div>

              <!-- Prix -->
              <div>
                <label class="block text-sm font-semibold text-white mb-2">Prix de base (€) *</label>
                <input
                  v-model.number="formData.basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-input w-full"
                  required
                  placeholder="20.00"
                >
              </div>

              <!-- Photos -->
              <div>
                <label class="block text-sm font-semibold text-white mb-2">Photos (2 recommandées)</label>
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="(photo, index) in formData.photos" :key="index">
                    <label class="block text-xs text-[var(--color-text-secondary)] mb-1">Photo {{ index + 1 }}</label>
                    <div class="space-y-2">
                      <!-- Preview -->
                      <div
                        v-if="photo"
                        class="aspect-square rounded-lg overflow-hidden border-2 border-[rgba(57,255,20,0.2)] relative group"
                      >
                        <img
                          :src="photo"
                          :alt="`Photo ${index + 1}`"
                          class="w-full h-full object-cover"
                        >
                        <button
                          type="button"
                          @click="formData.photos[index] = ''"
                          class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                      <!-- Upload -->
                      <div v-else class="space-y-2">
                        <div class="border-2 border-dashed border-[rgba(57,255,20,0.3)] rounded-lg p-4 text-center">
                          <input
                            :ref="`fileInput${index}`"
                            type="file"
                            accept="image/*"
                            @change="(e) => handleImageUpload(e, index)"
                            class="hidden"
                          >
                          <button
                            type="button"
                            @click="$refs[`fileInput${index}`][0].click()"
                            class="btn btn-secondary text-sm"
                          >
                            📁 Choisir une image
                          </button>
                        </div>
                        <input
                          v-model="formData.photos[index]"
                          type="url"
                          class="form-input w-full text-sm"
                          placeholder="ou URL de l'image"
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Caractéristiques -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-white mb-2">Matière</label>
                  <input
                    v-model="formData.details.material"
                    type="text"
                    class="form-input w-full"
                    placeholder="100% coton biologique"
                  >
                </div>
                <div>
                  <label class="block text-sm font-semibold text-white mb-2">Poids</label>
                  <input
                    v-model="formData.details.weight"
                    type="text"
                    class="form-input w-full"
                    placeholder="185 g/m²"
                  >
                </div>
                <div>
                  <label class="block text-sm font-semibold text-white mb-2">Coupe</label>
                  <input
                    v-model="formData.details.fit"
                    type="text"
                    class="form-input w-full"
                    placeholder="Coupe classique unisexe"
                  >
                </div>
                <div>
                  <label class="block text-sm font-semibold text-white mb-2">Entretien</label>
                  <input
                    v-model="formData.details.care"
                    type="text"
                    class="form-input w-full"
                    placeholder="Lavage machine 30°C"
                  >
                </div>
              </div>

              <!-- Tailles disponibles -->
              <div>
                <label class="block text-sm font-semibold text-white mb-2">Tailles disponibles</label>
                <div class="flex flex-wrap gap-3">
                  <label
                    v-for="size in availableSizes"
                    :key="size"
                    class="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :value="size"
                      v-model="formData.sizes"
                      class="form-checkbox"
                    >
                    <span class="text-white">{{ size }}</span>
                  </label>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-4 pt-4">
                <button type="button" @click="closeModal" class="btn btn-ghost flex-1">
                  Annuler
                </button>
                <button
                  type="submit"
                  :disabled="uploading"
                  class="btn btn-primary flex-1"
                >
                  <span v-if="uploading">⏳ Upload en cours...</span>
                  <span v-else>{{ editMode ? '💾 Mettre à jour' : '✨ Créer' }}</span>
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
import { ref, onMounted } from 'vue'
import { useGarments } from '@/composables/useGarments'
import { uploadToCloudinary } from '@/services/cloudinary'

const { garments, loading, loadGarments, createGarment, updateGarment, deleteGarment } = useGarments()

const showModal = ref(false)
const editMode = ref(false)
const editingId = ref(null)
const uploading = ref(false)

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

const formData = ref({
  type: '',
  basePrice: 20,
  photos: ['', ''],
  details: {
    material: '',
    weight: '',
    fit: '',
    care: ''
  },
  sizes: ['S', 'M', 'L', 'XL']
})

onMounted(async () => {
  await loadGarments()
})

const openCreateModal = () => {
  editMode.value = false
  editingId.value = null
  formData.value = {
    type: '',
    basePrice: 20,
    photos: ['', ''],
    details: {
      material: '',
      weight: '',
      fit: '',
      care: ''
    },
    sizes: ['S', 'M', 'L', 'XL']
  }
  showModal.value = true
}

const openEditModal = (garment) => {
  editMode.value = true
  editingId.value = garment.id
  formData.value = {
    type: garment.type,
    basePrice: garment.basePrice,
    photos: [...(garment.photos || ['', ''])],
    details: { ...(garment.details || {}) },
    sizes: [...(garment.sizes || [])]
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editMode.value = false
  editingId.value = null
}

const handleImageUpload = async (event, index) => {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true

  try {
    const imageUrl = await uploadToCloudinary(file, 'garments')
    formData.value.photos[index] = imageUrl
    
    if (import.meta.env.DEV) {
      console.log('✅ Image uploadée:', imageUrl)
    }
  } catch (error) {
    console.error('❌ Erreur upload:', error)
    alert('Erreur lors de l\'upload de l\'image')
  } finally {
    uploading.value = false
  }
}

const saveGarment = async () => {
  uploading.value = true

  try {
    const garmentData = {
      ...formData.value,
      photos: formData.value.photos.filter(p => p !== '')
    }

    let result
    if (editMode.value) {
      result = await updateGarment(editingId.value, garmentData)
    } else {
      result = await createGarment(garmentData)
    }

    if (result.success) {
      closeModal()
      alert(editMode.value ? 'Vêtement mis à jour !' : 'Vêtement créé !')
    } else {
      alert('Erreur: ' + result.error)
    }
  } catch (error) {
    console.error('Erreur sauvegarde:', error)
    alert('Erreur lors de la sauvegarde')
  } finally {
    uploading.value = false
  }
}

const confirmDelete = async (garment) => {
  const typeName = garment.type === 'tshirt' ? 'T-Shirt' : 'Hoodie'
  if (!confirm(`Supprimer le ${typeName} ? Cette action est irréversible.`)) return

  const result = await deleteGarment(garment.id)
  if (result.success) {
    alert('Vêtement supprimé !')
  } else {
    alert('Erreur: ' + result.error)
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

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 0.5rem;
  color: white;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-neon-green);
  box-shadow: 0 0 0 3px rgba(57, 255, 20, 0.1);
}

.form-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(57, 255, 20, 0.3);
  border-radius: 0.25rem;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.form-checkbox:checked {
  background: var(--color-neon-green);
  border-color: var(--color-neon-green);
}
</style>
