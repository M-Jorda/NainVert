# NainVert - Streetwear Psychédélique 🌿✨

Site e-commerce moderne pour la marque NainVert, spécialisée dans le streetwear psychédélique.

## 🚀 Stack Technique

- **Vue 3.4.21** - Framework JavaScript progressif (Composition API)
- **Vite 7.1.12** - Build tool ultra-rapide
- **Vue Router 4.3.0** - Routing SPA
- **Pinia 2.1.7** - State management moderne
- **Tailwind CSS 4.1.16** - Framework CSS utility-first
- **Firebase** - Backend (Firestore + Authentication)
  - Firestore pour la base de données
  - Firebase Auth pour l'authentification admin

## 📁 Structure du Projet

```
NainVert/
├── public/                     # Fichiers statiques
│   ├── products/              # Images produits
│   ├── favicon.svg
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/            # Composants réutilisables
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   ├── Cart.vue
│   │   ├── CartIcon.vue
│   │   ├── CheckoutModal.vue
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
│   │   ├── useGarmentTypes.js # Types de vêtements
│   │   ├── useOrders.js       # Gestion des commandes
│   │   ├── useStock.js        # Gestion stock par design
│   │   ├── useCheckout.js     # Système de checkout
│   │   ├── useEasterEgg.js    # Easter eggs
│   │   └── useEasterEggsFirestore.js
│   ├── stores/                # Stores Pinia
│   │   ├── cart.js            # Panier (localStorage)
│   │   └── admin.js           # Auth Firebase
│   ├── config/                # Configuration
│   │   └── firebase.js        # Config Firebase
│   ├── router/                # Configuration du routeur
│   │   └── index.js
│   ├── styles/                # Styles globaux
│   │   └── main.css           # Tailwind + variables CSS
│   ├── App.vue
│   └── main.js
├── scripts/                    # Scripts utilitaires
│   ├── importToFirestore.js   # Import données vers Firebase
│   ├── testFirestore.js       # Test connexion Firebase
│   └── create-test-order.js   # Créer commande de test
├── documentation/              # Documentation projet
├── firebase.json
├── firestore.rules
├── storage.rules
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Palette de Couleurs

- **Fond principal** : `#0a0a0a` (Noir profond)
- **Vert néon** : `#39FF14`
- **Vert cyan** : `#00FF88`
- **Vert lime** : `#B0FF00`

## ⚡ Installation

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   Le site sera accessible sur `http://localhost:3000`

3. **Build pour la production**
   ```bash
   npm run build
   ```

4. **Prévisualiser le build**
   ```bash
   npm run preview
   ```

## 📦 Fonctionnalités

### ✅ Implémenté

- [x] **Frontend moderne** avec Vue 3 + Tailwind CSS
- [x] **Backend Firebase** (Firestore + Authentication)
- [x] **Panel Admin** complet pour gérer :
  - Designs (nom, prix, description, images, tagline, story)
  - Vêtements/Garments (types, tailles, prix de base, photos)
  - Commandes (statuts, tracking, archivage)
  - Stock (par design avec décrémentation automatique)
  - Messages (formulaire de contact)
  - Sécurité (logs honeypot, changement mot de passe)
- [x] **Navigation responsive** avec menu mobile
- [x] **Page d'accueil** avec hero et produits vedette
- [x] **Catalogue designs** avec filtres par type de vêtement
- [x] **Page détail design** avec galerie d'images
- [x] **Système checkout** avec modal et création de commande
- [x] **Panier** latéral avec gestion des quantités (localStorage)
- [x] **Page de contact** avec formulaire
- [x] **Easter eggs** cachés dans le site (10 citations)
- [x] **Animations** et transitions fluides
- [x] **Design futuriste** noir & vert néon avec glassmorphism
- [x] **SEO optimisé** (meta tags, sitemap)

### 🔜 À venir

- [ ] Intégration paiement (Stripe/PayPal)
- [ ] Firebase Storage pour hébergement images
- [ ] Règles de sécurité Firestore avancées
- [ ] Système de commandes avec backend
- [ ] Authentification client (pour commandes)
- [ ] Historique des commandes
- [ ] Newsletter (intégration Mailchimp)
- [ ] Analytics (Google Analytics / Firebase)

## 🛍️ Système Produits

Le système fonctionne avec **designs + garments** :

- **Designs** : Les créations graphiques (illustrations, artworks)
  - Prix du design (ex: 15€)
  - Images, description, tagline, story
  - Stock géré par design
  
