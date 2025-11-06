# 🛒 Système de Checkout - NainVert

## Vue d'ensemble

Le système de checkout permet de créer des commandes directement depuis le panier et de gérer automatiquement le stock des produits.

## Fonctionnalités

### ✅ Ce qui est implémenté

1. **Création de commande**
   - Formulaire de checkout avec validation
   - Génération automatique d'un numéro de commande unique
   - Sauvegarde en base de données Firestore
   - Statut initial : `pending`

2. **Gestion du stock**
   - Décrémentation automatique du stock lors de la création de la commande
   - Association produit ↔ design via `designId`
   - Mise à jour en temps réel dans Firestore

3. **Informations collectées**
   - Nom complet du client
   - Email
   - Téléphone (optionnel)
   - Adresse de livraison complète
   - Liste des articles avec tailles et quantités

4. **Interface utilisateur**
   - Modal de checkout élégante
   - Message de confirmation avec numéro de commande
   - Feedback visuel (loading, erreurs, succès)
   - Vidage automatique du panier après succès

## Structure des fichiers

```
src/
├── composables/
│   ├── useCheckout.js      # Logique de création de commande
│   ├── useOrders.js        # Gestion des commandes (admin)
│   └── useStock.js         # Gestion du stock par design
├── components/
│   ├── Cart.vue            # Panier latéral
│   └── CheckoutModal.vue   # Modal de checkout
└── stores/
    └── cart.js             # Store Pinia du panier
```

## Flux de commande

1. **Client ajoute des produits au panier**
   - Les produits sont stockés avec leur `designId`
   - Quantité et taille sauvegardées

2. **Client clique sur "Procéder au paiement"**
   - Ouverture de la modal de checkout
   - Formulaire de saisie des informations

3. **Validation et création**
   - Validation des données du formulaire
   - Création de la commande dans Firestore (`/orders`)
   - Génération d'un numéro de commande unique

4. **Mise à jour du stock**
   - Décrémentation automatique du stock pour chaque design
   - Mise à jour dans `/settings/stock`

5. **Confirmation**
   - Affichage du numéro de commande
   - Vidage du panier
   - Fermeture de la modal

## Structure d'une commande en BDD

```javascript
{
  orderNumber: "NV-20251106-12345",
  status: "pending", // pending | paid | shipped | delivered | cancelled
  
  items: [
    {
      id: "prod-123",
      name: "T-Shirt Psychédélique",
      slug: "tshirt-psychedelique",
      price: 35,
      size: "M",
      quantity: 2,
      image: "...",
      designId: "design-1" // Important pour le stock
    }
  ],
  
  subtotal: 70,
  shipping: 0,
  total: 70,
  
  customer: {
    name: "Jean Dupont",
    email: "jean@email.com",
    phone: "0612345678",
    address: {
      street: "123 rue de la Paix",
      postalCode: "75001",
      city: "Paris",
      country: "France"
    }
  },
  
  shipping: {
    method: "standard",
    address: { ... },
    trackingNumber: null,
    estimatedDelivery: null
  },
  
  payment: {
    method: "pending",
    status: "pending",
    transactionId: null
  },
  
  notes: "",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Gestion du stock

Le stock est géré par **design** (dessin), pas par produit individuel.

### Structure du stock

```javascript
// Collection: settings
// Document: stock
{
  designs: [
    {
      id: "design-1",
      name: "Dessin Psychédélique #1",
      totalUnits: 100,
      remainingUnits: 85,
      products: ["prod-1", "prod-2"] // Produits utilisant ce dessin
    }
  ],
  lastUpdated: Timestamp
}
```

### Lien produit ↔ design

Chaque produit doit avoir un champ `designId` ou `design` qui pointe vers l'ID du dessin utilisé.

**Exemple de produit :**
```javascript
{
  id: "prod-1",
  name: "T-Shirt Psychédélique",
  designId: "design-1", // ← Important !
  price: 35,
  sizes: ["S", "M", "L", "XL"],
  // ...
}
```

## Statuts de commande

| Statut | Description | Action |
|--------|-------------|--------|
| `pending` | Commande créée, en attente de paiement | Stock déjà décrémenté |
| `paid` | Paiement reçu et validé | Prête pour expédition |
| `shipped` | Commande expédiée | Numéro de tracking ajouté |
| `delivered` | Commande livrée | Archivée |
| `cancelled` | Commande annulée | Stock peut être remis |

## Prochaines étapes

### 🔜 À implémenter

1. **Intégration paiement**
   - Stripe ou PayPal
   - Mise à jour du statut après paiement

2. **Emails de confirmation**
   - Email au client avec récapitulatif
   - Email à l'admin pour notification

3. **Gestion des annulations**
   - Remettre le stock si commande annulée
   - Logique de remboursement

4. **Validation du stock**
   - Vérifier la disponibilité avant création
   - Message d'erreur si stock insuffisant

5. **Interface de suivi**
   - Page de suivi de commande pour le client
   - Historique des commandes

## Utilisation

### Créer une commande manuellement

```javascript
import { useCheckout } from '@/composables/useCheckout'

const { processCheckout } = useCheckout()

const result = await processCheckout(
  cartItems,      // Articles du panier
  customerInfo,   // Infos client
  shippingInfo    // Infos livraison
)

if (result.success) {
  console.log('Commande créée:', result.orderNumber)
}
```

### Gérer les commandes (Admin)

```javascript
import { useOrders } from '@/composables/useOrders'

const { loadOrders, updateOrderStatus, orders } = useOrders()

// Charger les commandes
loadOrders()

// Changer le statut
await updateOrderStatus('order-id', 'shipped')
```

### Gérer le stock

```javascript
import { useStock } from '@/composables/useStock'

const { loadStock, updateDesignStock, stockData } = useStock()

// Charger le stock
loadStock()

// Mettre à jour le stock manuellement
await updateDesignStock('design-1', 50)
```

## Notes importantes

⚠️ **Stock décrémenté immédiatement**
Le stock est décrémenté dès la création de la commande (statut `pending`), pas seulement quand elle est livrée. Cela évite les surventes.

⚠️ **Design ID obligatoire**
Pour que la gestion du stock fonctionne, chaque produit DOIT avoir un `designId`.

⚠️ **Numéros de commande uniques**
Format : `NV-YYYYMMDD-XXXXX` où XXXXX est un nombre aléatoire à 5 chiffres.

## Support

Pour toute question ou problème, consulte les fichiers :
- `src/composables/useCheckout.js`
- `src/composables/useOrders.js`
- `src/composables/useStock.js`
