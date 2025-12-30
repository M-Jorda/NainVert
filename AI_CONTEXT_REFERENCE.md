================================================================================
                    🤖 FICHIER DE RÉFÉRENCE POUR L'IA
                        NainVert - E-commerce Platform
                    Document de contexte et contraintes strictes
================================================================================

> **⚠️ AVERTISSEMENT CRITIQUE**  
> Ce fichier sert de "prompt système permanent" pour toute intervention d'IA.  
> Il DOIT être lu en PREMIER avant toute modification du projet.  
> Respectez STRICTEMENT les règles définies ci-dessous.

================================================================================
## 📘 1. COMMENT UTILISER CE FICHIER
================================================================================

### Pour l'IA qui intervient sur ce projet :

1. ✅ **TOUJOURS** lire ce fichier AVANT toute modification
2. ✅ **TOUJOURS** vérifier les fichiers existants avant de créer
3. ✅ **TOUJOURS** respecter l'architecture et la structure définies
4. ✅ **TOUJOURS** consulter les docs dans `/documentation/` pour plus de détails
5. ❌ **JAMAIS** modifier la charte graphique sans validation explicite
6. ❌ **JAMAIS** changer l'architecture sans accord du client
7. ❌ **JAMAIS** recréer ce qui existe déjà
8. ❌ **JAMAIS** modifier les règles Firestore sans alerter

### Documentation complémentaire disponible :

- `FIREBASE_SETUP.md` - Configuration Firebase complète
- `STOCK_SYSTEM.md` - Système de stock détaillé
- `HONEYPOT_SETUP.md` - Sécurité honeypot
- `DESIGN_GUIDE.md` - Charte graphique complète
- `CHECKOUT_SYSTEM.md` - Système de commande
- `README.md` - Vue d'ensemble du projet

================================================================================
## 🏗️ 2. ARCHITECTURE TECHNIQUE
================================================================================

### Stack Technologique (À RESPECTER)

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Vue.js** | 3.4.21 | Framework frontend (Composition API) |
| **Vite** | 7.1.12 | Build tool ultra-rapide |
| **Vue Router** | 4.3.0 | Routing SPA |
| **Pinia** | 2.1.7 | State management |
| **Tailwind CSS** | 4.1.16 | Framework CSS utility-first |
| **Firebase** | 12.5.0 | Backend (Firestore + Auth) |

### Structure des dossiers (STRICTE)

