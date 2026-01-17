<template>
  <div class="plan-tab">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gradient">Plan Interactif</h2>
        <p class="text-sm text-[var(--color-text-secondary)] mt-1">
          {{ plan?.hotspots?.length || 0 }} zone{{ (plan?.hotspots?.length || 0) > 1 ? 's' : '' }} interactive{{ (plan?.hotspots?.length || 0) > 1 ? 's' : '' }}
        </p>
      </div>
      <div class="flex gap-2">
        <button
          v-if="plan?.imageUrl"
          @click="handleTogglePlanActive"
          :class="['btn', plan.isActive ? 'btn-primary' : 'btn-ghost']"
        >
          {{ plan.isActive ? 'Actif' : 'Inactif' }}
        </button>
        <button
          v-if="!plan?.imageUrl"
          @click="openUploadModal"
          class="btn btn-primary"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Uploader un plan
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-[var(--color-text-secondary)]">Chargement du plan...</p>
    </div>

    <!-- No Plan State -->
    <div v-else-if="!plan?.imageUrl" class="text-center py-12 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-xl">
      <svg class="w-16 h-16 mx-auto mb-4 text-[var(--color-text-secondary)] opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <p class="text-[var(--color-text-secondary)] mb-4">Aucun plan configure</p>
      <button @click="openUploadModal" class="btn btn-primary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        Uploader une image
      </button>
    </div>

    <!-- Plan Editor -->
    <div v-else class="plan-editor">
      <!-- Toolbar -->
      <div class="flex items-center justify-between mb-4 p-3 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg">
        <div class="flex gap-2">
          <button
            @click="editorMode = 'view'"
            :class="['btn btn-sm', editorMode === 'view' ? 'btn-primary' : 'btn-ghost']"
          >
            Visualiser
          </button>
          <button
            @click="editorMode = 'add'"
            :class="['btn btn-sm', editorMode === 'add' ? 'btn-primary' : 'btn-ghost']"
          >
            + Ajouter zone
          </button>
          <button
            @click="editorMode = 'edit'"
            :class="['btn btn-sm', editorMode === 'edit' ? 'btn-primary' : 'btn-ghost']"
          >
            Editer zones
          </button>
        </div>
        <button @click="openUploadModal" class="btn btn-ghost btn-sm">
          Changer l'image
        </button>
      </div>

      <!-- Mode Instructions -->
      <div v-if="editorMode === 'add'" class="mb-4 p-3 bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.3)] rounded-lg text-sm text-[var(--color-neon-green)]">
        Cliquez sur l'image pour placer une nouvelle zone interactive
      </div>
      <div v-else-if="editorMode === 'edit'" class="mb-4 p-3 bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.3)] rounded-lg text-sm text-[var(--color-neon-green)]">
        Glissez les zones pour les repositionner. Cliquez pour editer.
      </div>

      <!-- Interactive Canvas -->
      <div
        ref="canvasContainer"
        class="relative border-2 border-[rgba(57,255,20,0.3)] rounded-xl overflow-hidden"
        :class="{ 'cursor-crosshair': editorMode === 'add' }"
        @click="handleCanvasClick"
      >
        <img
          :src="plan.imageUrl"
          alt="Plan du site"
          class="w-full h-auto"
          @load="imageLoaded = true"
        >

        <!-- Hotspots Overlay -->
        <div
          v-for="(hotspot, index) in plan.hotspots"
          :key="hotspot.id"
          :style="getHotspotStyle(hotspot)"
          :class="[
            'absolute transform -translate-x-1/2 -translate-y-1/2 transition-all',
            editorMode === 'edit' ? 'cursor-move' : 'cursor-pointer',
            selectedHotspot?.id === hotspot.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
          ]"
          @click.stop="handleHotspotClick(hotspot)"
          @mousedown="startDrag(hotspot, $event)"
        >
          <!-- Circle Hotspot -->
          <div
            class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-black"
            :style="{
              borderColor: hotspot.color || '#39FF14',
              backgroundColor: hotspot.color || '#39FF14'
            }"
          >
            {{ index + 1 }}
          </div>

          <!-- Label Tooltip -->
          <div
            v-if="hotspot.label && editorMode !== 'add'"
            class="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
            :class="{ 'opacity-100': selectedHotspot?.id === hotspot.id }"
          >
            {{ hotspot.label }}
          </div>
        </div>
      </div>

      <!-- Hotspots List -->
      <div class="mt-6">
        <h3 class="text-lg font-bold text-white mb-3">Zones interactives</h3>
        <div v-if="!plan.hotspots?.length" class="text-center py-6 text-[var(--color-text-secondary)] bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.1)] rounded-lg">
          Cliquez sur l'image en mode "Ajouter zone" pour creer une zone interactive
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="(hotspot, index) in plan.hotspots"
            :key="hotspot.id"
            :class="[
              'flex items-center gap-3 p-3 bg-[rgba(57,255,20,0.05)] border rounded-lg cursor-pointer transition-all',
              selectedHotspot?.id === hotspot.id
                ? 'border-[var(--color-neon-green)]'
                : 'border-[rgba(57,255,20,0.2)] hover:border-[rgba(57,255,20,0.4)]'
            ]"
            @click="selectHotspot(hotspot)"
          >
            <span
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
              :style="{ backgroundColor: hotspot.color || '#39FF14' }"
            >
              {{ index + 1 }}
            </span>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-white truncate">{{ hotspot.label || 'Sans titre' }}</p>
              <p class="text-xs text-[var(--color-text-secondary)] truncate">{{ hotspot.link || 'Aucun lien' }}</p>
            </div>
            <button
              @click.stop="openEditHotspotModal(hotspot)"
              class="w-8 h-8 flex items-center justify-center border border-[rgba(57,255,20,0.2)] rounded-lg text-[var(--color-text-secondary)] hover:border-[var(--color-neon-green)] hover:text-[var(--color-neon-green)] transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button
              @click.stop="confirmDeleteHotspot(hotspot)"
              class="w-8 h-8 flex items-center justify-center border border-[rgba(255,0,0,0.2)] rounded-lg text-red-400 hover:border-red-500 hover:text-red-500 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="showUploadModal"
          class="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        >
          <div
            class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl max-w-lg w-full p-6"
            @click.stop
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gradient">
                {{ plan?.imageUrl ? 'Changer l\'image du plan' : 'Uploader un plan' }}
              </h2>
              <button
                @click="closeUploadModal"
                class="w-10 h-10 flex items-center justify-center border border-[rgba(57,255,20,0.2)] rounded-lg text-[var(--color-text-secondary)] hover:border-[var(--color-neon-green)] hover:text-[var(--color-neon-green)] transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Upload Zone -->
            <div
              v-if="!uploadPreview"
              class="space-y-4"
            >
              <!-- File upload option -->
              <div class="border-2 border-dashed border-[rgba(57,255,20,0.3)] rounded-xl p-6 text-center hover:border-[var(--color-neon-green)] transition-colors">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleImageSelect"
                  class="hidden"
                >
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="btn btn-secondary mb-2"
                  :disabled="uploading"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Choisir une image
                </button>
                <p class="text-xs text-[var(--color-text-secondary)]">
                  JPG, PNG, WebP
                </p>
              </div>

              <!-- Separator -->
              <div class="flex items-center gap-3">
                <div class="flex-1 h-px bg-[rgba(57,255,20,0.2)]"></div>
                <span class="text-xs text-[var(--color-text-secondary)]">OU</span>
                <div class="flex-1 h-px bg-[rgba(57,255,20,0.2)]"></div>
              </div>

              <!-- URL paste option -->
              <div>
                <label class="block text-xs font-semibold text-white mb-2">Coller une URL Cloudinary</label>
                <div class="flex gap-2">
                  <input
                    v-model="pastedUrl"
                    type="text"
                    class="form-input flex-1 text-sm"
                    placeholder="https://res.cloudinary.com/..."
                  >
                  <button
                    type="button"
                    @click="useUrlPreview"
                    :disabled="!pastedUrl"
                    class="btn btn-secondary"
                  >
                    Utiliser
                  </button>
                </div>
              </div>
            </div>

            <!-- Preview -->
            <div v-else class="relative">
              <img
                :src="uploadPreview"
                alt="Apercu"
                class="w-full h-auto rounded-lg border border-[rgba(57,255,20,0.2)]"
              >
              <button
                v-if="!uploading"
                @click="clearUploadPreview"
                class="absolute top-2 right-2 w-8 h-8 bg-red-500/90 hover:bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                x
              </button>
              <div v-if="uploading" class="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-lg">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-neon-green)] mb-2"></div>
                <div class="text-white text-sm">Upload en cours...</div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 mt-6">
              <button
                @click="uploadAndSave"
                :disabled="!uploadPreview || uploading"
                class="btn btn-primary flex-1"
              >
                {{ uploading ? 'Upload...' : 'Sauvegarder' }}
              </button>
              <button
                @click="closeUploadModal"
                :disabled="uploading"
                class="btn btn-ghost"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Hotspot Edit Modal -->
    <teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="showHotspotModal"
          class="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        >
          <div
            class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl max-w-md w-full p-6"
            @click.stop
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gradient">
                {{ hotspotForm.id ? 'Editer la zone' : 'Nouvelle zone' }}
              </h2>
              <button
                @click="closeHotspotModal"
                class="w-10 h-10 flex items-center justify-center border border-[rgba(57,255,20,0.2)] rounded-lg text-[var(--color-text-secondary)] hover:border-[var(--color-neon-green)] hover:text-[var(--color-neon-green)] transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form @submit.prevent="saveHotspot" class="space-y-4">
              <!-- Label -->
              <div>
                <label class="block text-xs font-semibold text-white mb-1">Libelle *</label>
                <input
                  v-model="hotspotForm.label"
                  type="text"
                  required
                  class="form-input w-full text-sm"
                  placeholder="Ex: T-Shirts, Contact, etc."
                >
              </div>

              <!-- Link -->
              <div>
                <label class="block text-xs font-semibold text-white mb-1">Lien *</label>
                <input
                  v-model="hotspotForm.link"
                  type="text"
                  required
                  class="form-input w-full text-sm"
                  placeholder="Ex: /designs ou https://..."
                >
              </div>

              <!-- Link Type -->
              <div>
                <label class="block text-xs font-semibold text-white mb-1">Type de lien</label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      v-model="hotspotForm.linkType"
                      value="internal"
                      class="form-radio"
                    >
                    <span class="text-sm text-[var(--color-text-secondary)]">Interne</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      v-model="hotspotForm.linkType"
                      value="external"
                      class="form-radio"
                    >
                    <span class="text-sm text-[var(--color-text-secondary)]">Externe</span>
                  </label>
                </div>
              </div>

              <!-- Color -->
              <div>
                <label class="block text-xs font-semibold text-white mb-1">Couleur</label>
                <div class="flex gap-2">
                  <input
                    type="color"
                    v-model="hotspotForm.color"
                    class="w-10 h-10 rounded border border-[rgba(57,255,20,0.2)] cursor-pointer"
                  >
                  <input
                    v-model="hotspotForm.color"
                    type="text"
                    class="form-input flex-1 text-sm"
                    placeholder="#39FF14"
                  >
                </div>
              </div>

              <!-- Position (read-only info) -->
              <div class="text-xs text-[var(--color-text-secondary)] bg-[rgba(57,255,20,0.05)] p-2 rounded">
                Position : {{ hotspotForm.x?.toFixed(1) }}% x {{ hotspotForm.y?.toFixed(1) }}%
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-4 border-t border-[rgba(57,255,20,0.2)]">
                <button type="submit" class="btn btn-primary flex-1">
                  {{ hotspotForm.id ? 'Sauvegarder' : 'Creer' }}
                </button>
                <button type="button" @click="closeHotspotModal" class="btn btn-ghost">
                  Annuler
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
import { usePlan } from '@/composables/usePlan'
import { uploadToCloudinary } from '@/services/cloudinary'

