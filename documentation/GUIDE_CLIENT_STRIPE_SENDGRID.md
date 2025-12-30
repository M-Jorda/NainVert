# 🛒 Guide de configuration - NainVert

Bonjour ! Pour finaliser le système de paiement et d'emails du site, j'ai besoin que vous créiez 2 comptes gratuits et me transmettiez les clés API.

**Temps estimé : 15-20 minutes**

---

## 1️⃣ Stripe (Paiements) - 10 min

### Créer le compte

1. Aller sur **[dashboard.stripe.com/register](https://dashboard.stripe.com/register)**
2. Créer un compte avec votre email professionnel
3. Confirmer votre email

### Récupérer les clés de test

1. Dans le Dashboard, cliquer sur **Développeurs** (menu de gauche)
2. Cliquer sur **Clés API**
3. Copier les 2 clés **TEST** :
   - `pk_test_...` (Clé publique)
   - `sk_test_...` (Clé secrète)

> ⚠️ Gardez la clé secrète confidentielle !

### Me transmettre

```
Clé publique Stripe : pk_test_xxxxxxxxx
Clé secrète Stripe : sk_test_xxxxxxxxx
```

---

## 2️⃣ SendGrid (Emails) - 10 min

### Créer le compte

1. Aller sur **[signup.sendgrid.com](https://signup.sendgrid.com/)**
2. Créer un compte gratuit (100 emails/jour)
3. Confirmer votre email

### Vérifier l'expéditeur

1. Aller dans **Settings** → **Sender Authentication**
2. Cliquer sur **Verify a Single Sender**
3. Remplir avec :
   - Email : `contact@nainvert.com`
   - Nom : `NainVert`
4. Cliquer sur le lien dans l'email reçu à `contact@nainvert.com`

### Créer une clé API

1. Aller dans **Settings** → **API Keys**
2. Cliquer sur **Create API Key**
3. Nom : `NainVert`
4. Permissions : **Full Access**
5. Cliquer sur **Create & View**
6. **Copier immédiatement** la clé (elle ne sera plus visible après !)

### Me transmettre

```
Clé API SendGrid : SG.xxxxxxxxx
Email vérifié : contact@nainvert.com
```

---

## 📧 Récapitulatif à m'envoyer

```
=== STRIPE ===
Clé publique : pk_test_...
Clé secrète : sk_test_...

=== SENDGRID ===
Clé API : SG....
Email expéditeur : contact@nainvert.com
```

---

## ❓ Questions fréquentes

**C'est gratuit ?**
→ Oui ! Stripe ne prélève que sur les vrais paiements (1.4% + 0.25€). SendGrid gratuit jusqu'à 100 emails/jour.

**C'est sécurisé ?**
→ Oui, ces clés servent uniquement à connecter le site aux services.

**Je dois entrer ma carte bancaire ?**
→ Stripe peut demander des infos entreprise pour les paiements réels, mais pas pour les tests.

---

Merci ! Une fois que j'ai ces clés, je finalise l'intégration et on peut tester ensemble. 🚀
