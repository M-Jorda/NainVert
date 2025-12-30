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

#### Designs (Firestore: `designs/{designId}`)
```json
{
  "id": "ftg",
  "name": "ftg",
  "slug": "ftg",
  "designPrice": 15,  // Prix du design
  "tagline": "...",
  "description": "...",
  "story": "...",
  "images": ["url1", "url2"],
  "featured": true,
  "inStock": true,
  "archived": false
}
```

#### Garments (Firestore: `garments/{type}`)
```json
{
  "type": "tshirt",  // ou "hoodie"
  "basePrice": 20,  // Prix de base du vêtement
  "sizes": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  "photos": ["url1", "url2"],  // Photos du vêtement seul
  "details": {
    "material": "100% coton",
    "weight": "185 m/g²",
    "fit": "Coupe classique unisexe",
    "care": "Lavage machine 30°C"
  }
}
```

**Prix final** = `designPrice` + `basePrice` (ex: 15€ + 20€ = 35€)

#### Commandes (Firestore: `orders/{orderId}`)
```json
{
  "items": [
    {
      "id": "ftg-hoodie-L",  // ID unique
      "designId": "ftg",  // ← Association au design
      "name": "ftg",
      "slug": "ftg",
      "type": "hoodie",
      "size": "L",
      "quantity": 2,
      "price": 65,  // designPrice (15) + basePrice (50)
      "image": "url1"
    }
  ],
  "status": "delivered",  // ← Déclenche la décrémentation
  "total": 130
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

### 2. Vérifier les designs dans Firestore

Les designs doivent exister dans la collection `designs` :
- Chaque design a automatiquement une sous-collection `stock` créée lors de sa création
- Le stock est géré individuellement par design
- Le système décrémente automatiquement lors du passage à "delivered"

### 3. S'assurer que les commandes incluent le designId

Lors de la création d'une commande (checkout), le designId est automatiquement copié depuis le design sélectionné :

```javascript
// Dans le processus de checkout
const cartItem = {
  id: `${design.id}-${garmentType}-${size}`,
  designId: design.id,  // ← Important !
  name: design.name,
  slug: design.slug,
  type: garmentType,
  size: size,
  quantity: quantity,
  price: design.designPrice + garment.basePrice,
  image: design.images[0]
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

### Onglet Designs

- **Colonne "Stock"** dans le tableau des designs
- **Indicateur visuel** du niveau de stock
- Badge de statut par design (BON, FAIBLE, CRITIQUE, ÉPUISÉ)

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
1. Les designs existent-ils dans Firestore ?
2. Les articles de la commande ont-ils le `designId` ?
3. Le statut passe-t-il bien à "delivered" ?
4. Consulter la console pour les erreurs

**Console utile :**
```javascript
// Vérifier un article de commande
console.log(order.items[0].designId) // devrait afficher l'ID du design (ex: "ftg")

// Vérifier le stock d'un design
// Dans Firestore: designs/{designId}/stock/{designId}
```

### Stock incorrect

1. Aller dans l'onglet Stock
2. Utiliser l'ajustement manuel
3. Ou réinitialiser à 100 unités

## Support

Pour toute question ou problème :
- Consulter les logs dans la console navigateur
- Vérifier Firestore : `designs/{id}/stock` et `designs` collection
- Vérifier que les commandes contiennent bien le `designId`
- Tester avec une commande factice via `scripts/create-test-order.js`
