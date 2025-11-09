import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC9lxQsY8C5fwMvjhNZZpkXGqRz0Tx5xD0",
  authDomain: "nainvert-f5d01.firebaseapp.com",
  projectId: "nainvert-f5d01",
  storageBucket: "nainvert-f5d01.firebasestorage.app",
  messagingSenderId: "894478229671",
  appId: "1:894478229671:web:bc3e8c1cb6ab5e8a6c5a0f"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const designs = [
  {
    id: 'neon-dreams',
    slug: 'neon-dreams',
    name: 'Neon Dreams',
    tagline: 'Plongez dans l\'univers psychédélique',
    description: 'Design psychédélique avec motifs néon vibrants. Un voyage visuel inspiré des nuits électriques urbaines.',
    story: 'Inspiré par les néons qui illuminent les rues de Tokyo la nuit, Neon Dreams capture l\'essence de la culture urbaine moderne avec une touche psychédélique. Chaque courbe et chaque couleur raconte une histoire de rêves électriques.',
    images: [
      '/products/tshirt-1-front.jpg',
      '/products/tshirt-1-back.jpg',
      '/products/tshirt-1-detail.jpg'
    ],
    featured: true,
    inStock: true,
    createdAt: new Date()
  },
  {
    id: 'acid-wave',
    slug: 'acid-wave',
    name: 'Acid Wave',
    tagline: 'L\'onde hypnotique',
    description: 'Motif ondulé hypnotique qui attire tous les regards. Un design unique qui défie les conventions.',
    story: 'Acid Wave est né d\'une exploration des formes organiques et du mouvement. Les vagues psychédéliques créent un effet visuel captivant, parfait pour ceux qui osent se démarquer.',
    images: [
      '/products/tshirt-2-front.jpg',
      '/products/tshirt-2-back.jpg',
      '/products/tshirt-2-detail.jpg'
    ],
    featured: true,
    inStock: true,
    createdAt: new Date()
  },
  {
    id: 'electric-jungle',
    slug: 'electric-jungle',
    name: 'Electric Jungle',
    tagline: 'La jungle électrique',
    description: 'Design jungle électrique avec des éléments naturels revisités dans un style futuriste et psychédélique.',
    story: 'Electric Jungle fusionne la nature sauvage avec l\'énergie urbaine. Un design qui célèbre la coexistence du naturel et du synthétique dans notre monde moderne.',
    images: [
      '/products/hoodie-1-front.jpg',
      '/products/hoodie-1-back.jpg',
      '/products/hoodie-1-detail.jpg'
    ],
    featured: true,
    inStock: true,
    createdAt: new Date()
  },
  {
    id: 'cyber-trip',
    slug: 'cyber-trip',
    name: 'Cyber Trip',
    tagline: 'Le voyage cybernétique',
    description: 'Design futuriste avec éléments cybernétiques et effets psychédéliques pour un look avant-gardiste.',
    story: 'Cyber Trip nous transporte dans un futur dystopique où la technologie et la conscience fusionnent. Un design pour les visionnaires qui embrassent l\'avenir.',
    images: [
      '/products/hoodie-2-front.jpg',
      '/products/hoodie-2-back.jpg',
      '/products/hoodie-2-detail.jpg'
    ],
    featured: false,
    inStock: true,
    createdAt: new Date()
  }
]

async function migrateToDesigns() {
  console.log('🚀 Démarrage de la migration vers designs...')
  
  try {
    for (const design of designs) {
      console.log(`📝 Création du design: ${design.name}`)
      await setDoc(doc(db, 'designs', design.slug), design)
      console.log(`✅ Design créé: ${design.name}`)
    }
    
    console.log('✅ Migration terminée avec succès!')
    console.log(`📊 ${designs.length} designs créés`)
    
    const snapshot = await getDocs(collection(db, 'designs'))
    console.log(`\n🎨 Designs dans Firestore:`)
    snapshot.forEach(doc => {
      console.log(`  - ${doc.id}: ${doc.data().name}`)
    })
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
  }
}

async function updateStock() {
  console.log('\n📦 Mise à jour du stock...')
  
  try {
    const stockData = {
      designs: [
        {
          id: 'neon-dreams',
          name: 'Neon Dreams',
          totalUnits: 100,
          remainingUnits: 100,
          products: ['neon-dreams-tshirt']
        },
        {
          id: 'acid-wave',
          name: 'Acid Wave',
          totalUnits: 100,
          remainingUnits: 100,
          products: ['acid-wave-tshirt']
        },
        {
          id: 'electric-jungle',
          name: 'Electric Jungle',
          totalUnits: 100,
          remainingUnits: 100,
          products: ['electric-jungle-hoodie']
        },
        {
          id: 'cyber-trip',
          name: 'Cyber Trip',
          totalUnits: 100,
          remainingUnits: 100,
          products: ['cyber-trip-hoodie']
        }
      ],
      lastUpdated: new Date()
    }
    
    await setDoc(doc(db, 'settings', 'stock'), stockData)
    console.log('✅ Stock mis à jour')
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du stock:', error)
  }
}

async function main() {
  await migrateToDesigns()
  await updateStock()
  console.log('\n🎉 Migration complète terminée!')
  process.exit(0)
}

main()
