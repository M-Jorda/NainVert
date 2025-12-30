# 💳 Guide d'intégration Stripe + Emails - NainVert

## Table des matières
1. [Configuration Stripe](#1-configuration-stripe)
2. [Configuration SendGrid](#2-configuration-sendgrid)
3. [Déploiement des Cloud Functions](#3-déploiement-des-cloud-functions)
4. [Test du système](#4-test-du-système)
5. [Passage en production](#5-passage-en-production)

---

## 1. Configuration Stripe

### 1.1 Créer un compte Stripe

1. Aller sur [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Créer un compte avec votre email professionnel
3. Vérifier votre email

### 1.2 Récupérer les clés API

1. Dashboard Stripe → **Développeurs** → **Clés API**
2. Copier les clés **TEST** :
   - `pk_test_...` → Clé publique (frontend)
   - `sk_test_...` → Clé secrète (backend - Firebase)

### 1.3 Configurer les variables d'environnement

**Frontend (.env)** :
```env
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
VITE_STRIPE_FUNCTION_URL=https://us-central1-VOTRE_PROJECT_ID.cloudfunctions.net/createPaymentIntent
```

**Firebase Functions** :
```bash
# Configurer les secrets Firebase
firebase functions:config:set stripe.secret="sk_test_xxxxxxxxxxxxx"
firebase functions:config:set stripe.webhook_secret="whsec_xxxxxxxxxxxxx"
```

### 1.4 Configurer le Webhook Stripe

1. Dashboard Stripe → **Développeurs** → **Webhooks**
2. Cliquer sur **Ajouter un endpoint**
3. URL : `https://us-central1-VOTRE_PROJECT_ID.cloudfunctions.net/stripeWebhook`
4. Événements à écouter :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copier le **Signing secret** (`whsec_...`)

---

## 2. Configuration SendGrid

### 2.1 Créer un compte SendGrid

1. Aller sur [https://sendgrid.com](https://sendgrid.com)
2. Créer un compte gratuit (100 emails/jour)
3. Vérifier votre email

### 2.2 Configurer un expéditeur vérifié

1. **Settings** → **Sender Authentication**
2. Choisir **Single Sender Verification** (le plus simple)
3. Ajouter `contact@nainvert.com` comme expéditeur
4. Vérifier l'email reçu

### 2.3 Créer une clé API

1. **Settings** → **API Keys**
2. Cliquer **Create API Key**
3. Nom : `NainVert Production`
4. Permissions : **Full Access**
5. Copier la clé `SG.xxxxxxxx`

### 2.4 Configurer Firebase

```bash
firebase functions:config:set sendgrid.api_key="SG.xxxxxxxxxxxxx"
firebase functions:config:set sendgrid.from_email="contact@nainvert.com"
firebase functions:config:set admin.email="votre-email-admin@gmail.com"
```

---

## 3. Déploiement des Cloud Functions

### 3.1 Prérequis

```bash
# Installer Firebase CLI si pas déjà fait
npm install -g firebase-tools

# Se connecter à Firebase
firebase login

# Vérifier le projet
firebase projects:list
```

### 3.2 Installer les dépendances des functions

```bash
cd functions
npm install
```

### 3.3 Tester localement (optionnel)

```bash
# Démarrer l'émulateur
firebase emulators:start --only functions

# Les fonctions seront disponibles sur:
# http://localhost:5001/VOTRE_PROJECT_ID/us-central1/createPaymentIntent
```

### 3.4 Déployer les functions

```bash
# Depuis la racine du projet
firebase deploy --only functions
```

Après le déploiement, vous verrez les URLs des fonctions :
```
✔ functions: Finished running predeploy script.
✔ functions[createPaymentIntent(us-central1)]: Deployed
✔ functions[stripeWebhook(us-central1)]: Deployed
✔ functions[sendShippingEmail(us-central1)]: Deployed
✔ functions[sendCustomEmail(us-central1)]: Deployed
```

### 3.5 Mettre à jour l'URL dans le frontend

Copiez l'URL de `createPaymentIntent` dans votre `.env` :
```env
VITE_STRIPE_FUNCTION_URL=https://us-central1-nainvert.cloudfunctions.net/createPaymentIntent
```

---

## 4. Test du système

### 4.1 Cartes de test Stripe

| Numéro | Comportement |
|--------|--------------|
| `4242 4242 4242 4242` | Paiement réussi |
| `4000 0000 0000 0002` | Carte refusée |
| `4000 0025 0000 3155` | Nécessite 3D Secure |
| `4000 0000 0000 9995` | Fonds insuffisants |

- Date d'expiration : N'importe quelle date future
- CVC : N'importe quel code à 3 chiffres
- Code postal : N'importe quel code

### 4.2 Tester le flux complet

1. **Ajouter un produit au panier**
2. **Ouvrir le checkout**
3. **Remplir les informations client**
4. **Passer à l'étape paiement**
5. **Entrer la carte test** `4242 4242 4242 4242`
6. **Valider le paiement**

### 4.3 Vérifier dans Stripe

1. Dashboard Stripe → **Paiements**
2. Voir le paiement test
3. Vérifier les métadonnées (orderId, email)

### 4.4 Vérifier dans Firestore

1. Console Firebase → **Firestore**
2. Collection `orders`
3. Vérifier que la commande a `status: "paid"`
4. Vérifier `payment.transactionId`

### 4.5 Vérifier les emails

1. Vérifier la boîte de réception du client test
2. Email de confirmation reçu ?
3. Vérifier la boîte admin (notification)

---

## 5. Passage en production

### 5.1 Activer votre compte Stripe

1. Dashboard Stripe → Compléter le profil entreprise
2. Fournir les informations légales
3. Attendre la validation (24-48h)

### 5.2 Basculer vers les clés de production

**Frontend (.env)** :
```env
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
```

**Firebase Functions** :
```bash
firebase functions:config:set stripe.secret="sk_live_xxxxxxxxxxxxx"
```

### 5.3 Créer le webhook de production

1. Dashboard Stripe → Webhooks → Ajouter endpoint
2. Utiliser les mêmes événements
3. Mettre à jour le `webhook_secret` dans Firebase

### 5.4 Redéployer les functions

```bash
firebase deploy --only functions
```

### 5.5 Checklist finale

- [ ] Clés de production configurées
- [ ] Webhook de production créé
- [ ] Emails testés avec une vraie adresse
- [ ] Informations légales complètes sur Stripe
- [ ] CGV et mentions légales à jour sur le site
- [ ] Test d'un vrai achat (1€)

---

## 📁 Fichiers créés/modifiés

| Fichier | Description |
|---------|-------------|
| `src/services/stripe.js` | Service Stripe frontend |
| `src/services/email.js` | Service email frontend |
| `src/composables/useStripePayment.js` | Composable paiement |
| `src/components/StripePaymentForm.vue` | Formulaire Stripe |
| `functions/package.json` | Dépendances Cloud Functions |
| `functions/index.js` | Cloud Functions (Stripe + Emails) |
| `firebase.json` | Config Firebase mise à jour |

---

## 🆘 Dépannage

### Erreur "No such payment intent"
→ Vérifiez que le `clientSecret` est bien passé au composant

### Erreur CORS
→ Vérifiez que la fonction utilise `cors(req, res, async () => {})`

### Emails non reçus
→ Vérifiez que l'expéditeur est vérifié dans SendGrid
→ Vérifiez les logs : `firebase functions:log`

### Webhook non déclenché
→ Vérifiez la signature dans le dashboard Stripe → Webhooks → Logs

---

## 📞 Support

- **Stripe** : [support.stripe.com](https://support.stripe.com)
- **SendGrid** : [support.sendgrid.com](https://support.sendgrid.com)
- **Firebase** : [firebase.google.com/support](https://firebase.google.com/support)
