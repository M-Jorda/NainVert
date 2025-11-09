/**
 * Script pour recréer la collection Designs avec la structure à jour
 * 
 * ATTENTION : Ce script va SUPPRIMER tous les designs existants
 * 
 * Usage:
 * 1. Supprimer manuellement la collection 'designs' dans Firebase Console
 * 2. node scripts/recreate-designs.js
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCEBe1sPX9iPwS99Y4D2QljJvTdpGnGOWg",
  authDomain: "nainvert-bc46d.firebaseapp.com",
  projectId: "nainvert-bc46d",
  storageBucket: "nainvert-bc46d.firebasestorage.app",
  messagingSenderId: "293566166691",
  appId: "1:293566166691:web:9aefbe8e9d08a95e6e40d8"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

/**
 * Structure d'un design à jour (novembre 2025)
 * 
 * NOTE IMPORTANTE : 
 * Pour la future implémentation, chaque design devra avoir des images
 * spécifiques pour chaque type de vêtement (T-Shirt et Hoodie).
 * 
 * Structure future recommandée :
 * garmentImages: {
 *   tshirt: ["front.jpg", "back.jpg", "detail.jpg"],
 *   hoodie: ["front.jpg", "back.jpg", "hood.jpg"]
 * }
 */
const sampleDesigns = [
  {
    // Identifiants
    id: 'neon-dreams',
    slug: 'neon-dreams',
    name: 'Neon Dreams',
    
    // Descriptions
    tagline: 'Plongez dans l\'univers psychédélique',
    description: 'Design psychédélique avec motifs néon vibrants inspirés des rues de Tokyo la nuit.',
    story: 'Inspiré par les néons qui illuminent les rues de Tokyo la nuit, ce design capture l\'essence de la culture cyberpunk japonaise avec des couleurs vibrantes et des formes géométriques hypnotiques.',
    
    // Prix (IMPORTANT: Number, pas String!)
    designPrice: 15.00,  // Prix du design seul (Number)
    
    // Images (structure actuelle - sera améliorée plus tard)
    images: [
      'https://res.cloudinary.com/dqnvpvhae/image/upload/v1731099643/designs/neon-dreams.jpg'
    ],
    
    // TODO: Implémenter garmentImages pour images spécifiques par vêtement
    // garmentImages: {
    //   tshirt: ["tshirt-front.jpg", "tshirt-back.jpg"],
    //   hoodie: ["hoodie-front.jpg", "hoodie-back.jpg", "hoodie-hood.jpg"]
    // },
    
    // Statut
    featured: true,   // Mis en avant
    inStock: true,    // Disponible
    
    // Métadonnées
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  
  {
    id: 'cyber-nain',
    slug: 'cyber-nain',
    name: 'Cyber Nain',
    
    tagline: 'Le nain du futur',
    description: 'Design futuriste mêlant traditions et technologies avec un nain cybernétique au style unique.',
    story: 'Dans un futur proche, les nains ont évolué pour devenir des êtres cybernétiques gardant leur culture ancestrale tout en embrassant les nouvelles technologies.',
    
    designPrice: 18.00,  // Number
    
    images: [
      'https://res.cloudinary.com/dqnvpvhae/image/upload/v1731099643/designs/cyber-nain.jpg'
    ],
    
    featured: true,
    inStock: true,
    
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  
  {
    id: 'forest-spirit',
    slug: 'forest-spirit',
    name: 'Forest Spirit',
    
    tagline: 'L\'esprit de la forêt',
    description: 'Design mystique représentant les esprits de la nature avec des couleurs organiques et apaisantes.',
    story: 'Chaque arbre a son gardien, chaque forêt son esprit. Ce design rend hommage aux forces mystiques qui protègent la nature depuis la nuit des temps.',
    
    designPrice: 15.00,  // Number
    
    images: [
      'https://res.cloudinary.com/dqnvpvhae/image/upload/v1731099643/designs/forest-spirit.jpg'
    ],
    
    featured: false,
    inStock: true,
    
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
]

async function recreateDesigns() {
  console.log('🎨 Recréation de la collection Designs...\n')
  
  try {
    const designsRef = collection(db, 'designs')
    
    for (const design of sampleDesigns) {
      const docRef = await addDoc(designsRef, design)
      console.log(`✅ Design créé: ${design.name} (ID: ${docRef.id})`)
    }
    
    console.log('\n🎉 Collection Designs recréée avec succès!')
    console.log(`📊 ${sampleDesigns.length} designs ajoutés\n`)
    
    console.log('📝 Structure de design à jour:')
    console.log('  - id: String (unique)')
    console.log('  - slug: String (URL-friendly)')
    console.log('  - name: String')
    console.log('  - tagline: String')
    console.log('  - description: String')
    console.log('  - story: String (optionnel)')
    console.log('  - designPrice: Number (IMPORTANT: pas String!)')
    console.log('  - images: Array [url1, url2, ...]')
    console.log('  - featured: Boolean')
    console.log('  - inStock: Boolean')
    console.log('  - createdAt: Timestamp')
    console.log('  - updatedAt: Timestamp\n')
    
    console.log('⚠️  TODO - Implémentation future:')
    console.log('  - garmentImages: { tshirt: [...], hoodie: [...] }')
    console.log('  - Permettra d\'afficher des images différentes selon le vêtement choisi')
    console.log('  - Voir DESIGN_IMAGES_STRUCTURE.md pour plus de détails\n')
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

recreateDesigns()
