# 🔄 Recréation des Collections Firestore

## ⚠️ ATTENTION
Ces scripts vont recréer les collections avec la structure à jour. Assurez-vous d'avoir sauvegardé vos données importantes avant de continuer.

---

## 📋 Procédure

### Étape 1️⃣ : Supprimer les anciennes collections

1. Ouvre Firebase Console : https://console.firebase.google.com/
2. Sélectionne le projet **nainvert-bc46d**
3. Va dans **Firestore Database**
4. Supprime les collections suivantes :
   - ✅ `orders` (commandes)
   - ✅ `designs` (designs)

> **Note** : Ne touche PAS aux autres collections (`garments`, `garmentTypes`, `honeypot`, etc.)

---

### Étape 2️⃣ : Recréer les collections

Dans le terminal, exécute les scripts suivants **depuis la racine du projet** :

```bash
# Recréer la collection Designs
node scripts/recreate-designs.js

# Recréer la collection Orders
node scripts/recreate-orders.js
```

---

## 📊 Structures Mises à Jour

### **Collection : `designs`**

```javascript
{
  id: "neon-dreams",                    // String
  slug: "neon-dreams",                  // String (URL)
  name: "Neon Dreams",                  // String
  tagline: "...",                       // String
  description: "...",                   // String
  story: "...",                         // String (optionnel)
  designPrice: 15.00,                   // Number ⚠️ PAS String!
  images: ["https://..."],              // Array
  featured: true,                       // Boolean
  inStock: true,                        // Boolean
  createdAt: Timestamp,                 // Timestamp
  updatedAt: Timestamp                  // Timestamp
}
```

**Points clés** :
- ✅ `designPrice` est maintenant un **Number** (pas String "15.00")
- ✅ Structure propre et cohérente
- 📝 TODO futur : `garmentImages` pour images par vêtement

---

### **Collection : `orders`**

```javascript
{
  orderNumber: "NV-2025-0001",          // String
  status: "pending",                    // String (pending, processing, shipped, delivered, cancelled)
  
  customerInfo: {
    name: "Jean Dupont",                // String
    email: "jean@example.com",          // String
    phone: "06 12 34 56 78",            // String
    address: {
      street: "12 rue...",              // String
      postalCode: "75001",              // String
      city: "Paris",                    // String
      country: "France"                 // String
    }
  },
  
  items: [
    {
      id: "neon-dreams-tshirt-L",       // String
      designId: "neon-dreams",          // String
      designSlug: "neon-dreams",        // String
      designName: "Neon Dreams",        // String
      type: "tshirt",                   // String (tshirt | hoodie)
      size: "L",                        // String
      price: 35.00,                     // Number ⚠️ PAS String!
      quantity: 1,                      // Number
      total: 35.00,                     // Number ⚠️ PAS String!
      image: "https://..."              // String
    }
  ],
  
  subtotal: 35.00,                      // Number ⚠️ PAS String!
  shippingCost: 0.00,                   // Number
  taxRate: 0.20,                        // Number (20%)
  taxAmount: 7.00,                      // Number
  total: 35.00,                         // Number ⚠️ PAS String!
  
  createdAt: Timestamp,                 // Timestamp
  updatedAt: Timestamp,                 // Timestamp
  
  paymentStatus: "pending",             // String (pending, paid, failed)
  paymentMethod: null,                  // String | null
  adminNotes: ""                        // String
}
```

**Points clés** :
- ✅ Tous les prix sont des **Numbers** (pas Strings)
- ✅ Structure complète avec infos client
- ✅ Items détaillés avec toutes les infos nécessaires
- ✅ Calculs de prix clairs (subtotal, tax, total)

---

## ✅ Vérification

Après avoir exécuté les scripts :

1. **Firebase Console** :
   - Vérifie que les collections existent
   - Vérifie que les documents sont créés
   - Vérifie les types de données (notamment les Numbers)

2. **Application** :
   - Va sur `/designs` → Tous les designs doivent s'afficher
   - Va sur `/admin` → Les commandes doivent s'afficher
   - Teste une nouvelle commande → Elle doit fonctionner

---

## 🐛 Problèmes Courants

### Erreur : `toFixed is not a function`
**Cause** : Un prix est stocké en String au lieu de Number  
**Solution** : Vérifie que tous les prix sont bien des Numbers dans les scripts

### Les designs ne s'affichent pas
**Cause** : Les images Cloudinary ne sont peut-être plus valides  
**Solution** : Upload de nouvelles images via l'admin panel

### Les commandes ne se créent pas
**Cause** : Problème de type de données  
**Solution** : Vérifie dans `useCheckout.js` que les prix sont bien convertis en Number

---

## 📝 Notes Importantes

1. **Types de données** : 
   - Firestore fait la différence entre `15` (Number) et `"15"` (String)
   - Toujours utiliser `Number()` pour convertir si nécessaire

2. **Images** :
   - Remplace les URLs d'exemple par tes vraies images Cloudinary
   - Voir `DESIGN_IMAGES_STRUCTURE.md` pour la future structure

3. **Numéros de commande** :
   - Format : `NV-YYYY-XXXX` (NainVert - Année - Numéro)
   - Auto-incrémenté dans l'application

---

## 🚀 Prochaines Étapes

1. ✅ Recréer les collections
2. ✅ Vérifier que tout fonctionne
3. 📸 Implémenter `garmentImages` pour images par vêtement
4. 💳 Intégrer le paiement (Stripe/PayPal)
5. 📧 Ajouter les emails de confirmation
6. 📦 Gérer les stocks en temps réel

---

**Date** : 9 Novembre 2025  
**Auteur** : Copilot  
**Version** : 1.0
