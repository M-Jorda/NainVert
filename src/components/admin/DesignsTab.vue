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

    <!-- Tableau des designs -->
    <div v-else class="overflow-hidden border border-[rgba(57,255,20,0.2)] rounded-xl">
      <table class="designs-table">
        <thead>
          <tr>
            <th>Design</th>
            <th>Stock</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="design in sortedDesigns"
            :key="design.id"
            @click="editDesign(design)"
            class="hover:bg-[rgba(57,255,20,0.05)] cursor-pointer transition-all"
          >
            <td>
              <div class="flex items-center gap-3">
                <img
                  v-if="design.images && design.images[0]"
                  :src="design.images[0]"
                  :alt="design.name"
                  class="w-16 h-16 rounded object-cover border border-[rgba(57,255,20,0.2)]"
                  :class="{ 'opacity-50': design.archived }"
                >
                <div>
                  <div class="font-bold text-white" :class="{ 'opacity-50': design.archived }">
                    {{ design.name }}
                    <span v-if="design.archived" class="text-xs text-yellow-500 ml-2">📦 Archivé</span>
                  </div>
                  <div class="text-xs text-[var(--color-text-secondary)] line-clamp-1">
                    {{ design.tagline || design.description }}
                  </div>
                </div>
              </div>
            </td>
            <td>
              <span 
                :class="[
                  'px-3 py-1 text-xs font-bold rounded-full',
                  design.inStock 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                ]"
              >
                {{ design.inStock ? '✅ En stock' : '🔴 Rupture' }}
              </span>
            </td>
            <td>
              <button
                @click.stop="toggleArchive(design)"
                :class="[
                  'px-3 py-1 text-xs font-bold rounded-full transition-colors',
                  design.archived
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                ]"
              >
                {{ design.archived ? '📦 Archivé' : '✅ Actif' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Create/Edit Design -->
    <teleport to="body">
      <transition name="modal-fade">
        <div 
          v-if="showModal" 
          class="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-hidden"
        >
          <div 
            class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl max-w-6xl w-full p-6 max-h-[90vh] overflow-y-auto"
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

            <form @submit.prevent="saveDesign">
              <!-- Layout 2 colonnes -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Colonne gauche : Champs -->
                <div class="space-y-4">
                  <!-- Nom & Slug -->
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-semibold text-white mb-1">Nom du design *</label>
                      <input 
                        v-model="formData.name" 
                        type="text" 
                        required
                        class="form-input w-full text-sm"
                        placeholder="Neon Dreams"
                        @input="generateSlug"
                      >
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-white mb-1">Slug (URL) *</label>
                      <input 
                        v-model="formData.slug" 
                        type="text" 
                        required
                        class="form-input w-full text-sm"
                        placeholder="neon-dreams"
                      >
                    </div>
                  </div>

                  <!-- Tagline -->
                  <div>
                    <label class="block text-xs font-semibold text-white mb-1">Tagline</label>
                    <input 
                      v-model="formData.tagline" 
                      type="text" 
                      class="form-input w-full text-sm"
                      placeholder="Plongez dans l'univers psychédélique"
                    >
                  </div>

                  <!-- Description -->
                  <div>
                    <label class="block text-xs font-semibold text-white mb-1">Description courte *</label>
                    <textarea 
                      v-model="formData.description" 
                      rows="2"
                      required
                      class="form-input w-full text-sm"
                      placeholder="Design psychédélique avec motifs néon vibrants..."
                    ></textarea>
                  </div>

                  <!-- Histoire -->
                  <div>
                    <label class="block text-xs font-semibold text-white mb-1">Histoire (optionnel)</label>
                    <textarea 
                      v-model="formData.story" 
                      rows="3"
                      class="form-input w-full text-sm"
                      placeholder="Inspiré par les néons qui illuminent les rues de Tokyo la nuit..."
                    ></textarea>
                  </div>
                </div>

                <!-- Colonne droite : Image -->
                <div>
                  <label class="block text-xs font-semibold text-white mb-2">Image du design *</label>
                  
                  <!-- Zone d'upload (cachée si image uploadée) -->
                  <div 
                    v-if="uploadedImages.length === 0"
                    class="border-2 border-dashed border-[rgba(57,255,20,0.3)] rounded-xl p-6 text-center hover:border-[var(--color-neon-green)] transition-colors h-full flex flex-col items-center justify-center min-h-[400px]"
                  >
                    <input 
                      ref="fileInput"
                      type="file"
                      accept="image/*"
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
                      📱 Choisir une image
                    </button>
                    <p class="text-sm text-[var(--color-text-secondary)]">
                      Formats acceptés : JPG, PNG, WebP
                    </p>
                    <p class="text-xs text-[var(--color-text-muted)] mt-1">
                      💡 Une seule image par design
                    </p>
                  </div>

                  <!-- Aperçu de l'image -->
                  <div v-else>
                    <div 
                      v-for="(img, idx) in uploadedImages" 
                      :key="idx"
                      class="relative rounded-lg overflow-hidden border-2 group w-[85%] mx-auto"
                      :class="img.error ? 'border-yellow-500/60' : 'border-[rgba(57,255,20,0.2)]'"
                      style="aspect-ratio: 1/1;"
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
                </div>
              </div>              <!-- Actions -->
              <div class="flex gap-3 pt-4 border-t border-[rgba(57,255,20,0.2)]">
                <button type="submit" class="btn btn-primary flex-1">
                  {{ isEditMode ? '💾 Sauvegarder' : '✅ Créer le design' }}
                </button>
                <button type="button" @click="closeModal" class="btn btn-ghost">
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
import { ref, computed, onMounted } from 'vue'
import { useDesigns } from '@/composables/useDesigns'
import { uploadToCloudinary } from '@/services/cloudinary'

const { designs, loading, loadDesigns, updateDesign, createDesign, deleteDesign } = useDesigns()

// Trier les designs : actifs d'abord, archivés ensuite
const sortedDesigns = computed(() => {
  return [...designs.value].sort((a, b) => {
    // Les designs archivés vont à la fin
    if (a.archived && !b.archived) return 1
    if (!a.archived && b.archived) return -1
    // Sinon, garder l'ordre original
    return 0
  })
})

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
  designPrice: 0,  // Prix à 0 par défaut (seul le vêtement a un prix)
  featured: true, // Toujours en vedette
  inStock: true,  // Toujours en stock
  images: []
  
  /* 📝 STRUCTURE FUTURE POUR IMAGES PAR VÊTEMENT :
   * 
   * Au lieu de : images: ["url1.jpg", "url2.jpg"]
   * 
   * Utiliser :
   * garmentImages: {
   *   tshirt: ["front.jpg", "back.jpg", "detail1.jpg"],
   *   hoodie: ["front.jpg", "back.jpg", "detail1.jpg"]
   * }
   * 
   * Cela permettra :
   * - D'afficher les bonnes images selon le vêtement sélectionné
   * - De gérer une galerie d'images différente par type de vêtement
   * - De maintenir la cohérence du design tout en montrant les spécificités (capuche, manches, etc.)
   * 
   * MIGRATION NÉCESSAIRE :
   * - Modifier le formulaire pour uploader séparément les images T-shirt et Hoodie
   * - Adapter DesignDetail.vue pour charger les images selon selectedType
   * - Mettre à jour la structure Firestore des designs existants
   */
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
    designPrice: 0,  // Prix à 0 par défaut (seul le vêtement a un prix)
    featured: true,
    inStock: true,
    archived: false,  // Par défaut, le design n'est pas archivé
    images: []
  }
  uploadedImages.value = []
  showModal.value = true
  document.body.style.overflow = 'hidden'
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
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  showModal.value = false
  document.body.style.overflow = ''
}

