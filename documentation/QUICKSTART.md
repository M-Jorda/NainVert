# 🚀 Guide de Démarrage Rapide - NainVert

## ✅ Le site est prêt !

Votre site e-commerce **NainVert** a été créé avec succès ! 🎉

### 🌐 Accès

Le site de développement est accessible sur : **http://localhost:3000**

### 📂 Structure Créée

```
✅ Configuration (Vite, Vue 3, Router, Pinia)
✅ Design système (Couleurs, typographie, composants)
✅ 3 Pages principales (Accueil, Articles, Contact)
✅ 4 Produits (2 t-shirts, 2 pulls)
✅ Panier fonctionnel avec gestion d'état
✅ Navigation responsive
✅ Animations et transitions
✅ SEO de base (meta tags, sitemap)
✅ Images placeholder
```

## 🎨 Palette de Couleurs

- **Noir profond** : `#0a0a0a`
- **Vert néon** : `#39FF14` ⚡
- **Vert cyan** : `#00FF88` 💚
- **Vert lime** : `#B0FF00` 🍋

## 🗂️ Pages Disponibles

| URL | Description |
|-----|-------------|
| `/` | Page d'accueil avec hero + lien Instagram |
| `/products` | Catalogue avec filtres T-shirts/Pulls |
| `/products/:slug` | Page détail d'un produit |
| `/contact` | Formulaire de contact |

## 🛍️ Fonctionnalités du Panier

- ✅ Ajout/retrait produits
- ✅ Gestion quantités
- ✅ Calcul total automatique
- ✅ Panneau latéral animé
- ✅ Badge avec nombre d'articles
- ✅ État persistant (Pinia)

## 📝 Prochaines Étapes Importantes

### 1. Remplacer les Images (URGENT)
Les images actuelles sont des placeholders SVG. Pour un site réel :

```bash
# Placer vos vraies photos dans :
public/products/
  ├── tshirt-1-front.jpg
  ├── tshirt-1-back.jpg
  ├── tshirt-1-detail.jpg
  ├── tshirt-2-front.jpg
  └── ... (12 images au total)
```

**Specs recommandées :**
- Format : WebP (ou JPG)
- Dimensions : 800x1000px minimum
- Poids : < 200KB par image
- Nommage : respecter les noms actuels

### 2. Configurer le Paiement (Stripe)

```bash
# 1. Installer Stripe
npm install @stripe/stripe-js

# 2. Créer compte sur stripe.com

# 3. Obtenir les clés API

# 4. Créer fichier .env
echo "VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx" > .env

# 5. Implémenter composant Checkout
# (voir TODO.md pour détails)
```

### 3. Déploiement Simple (Vercel)

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Se connecter
vercel login

# 3. Déployer
vercel --prod
```

## 🔧 Commandes Utiles

```bash
# Démarrer le serveur de dev
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview

# Installer une dépendance
npm install package-name

# Linter / Formater (à configurer)
npm run lint
npm run format
```

## 📦 Modifier les Produits

Éditez `src/data/products.js` :

```javascript
{
  id: 5,
  name: 'Mon Nouveau Produit',
  slug: 'mon-nouveau-produit', // URL-friendly
  type: 'tshirt', // ou 'hoodie'
  price: 45,
  description: 'Super description...',
  images: [
    '/products/mon-produit-front.jpg',
    '/products/mon-produit-back.jpg',
    '/products/mon-produit-detail.jpg'
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  colors: ['Noir', 'Vert'],
  inStock: true,
  featured: true, // Apparaît sur la page d'accueil
  details: {
    material: '100% Coton*',
    weight: '180g/m²',
    fit: 'Coupe régulière',
    care: 'Lavage machine 30°C'
  }
}
```

## 🎨 Personnaliser les Couleurs

Éditez `src/styles/main.css` :

```css
:root {
  --neon-green: #39FF14;      /* Vert principal */
  --cyan-green: #00FF88;      /* Vert secondaire */
  --lime-green: #B0FF00;      /* Accents */
}
```

## 📱 Lien Instagram

Actuellement configuré pour : `https://instagram.com/nainvert`

Pour changer :
1. `src/components/Footer.vue` (ligne ~21)
2. `src/pages/Home.vue` (ligne ~23 et ~132)
3. `src/pages/Contact.vue` (ligne ~50 et ~171)

## 🐛 Résolution de Problèmes

### Le serveur ne démarre pas
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Les images ne s'affichent pas
- Vérifier que les fichiers sont dans `public/products/`
- Vérifier les noms de fichiers (sensible à la casse)
- Vérifier les chemins dans `src/data/products.js`

### Erreurs TypeScript/JSConfig
```bash
# Redémarrer le serveur Vue
# Dans VS Code : Cmd+Shift+P > "Reload Window"
```

## 📚 Documentation

- **Vue 3** : https://vuejs.org
- **Vite** : https://vitejs.dev
- **Pinia** : https://pinia.vuejs.org
- **Vue Router** : https://router.vuejs.org

## 💡 Tips

1. **Testez sur mobile** : Le design est responsive, vérifiez sur téléphone
2. **Optimisez les images** : Utilisez TinyPNG ou Squoosh
3. **Testez le panier** : Ajoutez/retirez des produits pour vérifier
4. **Personnalisez** : Changez les textes, couleurs selon vos goûts
5. **Backup** : Committez régulièrement sur Git

## 🎯 Checklist Avant Mise en Ligne

- [ ] Vraies photos produits ajoutées
- [ ] Paiement Stripe configuré
- [ ] Formulaire contact fonctionnel (backend)
- [ ] URL Instagram correcte
- [ ] Coordonnées contact à jour
- [ ] Testé sur Chrome, Firefox, Safari
- [ ] Testé sur mobile (iPhone, Android)
- [ ] CGV / Mentions légales ajoutées
- [ ] Politique de confidentialité
- [ ] Google Analytics configuré
- [ ] Nom de domaine acheté et configuré

## 🆘 Support

Des questions ? Consultez :
- `README.md` - Documentation complète
- `TODO.md` - Prochaines fonctionnalités à implémenter
- Les commentaires dans le code

---

**Bon développement ! 🚀**

_Créé avec ♥ pour NainVert_
