/**
 * Script pour ajouter des designId aux produits existants
 * À exécuter une seule fois pour migrer les données
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore'

// Configuration Firebase (à adapter selon votre config)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function addDesignIdsToProducts() {
  console.log('🔄 Début de l\'ajout des designId aux produits...')
  
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'))
    
    console.log(`📦 ${productsSnapshot.docs.length} produits trouvés`)
    
    // Mapping des produits aux dessins
    // Vous devrez adapter ceci selon votre structure de produits
    const productToDesignMap = {
      // Exemple :
      // 'tshirt-nain-vert': 'design-1',
      // 'pull-nain-vert': 'design-1',
      // 'tshirt-autre': 'design-2',
      // 'pull-autre': 'design-2',
    }
    
    let updated = 0
    
    for (const productDoc of productsSnapshot.docs) {
      const productId = productDoc.id
      const productData = productDoc.data()
      
      // Logique pour déterminer le designId
      // Option 1: Utiliser un mapping manuel
      let designId = productToDesignMap[productId]
      
      // Option 2: Auto-assigner basé sur l'index (temporaire)
      if (!designId) {
        // Diviser les produits en 2 groupes
        const index = productsSnapshot.docs.indexOf(productDoc)
        designId = index < productsSnapshot.docs.length / 2 ? 'design-1' : 'design-2'
      }
      
      // Mettre à jour le produit avec le designId
      await updateDoc(doc(db, 'products', productId), {
        designId: designId
      })
      
      console.log(`✅ Produit "${productData.name}" (${productId}) -> ${designId}`)
      updated++
    }
    
    console.log(`\n✅ ${updated} produits mis à jour avec succès !`)
    console.log('\n⚠️  IMPORTANT: Vérifiez les assignations et ajustez-les si nécessaire dans l\'admin.')
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error)
  }
}

// Exécuter le script
addDesignIdsToProducts()
  .then(() => {
    console.log('\n✨ Migration terminée !')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })
