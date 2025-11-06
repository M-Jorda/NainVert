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
│   │   ├── ProductCard.vue
│   │   ├── ProductGrid.vue
│   │   ├── EasterEggModal.vue
│   │   └── admin/             # Composants admin
│   │       ├── ProductsTab.vue
│   │       ├── ContentTab.vue
│   │       ├── OrdersTab.vue
│   │       ├── RefundsTab.vue
│   │       ├── StockTab.vue   # ✨ Gestion de stock
│   │       └── SecurityTab.vue
│   ├── pages/                 # Pages de l'application
│   │   ├── Home.vue
│   │   ├── Products.vue
│   │   ├── ProductDetail.vue
│   │   ├── Contact.vue
│   │   └── Admin.vue          # Panel admin Firebase
│   ├── composables/           # Logique réutilisable
│   │   ├── useProducts.js     # Gestion produits Firestore
│   │   ├── useSiteContent.js  # Gestion contenu Firestore
│   │   ├── useEasterEgg.js    # Easter eggs cachés
│   │   ├── useOrders.js       # Gestion commandes
│   │   ├── useRefunds.js      # Gestion remboursements
│   │   └── useStock.js        # ✨ Gestion stock par dessin
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
│   └── testFirestore.js       # Test connexion Firebase
├── index.html
├── vite.config.js
├── package.json
├── FIREBASE_SETUP.md          # Guide setup Firebase
├── MIGRATION_COMPLETE.md      # Guide migration & tests
└── README.md
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
  - Produits (nom, prix, description, images, stock)
  - Contenu du site (home, contact)
- [x] **Navigation responsive** avec menu mobile
- [x] **Page d'accueil** avec hero et produits vedette
- [x] **Catalogue** avec filtres (T-shirts / Pulls)
- [x] **Page détail produit** avec galerie d'images
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

## 🛍️ Produits

Le site propose 4 produits :

### T-Shirts
1. **Neon Dreams T-Shirt** - 35€
2. **Acid Wave T-Shirt** - 38€

### Pulls
3. **Electric Jungle Hoodie** - 75€
4. **Cyber Trip Crewneck** - 65€

## 🎯 Pages

- **/** - Page d'accueil avec hero et lien Instagram
- **/products** - Catalogue avec filtres
- **/products/:slug** - Détail d'un produit
- **/contact** - Formulaire de contact

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

- **URL** : `/admin`
- **Connexion** : Email + mot de passe Firebase
- **Fonctionnalités** :
  - **Produits** : Modifier nom, prix, description, images, stock, dessin associé
  - **Contenu** : Modifier le contenu du site (home, contact)
  - **Commandes** : Gérer les commandes, changer statuts, ajouter tracking
  - **Remboursements** : Traiter les demandes de remboursement
  - **Stock** : ✨ Gestion automatique du stock par dessin (voir ci-dessous)
  - **Sécurité** : Changer mot de passe, voir logs honeypot
  - Tout est sauvegardé automatiquement dans Firestore

### 📦 Système de Gestion de Stock (NOUVEAU)

Le stock se gère **par dessin** et non par produit individuel :

- **2 dessins** avec 100 unités chacun
- **Décrémentation automatique** quand une commande est livrée
- **Temps réel** : synchronisation instantanée via Firestore
- **Interface visuelle** : barres de progression, badges de statut, alertes

**Configuration :**
1. Aller dans l'onglet "Produits" de l'admin
2. Associer chaque produit à un dessin (design-1 ou design-2)
3. Le stock se décrémentera automatiquement lors des livraisons

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