const {
  plan,
  loading,
  loadPlan,
  savePlan,
  addHotspot,
  updateHotspot,
  deleteHotspot,
  togglePlanActive
} = usePlan()

// Editor state
const editorMode = ref('view')
const selectedHotspot = ref(null)
const canvasContainer = ref(null)
const imageLoaded = ref(false)

// Upload modal state
const showUploadModal = ref(false)
const fileInput = ref(null)
const uploadPreview = ref(null)
const uploadFile = ref(null)
const uploading = ref(false)
const pastedUrl = ref('')
const isUrlMode = ref(false)

// Hotspot modal state
const showHotspotModal = ref(false)
const hotspotForm = ref({
  id: null,
  x: 0,
  y: 0,
  label: '',
  link: '',
  linkType: 'internal',
  color: '#39FF14'
})

// Drag state
let isDragging = false
let dragHotspot = null

onMounted(async () => {
  await loadPlan()
})

// Canvas click handler
const handleCanvasClick = (event) => {
  if (editorMode.value !== 'add' || isDragging) return

  const rect = canvasContainer.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  // Open modal to configure the new hotspot
  hotspotForm.value = {
    id: null,
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
    label: '',
    link: '',
    linkType: 'internal',
    color: '#39FF14'
  }
  showHotspotModal.value = true
  document.body.style.overflow = 'hidden'
}

