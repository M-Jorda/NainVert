/**
 * Script pour lire les designs existants dans Firestore
 * AVANT de les supprimer (pour récupérer les URLs d'images)
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

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

async function checkExistingDesigns() {
  console.log('🔍 Récupération des designs existants...\n')
  
  try {
    const designsRef = collection(db, 'designs')
    const snapshot = await getDocs(designsRef)
    
    if (snapshot.empty) {
      console.log('❌ Aucun design trouvé dans Firestore')
      return
    }
    
    console.log(`✅ ${snapshot.size} designs trouvés\n`)
    console.log('━'.repeat(80))
    
    snapshot.forEach((doc, index) => {
      const data = doc.data()
      console.log(`\n📌 DESIGN ${index + 1}: ${data.name}`)
      console.log(`   ID: ${doc.id}`)
      console.log(`   Slug: ${data.slug}`)
      console.log(`   Prix: ${data.designPrice} (Type: ${typeof data.designPrice})`)
      console.log(`   Images (${data.images?.length || 0}):`)
      
      if (data.images && data.images.length > 0) {
        data.images.forEach((img, i) => {
          console.log(`     ${i + 1}. ${img}`)
        })
      } else {
        console.log('     ⚠️  Aucune image')
      }
      
      console.log('━'.repeat(80))
    })
    
    console.log('\n💡 CONSEIL:')
    console.log('  - Copie ces URLs AVANT de supprimer la collection')
    console.log('  - Utilise-les pour créer les nouveaux designs\n')
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

checkExistingDesigns()
