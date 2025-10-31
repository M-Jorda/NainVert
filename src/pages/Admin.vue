<template>
  <div class="min-h-screen py-20">
    <!-- Login Form -->
    <div v-if="!adminStore.isAuthenticated" class="container max-w-md mx-auto px-4">
      <div class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl p-8">
        <h1 class="text-3xl font-bold text-center mb-8">
          <span class="text-gradient">Admin Panel</span>
        </h1>
        
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">
              Email
            </label>
            <input 
              v-model="email"
              type="email"
              class="form-input"
              placeholder="admin@nainvert.com"
              required
            >
          </div>
          
          <div>
            <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">
              Mot de passe
            </label>
            <input 
              v-model="password"
              type="password"
              class="form-input"
              placeholder="Entrez le mot de passe"
              required
            >
          </div>
          
          <div v-if="loginError || adminStore.error" class="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {{ adminStore.error || 'Erreur de connexion' }}
          </div>
          
          <button type="submit" class="btn btn-primary" :disabled="adminStore.loading">
            {{ adminStore.loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Admin Dashboard -->
    <div v-else class="container max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-4xl font-bold">
          <span class="text-gradient">Admin Panel</span>
        </h1>
        <button @click="adminStore.logout" class="btn btn-ghost">
          Déconnexion
        </button>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex gap-2 mb-8 border-b border-[rgba(57,255,20,0.2)]">
        <button 
          :class="['tab-btn', { active: activeTab === 'products' }]"
          @click="activeTab = 'products'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
          Produits
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'content' }]"
          @click="activeTab = 'content'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Contenu
        </button>
      </div>

      <!-- Products Tab -->
      <div v-if="activeTab === 'products'" class="products-tab">
        <h2 class="text-2xl font-bold mb-6 text-white">Gestion des Produits</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="product in products" 
            :key="product.id"
            class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.2)] rounded-xl hover:border-[var(--color-neon-green)] transition-all duration-300"
          >
            <div class="flex gap-4 p-4">
              <!-- Product Image (compact) -->
              <div class="relative w-32 h-32 flex-shrink-0 bg-[rgba(57,255,20,0.05)] rounded-lg overflow-hidden group">
                <img 
                  :src="product.images[0]" 
                  :alt="product.name"
                  class="w-full h-full object-cover"
                >
                
                <!-- Edit Image Button -->
                <div class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button 
                    @click="openImageModal(product)"
                    class="px-3 py-2 bg-[var(--color-neon-green)] text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline mr-1">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Images
                  </button>
                </div>
              </div>

              <!-- Product Fields -->
              <div class="flex-1 flex flex-col gap-2 min-w-0">
                <!-- Nom -->
                <div>
                  <label class="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)]">Nom</label>
                  <input 
                    v-model="product.name"
                    @blur="updateProduct(product.slug, { name: product.name })"
                    class="form-input text-sm py-2"
                  >
                </div>

                <!-- Prix et Stock -->
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)]">Prix (€)</label>
                    <div class="flex items-stretch gap-1">
                      <button
                        @click="decrementPrice(product)"
                        class="price-control-btn-compact"
                        :disabled="product.price <= 1"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                      <input 
                        v-model.number="product.price"
                        @blur="updateProduct(product.slug, { price: product.price })"
                        type="number"
                        min="1"
                        class="form-input text-sm py-2 flex-1 text-center"
                      >
                      <button
                        @click="incrementPrice(product)"
                        class="price-control-btn-compact"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)]">En stock</label>
                    <label class="inline-flex items-center cursor-pointer h-[38px] px-3 bg-[var(--color-black-lighter)] rounded-lg border border-[rgba(57,255,20,0.2)]">
                      <input 
                        v-model="product.inStock"
                        @change="updateProduct(product.slug, { inStock: product.inStock })"
                        type="checkbox"
                        class="w-4 h-4 rounded border-2 border-[rgba(57,255,20,0.3)] bg-transparent checked:bg-[var(--color-neon-green)] transition-all"
                      >
                      <span class="ml-2 text-xs text-[var(--color-text-secondary)]">
                        {{ product.inStock ? '✓ Dispo' : '✗ Rupture' }}
                      </span>
                    </label>
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-xs font-semibold mb-1 text-[var(--color-text-secondary)]">Description</label>
                  <textarea 
                    v-model="product.description"
                    @blur="updateProduct(product.slug, { description: product.description })"
                    class="form-textarea text-sm py-2"
                    rows="2"
                  ></textarea>
                </div>

                <!-- Info badges -->
                <div class="flex gap-1 flex-wrap text-xs">
                  <span class="px-2 py-1 bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.2)] rounded text-[var(--color-neon-green)]">
                    {{ product.images.length }} image{{ product.images.length > 1 ? 's' : '' }}
                  </span>
                  <span class="px-2 py-1 bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.2)] rounded text-[var(--color-neon-green)]">
                    {{ product.type }}
                  </span>
                  <span class="px-2 py-1 bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.2)] rounded text-[var(--color-neon-green)]">
                    {{ product.sizes.join(', ') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Tab -->
      <div v-if="activeTab === 'content' && siteContent" class="content-tab">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Home Page Content -->
          <div class="content-section">
            <h2 class="text-2xl font-bold mb-4 text-white flex items-center gap-2">
              <span>🏠</span> Page d'accueil
            </h2>
            
            <!-- Hero Section -->
            <div class="content-card">
              <h3 class="text-lg font-semibold mb-4 text-[var(--color-neon-green)]">Section Hero</h3>
              <div class="flex flex-col gap-3">
                <div>
                  <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Titre</label>
                  <input 
                    v-model="siteContent.home.title"
                    class="form-input"
                  >
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Sous-titre</label>
                  <input 
                    v-model="siteContent.home.subtitle"
                    class="form-input"
                  >
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Call-to-Action</label>
                  <input 
                    v-model="siteContent.home.cta"
                    class="form-input"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Page Content -->
          <div class="content-section">
            <h2 class="text-2xl font-bold mb-4 text-white flex items-center gap-2">
              <span>📧</span> Page Contact
            </h2>
            
            <div class="content-card">
              <h3 class="text-lg font-semibold mb-4 text-[var(--color-neon-green)]">Informations</h3>
              <div class="flex flex-col gap-3">
                <div>
                  <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Titre</label>
                  <input 
                    v-model="siteContent.contact.title"
                    class="form-input"
                  >
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Sous-titre</label>
                  <textarea 
                    v-model="siteContent.contact.subtitle"
                    class="form-textarea"
                    rows="3"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Email</label>
                  <input 
                    v-model="siteContent.contact.email"
                    type="email"
                    class="form-input"
                  >
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Instagram</label>
                  <input 
                    v-model="siteContent.contact.instagram"
                    class="form-input"
                  >
                </div>
                <div>
                  <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Horaires</label>
                  <input 
                    v-model="siteContent.contact.hours"
                    class="form-input"
                  >
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Save Button -->
        <div class="mt-8 flex justify-end">
          <button @click="saveSiteContent" class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Sauvegarder le contenu
          </button>
        </div>
      </div>
    </div>

    <!-- Image Upload Modal -->
    <teleport to="body">
      <transition name="modal-fade">
        <div 
          v-if="showImageModal" 
          class="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          @click="closeImageModal"
        >
          <div 
            class="bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gradient">
                Modifier les images - {{ selectedProduct?.name }}
              </h2>
              <button 
                @click="closeImageModal"
                class="w-10 h-10 flex items-center justify-center border border-[rgba(57,255,20,0.2)] rounded-lg text-[var(--color-text-secondary)] hover:border-[var(--color-neon-green)] hover:text-[var(--color-neon-green)] transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Current Images -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4 text-white">Images actuelles :</h3>
              <div class="grid grid-cols-3 gap-4">
                <div 
                  v-for="(image, idx) in selectedProduct?.images" 
                  :key="idx"
                  class="relative aspect-square rounded-lg overflow-hidden border-2 border-[rgba(57,255,20,0.2)] group"
                >
                  <img 
                    :src="image" 
                    :alt="`Image ${idx + 1}`"
                    class="w-full h-full object-cover"
                  >
                  <div class="absolute bottom-2 left-2 right-2 flex gap-2">
                    <button 
                      @click="removeImage(idx)"
                      class="flex-1 bg-red-500/90 hover:bg-red-500 text-white text-xs py-1 px-2 rounded transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Upload New Image -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-4 text-white">Ajouter une nouvelle image :</h3>
              
              <div class="border-2 border-dashed border-[rgba(57,255,20,0.3)] rounded-xl p-8 text-center hover:border-[var(--color-neon-green)] transition-colors cursor-pointer">
                <input 
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="hidden"
                >
                <button 
                  @click="$refs.fileInput.click()"
                  class="btn btn-secondary"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Choisir une image
                </button>
                <p class="text-sm text-[var(--color-text-secondary)] mt-4">
                  Formats acceptés : JPG, PNG, WebP
                </p>
              </div>

              <!-- Preview -->
              <div v-if="newImagePreview" class="mt-4">
                <img 
                  :src="newImagePreview" 
                  alt="Aperçu"
                  class="max-w-full h-48 object-contain mx-auto rounded-lg border border-[rgba(57,255,20,0.2)]"
                >
                <button 
                  @click="confirmImageUpload"
                  class="btn btn-primary w-full mt-4"
                >
                  Confirmer l'ajout
                </button>
              </div>
            </div>

            <!-- URL Method (alternative) -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-white">Ou ajouter par URL :</h3>
              <div class="flex gap-2">
                <input 
                  v-model="imageUrl"
                  type="url"
                  class="form-input flex-1"
                  placeholder="https://exemple.com/image.jpg"
                >
                <button 
                  @click="addImageByUrl"
                  class="btn btn-primary whitespace-nowrap"
                >
                  Ajouter
                </button>
              </div>
            </div>

            <div class="mt-6 p-4 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg">
              <p class="text-sm text-[var(--color-text-secondary)]">
                <strong class="text-[var(--color-neon-green)]">💡 Astuce :</strong> 
                Les changements sont enregistrés automatiquement dans le localStorage. 
                Pour une solution permanente, contactez votre développeur.
              </p>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../stores/admin'
import { useProducts } from '../composables/useProducts'
import { useSiteContent } from '../composables/useSiteContent'

const adminStore = useAdminStore()
const { products, loadProducts, updateProduct } = useProducts()
const { siteContent, loadSiteContent, updateSiteContent } = useSiteContent()

const email = ref('')
const password = ref('')
const loginError = ref(false)
const activeTab = ref('products')

const showImageModal = ref(false)
const selectedProduct = ref(null)
const newImagePreview = ref(null)
const newImageFile = ref(null)
const imageUrl = ref('')

onMounted(async () => {
  await adminStore.initAuth()
  await loadProducts()
  await loadSiteContent()
})

const saveProducts = async () => {
  // Les produits sont déjà sauvegardés via updateProduct()
  console.log('✅ Produits sauvegardés')
}

const saveSiteContent = async () => {
  const success = await updateSiteContent(siteContent.value)
  if (success) {
    alert('Contenu sauvegardé avec succès !')
  } else {
    alert('Erreur lors de la sauvegarde')
  }
}

const incrementPrice = async (product) => {
  product.price += 1
  await updateProduct(product.slug, { price: product.price })
}

const decrementPrice = async (product) => {
  if (product.price > 1) {
    product.price -= 1
    await updateProduct(product.slug, { price: product.price })
  }
}

const handleLogin = async () => {
  loginError.value = false
  const success = await adminStore.login(email.value, password.value)
  if (!success) {
    loginError.value = true
  }
}

const openImageModal = (product) => {
  selectedProduct.value = { ...product }
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
  selectedProduct.value = null
  newImagePreview.value = null
  newImageFile.value = null
  imageUrl.value = ''
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    newImageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      newImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const confirmImageUpload = async () => {
  if (newImagePreview.value && selectedProduct.value) {
    // Add the base64 image to the product
    const productIndex = products.value.findIndex(p => p.id === selectedProduct.value.id)
    if (productIndex !== -1) {
      const updatedImages = [...products.value[productIndex].images, newImagePreview.value]
      await updateProduct(products.value[productIndex].slug, { images: updatedImages })
      
      products.value[productIndex].images.push(newImagePreview.value)
      selectedProduct.value.images.push(newImagePreview.value)
      
      // Reset
      newImagePreview.value = null
      newImageFile.value = null
    }
  }
}

const addImageByUrl = async () => {
  if (imageUrl.value && selectedProduct.value) {
    const productIndex = products.value.findIndex(p => p.id === selectedProduct.value.id)
    if (productIndex !== -1) {
      const updatedImages = [...products.value[productIndex].images, imageUrl.value]
      await updateProduct(products.value[productIndex].slug, { images: updatedImages })
      
      products.value[productIndex].images.push(imageUrl.value)
      selectedProduct.value.images.push(imageUrl.value)
      imageUrl.value = ''
    }
  }
}

const removeImage = async (imageIndex) => {
  if (selectedProduct.value && confirm('Supprimer cette image ?')) {
    const productIndex = products.value.findIndex(p => p.id === selectedProduct.value.id)
    if (productIndex !== -1) {
      const updatedImages = [...products.value[productIndex].images]
      updatedImages.splice(imageIndex, 1)
      await updateProduct(products.value[productIndex].slug, { images: updatedImages })
      
      products.value[productIndex].images.splice(imageIndex, 1)
      selectedProduct.value.images.splice(imageIndex, 1)
    }
  }
}
</script>

<style scoped>
/* Tabs */
.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: var(--color-neon-green);
}

.tab-btn.active {
  color: var(--color-neon-green);
  border-bottom-color: var(--color-neon-green);
}

/* Content Cards */
.content-card {
  padding: 24px;
  background: var(--color-black-light);
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.content-card:hover {
  border-color: rgba(57, 255, 20, 0.4);
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

/* Price Control Buttons (compact version) */
.price-control-btn-compact {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  padding: 0 8px;
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(42, 42, 42, 0.6));
  border: 1px solid rgba(57, 255, 20, 0.3);
  border-radius: 8px;
  color: var(--color-neon-green);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.price-control-btn-compact:hover:not(:disabled) {
  border-color: var(--color-neon-green);
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(57, 255, 20, 0.3);
}

.price-control-btn-compact:active:not(:disabled) {
  transform: scale(0.95);
}

.price-control-btn-compact:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: rgba(57, 255, 20, 0.1);
}

.price-control-btn-compact svg {
  filter: drop-shadow(0 0 3px rgba(57, 255, 20, 0.5));
}

/* Price Control Buttons (original size - kept for modal if needed) */
.price-control-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  padding: 0 20px;
  background: linear-gradient(145deg, rgba(26, 26, 26, 0.8), rgba(42, 42, 42, 0.6));
  border: 1px solid rgba(57, 255, 20, 0.3);
  border-radius: 12px;
  color: var(--color-neon-green);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.price-control-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(145deg, rgba(57, 255, 20, 0.3), rgba(0, 255, 136, 0.3));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.price-control-btn:hover:not(:disabled) {
  border-color: var(--color-neon-green);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
}

.price-control-btn:hover:not(:disabled)::before {
  opacity: 1;
}

.price-control-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.price-control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: rgba(57, 255, 20, 0.1);
}

.price-control-btn svg {
  filter: drop-shadow(0 0 4px rgba(57, 255, 20, 0.5));
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from > div,
.modal-fade-leave-to > div {
  transform: scale(0.9) translateY(20px);
}
</style>
