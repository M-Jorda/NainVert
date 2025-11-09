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

          <!-- Prix -->
          <div class="mb-3 text-sm">
            <div class="text-[var(--color-text-secondary)]">Prix design: 
              <span class="text-[var(--color-neon-green)] font-bold">{{ design.designPrice }}€</span>
            </div>
            <div class="text-xs text-[var(--color-text-muted)] mt-1">
              T-shirt: {{ (design.designPrice + 20).toFixed(2) }}€ • Hoodie: {{ (design.designPrice + 55).toFixed(2) }}€
            </div>
          </div>

          <!-- Nombre d'images -->
          <div class="mb-4 text-sm text-[var(--color-text-secondary)]">
            📸 {{ design.images.length }} image{{ design.images.length > 1 ? 's' : '' }}
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

              <!-- Prix du design -->
              <div>
                <label class="block text-sm font-semibold text-white mb-2">Prix du design (€) *</label>
                <input 
                  v-model.number="formData.designPrice" 
                  type="number" 
                  min="0"
                  step="0.01"
                  required
                  class="form-input w-full"
                  placeholder="15.00"
                >
                <p class="text-xs text-[var(--color-text-muted)] mt-1">
                  💡 Le prix final = Prix design + Prix vêtement (T-shirt: 20€, Hoodie: 55€)
                </p>
              </div>

          <!-- Upload Images -->
          <div>
            <label class="block text-sm font-semibold text-white mb-2">Images du design *</label>
            
            <!-- Zone d'upload -->
            <div class="border-2 border-dashed border-[rgba(57,255,20,0.3)] rounded-xl p-6 text-center hover:border-[var(--color-neon-green)] transition-colors">
              <input 
                ref="fileInput"
                type="file"
                accept="image/*"
                multiple
                @change="handleImageUpload"
                class="hidden"
              >
              <button 
                type="button"
                @click="$refs.fileInput.click()"
                class="btn btn-secondary mb-3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                📱 Choisir des images
              </button>
              <p class="text-sm text-[var(--color-text-secondary)]">
                Formats acceptés : JPG, PNG, WebP
              </p>
              <p class="text-xs text-[var(--color-text-muted)] mt-1">
                💡 Sélectionnez plusieurs images depuis votre téléphone ou PC
              </p>
            </div>

            <!-- Aperçu des images -->
            <div v-if="uploadedImages.length > 0" class="mt-4 grid grid-cols-3 gap-3">
              <div 
                v-for="(img, idx) in uploadedImages" 
                :key="idx"
                class="relative aspect-square rounded-lg overflow-hidden border-2 group"
                :class="img.error ? 'border-yellow-500/60' : 'border-[rgba(57,255,20,0.2)]'"
              >
                <img 
                  :src="img.preview" 
                  :alt="`Image ${idx + 1}`"
                  class="w-full h-full object-cover"
                >
                <button 
                  type="button"
                  @click="removeUploadedImage(idx)"
                  class="absolute top-2 right-2 w-8 h-8 bg-red-500/90 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  ×
                </button>
                
                <!-- Indicateur d'upload en cours -->
                <div v-if="img.uploading" class="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-neon-green)] mb-2"></div>
                  <div class="text-white text-xs">Upload...</div>
                </div>
                
                <!-- Indicateur d'erreur / URL temporaire -->
                <div v-if="img.error && !img.uploading" class="absolute bottom-0 left-0 right-0 bg-yellow-500/90 text-black text-xs py-1 px-2 text-center">
                  ⚠️ URL temporaire
                </div>
              </div>
            </div>
          </div>              <!-- Actions -->
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
import { ref, onMounted } from 'vue'
import { useDesigns } from '@/composables/useDesigns'
import { uploadToCloudinary } from '@/services/cloudinary'

const { designs, loading, loadDesigns, updateDesign, createDesign, deleteDesign } = useDesigns()

const showModal = ref(false)
const isEditMode = ref(false)
const currentDesign = ref(null)
const uploadedImages = ref([])
const fileInput = ref(null)

const formData = ref({
  name: '',
  slug: '',
  tagline: '',
  description: '',
  story: '',
  designPrice: 15,
  featured: true, // Toujours en vedette
  inStock: true,  // Toujours en stock
  images: []
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
    designPrice: 15,
    featured: true,
    inStock: true,
    images: []
  }
  uploadedImages.value = []
  showModal.value = true
}