```
NainVert/
├── public/                     # Fichiers statiques
│   ├── products/              # Images produits
│   ├── favicon.svg
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
├── functions/                  # 🆕 Cloud Functions Firebase
│   ├── package.json
│   └── index.js               # Stripe + Emails
├── src/
│   ├── components/            # Composants réutilisables
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   ├── Cart.vue
│   │   ├── CartIcon.vue
│   │   ├── CheckoutModal.vue
│   │   ├── CheckoutModalStripe.vue  # 🆕 Version avec Stripe
│   │   ├── StripePaymentForm.vue    # 🆕 Formulaire paiement
│   │   ├── OrderSummary.vue         # 🆕 Résumé commande
│   │   ├── EasterEggModal.vue
│   │   ├── SeedMessages.vue
│   │   ├── admin/             # Composants admin
│   │   │   ├── DesignsTab.vue
│   │   │   ├── GarmentsTab.vue
│   │   │   ├── MessagesTab.vue
│   │   │   ├── OrdersTab.vue
│   │   │   ├── SecurityTab.vue
│   │   │   └── StockTab.vue
│   │   └── shop/              # Composants boutique
│   │       ├── DesignCard.vue
│   │       └── SizeSelector.vue
│   ├── pages/                 # Pages de l'application
│   │   ├── Home.vue
│   │   ├── Designs.vue
│   │   ├── DesignDetail.vue
│   │   ├── Contact.vue
│   │   ├── Admin.vue
│   │   ├── Honeypot.vue
│   │   ├── DevTools.vue
│   │   ├── Shipping.vue
│   │   ├── Returns.vue
│   │   ├── Terms.vue
│   │   ├── Legal.vue
│   │   └── NotFound.vue
│   ├── composables/           # Logique réutilisable
│   │   ├── useDesigns.js      # Gestion des designs
│   │   ├── useGarments.js     # Gestion des types de vêtements
│   │   ├── useStripePayment.js # 🆕 Paiement Stripe
│   │   ├── useGarmentTypes.js # Types de vêtements
│   │   ├── useOrders.js       # Gestion des commandes
│   │   ├── useStock.js        # Gestion du stock
│   │   ├── useCheckout.js     # Système de checkout
│   │   ├── useEasterEgg.js    # Easter eggs
│   │   └── useEasterEggsFirestore.js
│   ├── stores/                # Stores Pinia
│   │   ├── cart.js            # Panier client
│   │   └── admin.js           # Admin auth
│   ├── config/
│   │   └── firebase.js        # Configuration Firebase
│   ├── services/
│   │   ├── cloudinary.js      # Upload images
│   │   ├── stripe.js          # 🆕 Service Stripe
│   │   └── email.js           # 🆕 Service emails
│   ├── router/
│   │   └── index.js           # Routes
│   ├── styles/
│   │   ├── main.css           # Styles globaux
│   │   └── legal-pages.css    # Styles pages légales
│   ├── App.vue
│   └── main.js
├── scripts/                   # Scripts utilitaires
├── documentation/             # Documentation projet
│   └── STRIPE_SENDGRID_SETUP.md # 🆕 Guide intégration paiement
├── firebase.json              # Config Firebase
├── firestore.rules            # Règles sécurité Firestore
├── storage.rules              # Règles sécurité Storage
├── package.json
├── vite.config.js
└── postcss.config.js
```

### Composables (Responsabilités)

| Composable | Responsabilité |
|-----------|---------------|
| `useDesigns.js` | CRUD designs, chargement, mise à jour |
| `useGarments.js` | CRUD types de vêtements (T-shirt, Hoodie, etc.) |
| `useGarmentTypes.js` | Utilitaires types de vêtements |
| `useOrders.js` | Gestion commandes, statuts, tracking, archivage |
| `useStock.js` | Gestion stock par design, décrémentation auto |
| `useCheckout.js` | Création commandes depuis panier |
| `useEasterEgg.js` | Gestion easter eggs cachés |

### Stores Pinia

- **cart.js** : Gestion panier client avec persistance localStorage
- **admin.js** : Authentification Firebase, session, changement mot de passe

================================================================================
## 🗄️ 3. BASE DE DONNÉES FIRESTORE (SCHÉMAS EXACTS)
================================================================================

### Collection: `designs`

```javascript
{
  id: "ftg",                      // Identifiant unique
  name: "ftg",                    // Nom du design
  slug: "ftg",                    // URL-friendly
  description: "Description...",   // Description longue
  tagline: "hjgkjha",             // Accroche courte
  story: "fgghfgffcg",            // Histoire du design
  designPrice: 15,                // Prix du design (number)
  images: [                       // Array d'URLs Cloudinary
    "https://res.cloudinary.com/..."
  ],
  featured: true,                 // Mis en avant ?
  inStock: true,                  // En stock ?
  archived: false,                // Archivé ? (boolean)
  createdAt: Timestamp,           // Date de création
  updatedAt: Timestamp            // Date de mise à jour (si applicable)
}
```

### Collection: `garments`

