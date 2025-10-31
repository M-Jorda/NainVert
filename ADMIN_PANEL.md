# 🔐 Admin Panel - NainVert

## Accès

**URL :** `/admin` ou via le petit point `•` dans le footer

**Mot de passe par défaut :** `nainvert2024`

> ⚠️ **Important** : Changez le mot de passe dans `src/stores/admin.js` ligne 6

## 📸 Gestion des Images

### Fonctionnalités

1. **Voir tous les produits** avec leurs images actuelles
2. **Modifier les images** de chaque produit
3. **Ajouter des images** via :
   - Upload de fichier (JPG, PNG, WebP)
   - URL directe d'une image en ligne
4. **Supprimer des images** existantes

### Comment ça marche ?

#### 1. Connexion
- Allez sur `/admin`
- Entrez le mot de passe
- L'authentification est stockée dans localStorage

#### 2. Modification d'images
- Survolez un produit → bouton "Modifier les images" apparaît
- Cliquez pour ouvrir la modale d'édition

#### 3. Ajouter une image

**Méthode 1 : Upload de fichier**
- Cliquez sur "Choisir une image"
- Sélectionnez un fichier depuis votre ordinateur
- L'image est convertie en base64 et stockée localement
- Cliquez sur "Confirmer l'ajout"

**Méthode 2 : URL**
- Collez l'URL d'une image hébergée en ligne
- Cliquez sur "Ajouter"
- L'URL est ajoutée directement

#### 4. Supprimer une image
- Dans la modale, cliquez sur "Supprimer" sous l'image
- Confirmez la suppression

## 💾 Stockage

### LocalStorage
Les modifications sont **automatiquement sauvegardées** dans `localStorage` du navigateur :
- Clé : `nainvert_products`
- Format : JSON

### Limitations

❌ **Ce système n'est PAS permanent** :
- Les changements sont locaux au navigateur utilisé
- Si vous videz le cache/localStorage, tout est perdu
- Les autres visiteurs ne voient pas vos changements

✅ **Idéal pour** :
- Tests en local
- Prévisualisation de nouvelles images
- Développement et prototypage

## 🚀 Pour une solution permanente

Si tu veux que les changements soient **permanents et visibles par tous**, il faudra :

### Option 1 : Backend Simple (Recommandé)
- Node.js + Express
- Endpoint API pour modifier `products.js`
- Upload d'images vers un dossier `/public/products/`

### Option 2 : CMS Headless
- Strapi, Sanity, ou Contentful
- Interface d'admin complète
- API GraphQL/REST

### Option 3 : GitHub Integration
- Utiliser l'API GitHub pour modifier `products.js`
- Commit automatique des changements
- Redéploiement automatique (Netlify/Vercel)

### Option 4 : Firebase (Plus simple)
- Firebase Storage pour les images
- Firestore pour les données produits
- Authentication Firebase

## 🔒 Sécurité

### Actuellement

⚠️ **Le mot de passe est en clair dans le code !**
- Visible dans le code source
- Pas de vrai système d'authentification

### Pour la production

Si tu passes en prod :
1. **Backend avec JWT** pour l'authentification
2. **Hash des mots de passe** (bcrypt)
3. **Rate limiting** pour éviter les attaques brute force
4. **HTTPS obligatoire**
5. **Validation des uploads** (taille, format, virus scan)

## 📝 Changer le mot de passe

Éditer `src/stores/admin.js` :

```javascript
// Ligne 6
const adminPassword = 'TON_NOUVEAU_MOT_DE_PASSE'
```

## 🎨 Personnalisation

Tu peux facilement :
- Ajouter d'autres champs modifiables (prix, description)
- Créer une page pour gérer les easter eggs
- Ajouter/supprimer des produits entiers
- Gérer les tailles et couleurs

## 🐛 Problèmes connus

1. **Images en base64** = fichiers volumineux dans localStorage
   - Limite : ~5-10MB selon le navigateur
   - Solution : utiliser des URLs vers images hébergées

2. **Pas de synchronisation**
   - Changements visibles uniquement sur l'appareil qui les a faits
   - Solution : backend avec base de données

