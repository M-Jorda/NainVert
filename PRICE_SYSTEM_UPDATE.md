# 🎯 Mise à jour du système de prix - Designs gratuits

## 📋 Contexte

Le nouveau système de prix simplifie l'achat :
- **Les designs sont gratuits** (designPrice = 0)
- **Seul le vêtement a un prix** (T-shirt 35€ / Hoodie 75€)
- Prix affiché = Prix du vêtement TTC (TVA 20% incluse)

---

## ✅ Modifications effectuées

### 1. **Admin - DesignsTab.vue**
```vue
<!-- ❌ SUPPRIMÉ : Champ "Prix du design" dans le formulaire -->

<!-- ✅ MODIFIÉ : Affichage dans le tableau -->
<td>
  <div class="text-white font-semibold">Gratuit</div>
  <div class="text-xs text-[var(--color-text-muted)]">
    Prix = vêtement uniquement
  </div>
</td>
```

```javascript
// ✅ MODIFIÉ : designPrice par défaut à 0
const formData = ref({
  name: '',
  slug: '',
  // ...
  designPrice: 0,  // Prix à 0 par défaut
  // ...
})
```

---

### 2. **DesignDetail.vue**
```javascript
// ❌ ANCIEN : Prix total = design + vêtement
return Number((design.value.designPrice + garmentPrice).toFixed(2))

// ✅ NOUVEAU : Prix = vêtement uniquement
const calculatePrice = (type) => {
  if (!design.value) return 0
  const garment = getGarmentByType(type)
  const garmentPrice = garment?.basePrice || garmentTypes.value[type]?.basePrice || 0
  return Number(garmentPrice.toFixed(2))
}
```

---

### 3. **SizeSelector.vue**
```vue
<!-- ❌ SUPPRIMÉ : Ligne "Prix design" -->
<div class="flex justify-between text-sm">
  <span>Prix design</span>
  <span>{{ designPrice.toFixed(2) }}€</span>
</div>

<!-- ✅ CONSERVÉ : Uniquement prix du vêtement -->
<div class="flex justify-between text-sm">
  <span>Prix {{ selectedType === 'tshirt' ? 'T-Shirt' : 'Hoodie' }}</span>
  <span>{{ garmentPrice.toFixed(2) }}€</span>
</div>
```

```javascript
// ❌ SUPPRIMÉ : Computed designPrice
const designPrice = computed(() => {
  return props.design.designPrice || 15
})

// ✅ CONSERVÉ : Uniquement garmentPrice
const garmentPrice = computed(() => {
  const garment = garmentTypes.value?.[props.selectedType]
  return garment ? garment.basePrice : 0
})
```

---

## 📊 Affichage des prix

### Avant (design payant) :
```
Prix design:     15.00€
Prix T-Shirt:    35.00€
TVA (20%):       10.00€
────────────────────
Total TTC:       50.00€
```

### Après (design gratuit) :
```
Prix T-Shirt:    35.00€
TVA (20%):        7.00€
────────────────────
Total TTC:       35.00€
```

---

## 🎯 Prix par vêtement

| Vêtement | Prix HT | TVA 20% | Prix TTC |
|----------|---------|---------|----------|
| **T-Shirt** | 29.17€ | 5.83€ | **35.00€** |
| **Hoodie** | 62.50€ | 12.50€ | **75.00€** |

---

## 🗂️ Structure Firestore

Les designs conservent le champ `designPrice` pour compatibilité :

```javascript
{
  id: 'neon-dreams',
  slug: 'neon-dreams',
  name: 'Neon Dreams',
  tagline: 'Plongez dans l\'univers psychédélique',
  description: '...',
  story: '...',
  
  designPrice: 0,  // ✅ Toujours à 0 maintenant
  
  images: ["url1.jpg"],
  featured: true,
  inStock: true,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## ✅ Résultat final

### Admin Panel
- ✅ Formulaire simplifié (pas de champ prix)
- ✅ Tableau affiche "Gratuit"
- ✅ designPrice automatiquement à 0

### Page Produit
- ✅ Prix affiché = Prix du vêtement uniquement
- ✅ Calcul correct : `price = garmentPrice` (sans design)

### Sélecteur de taille
- ✅ Ligne "Prix design" supprimée
- ✅ Affiche uniquement : Prix vêtement + TVA + Total

### Panier
- ✅ Prix correct (vêtement uniquement)
- ✅ Total calculé sans le prix du design

---

## 🧪 Test de validation

1. **Créer un design** → designPrice doit être 0
2. **Voir un design** → Prix affiché = 35€ (T-shirt) ou 75€ (Hoodie)
3. **Ajouter au panier** → Prix correct sans supplément design
4. **Passer commande** → Total = Prix vêtements uniquement

---

## 📝 Notes

- Le champ `designPrice` existe toujours en BDD (valeur 0)
- Utile pour une future évolution si designs payants à nouveau
- Tous les calculs ignorent désormais `designPrice`
- Rétrocompatible avec anciens designs (designPrice sera ignoré)

---

✅ **Système de prix simplifié et opérationnel !**
