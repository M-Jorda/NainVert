# 🍯 Configuration du Honeypot

## Vue d'ensemble

Le honeypot est un système de sécurité qui :
- **Capture les tentatives d'intrusion** sur `/admin` (fausse page)
- **Protège le vrai admin** accessible sur `/rho`
- **Log toutes les tentatives** dans Firebase Firestore
- **Fait perdre du temps** aux bots avec des délais artificiels

## Architecture

### Routes configurées

```
/admin  → Honeypot (faux admin qui log les tentatives)
/rho    → Vrai admin panel (Firebase Auth requis)
```

### Fonctionnalités du Honeypot

1. **Interface identique** au vrai admin (les bots ne voient pas la différence)
2. **Délais artificiels** : 5-10 secondes par tentative (tarpit)
3. **Messages aléatoires** : erreurs variées pour tromper les bots
4. **Faux succès** : parfois affiche "succès" puis reload (boucle infinie)
5. **Logging complet** :
   - Email essayé
   - Début du mot de passe (3 premiers caractères)
   - Timestamp
   - User Agent
   - Numéro de tentative

## Règles Firestore à ajouter

Allez dans Firebase Console → Firestore Database → Rules et ajoutez :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Collection honeypot_logs : tout le monde peut écrire (c'est le but)
    // mais seuls les admins authentifiés peuvent lire
    match /honeypot_logs/{logId} {
      allow write: if true; // Bots peuvent écrire
      allow read: if request.auth != null; // Seuls admins peuvent lire
      allow delete: if request.auth != null; // Seuls admins peuvent supprimer
    }
    
    // Vos autres règles existantes...
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /siteContent/{contentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Dashboard d'intrusions

Dans le vrai admin (`/rho`), vous avez un onglet **"Intrusions"** qui affiche :

### Informations par tentative
- Email utilisé
- Début du mot de passe
- Date et heure
- User Agent (navigateur/bot)
- Numéro de la tentative

### Statistiques
- **Tentatives totales** : Nombre total d'intrusions
- **Emails uniques** : Combien d'emails différents ont été essayés
- **Aujourd'hui** : Tentatives dans les dernières 24h
- **Dernière tentative** : Temps écoulé depuis la dernière

### Actions disponibles
- ✅ Supprimer une tentative individuelle
- ✅ Effacer tous les logs
- ✅ Mise à jour en temps réel (Firebase listeners)

## Avantages de cette approche

### 🔒 Sécurité
- **Réduit les attaques automatisées** : Les bots passent leur temps sur `/admin`
- **URL obscure** : `/rho` est impossible à deviner
- **Double protection** : Firebase Auth + URL cachée

### 📊 Intelligence
- **Visibilité** : Vous savez qui essaye d'accéder
- **Patterns** : Identifiez les attaques coordonnées
- **Proactif** : Bloquez les IPs suspectes si nécessaire

### 💰 Gratuit
- **Pas de service externe** : Tout dans Firebase
- **Quota Firestore** : Largement suffisant pour ce cas d'usage

## Comment tester

1. **Testez le honeypot** :
   ```
   http://localhost:3000/admin
   ```
   - Entrez n'importe quel email/mot de passe
   - Attendez 5-10 secondes
   - Vous verrez un message d'erreur ou de "succès"

2. **Consultez les logs** :
   ```
   http://localhost:3000/rho
   ```
   - Connectez-vous avec vos vrais identifiants
   - Allez dans l'onglet "Intrusions"
   - Vous verrez la tentative que vous venez de faire

## Améliorations futures possibles

- [ ] **Capturer l'IP réelle** (nécessite Cloud Function)
- [ ] **Blocage automatique** après X tentatives
- [ ] **Notifications email** quand nouvelle intrusion
- [ ] **Honeypot plus élaboré** : faux tableau de bord après "connexion"
- [ ] **Export CSV** des logs pour analyse

## Notes importantes

⚠️ **Ne partagez JAMAIS l'URL `/rho`** publiquement
⚠️ **Changez `/rho` périodiquement** si vous suspectez une fuite
⚠️ **Les logs peuvent contenir des données sensibles** : videz régulièrement

---

**Résultat** : Votre vrai admin est invisible, et les hackers perdent leur temps sur un faux ! 🎭