// Hotspot positioning
const getHotspotStyle = (hotspot) => ({
  left: `${hotspot.x}%`,
  top: `${hotspot.y}%`
})

// Hotspot selection
const selectHotspot = (hotspot) => {
  selectedHotspot.value = hotspot
}

const handleHotspotClick = (hotspot) => {
  if (editorMode.value === 'edit') {
    openEditHotspotModal(hotspot)
  } else {
    selectHotspot(hotspot)
  }
}

// Drag functionality
const startDrag = (hotspot, event) => {
  if (editorMode.value !== 'edit') return

  event.preventDefault()
  isDragging = true
  dragHotspot = hotspot

  const rect = canvasContainer.value.getBoundingClientRect()

  const onMouseMove = (e) => {
    if (!isDragging || !dragHotspot) return

    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Update local position (visual feedback)
    const idx = plan.value.hotspots.findIndex(h => h.id === dragHotspot.id)
    if (idx !== -1) {
      plan.value.hotspots[idx].x = Math.max(0, Math.min(100, x))
      plan.value.hotspots[idx].y = Math.max(0, Math.min(100, y))
    }
  }

  const onMouseUp = async () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)

    if (!isDragging || !dragHotspot) return

    // Save to Firestore
    const idx = plan.value.hotspots.findIndex(h => h.id === dragHotspot.id)
    if (idx !== -1) {
      await updateHotspot(dragHotspot.id, {
        x: plan.value.hotspots[idx].x,
        y: plan.value.hotspots[idx].y
      })
    }

    isDragging = false
    dragHotspot = null
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// Upload modal handlers
const openUploadModal = () => {
  showUploadModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeUploadModal = () => {
  showUploadModal.value = false
  uploadPreview.value = null
  uploadFile.value = null
  pastedUrl.value = ''
  isUrlMode.value = false
  document.body.style.overflow = ''
}

const handleImageSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  uploadFile.value = file
  uploadPreview.value = URL.createObjectURL(file)
  isUrlMode.value = false
}

