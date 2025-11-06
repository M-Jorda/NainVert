<template>
  <div class="p-6 bg-[var(--color-black-light)] border border-[rgba(57,255,20,0.3)] rounded-xl max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-4 text-gradient">📬 Seed Data - Messages de Contact</h2>
    
    <div class="mb-4 text-[var(--color-text-secondary)]">
      <p>Cet outil ajoute des messages de contact de test.</p>
      <p class="text-sm mt-2">15 messages seront créés avec différents sujets et statuts.</p>
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
      @click="seedMessages" 
      :disabled="loading"
      class="btn btn-primary w-full"
    >
      {{ loading ? 'Ajout en cours...' : 'Ajouter les messages de test' }}
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

const getRandomDate = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo))
  return date
}

const fakeMessages = [
  {
    name: 'Sophie Moreau',
    email: 'sophie.moreau@email.com',
    subject: 'Question produit',
    message: 'Bonjour, je voudrais savoir si le t-shirt "Psycho Green" est disponible en taille L ? Merci !',
    status: 'unread',
    source: 'contact-form'
  },
  {
    name: 'Thomas Dupont',
    email: 'thomas.dupont@email.com',
    subject: 'Problème commande',
    message: 'J\'ai passé commande il y a 10 jours (commande #12345) et je n\'ai toujours pas reçu mon colis. Pouvez-vous vérifier ?',
    status: 'unread',
    source: 'contact-form'
  },
  {
    name: 'Emma Laurent',
    email: 'emma.laurent@email.com',
    subject: 'Demande de partenariat',
    message: 'Bonjour, je suis influenceuse sur Instagram (50k abonnés) et j\'aimerais vous proposer un partenariat. Êtes-vous intéressés ?',
    status: 'read',
    source: 'contact-form'
  },
  {
    name: 'Lucas Bernard',
    email: 'lucas.bernard@email.com',
    subject: 'Retour produit',
    message: 'Je souhaite retourner le pull que j\'ai commandé car la taille ne convient pas. Comment dois-je procéder ?',
    status: 'unread',
    source: 'contact-form'
  },
  {
    name: 'Marie Petit',
    email: 'marie.petit@email.com',
    subject: 'Compliment',
    message: 'Je voulais juste vous dire que vos produits sont incroyables ! J\'ai reçu ma commande hier et je suis hyper contente. Merci ! 😊',
    status: 'read',
    source: 'contact-form'
  },
  {
    name: 'Antoine Roux',
    email: 'antoine.roux@email.com',
    subject: 'Disponibilité',
    message: 'Quand est-ce que vous allez réapprovisionner les sweats en taille M ? Ils sont en rupture depuis plusieurs semaines.',
    status: 'unread',
    source: 'contact-form'
  },
  {
    name: 'Camille Simon',
    email: 'camille.simon@email.com',
    subject: 'Demande personnalisation',
    message: 'Serait-il possible de personnaliser un t-shirt avec un design spécifique ? Si oui, quel serait le tarif ?',
    status: 'read',
    source: 'contact-form'
  },
  {
    name: 'Hugo Martin',
    email: 'hugo.martin@email.com',
    subject: 'Question livraison',
    message: 'Je vis à l\'étranger (Belgique), est-ce que vous livrez hors de France ? Quels sont les frais de port ?',
    status: 'unread',
    source: 'contact-form'
  },
  {
    name: 'Léa Dubois',
    email: 'lea.dubois@email.com',
    subject: 'Taille guide',
    message: 'Je fais habituellement du M, mais j\'hésite avec le L pour vos t-shirts. Est-ce que ça taille grand ou petit ?',
    status: 'read',
    source: 'contact-form'
  },
  {
    name: 'Nathan Garcia',
    email: 'nathan.garcia@email.com',
    subject: 'Collaboration artiste',
    message: 'Salut ! Je suis designer graphique et j\'adore votre univers. Ça vous dirait qu\'on collabore sur une collection ?',
    status: 'unread',
    source: 'contact-form'
  },
  {
    name: 'Chloé Fournier',
    email: 'chloe.fournier@email.com',
    subject: 'Code promo',
    message: 'Bonjour, avez-vous des codes promo en ce moment ? Je voudrais commander plusieurs articles.',
    status: 'read',
    source: 'contact-form'
  },
  {
    name: 'Maxime Leroy',
    email: 'maxime.leroy@email.com',
    subject: 'Qualité tissu',
    message: 'De quel type de tissu sont faits vos t-shirts ? Est-ce du 100% coton ?',
    status: 'unread',
    source: 'contact-form'
  },
  {
    name: 'Sarah Michel',
    email: 'sarah.michel@email.com',
    subject: 'Problème paiement',
    message: 'J\'ai essayé de passer commande mais le paiement n\'a pas fonctionné. Mon compte a été débité mais je n\'ai pas reçu de confirmation.',
    status: 'unread',
    source: 'contact-form'
  },
  {
    name: 'Alexandre Blanc',
    email: 'alex.blanc@email.com',
    subject: 'Réassort',
    message: 'Le modèle "Neon Dreams" en XL sera-t-il de nouveau disponible bientôt ?',
    status: 'read',
    source: 'contact-form'
  },
  {
    name: 'Julie Mercier',
    email: 'julie.mercier@email.com',
    subject: 'Suggestion',
    message: 'Ce serait cool d\'avoir des casquettes ou des bonnets avec vos designs ! Vous y avez pensé ?',
    status: 'read',
    source: 'contact-form'
  }
]

const seedMessages = async () => {
  loading.value = true
  message.value = null
  progress.value = 0
  total.value = fakeMessages.length
  
  try {
    for (let i = 0; i < fakeMessages.length; i++) {
      const msg = fakeMessages[i]
      const timestamp = getRandomDate(30)
      
      const messageData = {
        ...msg,
        timestamp: timestamp,
        createdAt: timestamp
      }
      
      await addDoc(collection(db, 'messages'), messageData)
      progress.value = i + 1
      
      // Petit délai pour voir la progression
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    message.value = {
      type: 'success',
      text: `✅ ${fakeMessages.length} messages ont été ajoutés avec succès!`
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
