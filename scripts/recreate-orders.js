/**
 * Script pour recréer la collection Orders avec la structure à jour
 * 
 * ATTENTION : Ce script va SUPPRIMER toutes les commandes existantes
 * 
 * Usage:
 * 1. Supprimer manuellement la collection 'orders' dans Firebase Console
 * 2. node scripts/recreate-orders.js
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
 * Structure d'une commande à jour (novembre 2025)
 */
const sampleOrders = [
  {
    orderNumber: 'NV-2025-0001',
    status: 'pending',
    
    // Informations client
    customerInfo: {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      phone: '06 12 34 56 78',
      address: {
        street: '12 rue de la Paix',
        postalCode: '75001',
        city: 'Paris',
        country: 'France'
      }
    },
    
    // Articles commandés
    items: [
      {
        id: 'neon-dreams-tshirt-L',
        designId: 'neon-dreams',
        designSlug: 'neon-dreams',
        designName: 'Neon Dreams',
        type: 'tshirt',
        size: 'L',
        price: 35.00,      // Number (pas String!)
        quantity: 1,
        total: 35.00,      // Number
        image: 'https://res.cloudinary.com/...'
      }
    ],
    
    // Prix
    subtotal: 35.00,     // Number
    shippingCost: 0.00,  // Number (gratuit)
    taxRate: 0.20,       // Number (20%)
    taxAmount: 7.00,     // Number
    total: 35.00,        // Number (TTC)
    
    // Métadonnées
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    
    // Informations de paiement (à implémenter plus tard)
    paymentStatus: 'pending',
    paymentMethod: null,
    
    // Notes admin (optionnel)
    adminNotes: ''
  },
  
  {
    orderNumber: 'NV-2025-0002',
    status: 'processing',
    
    customerInfo: {
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      phone: '07 98 76 54 32',
      address: {
        street: '45 avenue des Champs',
        postalCode: '13000',
        city: 'Marseille',
        country: 'France'
      }
    },
    
    items: [
      {
        id: 'cyber-nain-hoodie-M',
        designId: 'cyber-nain',
        designSlug: 'cyber-nain',
        designName: 'Cyber Nain',
        type: 'hoodie',
        size: 'M',
        price: 70.00,
        quantity: 1,
        total: 70.00,
        image: 'https://res.cloudinary.com/...'
      },
      {
        id: 'neon-dreams-tshirt-S',
        designId: 'neon-dreams',
        designSlug: 'neon-dreams',
        designName: 'Neon Dreams',
        type: 'tshirt',
        size: 'S',
        price: 35.00,
        quantity: 2,
        total: 70.00,
        image: 'https://res.cloudinary.com/...'
      }
    ],
    
    subtotal: 140.00,
    shippingCost: 0.00,
    taxRate: 0.20,
    taxAmount: 28.00,
    total: 140.00,
    
    createdAt: Timestamp.fromDate(new Date('2025-11-08')),
    updatedAt: Timestamp.now(),
    
    paymentStatus: 'paid',
    paymentMethod: 'card',
    
    adminNotes: 'Client régulier'
  }
]

async function recreateOrders() {
  console.log('🔥 Recréation de la collection Orders...\n')
  
  try {
    const ordersRef = collection(db, 'orders')
    
    for (const order of sampleOrders) {
      const docRef = await addDoc(ordersRef, order)
      console.log(`✅ Commande créée: ${order.orderNumber} (ID: ${docRef.id})`)
    }
    
    console.log('\n🎉 Collection Orders recréée avec succès!')
    console.log(`📊 ${sampleOrders.length} commandes ajoutées\n`)
    
    console.log('📝 Structure de commande à jour:')
    console.log('  - orderNumber: String')
    console.log('  - status: String (pending, processing, shipped, delivered, cancelled)')
    console.log('  - customerInfo: Object { name, email, phone, address }')
    console.log('  - items: Array [{ id, designId, designSlug, designName, type, size, price (Number!), quantity, total (Number!), image }]')
    console.log('  - subtotal: Number')
    console.log('  - shippingCost: Number')
    console.log('  - taxRate: Number')
    console.log('  - taxAmount: Number')
    console.log('  - total: Number')
    console.log('  - createdAt: Timestamp')
    console.log('  - updatedAt: Timestamp')
    console.log('  - paymentStatus: String')
    console.log('  - paymentMethod: String | null')
    console.log('  - adminNotes: String\n')
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

recreateOrders()
