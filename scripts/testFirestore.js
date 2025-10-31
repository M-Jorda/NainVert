// Script de test pour vérifier que Firestore fonctionne
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCVYNc5nhSpjxyKtyTkG5HrQ3LA3vVCDn8",
  authDomain: "nainvert-2561c.firebaseapp.com",
  projectId: "nainvert-2561c",
  storageBucket: "nainvert-2561c.firebasestorage.app",
  messagingSenderId: "16726954023",
  appId: "1:16726954023:web:99ba7c15d4aecc7c4d7e02",
  measurementId: "G-PH2TWG5E8C"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function testFirestore() {
  console.log('🧪 Test de connexion Firestore...\n')

  try {
    // Test products collection
    console.log('📦 Récupération des produits...')
    const productsSnap = await getDocs(collection(db, 'products'))
    console.log(`✅ Nombre de produits: ${productsSnap.size}`)
    
    productsSnap.forEach((doc) => {
      console.log(`  - ${doc.id}:`, doc.data().name)
    })

    // Test siteContent collection
    console.log('\n📝 Récupération du contenu...')
    const contentSnap = await getDocs(collection(db, 'siteContent'))
    console.log(`✅ Nombre de documents: ${contentSnap.size}`)
    
    contentSnap.forEach((doc) => {
      console.log(`  - ${doc.id}:`, Object.keys(doc.data()))
    })

    console.log('\n🎉 Test réussi! Firestore fonctionne correctement.')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Erreur Firestore:', error.code)
    console.error('Message:', error.message)
    process.exit(1)
  }
}

testFirestore()