```javascript
{
  type: "tshirt",                 // "tshirt" ou "hoodie"
  basePrice: 20,                  // Prix de base du vêtement (number)
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],  // Tailles disponibles
  photos: [                       // Photos du vêtement seul
    "https://res.cloudinary.com/...",
    "https://res.cloudinary.com/..."
  ],
  details: {
    material: "100% coton",       // Composition
    weight: "185 m/g²",           // Grammage
    fit: "Coupe classique unisexe", // Coupe
    care: "Lavage machine 30°C"   // Entretien
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: `stock` (sous-collection de chaque design)

```javascript
{
  quantity: 97,                   // Quantité restante (number)
  salesStats: {                   // Statistiques de ventes
    tshirt: 1,                    // Nombre de T-shirts vendus
    hoodie: 2,                    // Nombre de Hoodies vendus
    total: 3                      // Total des ventes
  },
  createdAt: Timestamp,
  lastUpdated: Timestamp          // Dernière modification
}
```

### Collection: `settings` (document unique: stock)

```javascript
{
  designs: [                      // Array de designs pour gestion globale
    {
      id: "design-1",
      name: "Dessin 1",
      totalUnits: 100,            // Total initial
      remainingUnits: 100,        // Unités restantes
      products: []                // Produits associés
    },
    {
      id: "design-2",
      name: "Dessin 2",
      totalUnits: 100,
      remainingUnits: 100,
      products: []
    }
  ],
  lastUpdated: Timestamp
}
```

### Collection: `orders`

```javascript
{
  orderNumber: "NV-20251109-60122",  // Format: NV-YYYYMMDD-XXXXX
  status: "pending",                  // "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  customer: {
    name: "Jean Dupont",
    email: "jean@email.com",
    phone: "0612345678",
    dob: "1990-01-15",               // 🆕 Date de naissance (YYYY-MM-DD)
    address: {
      street: "123 rue de la Paix",
      postalCode: "75001",
      city: "Paris",
      country: "France"
    }
  },
  items: [
    {
      id: "ftg-hoodie-L",            // ID unique produit+taille
      designId: "ftg",               // Référence design
      name: "ftg",                   // Nom du design
      slug: "ftg",                   // Slug du design
      type: "hoodie",                // Type de vêtement
      size: "L",                     // Taille
      price: 35,                     // Prix unitaire (designPrice + basePrice)
      quantity: 2,                   // Quantité
      image: "https://..."           // Image principale
    }
  ],
  subtotal: 105,                     // Sous-total articles
  total: 105,                        // Total commande
  notes: "",                         // 🆕 Commentaire client (alerte admin si rempli)
  payment: {
    status: "pending",               // "pending" | "paid" | "failed" | "refunded"
    method: "pending",               // "stripe" | "paypal" | "pending"
    transactionId: null              // ID transaction paiement
  },
  shipping: {
    method: "standard",              // "standard" | "express" | "mondial-relay"
    address: {                       // Adresse de livraison (peut différer de customer.address)
      street: "...",
      postalCode: "...",
      city: "...",
      country: "..."
    },
    trackingNumber: null,            // Numéro de suivi
    estimatedDelivery: null          // Date estimée (Timestamp)
  },
  isArchived: false,                 // Commande archivée ?
  archivedAt: null,                  // Date archivage (Timestamp ou null)
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: `honeypot_logs`

```javascript
{
  email: "attacker@example.com",
  password: "199***",              // 3 premiers caractères seulement
  ip: "client-side",               // IP (si disponible)
  userAgent: "Mozilla/5.0...",     // User Agent complet
  attemptNumber: 1,                // Numéro de tentative
  timestamp: Timestamp
}
```

### Collection: `messages` (Contact form)

```javascript
{
  name: "Client Name",
  email: "client@email.com",
  subject: "Demande d'info",
  message: "Message complet...",
  status: "unread",                // "unread" | "read" | "replied"
  timestamp: Timestamp
}
```

### Collection: `siteContent` (document unique: global)

```javascript
{
  home: {
    title: "...",
    subtitle: "...",
    cta: "..."
  },
  contact: {
    title: "...",
    subtitle: "...",
    email: "...",
    instagram: "...",
    hours: "..."
  },
  footer: {
    tagline: "..."
  }
}
```

================================================================================
## 📦 4. SYSTÈME DE STOCK (CRITIQUE - NE PAS MODIFIER)
================================================================================

