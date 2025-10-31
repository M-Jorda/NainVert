# 🔥 Guide de Migration Firebase - NainVert

## Étape 1 : Créer le projet Firebase

1. **Va sur [console.firebase.google.com](https://console.firebase.google.com)**
2. **Clique sur "Ajouter un projet"**
3. **Nomme-le "NainVert"** (ou ce que tu veux)
4. **Désactive Google Analytics** (optionnel pour un petit site)
5. **Clique sur "Créer le projet"**

## Étape 2 : Récupérer les clés de configuration

1. Dans la console Firebase, clique sur **⚙️ > Paramètres du projet**
2. Descends jusqu'à **"Vos applications"**
3. Clique sur l'icône **Web (</>)**
4. Nomme l'app "NainVert Web"
5. **Copie les valeurs de `firebaseConfig`**
6. **Colle-les dans `src/config/firebase.js`** (remplace les YOUR_XXX)

```javascript
// Exemple de ce que tu dois remplacer:
const firebaseConfig = {
  apiKey: "AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567",
  authDomain: "nainvert-12345.firebaseapp.com",
  projectId: "nainvert-12345",
  storageBucket: "nainvert-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
}
```

## Étape 3 : Activer l'authentification

1. Dans la console Firebase, va dans **🔐 Authentication**
2. Clique sur **"Commencer"**
3. Dans l'onglet **"Sign-in method"**
4. Active **"E-mail/Mot de passe"**
5. Clique sur **"Enregistrer"**

## Étape 4 : Créer un utilisateur admin

1. Dans **Authentication > Users**
2. Clique sur **"Ajouter un utilisateur"**
3. Entre ton email admin (ex: `admin@nainvert.com`)
4. Entre un mot de passe **FORT** (ex: génère-en un avec un gestionnaire de mots de passe)
5. **Note bien ce mot de passe** (tu ne pourras plus le voir après)

## Étape 5 : Activer Firestore

1. Dans la console Firebase, va dans **🗄️ Firestore Database**
2. Clique sur **"Créer une base de données"**
3. Choisis **"Démarrer en mode test"** (on changera les règles après)
4. Choisis la région **"europe-west"** (plus proche de toi)
5. Clique sur **"Activer"**

## Étape 6 : Créer les collections Firestore

### Collection `products`
1. Clique sur **"Commencer une collection"**
2. Nomme-la **`products`**
3. Ajoute un document avec ID auto
4. Structure:
```json
{
  "id": "string (ex: huile-argan)",
  "name": "string (ex: Huile d'Argan Bio)",
  "price": "number (ex: 15.99)",
  "image": "string (URL)",
  "category": "string (ex: Soins)",
  "description": "string (texte long)",
  "slug": "string (ex: huile-argan)"
}
```

### Collection `siteContent`
1. Crée une nouvelle collection **`siteContent`**
2. Crée un document avec l'ID **`global`**
3. Structure:
```json
{
  "home": {
    "title": "string",
    "subtitle": "string",
    "cta": "string"
  },
  "contact": {
    "title": "string",
    "subtitle": "string",
    "email": "string",
    "instagram": "string",
    "hours": "string"
  },
  "footer": {
    "tagline": "string"
  }
}
```

## Étape 7 : Importer les données existantes

Tu peux importer tes données actuelles depuis `src/data/products.js` manuellement ou avec un script.

**Option manuelle**: Copie-colle chaque produit dans Firestore (fastidieux mais sûr)

**Option script** (plus rapide): Je peux créer un script d'import si tu veux.

## Étape 8 : Configurer les règles de sécurité Firestore

1. Va dans **Firestore Database > Règles**
2. Remplace le contenu par:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Règles pour les produits
    match /products/{productId} {
      // Lecture publique
      allow read: if true;
      // Écriture uniquement pour les utilisateurs authentifiés
      allow write: if request.auth != null;
    }
    
    // Règles pour le contenu du site
    match /siteContent/{document} {
      // Lecture publique
      allow read: if true;
      // Écriture uniquement pour les utilisateurs authentifiés
      allow write: if request.auth != null;
    }
  }
}
```

3. **Publie les règles**

## Étape 9 : Tester la connexion

Une fois que tu as tout configuré, dis-moi et je mettrai à jour le code pour utiliser Firebase !

## 🚨 Sécurité importante

- **Ne commit JAMAIS tes clés Firebase dans Git** (elles sont publiques de toute façon pour le frontend)
- Les vraies clés secrètes sont dans les règles Firestore (côté serveur)
- L'authentification protège l'écriture, pas la lecture
- Pour plus de sécurité, tu pourrais restreindre les règles à un UID spécifique

## 📋 Checklist avant de continuer

- [ ] Projet Firebase créé
- [ ] Clés copiées dans `src/config/firebase.js`
- [ ] Authentication Email/Password activée
- [ ] Utilisateur admin créé
- [ ] Firestore activé
- [ ] Collections `products` et `siteContent` créées
- [ ] Règles de sécurité configurées

**Quand tu auras fait tout ça, dis-moi et je coderai la migration du code Vue ! 🚀**
