# TODO - Prochaines Étapes 🚀

## Priorité 1 - Essentiel pour la mise en ligne

### 🎨 Configuration Stock (NOUVEAU - À FAIRE EN PREMIER)
- [ ] **Tester le système de stock** avec `node scripts/create-test-order.js`
- [ ] **Vérifier que chaque design a son stock** dans Firestore (sous-collection)
- [ ] **Vérifier que le checkout copie le designId** dans les articles
- [ ] Lire `STOCK_QUICKSTART.md` et `STOCK_SYSTEM.md`

### Images Designs
- [ ] Remplacer les images de test par de vraies créations
- [ ] Format recommandé : WebP ou PNG (meilleure qualité)
- [ ] Format recommandé : WebP (meilleure compression)
- [ ] Dimensions : 800x1000px minimum
- [ ] Optimiser les images (< 200KB par image)
- [ ] 3 photos par produit : face, dos, détail

### Intégration Paiement
- [ ] Créer compte Stripe (https://stripe.com)
- [ ] Obtenir clés API (test puis production)
- [ ] Installer `@stripe/stripe-js`
- [ ] Créer composant Checkout
- [ ] Tester paiements en mode test
- [ ] Configurer webhooks pour confirmation

### Backend / API
- [ ] Firebase configuré ✅ (déjà fait)
- [ ] Base de données Firestore avec collections :
  - designs ✅
  - garments ✅
  - orders ✅
  - stock (sous-collection de designs) ✅
  - messages ✅
  - honeypot_logs ✅

### Email
- [ ] Service d'envoi emails :
  - SendGrid (gratuit jusqu'à 100/jour)
  - Mailgun
  - AWS SES
- [ ] Templates emails :
  - Confirmation commande
  - Suivi livraison
  - Contact reçu

## Priorité 2 - Amélioration UX

### Fonctionnalités Panier
- [ ] Modal de confirmation "Ajouté au panier"
- [ ] Panier persistant (localStorage)
- [ ] Animation d'ajout au panier
- [ ] Codes promo / réductions

### Modal Quick View
- [ ] Composant modal réutilisable
- [ ] Affichage rapide produit sans changer de page
- [ ] Sélection taille dans la modal
- [ ] Ajout direct au panier

### Wishlist / Favoris
- [ ] Bouton coeur sur ProductCard
- [ ] Store Pinia pour wishlist
- [ ] Page /wishlist dédiée
- [ ] Persistance localStorage

### Recherche
- [ ] Barre de recherche dans Header
- [ ] Filtrage en temps réel
- [ ] Suggestions de recherche

## Priorité 3 - Marketing & Analytics

### SEO Avancé
- [ ] Google Search Console
- [ ] Schema.org pour produits (JSON-LD)
- [ ] Open Graph images optimisées
- [ ] Blog (optionnel)

### Analytics
- [ ] Google Analytics 4
- [ ] Facebook Pixel
- [ ] Tracking événements :
  - Vue produit
  - Ajout panier
  - Début checkout
  - Achat

### Newsletter
- [ ] Formulaire inscription (Footer + popup)
- [ ] Intégration Mailchimp / Brevo
- [ ] Welcome email automatique
- [ ] Newsletter produits

### Social Media
- [ ] Partage produits (Twitter, FB, Pinterest)
- [ ] Instagram Feed intégration
- [ ] Boutons de partage

## Priorité 4 - Fonctionnalités Avancées

### Compte Client
- [ ] Authentification (Firebase Auth / Auth0)
- [ ] Page profil
- [ ] Historique commandes
- [ ] Adresses enregistrées
- [ ] Suivi livraison

### Avis & Notations
- [ ] Système de reviews
- [ ] Notes étoiles
- [ ] Photos clients (UGC)
- [ ] Modération avis

### Stock Management
- [x] ✨ Gestion stock par dessin (FAIT)
- [x] ✨ Décrémentation automatique lors livraison (FAIT)
- [x] ✨ Interface admin pour gérer le stock (FAIT)
- [ ] Alertes email quand stock < 10 unités
- [ ] Pré-commandes pour produits en rupture
- [ ] Notifications réapprovisionnement
- [ ] **IMPORTANT** : Associer tous les produits à un dessin avant production

### Multi-langue
- [ ] i18n (FR, EN)
- [ ] Détection automatique langue
- [ ] Sélecteur de langue

### Performance
- [ ] Lazy loading images
- [ ] Code splitting
- [ ] Service Worker (PWA)
- [ ] Cache stratégies

## Priorité 5 - Administration

### Dashboard Admin
- [ ] Interface admin séparée
- [ ] Gestion produits (CRUD)
- [ ] Gestion commandes
- [ ] Statistiques ventes
- [ ] Gestion clients

### Livreurs
- [ ] Intégration Mondial Relay
- [ ] Colissimo
- [ ] Chronopost
- [ ] Calcul frais de port automatique

## Configuration Déploiement

### Nom de domaine
- [ ] Acheter nainvert.com (ou .fr)
- [ ] Configurer DNS
- [ ] Certificat SSL (Let's Encrypt)

### Hébergement
Recommandations :
1. **Vercel** (gratuit, simple, excellent pour Vue)
2. **Netlify** (gratuit, CI/CD facile)
3. **Firebase Hosting** (gratuit jusqu'à 10GB)
4. **AWS Amplify** (plus complexe, scalable)

### Variables d'environnement
Créer `.env` :
```
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
VITE_API_URL=https://api.nainvert.com
VITE_FIREBASE_API_KEY=xxx
VITE_GA_ID=G-XXXXXXXXXX
```

### CI/CD
- [ ] GitHub Actions pour déploiement auto
- [ ] Tests automatiques (optionnel)
- [ ] Preview déploiement par PR

## Notes

### Stack Recommandée Complète
```
Frontend: Vue 3 + Vite (✅ fait)
Backend: Firebase / Supabase
Paiement: Stripe
Email: SendGrid
Analytics: Google Analytics 4
SEO: JSON-LD Schema.org
Hosting: Vercel / Netlify
CDN: Cloudflare (gratuit)
```

### Budget Estimé (Mois)
- Domaine : ~10€/an
- Hébergement : 0€ (Vercel/Netlify)
- Stripe : 1.4% + 0.25€ par transaction
- SendGrid : 0€ (jusqu'à 100 emails/jour)
- Firebase : 0€ (plan gratuit généreux)
- **Total démarrage : ~15€ + frais transaction**

### Temps de Développement Estimé
- Intégration paiement : 2-3 jours
- Backend Firebase : 2-4 jours
- Vraies photos produits : 1 jour
- Tests complets : 1 jour
- **Total MVP production : 1-2 semaines**

---

## Commandes Utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Tester build localement
npm run preview

# Déployer sur Vercel
vercel --prod

# Déployer sur Netlify
netlify deploy --prod
```

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vue 3 Guide](https://vuejs.org/guide/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Pinia Documentation](https://pinia.vuejs.org/)
