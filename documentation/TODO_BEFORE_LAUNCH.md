# 🚀 TODO Avant Lancement - NainVert

> **⚠️ IMPORTANT** : Ce fichier liste toutes les actions à effectuer avant la mise en production.
> À cocher au fur et à mesure de la réception des clés API du client.

---

## 📋 Checklist Pré-Lancement

### 1. 💳 Stripe (Paiement)

- [ ] **Recevoir les clés API Stripe du client**
  - Clé publique : `pk_live_...`
  - Clé secrète : `sk_live_...`
  - Webhook secret : `whsec_...`

- [ ] **Configurer les variables d'environnement**
  ```bash
  # Dans .env (production)
  VITE_STRIPE_PUBLIC_KEY=pk_live_XXXXXXX
  
  # Dans Firebase Functions
  firebase functions:secrets:set STRIPE_SECRET_KEY
  firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
  ```

- [ ] **Configurer le webhook Stripe**
  - URL : `https://VOTRE_PROJET.cloudfunctions.net/stripeWebhook`
  - Événements à écouter : `payment_intent.succeeded`, `payment_intent.payment_failed`

- [ ] **Tester un vrai paiement** (avec carte de test Stripe)

- [ ] **Désactiver le mode test** 
  - Le mode test se désactive automatiquement quand `VITE_STRIPE_PUBLIC_KEY` est une vraie clé `pk_live_...`
  - Fichier concerné : `src/components/CheckoutModalStripe.vue`
  - La fonction `isStripeConfigured()` dans `src/services/stripe.js` vérifie automatiquement

---

### 2. 📧 SendGrid (Emails transactionnels)

- [ ] **Recevoir la clé API SendGrid du client**
  - Clé API : `SG.XXXXXXX`

- [ ] **Configurer l'adresse d'expédition vérifiée**
  - Email : `commandes@nainvert.com` (ou autre)
  - Vérifier le domaine dans SendGrid

- [ ] **Configurer la variable Firebase Functions**
  ```bash
  firebase functions:secrets:set SENDGRID_API_KEY
  ```

- [ ] **Tester l'envoi d'emails**
  - Email de confirmation de commande
  - Email d'expédition avec numéro de suivi

---

### 3. 📦 Colissimo (Livraison) - Optionnel

- [ ] **Recevoir les identifiants API Colissimo Pro**
  - Contract ID
  - Mot de passe API

- [ ] **Intégrer l'API pour génération d'étiquettes** (si souhaité)

---

### 4. 🔒 Sécurité Production

- [ ] **Passer Firebase en mode production**
  - Désactiver les règles de test
  - Activer les règles restrictives

- [ ] **Vérifier les règles Firestore**
  ```bash
  firebase deploy --only firestore:rules
  ```

- [ ] **Configurer le domaine personnalisé** (si applicable)

---

### 5. 🚀 Déploiement

- [ ] **Déployer les Cloud Functions**
  ```bash
  cd functions && npm install
  firebase deploy --only functions
  ```

- [ ] **Déployer le frontend**
  ```bash
  npm run build
  firebase deploy --only hosting
  # OU
  vercel --prod
  ```

- [ ] **Tester le flux complet de commande**

---

## 📝 Notes Techniques

### Mode Test Actuel

Le checkout fonctionne actuellement en **mode test** :
- Détection automatique via `isStripeConfigured()` dans `src/services/stripe.js`
- Affiche un banner jaune "MODE TEST" à l'étape paiement
- Propose des boutons pour simuler succès/échec de paiement
- Permet de tester le stock et le flux complet sans vraie transaction

### Fichiers à surveiller lors de l'activation Stripe

| Fichier | Rôle |
|---------|------|
| `.env` | Variable `VITE_STRIPE_PUBLIC_KEY` |
| `src/services/stripe.js` | Fonction `isStripeConfigured()` |
| `src/components/CheckoutModalStripe.vue` | Mode test/production automatique |
| `functions/index.js` | Cloud Functions (createPaymentIntent, webhook) |

### Commande rapide pour vérifier la configuration

```javascript
// Dans la console navigateur
console.log('Stripe configuré:', import.meta.env.VITE_STRIPE_PUBLIC_KEY?.startsWith('pk_'))
```

---

## ✅ Validation Finale

Avant de déclarer le site "prêt pour production" :

1. [ ] Passer une vraie commande test (avec remboursement)
2. [ ] Vérifier la réception des emails
3. [ ] Vérifier la décrémentation du stock
4. [ ] Vérifier l'affichage dans l'admin
5. [ ] Tester sur mobile

---

*Document créé le 30 décembre 2025*
*Dernière mise à jour : 30 décembre 2025*
