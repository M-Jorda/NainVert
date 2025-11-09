/**
 * Service d'upload d'images vers Cloudinary
 * Utilise l'API Unsigned Upload pour éviter d'exposer l'API Secret côté client
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'durcno7ql'
const CLOUDINARY_UPLOAD_PRESET = 'nainvert_designs' // On va créer ce preset

/**
 * Upload une image vers Cloudinary
 * @param {File} file - Fichier image à uploader
 * @returns {Promise<string>} - URL de l'image uploadée
 */
export async function uploadToCloudinary(file) {
  const isDev = import.meta.env.DEV
  
  try {
    if (isDev) console.log('📤 Upload vers Cloudinary...')
    if (isDev) console.log('📊 Fichier:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`)

    // Créer le FormData pour l'upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('folder', 'designs') // Dossier dans Cloudinary

    if (isDev) console.log('🔄 Envoi de la requête...')

    // Upload vers Cloudinary (API publique unsigned)
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    if (isDev) console.log('📡 Réponse reçue:', response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Erreur Cloudinary:', error)
      throw new Error(error.error?.message || 'Erreur lors de l\'upload')
    }

    const data = await response.json()
    
    if (isDev) console.log('✅ Upload réussi!')
    if (isDev) console.log('🔗 URL:', data.secure_url)
    
    return data.secure_url
  } catch (error) {
    console.error('❌ Erreur upload Cloudinary:', error)
    throw error
  }
}

/**
 * Optimiser l'URL Cloudinary pour différentes tailles
 * @param {string} url - URL Cloudinary originale
 * @param {object} options - Options de transformation
 * @returns {string} - URL optimisée
 */
export function getOptimizedCloudinaryUrl(url, options = {}) {
  const {
    width = 800,
    height = 800,
    quality = 'auto',
    format = 'auto'
  } = options

  // Si ce n'est pas une URL Cloudinary, retourner l'URL originale
  if (!url.includes('cloudinary.com')) {
    return url
  }

  // Extraire le public_id de l'URL
  const parts = url.split('/upload/')
  if (parts.length !== 2) return url

  const [base, path] = parts
  
  // Construire l'URL avec transformations
  const transformations = `w_${width},h_${height},c_fill,q_${quality},f_${format}`
  
  return `${base}/upload/${transformations}/${path}`
}
