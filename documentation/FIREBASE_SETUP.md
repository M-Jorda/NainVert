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

### Collection `designs`
1. Clique sur **"Commencer une collection"**
2. Nomme-la **`designs`**
3. Ajoute un document avec ID personnalisé (ex: "design-1")
4. Structure:
```json
{
  "id": "string (ex: design-1)",
  "name": "string (ex: Psychedelic Dream)",
  "slug": "string (ex: psychedelic-dream)",
  "designPrice": "number (ex: 15)",
  "tagline": "string (accroche courte)",
  "description": "string (description longue)",
  "story": "string (histoire du design)",
  "images": "array (URLs Cloudinary)",
  "featured": "boolean (mis en avant ?)",
  "inStock": "boolean (disponible ?)",
  "archived": "boolean (archivé ?)",
  "createdAt": "timestamp"
}
```

### Collection `garments`
1. Crée une nouvelle collection **`garments`**
2. Crée un document avec l'ID **`tshirt`**
3. Structure:
```json
{
  "type": "tshirt",
  "basePrice": 20,
  "sizes": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  "photos": ["url1", "url2"],
  "details": {
    "material": "100% coton",
    "weight": "185 m/g²",
    "fit": "Coupe classique unisexe",
    "care": "Lavage machine 30°C"
  },
  "createdAt": "timestamp"
}
```
4. Répète pour **`hoodie`** avec `basePrice: 50`

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

Tu peux utiliser le script d'import fourni :

```bash
node scripts/importToFirestore.js
```

Ou importer manuellement via l'interface Firestore.

## Étape 8 : Configurer les règles de sécurité Firestore

1. Va dans **Firestore Database > Règles**
2. Remplace le contenu par:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Règles pour les designs
    match /designs/{designId} {
      allow read: if true;
      allow write: if request.auth != null;
      
      // Sous-collection stock
      match /stock/{stockId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
    
    // Règles pour les types de vêtements
    match /garments/{garmentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Règles pour le contenu du site
    match /siteContent/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Règles pour les commandes
    match /orders/{orderId} {
      allow create: if true;  // Clients peuvent créer
      allow read, update, delete: if request.auth != null;  // Admin gère
    }
    
    // Règles pour les messages contact
    match /messages/{messageId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Règles pour honeypot logs
    match /honeypot_logs/{logId} {
      allow create: if true;
      allow read, delete: if request.auth != null;
    }
    
    // Règles pour les settings
    match /settings/{settingId} {
      allow read: if true;
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
- [ ] Collections `designs`, `garments` et `siteContent` créées
- [ ] Règles de sécurité configurées
- [ ] Données importées (designs, garments)

**Le site est maintenant prêt à fonctionner ! 🚀**
