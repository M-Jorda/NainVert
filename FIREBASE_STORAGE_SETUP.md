# 🔥 Configuration Firebase Storage - Guide

## 🎯 Problème actuel

Quand tu essaies d'uploader une image dans l'admin, elle reste en status "Upload..." très longtemps car **Firebase Storage n'est pas encore activé** sur ton projet.

## ✅ Solution : Activer Firebase Storage

### Étape 1 : Activer le service

1. **Ouvre la console Firebase Storage** :
   ```
   https://console.firebase.google.com/project/nainvert-2561c/storage
   ```

2. **Clique sur "Get Started" (Commencer)**

3. **Choisis le mode de sécurité** :
   - Sélectionne **"Production mode"** (les règles sont déjà configurées dans le code)
   - Clique sur **"Suivant"**

4. **Sélectionne la région** :
   - Choisis une région proche (ex: `europe-west1` pour l'Europe)
   - Clique sur **"Terminer"**

### Étape 2 : Déployer les règles de sécurité

Une fois Storage activé, reviens dans ton terminal et exécute :

```bash
firebase deploy --only storage:rules
```

## 📊 Comportement actuel (avant activation)

### Ce qui se passe maintenant :
- ✅ L'image s'affiche en preview locale
- ⏳ L'upload attend 10 secondes
- ⚠️ Timeout après 10s → affiche "URL temporaire"
- 🔗 Utilise une URL `blob:` locale (ne fonctionne pas après rechargement)

### Après activation de Storage :
- ✅ L'image s'affiche en preview locale
- 📤 Upload réel vers Firebase Storage (rapide, ~1-2 secondes)
- ✅ Récupération de l'URL publique permanente
- 🌍 Image accessible depuis n'importe où

## 🔍 Détails techniques

### Fichier de règles : `storage.rules`
```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /designs/{imageId} {
      allow read: if true;           // Lecture publique
      allow write: if request.auth != null;  // Écriture admin uniquement
    }
  }
}
```

### Stockage des images
- **Dossier** : `/designs/`
- **Format du nom** : `{timestamp}-{nom-fichier}.jpg`
- **Exemple** : `designs/1731068352288-mon-design.jpg`

### Taille des fichiers
- **Recommandé** : < 500 KB par image
- **Maximum** : 5 MB (limite Firebase gratuite)
- **Format** : JPG, PNG, WebP

## 🐛 Debugging

### Ouvrir la console du navigateur
1. Ouvre l'admin panel
2. Appuie sur **F12** pour ouvrir DevTools
3. Va dans l'onglet **"Console"**
4. Upload une image
5. Tu verras les logs détaillés :
   ```
   📦 Fichier: test.jpg (185.23 KB)
   ⏳ Début upload...
   📤 Upload de l'image vers Firebase Storage...
   📊 Taille: 185.23 KB
   ⚠️ Upload timeout - Firebase Storage n'est peut-être pas activé
   ```

### Si tu vois "timeout" :
→ Firebase Storage n'est pas activé, suis les étapes ci-dessus

### Si tu vois "storage/unauthorized" :
→ Les règles ne sont pas déployées, exécute :
```bash
firebase deploy --only storage:rules
```

## 📝 Après activation

Une fois Firebase Storage activé et les règles déployées :

1. **Recharge l'admin panel** (F5)
2. **Upload une image**
3. **Tu devrais voir** :
   ```
   📦 Fichier: test.jpg (185.23 KB)
   ⏳ Début upload...
   📤 Upload de l'image vers Firebase Storage...
   📊 Taille: 185.23 KB
   ✅ Upload terminé en 1.23s
   ✅ Image uploadée: https://firebasestorage.googleapis.com/...
   ```

4. **L'image n'aura plus le badge "⚠️ URL temporaire"**

## 🎨 Création de designs

Une fois Storage configuré, tu pourras :
- ✅ Upload plusieurs images par design
- ✅ Images accessibles publiquement
- ✅ URLs permanentes stockées en BDD
- ✅ Preview immédiat dans l'admin

**Dis "Storage activé" quand c'est fait !** 🚀