3. **Pas d'historique**
   - Impossible de revenir en arrière
   - Solution : système de versions avec Git ou DB

## 💡 Tips

- **Backup régulier** : Copie le contenu de localStorage
- **URL d'images** : Utilise Imgur, Cloudinary ou Firebase Storage
- **Optimisation** : Compress tes images avant upload (max 1MB)
- **Formats** : WebP pour la meilleure qualité/poids

## � Autres Choses Modifiables (Suggestions)

### ✅ Actuellement Éditable via Admin:
1. **Produits** :
   - ✅ Images (upload ou URL)
   - ✅ Descriptions
   - ✅ Prix
   - ✅ Statut stock (en stock/rupture)

2. **Page d'accueil** :
   - ✅ Titre hero
   - ✅ Sous-titre
   - ✅ Description
   - ✅ Section "À propos"

3. **Page Contact** :
   - ✅ Titre et sous-titre
   - ✅ Email
   - ✅ Instagram handle & URL
   - ✅ Horaires

### 💡 Suggestions pour Futures Additions :

#### 📦 **Produits (Avancé)**
- Tailles disponibles (ajouter/retirer)
- Couleurs disponibles
- Matériaux et détails techniques
- Badge "Nouveauté" / "Featured"
- Catégories et tags
- Ordre d'affichage

#### 🏠 **Page d'accueil**
- Section communauté (titre, texte)
- Section features (points forts)
- Bannières promotionnelles
- Vidéo de présentation
- Témoignages clients

#### 🎨 **Design**
- Couleurs du thème (vert néon, cyan, etc.)
- Logo (upload)
- Images de fond
- Polices (via Google Fonts)

#### 🦋 **Easter Eggs**
- Textes des citations
- Icônes emoji
- Ajouter/supprimer des easter eggs
- Positions sur le site

#### 🔗 **Footer**
- Liens réseaux sociaux (ajout YouTube, TikTok, etc.)
- Description de la marque
- Liens légaux (CGV, Mentions légales)
- Newsletter (texte d'appel)

#### 📧 **Formulaire Contact**
- Champs personnalisés
- Messages de succès/erreur
- Email de destination
- Message automatique de réponse

#### 🛍️ **E-commerce (si intégration future)**
- Frais de port
- Codes promo
- Messages panier
- Politique de retour
- Moyens de paiement acceptés

#### 📱 **SEO & Meta**
- Titres de pages
- Meta descriptions
- Open Graph images
- Mots-clés
- Alt texts des images

#### 🎯 **Promotions**
- Bannières temporaires
- Pop-ups d'annonces
- Compte à rebours (drops)
- Messages flash

### 🚀 Recommandations Prioritaires :

Si tu veux étendre l'admin, voici ce qui serait **le plus utile** :

1. **Gestion complète des produits** ⭐⭐⭐
   - Ajouter/Supprimer des produits
   - Gérer tailles et couleurs
   - Badge "Nouveauté"

2. **Easter Eggs** ⭐⭐
   - Interface pour modifier les citations
   - Ajouter de nouvelles citations
   - Choisir les emplacements

3. **Footer & Réseaux sociaux** ⭐⭐
   - Liens modifiables
   - Ajout de plateformes

4. **Bannières promotionnelles** ⭐
   - Pour annoncer drops/soldes
   - Activable/désactivable facilement

5. **Images du site** ⭐
   - Logo
   - Favicon
   - Images de fond

## 🎯 Roadmap Future

Fonctionnalités à ajouter :
- [x] Gestion des images produits
- [x] Descriptions produits
- [x] Contenu page d'accueil
- [x] Contenu page contact
- [ ] Gestion complète produits (CRUD)
- [ ] Upload multiple d'images
- [ ] Drag & drop pour réorganiser
- [ ] Éditeur de texte riche (WYSIWYG)
- [ ] Gestion des easter eggs
- [ ] Footer personnalisable
- [ ] Bannières promotionnelles
- [ ] Analytics simples
- [ ] Export/Import (JSON/CSV)