const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files)
  const isDev = import.meta.env.DEV
  
  // BLOQUER si une image existe déjà
  if (uploadedImages.value.length >= 1) {
    alert('❌ Une seule image par design est autorisée. Supprimez l\'image existante pour en ajouter une nouvelle.')
    event.target.value = ''
    return
  }
  
  // Limiter à la première image sélectionnée
  const file = files[0]
  if (!file) return
  
  // Créer aperçu local
  const preview = URL.createObjectURL(file)
  
  // Ajouter l'image au tableau réactif
  const imageIndex = 0
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
    closeModal()
    await loadDesigns()
  } else {
    alert('Erreur lors de la sauvegarde du design')
  }
}

const toggleArchive = async (design) => {
  const newArchivedStatus = !design.archived
  const action = newArchivedStatus ? 'archiver' : 'désarchiver'
  
  if (!confirm(`Voulez-vous vraiment ${action} le design "${design.name}" ?\n\n${newArchivedStatus ? '📦 Il n\'apparaîtra plus côté utilisateur.' : '✅ Il redeviendra visible côté utilisateur.'}`)) {
    return
  }
  
  const result = await updateDesign(design.slug, { 
    archived: newArchivedStatus 
  })
  
  if (result.success) {
    await loadDesigns()
  } else {
    alert(`Erreur lors de ${action} du design`)
  }
}

</script>

<style scoped>
.designs-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-black-light);
}

.designs-table thead {
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(57, 255, 20, 0.2);
}

.designs-table th {
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.designs-table tbody tr {
  border-bottom: 1px solid rgba(57, 255, 20, 0.1);
  transition: background-color 0.2s;
}

.designs-table td {
  padding: 1rem;
  color: var(--color-text-secondary);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