const useUrlPreview = () => {
  if (!pastedUrl.value) return
  uploadPreview.value = pastedUrl.value
  uploadFile.value = null
  isUrlMode.value = true
}

const clearUploadPreview = () => {
  if (uploadPreview.value && !isUrlMode.value) {
    URL.revokeObjectURL(uploadPreview.value)
  }
  uploadPreview.value = null
  uploadFile.value = null
  pastedUrl.value = ''
  isUrlMode.value = false
}

const uploadAndSave = async () => {
  if (!uploadPreview.value) return

  uploading.value = true

  try {
    let url = uploadPreview.value

    // If not URL mode, upload to Cloudinary first
    if (!isUrlMode.value && uploadFile.value) {
      url = await uploadToCloudinary(uploadFile.value)
    }

    // Get image dimensions
    const img = new Image()
    img.onload = async () => {
      const planData = {
        name: 'Plan du site',
        imageUrl: url,
        imageWidth: img.width,
        imageHeight: img.height,
        hotspots: plan.value?.hotspots || [],
        isActive: plan.value?.isActive ?? true
      }

      const result = await savePlan(planData)

      if (result.success) {
        uploading.value = false
        closeUploadModal()
      } else {
        alert('Erreur lors de la sauvegarde: ' + (result.error || 'Erreur inconnue'))
        uploading.value = false
      }
    }
    img.onerror = () => {
      alert('Erreur lors du chargement de l\'image')
      uploading.value = false
    }
    img.src = url
  } catch (error) {
    alert('Erreur lors de l\'upload: ' + error.message)
    uploading.value = false
  }
}

// Hotspot modal handlers
const openEditHotspotModal = (hotspot) => {
  hotspotForm.value = { ...hotspot }
  showHotspotModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeHotspotModal = () => {
  showHotspotModal.value = false
  hotspotForm.value = {
    id: null,
    x: 0,
    y: 0,
    label: '',
    link: '',
    linkType: 'internal',
    color: '#39FF14'
  }
  document.body.style.overflow = ''
}

const saveHotspot = async () => {
  if (hotspotForm.value.id) {
    // Editing existing
    await updateHotspot(hotspotForm.value.id, {
      label: hotspotForm.value.label,
      link: hotspotForm.value.link,
      linkType: hotspotForm.value.linkType,
      color: hotspotForm.value.color
    })
  } else {
    // Adding new
    await addHotspot({
      x: hotspotForm.value.x,
      y: hotspotForm.value.y,
      label: hotspotForm.value.label,
      link: hotspotForm.value.link,
      linkType: hotspotForm.value.linkType,
      color: hotspotForm.value.color
    })
  }
  closeHotspotModal()
}

const confirmDeleteHotspot = async (hotspot) => {
  if (!confirm(`Supprimer la zone "${hotspot.label || 'Sans titre'}" ?`)) return

  await deleteHotspot(hotspot.id)

  if (selectedHotspot.value?.id === hotspot.id) {
    selectedHotspot.value = null
  }
}

// Toggle plan active
const handleTogglePlanActive = async () => {
  await togglePlanActive()
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.form-radio {
  width: 16px;
  height: 16px;
  accent-color: var(--color-neon-green);
}
</style>