const editDesign = (design) => {
  isEditMode.value = true
  currentDesign.value = design
  formData.value = {
    ...design,
    images: [...design.images]
  }
  // Reconstruire uploadedImages depuis les URLs existantes
  uploadedImages.value = design.images.map((url, idx) => ({
    preview: url,
    url: url,
    uploading: false
  }))
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files)
  const isDev = import.meta.env.DEV
  
  for (const file of files) {
    // Vérifier la taille du fichier
    const fileSizeKB = (file.size / 1024).toFixed(2)
    if (isDev) console.log(`📦 Fichier: ${file.name} (${fileSizeKB} KB)`)
    
    // Créer aperçu local
    const preview = URL.createObjectURL(file)
    
    // Ajouter l'image au tableau réactif
    const imageIndex = uploadedImages.value.length
    uploadedImages.value.push({
      file,
      preview,
      uploading: true,
      url: null,
      error: false
    })

    try {
      if (isDev) console.log('⏳ Début upload...')
      const startTime = Date.now()
      
      // Upload vers Cloudinary
      const url = await uploadImageToStorage(file)
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2)
      if (isDev) console.log(`✅ Upload terminé en ${duration}s`)
      
      // IMPORTANT: Mettre à jour directement dans le tableau réactif
      uploadedImages.value[imageIndex].url = url
      uploadedImages.value[imageIndex].uploading = false
      uploadedImages.value[imageIndex].error = false
      
      if (isDev) console.log('🎯 Image state updated:', uploadedImages.value[imageIndex])
      
      // Ajouter l'URL au formData
      formData.value.images.push(url)
    } catch (error) {
      console.error('❌ Erreur upload:', error)
      
      // Mettre à jour l'état d'erreur
      uploadedImages.value[imageIndex].uploading = false
      uploadedImages.value[imageIndex].error = true
      
      // Afficher un message d'erreur clair
      let errorMsg = 'Erreur lors de l\'upload de l\'image.'
      
      if (error.message.includes('Upload preset')) {
        errorMsg = '⚠️ Configuration Cloudinary incomplète.\n\n' +
          'Tu dois créer un "Upload Preset" dans Cloudinary :\n' +
          '1. Va sur : https://console.cloudinary.com/settings/upload\n' +
          '2. Clique "Add upload preset"\n' +
          '3. Nom : nainvert_designs\n' +
          '4. Signing Mode : Unsigned\n' +
          '5. Folder : designs\n' +
          '6. Save'
      } else {
        errorMsg = `Erreur : ${error.message}`
      }
      
      alert(errorMsg)
      
      // Retirer l'image en cas d'erreur
      uploadedImages.value.splice(imageIndex, 1)
    }
  }
  
  // Réinitialiser l'input pour permettre de re-sélectionner le même fichier
  event.target.value = ''
}

const removeUploadedImage = (idx) => {
  const img = uploadedImages.value[idx]
  URL.revokeObjectURL(img.preview)
  
  // Retirer du tableau d'aperçu
  uploadedImages.value.splice(idx, 1)
  
  // Retirer du formData
  if (img.url) {
    const urlIdx = formData.value.images.indexOf(img.url)
    if (urlIdx > -1) {
      formData.value.images.splice(urlIdx, 1)
    }
  }
}

const uploadImageToStorage = async (file) => {
  const isDev = import.meta.env.DEV
  
  try {
    if (isDev) console.log('📤 Upload vers Cloudinary...')
    if (isDev) console.log('📊 Taille:', (file.size / 1024).toFixed(2), 'KB')
    
    const startTime = Date.now()
    
    // Upload vers Cloudinary
    const url = await uploadToCloudinary(file)
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    if (isDev) console.log(`✅ Upload terminé en ${duration}s`)
    if (isDev) console.log('🔗 URL:', url)
    
    return url
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload:', error)
    
    // Message d'erreur spécifique
    if (error.message.includes('Upload preset')) {
      throw new Error('Upload preset non configuré. Voir les instructions ci-dessous.')
    }
    
    throw error
  }
}

const saveDesign = async () => {
  const designData = {
    ...formData.value,
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
