// Script d'import des produits NainVert vers Firestore
// Usage: node scripts/importToFirestore.js

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore'

// ⚠️ IMPORTANT: Remplace ces valeurs par celles de ton projet Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCVYNc5nhSpjxyKtyTkG5HrQ3LA3vVCDn8",
  authDomain: "nainvert-2561c.firebaseapp.com",
  projectId: "nainvert-2561c",
  storageBucket: "nainvert-2561c.firebasestorage.app",
  messagingSenderId: "16726954023",
  appId: "1:16726954023:web:99ba7c15d4aecc7c4d7e02",
  measurementId: "G-PH2TWG5E8C"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Données des produits à importer
const products = [
  {
    id: 1,
    name: 'Neon Dreams T-Shirt',
    slug: 'neon-dreams-tshirt',
    type: 'tshirt',
    price: 35,
    description: 'T-shirt premium en coton bio avec design psychédélique exclusif. Impression haute qualité qui résiste au temps.',
    images: [
      '/products/tshirt-1-front.jpg',
      '/products/tshirt-1-back.jpg',
      '/products/tshirt-1-detail.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    inStock: true,
    details: {
      material: '100% Coton bio',
      weight: '180g/m²',
      fit: 'Coupe régulière',
      care: 'Lavage en machine à 30°C'
    }
  },
  {
    id: 2,
    name: 'Acid Wave T-Shirt',
    slug: 'acid-wave-tshirt',
    type: 'tshirt',
    price: 38,
    description: 'T-shirt oversized avec motif ondulé hypnotique. Design unique qui attire tous les regards.',
    images: [
      '/products/tshirt-2-front.jpg',
      '/products/tshirt-2-back.jpg',
      '/products/tshirt-2-detail.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Noir'],
    inStock: true,
    details: {
      material: '100% Coton bio',
      weight: '220g/m²',
      fit: 'Coupe oversize',
      care: 'Lavage en machine à 30°C'
    }
  },
  {
    id: 3,
    name: 'Electric Jungle Hoodie',
    slug: 'electric-jungle-hoodie',
    type: 'hoodie',
    price: 75,
    description: 'Pull à capuche premium avec design jungle électrique. Doublure douce et chaude pour un confort optimal.',
    images: [
      '/products/hoodie-1-front.jpg',
      '/products/hoodie-1-back.jpg',
      '/products/hoodie-1-detail.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Noir', 'Vert foncé'],
    inStock: true,
    details: {
      material: '80% Coton, 20% Polyester',
      weight: '320g/m²',
      fit: 'Coupe régulière',
      care: 'Lavage en machine à 30°C, séchage à l\'air libre'
    }
  },
  {
    id: 4,
    name: 'Cyber Trip Crewneck',
    slug: 'cyber-trip-crewneck',
    type: 'hoodie',
    price: 65,
    description: 'Sweatshirt col rond avec broderie 3D psychédélique. Parfait pour les soirées fraîches.',
    images: [
      '/products/hoodie-2-front.jpg',
      '/products/hoodie-2-back.jpg',
      '/products/hoodie-2-detail.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Noir'],
    inStock: true,
    details: {
      material: '85% Coton, 15% Polyester',
      weight: '300g/m²',
      fit: 'Coupe régulière',
      care: 'Lavage en machine à 30°C'
    }
  }
]

// Contenu du site à importer
const siteContent = {
  home: {
    title: "Bienvenue chez NainVert",
    subtitle: "Collection exclusive de vêtements streetwear psychédéliques",
    cta: "Découvrir la collection"
  },
  contact: {
    title: "Contactez-nous",
    subtitle: "Une question ? N'hésitez pas à nous contacter",
    email: "contact@nainvert.com",
    instagram: "@nainvert",
    hours: "Lun-Ven: 9h-18h"
  },
  footer: {
    tagline: "NainVert - L'authenticité psychédélique"
  }
}

// Fonction principale d'import
async function importData() {
  console.log('🚀 Début de l\'import vers Firestore...\n')

  try {
    // Import des produits
    console.log('📦 Import des produits...')
    for (const product of products) {
      const docRef = doc(db, 'products', product.slug)
      await setDoc(docRef, product)
      console.log(`✅ Produit importé: ${product.name}`)
    }

    // Import du contenu du site
    console.log('\n📝 Import du contenu du site...')
    const contentRef = doc(db, 'siteContent', 'global')
    await setDoc(contentRef, siteContent)
    console.log('✅ Contenu du site importé')

    console.log('\n🎉 Import terminé avec succès !')
    console.log('\n📊 Résumé:')
    console.log(`   - ${products.length} produits importés`)
    console.log('   - 1 document de contenu importé')
    console.log('\n💡 Tu peux maintenant voir tes données dans la console Firebase!')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error)
    process.exit(1)
  }
}

// Lancement du script
importData()
