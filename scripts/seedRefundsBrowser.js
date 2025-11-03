// Script à exécuter dans la console du navigateur (F12)
// Assurez-vous d'être connecté en tant qu'admin sur la page /admin

async function seedRefunds() {
  console.log('🌱 Début de l\'insertion des faux remboursements...')
  
  // Import dynamique de Firebase depuis votre app
  const { db } = await import('./config/firebase')
  const { collection, addDoc } = await import('firebase/firestore')
  
  // Fonction pour générer un ID de commande aléatoire
  const generateOrderId = () => {
    const prefix = 'ORD'
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${prefix}-${timestamp}-${random}`
  }
  
  // Fonction pour générer une date aléatoire dans les 30 derniers jours
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
  
  try {
    let count = 0
    
    for (const refund of fakeRefunds) {
      const createdDate = getRandomDate(30)
      
      const refundData = {
        ...refund,
        createdAt: createdDate,
        updatedAt: createdDate
      }
      
      await addDoc(collection(db, 'refunds'), refundData)
      count++
      console.log(`✅ ${count}/${fakeRefunds.length}: ${refund.customerName} - ${refund.status} - ${refund.amount}€`)
    }
    
    console.log(`\n🎉 ${count} remboursements ajoutés avec succès!`)
    console.log('\n📊 Résumé:')
    console.log(`   - Demandés (requested): ${fakeRefunds.filter(r => r.status === 'requested').length}`)
    console.log(`   - Approuvés (approved): ${fakeRefunds.filter(r => r.status === 'approved').length}`)
    console.log(`   - Rejetés (rejected): ${fakeRefunds.filter(r => r.status === 'rejected').length}`)
    console.log(`   - Traités (processed): ${fakeRefunds.filter(r => r.status === 'processed').length}`)
  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

// Lancer le script
seedRefunds()
