# 🖼️ Comment récupérer les URLs d'images

## ❌ Problème
Les scripts ne peuvent pas accéder à Firestore à cause des permissions (même en lecture).

## ✅ Solutions

### **Option 1 : Via l'Admin Panel** (RECOMMANDÉ)
1. Ouvre https://nainvert-bc46d.web.app/admin
2. Va dans l'onglet **Designs**
3. Clique sur chaque design pour l'ouvrir
4. **Copie l'URL de l'image affichée** (clic droit → Copier l'adresse de l'image)
5. Note ces URLs dans un fichier texte

---

### **Option 2 : Via Firebase Console**
1. Va sur https://console.firebase.google.com/project/nainvert-bc46d/firestore
2. Clique sur **Firestore Database**
3. Collection **designs**
4. Clique sur chaque document
5. Copie le champ `images[0]` (l'URL de l'image)

---

### **Option 3 : Via Cloudinary Dashboard**
1. Va sur https://console.cloudinary.com/console/c-0481c4ab26e1b3e07b6b29e5e0be8f/media_library/folders/f5a7cb82e5b5fdeb81eaf61f7c2b4e95
2. Compte : `dqnvpvhae`
3. Dossier : **designs/**
4. Copie les URLs des images

Format d'URL Cloudinary :
```
https://res.cloudinary.com/dqnvpvhae/image/upload/v1731099643/designs/NOM-IMAGE.jpg
```

---

## 📝 Structure des designs actuels

D'après les scripts de migration, les images sont probablement :

| Design | Image actuelle (locale) | URL Cloudinary nécessaire |
|--------|-------------------------|---------------------------|
| Neon Dreams | `/products/tshirt-1-front.jpg` | `https://res.cloudinary.com/.../neon-dreams.jpg` |
| Acid Wave | `/products/tshirt-2-front.jpg` | `https://res.cloudinary.com/.../acid-wave.jpg` |
| Electric Jungle | `/products/hoodie-1-front.jpg` | `https://res.cloudinary.com/.../electric-jungle.jpg` |
| Cyber Trip | `/products/hoodie-2-front.jpg` | `https://res.cloudinary.com/.../cyber-trip.jpg` |

---

## 🎯 Que faire ensuite ?

### Approche MANUELLE (recommandée) :
1. **Récupère les URLs** via l'admin panel ou Cloudinary
2. **Ne supprime PAS** la collection `designs` dans Firestore
3. **Utilise l'admin panel** pour modifier les prix :
   - Clique sur chaque design
   - Change `designPrice` de `"15.00"` (String) à `15` (Number)
   - Sauvegarde

### Approche SCRIPT (si tu veux vraiment) :
1. **Récupère les URLs** d'images
2. **Modifie** `scripts/recreate-designs.js` avec les vraies URLs
3. **Supprime** manuellement la collection dans Firebase Console
4. **Modifie temporairement** `firestore.rules` :
   ```
   match /designs/{designId} {
     allow read, write: if true; // TEMPORAIRE!
   }
   ```
5. Redéploie les règles : `firebase deploy --only firestore:rules`
6. Lance le script : `node scripts/recreate-designs.js`
7. **Restaure** les règles originales
8. Redéploie : `firebase deploy --only firestore:rules`

---

## ⚠️ RECOMMANDATION FINALE

**Utilise l'admin panel** pour tout faire :
1. Pas besoin de scripts
2. Pas besoin de modifier les règles
3. Modification directe dans l'interface
4. Contrôle visuel immédiat

**Étapes :**
1. Va sur /admin → Designs
2. Clique sur "Neon Dreams"
3. Modifie `Prix du design` : `15` (Number, pas `"15.00"`)
4. Sauvegarde
5. Répète pour les autres designs

✅ **Simple, sûr, et efficace !**