### Principe fondamental

⚠️ **Le stock est géré PAR DESIGN, pas par produit individuel**

- Un design peut être appliqué sur plusieurs types de vêtements (T-shirt, Hoodie)
- Chaque design a un stock unique partagé entre tous ses produits
- Prix final = `designPrice` (du design) + `basePrice` (du garment)

### Flux automatique de décrémentation

```
1. Client passe commande → status = "pending"
2. Admin confirme paiement → status = "paid"
3. Admin expédie → status = "shipped"
4. Admin marque livrée → status = "delivered"
   └─> 🔥 DÉCRÉMENTATION AUTOMATIQUE DU STOCK
```

**Code concerné** : `useOrders.js` → `updateOrderStatus()` → `decrementStockForDeliveredOrder()`

### Association obligatoire

Chaque produit **DOIT** avoir un `designId` pour que le système fonctionne.

### Interface Admin

- Onglet **Stock** : Visualisation par design avec barres de progression
- Badges : 🟢 OK (>50) | 🟡 Alerte (20-50) | 🔴 Critique (<20) | ⚫ Rupture (0)
- Actions : +1, -1, +10, -10, ajustement manuel

================================================================================
## 🔒 5. SÉCURITÉ
================================================================================

### Routes protégées

| Route | Description | Protection |
|-------|-------------|-----------|
| `/admin` | **Honeypot** (faux admin) | Tarpit + Logs |
| `/rho` | **Vrai admin panel** | Firebase Auth |

### Honeypot `/admin`

- Interface identique au vrai admin
- Log toutes les tentatives dans `honeypot_logs`
- Délais artificiels 5-10s par tentative (tarpit)
- Messages d'erreur aléatoires
- Faux succès occasionnels (boucle infinie)

### Authentification Admin

- Firebase Authentication (Email/Password)
- Session persistante automatique
- Protection anti-bruteforce :
  - Captcha mathématique après 2 tentatives
  - Blocage 30s après 3 tentatives
  - Blocage 5min après 6 tentatives
  - Blocage 30min après 10 tentatives

