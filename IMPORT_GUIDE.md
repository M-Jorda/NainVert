# 📦 Guide d'Import des Données vers Firebase

## Prérequis

Avant d'exécuter le script d'import, assure-toi d'avoir :

1. ✅ Créé ton projet Firebase
2. ✅ Activé Firestore (mode test pour commencer)
3. ✅ Récupéré tes clés de configuration Firebase

## Étapes d'import

### 1. Configure les clés Firebase dans le script

Ouvre `scripts/importToFirestore.js` et remplace les valeurs :

```javascript
const firebaseConfig = {
  apiKey: "TA_VRAIE_CLE_API",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef"
}
```

### 2. Lance le script d'import

```bash
npm run import-firebase
```

### 3. Vérifie dans la console Firebase

1. Va sur [console.firebase.google.com](https://console.firebase.google.com)
2. Sélectionne ton projet
3. Va dans **Firestore Database**
4. Tu devrais voir :
   - Collection **`products`** avec 4 documents
   - Collection **`siteContent`** avec 1 document (`global`)

## Ce qui sera importé

### Collection `products` (4 documents)

Chaque produit avec :
- ✅ Nom, slug, type, prix
- ✅ Description complète
- ✅ Array d'images (3 photos par produit)
- ✅ Array de tailles (XS à XXXL)
- ✅ Colors (si défini)
- ✅ Stock disponible
- ✅ Détails (matière, poids, coupe, entretien)

**Documents créés** :
1. `neon-dreams-tshirt`
2. `acid-wave-tshirt`
3. `electric-jungle-hoodie`
4. `cyber-trip-crewneck`

### Collection `siteContent` (1 document)

Document `global` contenant :
- ✅ Textes de la page d'accueil (titre, sous-titre, CTA)
- ✅ Textes de la page contact (titre, email, Instagram, horaires)
- ✅ Tagline du footer

## Erreurs possibles

### ❌ "Firebase config is missing"
→ Tu n'as pas remplacé les clés dans le script

### ❌ "Permission denied"
→ Tes règles Firestore sont trop restrictives. En mode développement, utilise :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Mode test - NE PAS utiliser en production !
    }
  }
}
```

### ❌ "Module not found"
→ Lance `npm install` avant d'exécuter le script

## Après l'import

Une fois les données importées :

1. **Vérifie** que tout est correct dans la console Firebase
2. **Configure les règles de sécurité** (voir FIREBASE_SETUP.md)
3. **Dis-moi que c'est fait** et je mettrai à jour le code Vue pour utiliser Firebase ! 🚀

## Re-importer les données

Si tu veux réimporter (écraser les données existantes) :

```bash
npm run import-firebase
```

Le script utilisera `setDoc()` qui écrase les documents existants.

## Notes importantes

- Le script utilise le **slug** comme ID de document (plus facile pour les requêtes)
- Les images restent en local dans `/public/products/`
- Pour héberger les images sur Firebase Storage, on le fera après si nécessaire
