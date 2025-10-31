# NainVert - Streetwear Psychédélique 🌿✨

Site e-commerce moderne pour la marque NainVert, spécialisée dans le streetwear psychédélique.

## 🚀 Technologies

- **Vue 3** - Framework JavaScript progressif
- **Vite** - Build tool ultra-rapide
- **Vue Router** - Routing
- **Pinia** - State management
- **CSS Variables** - Thème personnalisé noir & vert psychédélique

## 📁 Structure du Projet

```
NainVert/
├── public/                 # Fichiers statiques
│   ├── products/          # Images produits
│   ├── favicon.svg
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/        # Composants réutilisables
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   ├── Cart.vue
│   │   ├── CartIcon.vue
│   │   ├── ProductCard.vue
│   │   └── ProductGrid.vue
│   ├── pages/            # Pages de l'application
│   │   ├── Home.vue
│   │   ├── Products.vue
│   │   ├── ProductDetail.vue
│   │   └── Contact.vue
│   ├── stores/           # Stores Pinia
│   │   └── cart.js
│   ├── data/             # Données
│   │   └── products.js
│   ├── router/           # Configuration du routeur
│   │   └── index.js
│   ├── styles/           # Styles globaux
│   │   └── main.css
│   ├── App.vue
│   └── main.js
├── index.html
├── vite.config.js
├── package.json
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

- [x] Navigation responsive avec menu mobile
- [x] Page d'accueil avec hero et produits en vedette
- [x] Page catalogue avec filtres (T-shirts / Pulls)
- [x] Page détail produit avec galerie d'images
- [x] Sélection de taille
- [x] Panier latéral avec gestion des quantités
- [x] Page de contact avec formulaire
- [x] Animations et transitions fluides
- [x] Design responsive (mobile, tablette, desktop)
- [x] SEO optimisé (meta tags, sitemap)
- [x] Thème psychédélique noir & vert

### 🔜 À venir

- [ ] Intégration paiement (Stripe/PayPal)
- [ ] Modal de vue rapide (quick view)
- [ ] Wishlist / Favoris
- [ ] Système de notation / avis
- [ ] Backend API pour les commandes
- [ ] Authentification utilisateur
- [ ] Historique des commandes
- [ ] Newsletter (intégration Mailchimp)

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

## 🔧 Configuration

### Ajouter des produits

Éditer le fichier `src/data/products.js` :

```javascript
{
  id: 5,
  name: 'Nouveau Produit',
  slug: 'nouveau-produit',
  type: 'tshirt', // ou 'hoodie'
  price: 40,
  description: 'Description du produit...',
  images: ['/products/image1.jpg', '/products/image2.jpg'],
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['Noir'],
  inStock: true,
  featured: false
}
```

### Personnaliser les couleurs

Éditer les variables CSS dans `src/styles/main.css` :

```css
:root {
  --neon-green: #39FF14;
  --cyan-green: #00FF88;
  --lime-green: #B0FF00;
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

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 📄 Licence

Tous droits réservés © 2025 NainVert

## 🤝 Contact

- **Email** : contact@nainvert.com
- **Instagram** : [@nainvert](https://instagram.com/nainvert)

---

**Made with ♥ by passionate creators**