### Règles Firestore (CRITIQUES)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Lecture publique, écriture admin
    match /designs/{designId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /garments/{garmentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /siteContent/{contentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Honeypot: écriture publique, lecture admin
    match /honeypot_logs/{logId} {
      allow create: if true;
      allow read, delete: if request.auth != null;
    }
    
    // Commandes: création publique, gestion admin
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Messages contact: création publique, lecture admin
    match /messages/{messageId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // Stock: lecture publique, écriture admin
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

================================================================================
## 🎨 6. CHARTE GRAPHIQUE (STRICTE - NE PAS DÉVIER)
================================================================================

### Palette de couleurs (CODES EXACTS)

```css
--color-black: #0a0a0a;           /* Fond principal */
--color-black-light: #1a1a1a;     /* Cartes, sections */
--color-black-lighter: #2a2a2a;   /* Bordures, inputs */
--color-neon-green: #39FF14;      /* Primaire, CTA, prix */
--color-cyan: #00FF88;            /* Secondaire, hover */
--color-lime: #B0FF00;            /* Accents, badges */
--color-dark-green: #0d4d0d;      /* Subtil */
--color-text-primary: #ffffff;    /* Titres */
--color-text-secondary: #b0b0b0;  /* Descriptions */
--color-text-muted: #666666;      /* Labels */
```

### Typographie

**Police** : Montserrat (Google Fonts)

```css
/* Hiérarchie */
H1 Hero    : 6rem (responsive), font-weight: 900
H1 Page    : 4rem (responsive), font-weight: 900
H2         : 3rem (responsive), font-weight: 800
H3         : 2rem (responsive), font-weight: 700
Body       : 1rem (16px), font-weight: 400
Boutons    : 1rem, font-weight: 600, uppercase
```

**Styles spéciaux** :
- `.text-gradient` : Dégradé vert néon → cyan
- `.neon-text` : Effet glow vert néon

### Breakpoints Responsive

```css
Mobile   : < 768px    (1 colonne, menu hamburger)
Tablette : 768-1024px (2 colonnes)
Desktop  : > 1024px   (3-4 colonnes)
```

### Composants UI

**Boutons** :
- `btn-primary` : Gradient vert néon + box-shadow glow
- `btn-secondary` : Border vert néon, fond transparent
- `btn-ghost` : Border grise, minimal

**Cards** :
- Background: `var(--color-black-light)`
- Border: `var(--color-black-lighter)`
- Border-radius: 12px
- Hover: `translateY(-5px)` + border neon

**Inputs** :
- Background: `var(--color-black-lighter)`
- Border: 2px solid (même couleur que bg)
- Focus: Border `var(--color-neon-green)` + glow

### Animations

```css
Transitions : 0.3s ease (standard)
Hover cards : translateY(-8px) + border neon
Glow        : animation 2s infinite
Float       : animation 20s infinite (cercles hero)
```

================================================================================
## 🛣️ 7. ROUTES & NAVIGATION
================================================================================

| URL | Description | Composant | Auth |
|-----|-------------|-----------|------|
| `/` | Page d'accueil | `Home.vue` | Public |
| `/designs` | Catalogue designs | `Designs.vue` | Public |
| `/designs/:slug` | Détail design | `DesignDetail.vue` | Public |
| `/contact` | Formulaire contact | `Contact.vue` | Public |
| `/shipping` | Infos livraison | `Shipping.vue` | Public |
| `/returns` | Politique retours | `Returns.vue` | Public |
| `/terms` | CGV | `Terms.vue` | Public |
| `/legal` | Mentions légales | `Legal.vue` | Public |
| `/rho` | **Admin panel** | `Admin.vue` | **Protégé** |
| `/admin` | Honeypot | `Honeypot.vue` | Public (piège) |
| `/dev-tools` | Outils dev | `DevTools.vue` | Public (dev only) |
| `*` | 404 | `NotFound.vue` | Public |

================================================================================
## ✅ 8. FONCTIONNALITÉS IMPLÉMENTÉES (NE PAS RECRÉER)
================================================================================

### Frontend

- ✅ Navigation responsive avec menu mobile
- ✅ Page d'accueil avec hero et designs vedette
- ✅ Catalogue avec filtres par type de vêtement
- ✅ Page détail design avec galerie d'images
- ✅ Système panier latéral avec gestion quantités
- ✅ Persistance panier en localStorage
- ✅ Modal checkout avec formulaire complet
- ✅ Formulaire de contact avec honeypot anti-spam
- ✅ Easter eggs cachés (10 citations)
- ✅ Animations et transitions fluides
- ✅ Design noir & vert néon respecté
- ✅ SEO optimisé (meta tags, sitemap, robots.txt)

### Panel Admin (`/rho`)

- ✅ Authentification Firebase (email/password)
- ✅ **Onglet Designs** : CRUD designs, upload images Cloudinary
- ✅ **Onglet Vêtements** : CRUD types de vêtements (garments)
- ✅ **Onglet Commandes** : Gestion statuts, tracking, notes, archivage
- ✅ **Onglet Stock** : Visualisation et gestion par design
- ✅ **Onglet Sécurité** : Logs honeypot, changement mot de passe
- ✅ **Onglet Messages** : Messages du formulaire de contact
- ✅ Protection anti-bruteforce avec captcha

### Système Checkout

- ✅ Modal avec formulaire client complet
- ✅ Validation données
- ✅ Génération numéro commande (NV-YYYYMMDD-XXXXX)
- ✅ Sauvegarde Firestore
- ✅ Association design via `designId`
- ✅ Vidage panier après succès
- ✅ Feedback visuel (loading, erreurs, succès)

### Gestion Stock

- ✅ Stock par design (pas par produit)
- ✅ Décrémentation automatique à la livraison
- ✅ Interface admin visuelle (barres, badges)
- ✅ Temps réel via Firestore listeners
- ✅ Statistiques de ventes (salesStats)

================================================================================
## 🚀 9. TODO & ROADMAP (À IMPLÉMENTER)
================================================================================

### 🔥 Priorité 1 - UX/UI Améliorations

#### Tunnel de commande optimisé
- [ ] **Réduire à 2 écrans** :
  - ❌ Supprimer l'écran de choix de taille standalone
  - ✅ Écran 1 : Choix du type de vêtement (T-shirt/Hoodie) + taille + **lien vers FAQ tailles**
  - ✅ Écran 2 : Panier & checkout
- [ ] **Ajouter marges sur TOUTES les photos** (cohérence visuelle)
- [ ] **FAQ tailles** : Lien cliquable depuis le panier et écran choix
  - Guide des tailles avec tableau
  - Conseils de mesure
  - Photos/schémas explicatifs

#### Panier amélioré
- [ ] **Possibilité de modifier son choix dans le panier** :
  - Changer la taille sans supprimer l'article
  - Changer le type de vêtement (T-shirt ↔ Hoodie)
  - Recalcul automatique du prix
- [ ] **Information frais de livraison** :
  - Message : "Les frais de livraison seront calculés après validation de votre commande"
  - Affichage conditionnel selon méthode (standard/express/relay)

### 🔥 Priorité 2 - Admin & Notifications

#### Notifications admin
- [ ] **Alerte commentaire commande** :
  - Notification visuelle/sonore quand commande avec `notes` non vide
  - Badge sur l'onglet Commandes
  - Email optionnel à l'admin
- [ ] **Anniversaires clients** :
  - Ajouter champ `dob` (date of birth) dans formulaire checkout ✅ (déjà dans schéma)
  - Notification admin le jour J
  - Email/SMS automatique au client (optionnel)
  - Liste des anniversaires du mois dans admin

### 🔥 Priorité 3 - Paiement & Livraison

> ⚠️ **QUESTION CLIENT** :  
> Le site devrait être fonctionnel et commencer les commandes dans quelques mois.  
> **Dois-je mettre en place le service de paiement et de livraison maintenant ou attendre ?**  
> **Aussi, je veux mettre en place un service d'assurance pour les livraisons.**

#### Services à intégrer

**Paiement** :
- [ ] Stripe (recommandé) : 1.4% + 0.25€ par transaction
- [ ] PayPal (alternatif)
- [ ] Carte bancaire directe

**Livraison** :
- [ ] Colissimo (France) - API intégration
- [ ] Mondial Relay - Points relais
- [ ] Chronopost (express)
- [ ] International (optionnel)

**Assurance livraison** :
- [ ] Assurance Colissimo (incluse selon option)
- [ ] Assurance tierce (ex: Shipup, Send Cloud)
- [ ] Gestion des litiges livraison

**Recommandation** : Si lancement prévu dans quelques mois, intégrer **maintenant** en mode test :
1. Stripe en mode Test
2. Colissimo API avec compte test
3. Tester tout le flux avant le vrai lancement

### Priorité 4 - Fonctionnalités futures

- [ ] Comptes clients (Firebase Auth)
- [ ] Historique commandes clients
- [ ] Codes promo / réductions
- [ ] Newsletter (Mailchimp/Brevo)
- [ ] Système d'avis clients
- [ ] Photos clients (UGC)
- [ ] Wishlist / Favoris
- [ ] Barre de recherche
- [ ] Multi-langue (FR/EN)
- [ ] PWA (Service Worker)

### Priorité 5 - Analytics & Marketing

- [ ] Google Analytics 4
- [ ] Facebook Pixel
- [ ] Schema.org (JSON-LD) pour SEO
- [ ] Open Graph images optimisées
- [ ] Google Search Console

================================================================================
## 📋 10. FICHIERS À METTRE À JOUR OU SUPPRIMER
================================================================================

### À vérifier et mettre à jour

Les fichiers suivants peuvent contenir des schémas **obsolètes** (avant les garments) :

- `DESIGN_GUIDE.md` - Vérifier schémas produits
- `STOCK_SYSTEM.md` - Mettre à jour avec nouveaux schémas
- `CHECKOUT_SYSTEM.md` - Vérifier structure commandes
- `README.md` - Mettre à jour architecture si nécessaire

### À supprimer (si obsolètes)

Fichiers de documentation qui ne correspondent plus à l'architecture actuelle :
- Tout fichier mentionnant "products" au lieu de "designs + garments"
- Scripts dans `/scripts/` non utilisés ou obsolètes

⚠️ **Avant de supprimer** : Vérifier qu'aucun script/composant ne les référence

================================================================================
## 🛠️ 11. COMMANDES ESSENTIELLES
================================================================================

```bash
# Développement
npm install          # Installer dépendances
npm run dev          # Serveur dev (localhost:5173)
npm run build        # Build production
npm run preview      # Preview du build

# Firebase (si configuré)
firebase deploy      # Déployer sur Firebase Hosting

# Vercel (recommandé)
vercel --prod        # Déployer sur Vercel

# Scripts utilitaires
node scripts/importToFirestore.js      # Importer données initiales
node scripts/testFirestore.js          # Tester connexion Firestore
```

### Variables d'environnement (.env)

```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_CLOUDINARY_CLOUD_NAME=xxx
VITE_CLOUDINARY_API_KEY=xxx
VITE_CLOUDINARY_API_SECRET=xxx
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx (à venir)
```

================================================================================
## ⚠️ 12. RÈGLES IMPÉRATIVES POUR L'IA
================================================================================

### ✅ TOUJOURS FAIRE

1. **Lire ce fichier en premier** avant toute modification
2. **Vérifier les fichiers existants** (`grep_search`, `semantic_search`, `read_file`)
3. **Respecter l'architecture** définie (ne pas créer de nouvelles structures)
4. **Utiliser les composables existants** (ne pas réécrire la logique)
5. **Tester localement** avant de proposer des modifications
6. **Consulter la doc** dans `/documentation/` pour les détails
7. **Poser des questions** si quelque chose n'est pas clair
8. **Commenter le code** en français pour cohérence

### ❌ NE JAMAIS FAIRE

1. **Modifier la charte graphique** sans validation explicite
2. **Changer l'architecture** (structure dossiers, composables, stores)
3. **Modifier les règles Firestore** sans alerter (risque sécurité)
4. **Recréer des composants** qui existent déjà
5. **Ajouter des dépendances** sans justification (garder le projet léger)
6. **Ignorer les schémas de base de données** définis ci-dessus
7. **Modifier le système de stock** sans comprendre son fonctionnement
8. **Casser la compatibilité** avec les données existantes en BDD

### 🧠 PENSER À

- Le projet est en **FRANÇAIS** (code, commentaires, UI)
- Toujours privilégier la **Composition API** (Vue 3)
- Utiliser **Tailwind** pour le style (pas de CSS custom sauf nécessaire)
- Les uploads d'images passent par **Cloudinary**
- Firebase est en **mode test** (pas encore en production)
- Le design est **noir & vert néon** (ne pas dévier)
- La sécurité est **critique** (honeypot, anti-bruteforce)

================================================================================
## 📞 13. CONTACT & SUPPORT
================================================================================

**Email** : contact@nainvert.com  
**Instagram** : [@nainvert](https://instagram.com/nainvert)

**Pour l'IA** : En cas de doute, demander confirmation au client avant de :
- Modifier l'architecture
- Changer la charte graphique
- Ajouter des dépendances
- Modifier les règles de sécurité
- Supprimer du code existant

================================================================================
                    Document généré le 30 décembre 2025
                    Dernière mise à jour : 30 décembre 2025
                    NainVert © 2025 - Tous droits réservés
================================================================================