- **Garments** : Les types de vêtements
  - T-shirt : Prix de base 20€
  - Hoodie : Prix de base 50€
  - Tailles, matériaux, photos du vêtement seul
  
- **Prix final** = Design price + Garment base price
- Le client choisit d'abord un design, puis le type de vêtement et la taille

## 🎯 Pages

- **/** - Page d'accueil avec hero et designs vedette
- **/designs** - Catalogue des designs avec filtres
- **/designs/:slug** - Détail d'un design avec choix de vêtement/taille
- **/contact** - Formulaire de contact
- **/rho** - Panel d'administration (protégé)
- **/admin** - Honeypot (faux admin qui log les intrusions)
- **/shipping** - Informations livraison
- **/returns** - Politique de retours
- **/terms** - Conditions générales
- **/legal** - Mentions légales

## 🔧 Configuration Firebase

### Première installation

1. **Configurer Firebase** (voir `FIREBASE_SETUP.md` pour le guide détaillé)
   ```bash
   # Mettre vos clés Firebase dans src/config/firebase.js
   ```

2. **Importer les données initiales**
   ```bash
   npm run import-firebase
   ```

3. **Créer un utilisateur admin** dans Firebase Console
   - Aller dans Authentication > Users
   - Ajouter un utilisateur avec email/password

### Panel Admin

- **URL** : `/rho` (le vrai admin, `/admin` est un honeypot)
- **Connexion** : Email + mot de passe Firebase
- **Fonctionnalités** :
  - **Designs** : CRUD complet, upload images Cloudinary, featured, archived
  - **Vêtements** : CRUD types de vêtements (T-shirt, Hoodie), prix base, tailles, photos
  - **Commandes** : Gestion statuts, tracking, notes, archivage, recherche
  - **Stock** : Gestion automatique par design, décrémentation à la livraison
  - **Messages** : Messages du formulaire de contact
  - **Sécurité** : Logs honeypot, changement mot de passe, anti-bruteforce
  - Tout est sauvegardé automatiquement dans Firestore

### 📦 Système de Gestion de Stock (NOUVEAU)

Le stock se gère **par dessin** et non par produit individuel :

- **2 dessins** avec 100 unités chacun
- **Décrémentation automatique** quand une commande est livrée
- **Temps réel** : synchronisation instantanée via Firestore
- **Interface visuelle** : barres de progression, badges de statut, alertes

**Configuration :**
1. Les designs ont automatiquement un stock dans Firestore
2. Le système décrémente automatiquement lors du passage à "delivered"
3. Suivi en temps réel via Firestore listeners
4. Interface visuelle dans l'onglet Stock de l'admin

**Documentation complète** : Voir `STOCK_SYSTEM.md`

**Tester le système :**
```bash
node scripts/create-test-order.js
# Puis dans l'admin, marquez la commande comme "livrée"
# Le stock se mettra à jour automatiquement
```

### Personnaliser les couleurs

Éditer les variables CSS dans `src/styles/main.css` :

```css
@theme {
  --color-neon-green: #39FF14;
  --color-cyan-green: #00FF88;
  --color-lime-green: #B0FF00;
}
```

## 📱 Responsive Breakpoints

- **Mobile** : < 768px
- **Tablette** : 768px - 1024px
- **Desktop** : > 1024px

## 🌐 Déploiement

### Netlify / Vercel

1. Connecter le repository GitHub
2. Configuration build :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - **Node version** : 18+
3. Les clés Firebase sont publiques (frontend), donc pas besoin de variables d'environnement

### Firebase Hosting (recommandé)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

**Avantage** : Tout hébergé au même endroit (site + base de données)

## 🔒 Sécurité

- **Frontend** : Les clés Firebase API sont publiques (normal pour le web)
- **Backend** : Les règles Firestore protègent l'écriture (uniquement les utilisateurs authentifiés)
- **Admin** : Authentification Firebase (email/password)
- **Amélioration possible** : Restreindre les règles Firestore à un UID admin spécifique

## 📚 Documentation

- **FIREBASE_SETUP.md** - Guide complet de configuration Firebase
- **MIGRATION_COMPLETE.md** - Guide de test et dépannage

## 📄 Licence

Tous droits réservés © 2025 NainVert

## 🤝 Contact

- **Email** : contact@nainvert.com
- **Instagram** : [@nainvert](https://instagram.com/nainvert)

---

**Made with ♥ by passionate creators**
