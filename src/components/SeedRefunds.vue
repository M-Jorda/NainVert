<template>
  <div class="p-6 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-4 text-gradient">🌱 Seed Data - Remboursements</h2>
    
    <div class="mb-4 text-[var(--color-text-secondary)]">
      <p>Cet outil ajoute des données de test pour les remboursements.</p>
      <p class="text-sm mt-2">12 remboursements seront créés avec différents statuts.</p>
    </div>
    
    <div v-if="message" 
         :class="[
           'p-4 rounded-lg mb-4',
           message.type === 'success' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-red-500/10 text-red-500'
         ]"
    >
      {{ message.text }}
    </div>
    
    <div v-if="progress > 0 && progress < total" class="mb-4">
      <div class="flex justify-between text-sm mb-2">
        <span>Progression</span>
        <span>{{ progress }}/{{ total }}</span>
      </div>
      <div class="w-full bg-[var(--color-secondary)] rounded-full h-2">
        <div 
          class="bg-[var(--color-primary)] h-2 rounded-full transition-all"
          :style="{ width: `${(progress / total) * 100}%` }"
        ></div>
      </div>
    </div>
    
    <button 
      @click="seedRefunds" 
      :disabled="loading"
      class="btn btn-primary w-full"
    >
      {{ loading ? 'Ajout en cours...' : 'Ajouter les données de test' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

const loading = ref(false)
const message = ref(null)
const progress = ref(0)
const total = ref(0)

const generateOrderId = () => {
  const prefix = 'ORD'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}-${timestamp}-${random}`
}

const getRandomDate = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  return date
}

const fakeRefunds = [
  {
    orderId: generateOrderId(),
    customerName: 'Jean Dupont',
    customerEmail: 'jean.dupont@email.com',
    amount: 45.99,
    reason: 'Produit défectueux - couture déchirée',
    status: 'requested',
    notes: null
  },
  {
    orderId: generateOrderId(),
    customerName: 'Marie Martin',
    customerEmail: 'marie.martin@email.com',
    amount: 89.50,
    reason: 'Taille incorrecte - trop petit',
    status: 'approved',
    notes: 'Client régulier - remboursement approuvé rapidement'
  },
  {
    orderId: generateOrderId(),
    customerName: 'Pierre Durand',
    customerEmail: 'pierre.durand@email.com',
    amount: 125.00,
    reason: 'Produit non conforme à la description',
    status: 'processed',
    notes: 'Remboursement effectué le 28/10/2025'
  },
  {
    orderId: generateOrderId(),
    customerName: 'Sophie Bernard',
    customerEmail: 'sophie.bernard@email.com',
    amount: 35.99,
    reason: 'Changement d\'avis',
    status: 'rejected',
    notes: 'Dépassement du délai de rétractation (20 jours)'
  },
  {
    orderId: generateOrderId(),
    customerName: 'Lucas Petit',
    customerEmail: 'lucas.petit@email.com',
    amount: 67.50,
    reason: 'Couleur différente de la photo',
    status: 'requested',
    notes: null
  },
  {
    orderId: generateOrderId(),
    customerName: 'Emma Roux',
    customerEmail: 'emma.roux@email.com',
    amount: 99.99,
    reason: 'Article endommagé pendant la livraison',
    status: 'approved',
    notes: 'Photos reçues - dommage visible'
  },
  {
    orderId: generateOrderId(),
    customerName: 'Thomas Moreau',
    customerEmail: 'thomas.moreau@email.com',
    amount: 150.00,
    reason: 'Commande en double (erreur client)',
    status: 'processed',
    notes: 'Remboursement complet effectué'
  },
  {
    orderId: generateOrderId(),
    customerName: 'Julie Dubois',
    customerEmail: 'julie.dubois@email.com',
    amount: 42.00,
    reason: 'Produit reçu incomplet (accessoires manquants)',
    status: 'requested',
    notes: null
  },
  {
    orderId: generateOrderId(),
    customerName: 'Alexandre Garcia',
    customerEmail: 'alex.garcia@email.com',
    amount: 78.90,
    reason: 'Qualité inférieure aux attentes',
    status: 'rejected',
    notes: 'Produit conforme à la description - rejet du remboursement'
  },
  {
    orderId: generateOrderId(),
    customerName: 'Camille Laurent',
    customerEmail: 'camille.laurent@email.com',
    amount: 55.00,
    reason: 'Erreur de commande (mauvaise référence)',
    status: 'approved',
    notes: 'En attente du retour produit'
  },
  {
    orderId: generateOrderId(),
    customerName: 'Nicolas Simon',
    customerEmail: 'nicolas.simon@email.com',
    amount: 120.00,
    reason: 'Délai de livraison trop long (plus de 3 semaines)',
    status: 'processed',
    notes: 'Remboursement + bon de réduction 10€'
  },
  {
    orderId: generateOrderId(),
    customerName: 'Laura Fournier',
    customerEmail: 'laura.fournier@email.com',
    amount: 89.99,
    reason: 'Article ne correspond pas à la taille indiquée',
    status: 'requested',
    notes: null
  }
]

const seedRefunds = async () => {
  loading.value = true
  message.value = null
  progress.value = 0
  total.value = fakeRefunds.length
  
  try {
    for (let i = 0; i < fakeRefunds.length; i++) {
      const refund = fakeRefunds[i]
      const createdDate = getRandomDate(30)
      
      const refundData = {
        ...refund,
        createdAt: createdDate,
        updatedAt: createdDate
      }
      
      await addDoc(collection(db, 'refunds'), refundData)
      progress.value = i + 1
      
      // Petit délai pour voir la progression
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    message.value = {
      type: 'success',
      text: `✅ ${fakeRefunds.length} remboursements ont été ajoutés avec succès!`
    }
  } catch (error) {
    console.error('Erreur:', error)
    message.value = {
      type: 'error',
      text: `❌ Erreur: ${error.message}`
    }
  } finally {
    loading.value = false
  }
}
</script>
