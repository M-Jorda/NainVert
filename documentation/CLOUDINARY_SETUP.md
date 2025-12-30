# 🎨 Configuration Cloudinary - Upload Preset

## ✅ Étape finale : Créer un Upload Preset

Pour que l'upload fonctionne, tu dois créer un **Upload Preset** dans Cloudinary.

### 📋 Instructions

1. **Va sur la page de configuration** :
   ```
   https://console.cloudinary.com/settings/upload
   ```

2. **Descends jusqu'à la section "Upload presets"**

3. **Clique sur "Add upload preset"** (en haut à droite)

4. **Configure le preset** :
   
   | Champ | Valeur |
   |-------|--------|
   | **Upload preset name** | `nainvert_designs` |
   | **Signing Mode** | **Unsigned** ⚠️ IMPORTANT |
   | **Folder** | `designs` |
   | **Use filename or externally defined Public ID** | ✅ Coché |
   | **Unique filename** | ✅ Coché |
   
5. **Clique sur "Save"** en haut à droite

---

## 🔍 Pourquoi "Unsigned" ?

- **Unsigned** = Pas besoin d'exposer l'API Secret côté client
- Plus sécurisé pour une application web
- Cloudinary gère l'authentification via le preset

---

## 🧪 Tester l'upload

Une fois le preset créé :

1. **Complète ton fichier `.env`** avec l'API Secret complet :
   ```env
   VITE_CLOUDINARY_API_SECRET=FHY3NNeOzLpEzXQhIO********* 
   ```
   (Remplace les ********* par ton secret complet)

2. **Redémarre le serveur de dev** :
   ```bash
   npm run dev
   ```

3. **Va dans l'admin → Designs → Nouveau Design**

4. **Upload une image** → Tu devrais voir :
   ```
   📤 Upload vers Cloudinary...
   📊 Taille: 185.23 KB
   ✅ Upload terminé en 1.2s
   🔗 URL: https://res.cloudinary.com/durcno7ql/image/upload/v1731145234/designs/abc123.jpg
   ```

---

## 🎯 URL finale

Tes images seront accessibles via des URLs comme :
```
https://res.cloudinary.com/durcno7ql/image/upload/v1731145234/designs/mon-design.jpg
```

Ces URLs sont :
- ✅ Publiques (accessibles partout)
- ✅ Permanentes (ne changent jamais)
- ✅ Optimisables (tu peux redimensionner à la volée)

**Exemple d'optimisation automatique** :
```
https://res.cloudinary.com/durcno7ql/image/upload/w_800,h_800,c_fill,q_auto,f_auto/v1731145234/designs/mon-design.jpg
```
→ Image redimensionnée à 800x800, qualité auto, format auto (WebP si supporté)

---

## 📝 Résumé

✅ Package Cloudinary installé  
✅ Service d'upload créé (`src/services/cloudinary.js`)  
✅ Composant admin modifié  
⏳ **À faire** : Créer l'Upload Preset `nainvert_designs`  
⏳ **À faire** : Compléter `.env` avec l'API Secret  

**Dis "preset créé" quand c'est fait !** 🚀
