import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAo-cTQ7i8Pw9cLrLGOF7AMhz70Zzlvq9c",
  authDomain: "nainvert-2561c.firebaseapp.com",
  projectId: "nainvert-2561c",
  storageBucket: "nainvert-2561c.firebasestorage.app",
  messagingSenderId: "797551682046",
  appId: "1:797551682046:web:7b3cf93d9ce7d2e85d91f3"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Commandes de test
const testOrders = [
  {
    orderId: "ORDER_2025_001",
    status: "pending",
    customer: {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@example.com",
      phone: "+33612345678"
    },
    shipping: {
      address: "12 rue de la Paix",
      city: "Paris",
      postalCode: "75001",
      country: "France",
      method: "standard",
      cost: 4.90
    },
    items: [
      {
        productId: "tshirt-psy",
        name: "T-shirt Psyché",
        size: "M",
        quantity: 1,
        price: 29.90,
        total: 29.90
      }
    ],
    subtotal: 29.90,
    shippingCost: 4.90,
    total: 34.80,
    payment: {
      method: "card",
      transactionId: "txn_test_001",
      status: "pending"
    },
    notes: ""
  },
  {
    orderId: "ORDER_2025_002",
    status: "paid",
    customer: {
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@example.com",
      phone: "+33623456789"
    },
    shipping: {
      address: "45 avenue des Champs",
      city: "Lyon",
      postalCode: "69001",
      country: "France",
      method: "standard",
      cost: 4.90
    },
    items: [
      {
        productId: "hoodie-trip",
        name: "Hoodie Trip",
        size: "L",
        quantity: 1,
        price: 49.90,
        total: 49.90
      },
      {
        productId: "tshirt-psy",
        name: "T-shirt Psyché",
        size: "S",
        quantity: 2,
        price: 29.90,
        total: 59.80
      }
    ],
    subtotal: 109.70,
    shippingCost: 0, // Livraison gratuite
    total: 109.70,
    payment: {
      method: "paypal",
      transactionId: "txn_test_002",
      paidAt: new Date(),
      status: "success"
    },
    notes: "Client premium"
  },
  {
    orderId: "ORDER_2025_003",
    status: "shipped",
    customer: {
      firstName: "Pierre",
      lastName: "Dubois",
      email: "pierre.dubois@example.com",
      phone: "+33634567890"
    },
    shipping: {
      address: "78 boulevard de la Liberté",
      city: "Marseille",
      postalCode: "13001",
      country: "France",
      method: "standard",
      cost: 4.90,
      trackingNumber: "FR123456789"
    },
    items: [
      {
        productId: "casquette-neon",
        name: "Casquette Néon",
        size: "Unique",
        quantity: 1,
        price: 24.90,
        total: 24.90
      }
    ],
    subtotal: 24.90,
    shippingCost: 4.90,
    total: 29.80,
    payment: {
      method: "card",
      transactionId: "txn_test_003",
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
      status: "success"
    },
    notes: "Expédié le 30/10/2025"
  },
  {
    orderId: "ORDER_2025_004",
    status: "delivered",
    customer: {
      firstName: "Sophie",
      lastName: "Leroy",
      email: "sophie.leroy@example.com",
      phone: "+33645678901"
    },
    shipping: {
      address: "23 rue Victor Hugo",
      city: "Toulouse",
      postalCode: "31000",
      country: "France",
      method: "standard",
      cost: 4.90,
      trackingNumber: "FR987654321"
    },
    items: [
      {
        productId: "tshirt-psy",
        name: "T-shirt Psyché",
        size: "M",
        quantity: 3,
        price: 29.90,
        total: 89.70
      }
    ],
    subtotal: 89.70,
    shippingCost: 0, // Livraison gratuite
    total: 89.70,
    payment: {
      method: "card",
      transactionId: "txn_test_004",
      paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Il y a 7 jours
      status: "success"
    },
    notes: "Client satisfait, bon retour"
  },
  {
    orderId: "ORDER_2025_005",
    status: "cancelled",
    customer: {
      firstName: "Luc",
      lastName: "Bernard",
      email: "luc.bernard@example.com",
      phone: "+33656789012"
    },
    shipping: {
      address: "56 place de la République",
      city: "Bordeaux",
      postalCode: "33000",
      country: "France",
      method: "standard",
      cost: 4.90
    },
    items: [
      {
        productId: "hoodie-trip",
        name: "Hoodie Trip",
        size: "XL",
        quantity: 1,
        price: 49.90,
        total: 49.90
      }
    ],
    subtotal: 49.90,
    shippingCost: 4.90,
    total: 54.80,
    payment: {
      method: "card",
      transactionId: "txn_test_005",
      status: "failed"
    },
    notes: "Paiement refusé par la banque"
  }
]

// Import des commandes
async function importOrders() {
  console.log('🚀 Début de l\'import des commandes de test...\n')
  
  try {
    for (const order of testOrders) {
      const orderData = {
        ...order,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(collection(db, 'orders'), orderData)
      console.log(`✅ Commande importée: ${order.orderId} - ID: ${docRef.id}`)
    }
    
    console.log(`\n🎉 Import terminé ! ${testOrders.length} commandes importées`)
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error)
  }
}

// Exécution
importOrders()
