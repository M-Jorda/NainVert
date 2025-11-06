# 📦 Système de Gestion de Stock Automatique

## Vue d'ensemble

Le système de gestion de stock fonctionne **par dessin**, et non par produit individuel. Lorsqu'une commande est marquée comme "livrée", le stock est automatiquement décrémenté.

## Architecture

### 1. Structure des données

#### Stock (Firestore: `settings/stock`)
```json
{
  "designs": [
    {
      "id": "design-1",
      "name": "Dessin 1",
      "totalUnits": 100,
      "remainingUnits": 85,
      "products": []
    },
    {
      "id": "design-2",
      "name": "Dessin 2",
      "totalUnits": 100,
      "remainingUnits": 92,
      "products": []
    }
  ],
  "lastUpdated": "timestamp"
}
```

#### Produits (Firestore: `products/{productId}`)
```json
{
  "name": "T-Shirt Nain Vert",
  "price": 25,
  "type": "tshirt",
  "designId": "design-1",  // ← Association au dessin
  "inStock": true,
  "sizes": ["S", "M", "L", "XL"],
  "images": ["url1", "url2"]
}
```

#### Commandes (Firestore: `orders/{orderId}`)
```json
{
  "items": [
    {
      "name": "T-Shirt Nain Vert",
      "quantity": 2,
      "designId": "design-1",  // ← Hérité du produit
      "size": "M",
      "price": 25,
      "total": 50
    }
  ],
  "status": "delivered",  // ← Déclenche la décrémentation
  "total": 50
}
```

## Flux automatique

### Lors d'une livraison

```
1. Admin change le statut d'une commande à "delivered"
   ↓
2. useOrders.updateOrderStatus() détecte le changement
   ↓
3. Si ancien statut ≠ "delivered" ET nouveau statut = "delivered"
   ↓
4. Appel à decrementStockForDeliveredOrder()
   ↓
5. Pour chaque article avec un designId :
   - Trouve le dessin correspondant
   - Décrémente remainingUnits de la quantité commandée
   ↓
6. Mise à jour dans Firestore
   ↓
7. L'interface Stock se met à jour en temps réel via onSnapshot
```

### Code clé

**src/composables/useOrders.js**
```javascript
const updateOrderStatus = async (orderId, newStatus) => {
  // Récupère l'ancien statut
  const orderSnap = await getDoc(orderRef)
  const previousStatus = orderSnap.data().status
  
  // Met à jour le statut
  await updateDoc(orderRef, { status: newStatus })
  
  // Si passage à "delivered", décrémente le stock
  if (newStatus === 'delivered' && previousStatus !== 'delivered') {
    await decrementStockForDeliveredOrder(orderData.items)
  }
}
```

## Configuration initiale

### 1. Initialiser le stock

Le stock s'initialise automatiquement au premier accès à l'onglet Stock de l'admin :
- 2 dessins par défaut
- 100 unités chacun

### 2. Associer les produits aux dessins

**Option A : Via l'interface admin (recommandé)**
1. Aller dans l'onglet "Produits"
2. Cliquer sur un produit
3. Sélectionner le dessin associé dans le menu déroulant
4. Les changements sont sauvegardés automatiquement

**Option B : Via le script de migration**
```bash
cd /home/mel/Website/NainVert
node scripts/add-design-ids.js
```

Éditez le script pour mapper vos produits :
```javascript
const productToDesignMap = {
  'tshirt-nain-vert': 'design-1',
  'pull-nain-vert': 'design-1',
  'tshirt-champignon': 'design-2',
  'pull-champignon': 'design-2',
}
```

### 3. S'assurer que les commandes incluent le designId

Lors de la création d'une commande (checkout), le designId doit être copié du produit vers l'article :

```javascript
// Dans votre processus de checkout
const cartItem = {
  name: product.name,
  quantity: 1,
  size: selectedSize,
  price: product.price,
  total: product.price * quantity,
  designId: product.designId  // ← Important !
}
```

## Interface Admin

### Onglet Stock

- **Vue en temps réel** : Synchronisation automatique via Firestore
- **Cartes par dessin** avec :
  - Nom éditable
  - Barre de progression colorée
  - Pourcentage de stock restant
  - Badge de statut (BON, MOYEN, FAIBLE, CRITIQUE, ÉPUISÉ)
  
- **Actions disponibles** :
  - Décrémentation rapide (-1, -10, -50)
  - Ajustement manuel
  - Réinitialisation à 100 unités
  
- **Statistiques globales** :
  - Stock total
  - Unités disponibles
  - Unités vendues
  - Pourcentage global

### Onglet Produits

- **Colonne "Dessin"** dans le tableau
- **Sélecteur de dessin** dans le modal de détail
- Indicateur visuel (badge violet) si un dessin est associé

## Sécurité

- ✅ Le stock ne peut jamais être négatif (`Math.max(0, ...)`)
- ✅ Vérification de l'ancien statut pour éviter les décrémenta doubles
- ✅ Logs détaillés dans la console
- ✅ Gestion d'erreurs avec messages clairs

## Logs console

Lors d'une livraison, vous verrez :
```
📦 Commande livrée - Décrémentation du stock...
✅ Stock décrémenté: design-1 (-2) -> 85 unités restantes
✅ Stock mis à jour suite à livraison
```

## Évolutions futures possibles

1. **Alertes de stock bas** : Email/notification quand < 10 unités
2. **Historique des mouvements** : Traçabilité complète
3. **Réapprovisionnement** : Bouton pour commander plus de stock
4. **Prévisions** : Calcul du nombre de jours avant rupture
5. **Export** : CSV des mouvements de stock
6. **Multi-dessins** : Support de plus de 2 dessins

## Dépannage

### Le stock ne se décrémente pas

**Vérifier :**
1. Les produits ont-ils un `designId` ?
2. Les articles de la commande ont-ils le `designId` copié ?
3. Le statut passe-t-il bien à "delivered" ?
4. Consulter la console pour les erreurs

**Console utile :**
```javascript
// Vérifier un produit
console.log(product.designId) // devrait afficher "design-1" ou "design-2"

// Vérifier une commande
console.log(order.items[0].designId) // devrait afficher le designId
```

### Stock incorrect

1. Aller dans l'onglet Stock
2. Utiliser l'ajustement manuel
3. Ou réinitialiser à 100 unités

## Support

Pour toute question ou problème :
- Consulter les logs dans la console navigateur
- Vérifier Firestore : `settings/stock` et `products`
- Tester avec une commande factice
