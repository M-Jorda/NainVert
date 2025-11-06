# 🎨 Gestion de Stock - Guide Rapide

## ✅ Ce qui a été implémenté

### 1. Nouvel onglet "Stock" dans l'Admin
- 📊 Vue en temps réel du stock par dessin
- 🎯 Actions rapides (-1, -10, -50)
- ✏️ Ajustement manuel du stock
- 🔄 Réinitialisation à 100 unités
- 📈 Statistiques globales

### 2. Décrémentation automatique
- ✨ **Quand une commande passe à "Livrée"**
- 🔍 Le système vérifie les `designId` des articles
- 📉 Décrémente automatiquement le stock
- 💾 Sauvegarde dans Firestore
- 🔔 Logs détaillés dans la console

### 3. Association Produits ↔ Dessins
- 🏷️ Nouveau champ `designId` dans les produits
- 📝 Éditable dans l'onglet "Produits"
- 👁️ Visible dans le tableau (colonne "Dessin")
- 🔗 Copié dans les articles de commande

## 🎯 Comment l'utiliser

### Première configuration

**1. Associer les produits aux dessins**
```
Admin → Produits → Cliquer sur un produit → Sélectionner le dessin
```

**2. Vérifier le stock initial**
```
Admin → Stock → Devrait afficher 100/100 pour chaque dessin
```

### Utilisation quotidienne

**Quand une commande est payée :**
```
Admin → Commandes → Trouver la commande → Changer statut
pending → paid → shipped → delivered
                              ↑
                        Le stock se décrémente ici
```

**Ajuster manuellement :**
```
Admin → Stock → Utiliser les boutons ou l'ajustement manuel
```

## 📊 Statuts de stock

| Stock | Badge | Couleur |
|-------|-------|---------|
| 100-51% | BON | Vert |
| 50-26% | MOYEN | Jaune |
| 25-11% | FAIBLE | Orange |
| 10-1% | CRITIQUE | Rouge (pulse) |
| 0% | ÉPUISÉ | Rouge |

## 🧪 Tester le système

### Créer une commande de test
```bash
cd /home/mel/Website/NainVert
node scripts/create-test-order.js
```

### Marquer comme livrée
1. Aller dans Admin → Commandes
2. Trouver la commande `TEST-...`
3. Changer le statut à "Livrée"
4. Vérifier l'onglet Stock

### Vérifier les logs
Ouvrir la console du navigateur, vous devriez voir :
```
📦 Commande livrée - Décrémentation du stock...
✅ Stock décrémenté: design-1 (-2) -> 98 unités restantes
✅ Stock mis à jour suite à livraison
```

## 🔧 Fichiers modifiés/créés

### Nouveaux fichiers
- ✨ `src/composables/useStock.js` - Logique de gestion du stock
- ✨ `src/components/admin/StockTab.vue` - Interface stock
- 📝 `STOCK_SYSTEM.md` - Documentation complète
- 🧪 `scripts/create-test-order.js` - Script de test
- 📝 `scripts/add-design-ids.js` - Migration produits

### Fichiers modifiés
- ♻️ `src/pages/Admin.vue` - Ajout onglet Stock
- ♻️ `src/composables/useOrders.js` - Décrémentation auto
- ♻️ `src/components/admin/ProductsTab.vue` - Champ designId
- 📖 `README.md` - Documentation mise à jour

## 🚨 Important

### ⚠️ À faire avant la mise en production

1. **Associer tous les produits à un dessin**
   - Vérifier que chaque produit a un `designId`
   - Sinon, le stock ne se décrémentera pas pour ces produits

2. **Tester avec une vraie commande**
   - Créer une commande de test
   - La marquer comme livrée
   - Vérifier que le stock baisse

3. **Configurer les noms de dessins**
   - Par défaut : "Dessin 1" et "Dessin 2"
   - Éditable directement dans l'interface Stock

### ⚙️ Configuration du checkout

Assurez-vous que lors du checkout, le `designId` est copié du produit vers l'article :

```javascript
// Dans votre processus d'ajout au panier
const cartItem = {
  name: product.name,
  quantity: qty,
  size: selectedSize,
  price: product.price,
  total: product.price * qty,
  designId: product.designId  // ← IMPORTANT !
}
```

## 🎓 Concepts clés

### Stock par dessin, pas par produit
- ✅ 1 dessin = 100 unités total
- ✅ 1 dessin peut avoir plusieurs produits (T-shirt + Pull)
- ✅ Vendre 1 T-shirt OU 1 Pull = -1 sur le même dessin

### Exemple pratique
```
Dessin 1 : 100 unités
├── T-Shirt Nain Vert (designId: design-1)
└── Pull Nain Vert (designId: design-1)

Commande livrée :
- 2x T-Shirt → Dessin 1 passe à 98
- 1x Pull → Dessin 1 passe à 97

Total : 97/100 unités restantes pour Dessin 1
```

## 📞 Support

### Vérifications de base
- [ ] Les produits ont un `designId` ?
- [ ] Le stock est initialisé ? (Admin → Stock)
- [ ] La commande contient le `designId` dans ses items ?
- [ ] Le statut passe bien à "delivered" ?

### Console utile
```javascript
// Dans Admin → Produits, ouvrir la console :
products.value.forEach(p => console.log(p.name, p.designId))

// Dans Admin → Commandes, vérifier une commande :
console.log(order.items[0].designId)
```

## 🎉 Prochaines étapes

1. ✅ Tester le système avec une commande fictive
2. ✅ Associer tous vos produits à des dessins
3. ✅ Personnaliser les noms des dessins
4. ✅ Vérifier que le checkout copie bien le `designId`
5. 🚀 Mettre en production !

---

**Documentation complète** : `STOCK_SYSTEM.md`
