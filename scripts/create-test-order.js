/**
 * Script de test pour créer une commande factice
 * Permet de tester la décrémentation automatique du stock
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

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

async function createTestOrder() {
  console.log('🧪 Création d\'une commande de test...')
  
  const testOrder = {
    orderId: `TEST-${Date.now()}`,
    status: 'paid', // Commencera comme "payée"
    customer: {
      firstName: 'Jean',
      lastName: 'Test',
      email: 'test@example.com',
      phone: '0612345678'
    },
    items: [
      {
        name: 'T-Shirt Nain Vert (Test)',
        designId: 'design-1', // ← Important pour la gestion du stock
        quantity: 2,
        size: 'M',
        price: 25,
        total: 50
      },
      {
        name: 'Pull Champignon (Test)',
        designId: 'design-2', // ← Autre dessin
        quantity: 1,
        size: 'L',
        price: 35,
        total: 35
      }
    ],
    shipping: {
      address: '123 Rue du Test',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      method: 'Standard'
    },
    subtotal: 85,
    shippingCost: 5,
    total: 90,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
  
  try {
    const docRef = await addDoc(collection(db, 'orders'), testOrder)
    console.log('✅ Commande de test créée avec succès!')
    console.log('📝 ID:', docRef.id)
    console.log('\n📦 Contenu de la commande:')
    console.log('  - 2x T-Shirt (design-1)')
    console.log('  - 1x Pull (design-2)')
    console.log('\n🎯 Prochaines étapes:')
    console.log('  1. Allez dans l\'admin')
    console.log('  2. Ouvrez l\'onglet "Commandes"')
    console.log('  3. Trouvez la commande TEST-...')
    console.log('  4. Changez le statut à "Livrée"')
    console.log('  5. Vérifiez l\'onglet "Stock" :')
    console.log('     → design-1 devrait -2')
    console.log('     → design-2 devrait -1')
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
  
  process.exit(0)
}

createTestOrder()
