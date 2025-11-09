# 📸 Structure des Images par Vêtement

## 🎯 Objectif

Chaque design doit avoir **des images spécifiques pour chaque type de vêtement** (T-shirt et Hoodie).
Cela permet d'afficher les différences visuelles importantes (capuche, manches longues, poches, etc.).

---

## 📊 Structure de Base de Données

### ❌ Ancienne Structure (actuelle)

```javascript
{
  id: "neon-dreams",
  name: "Neon Dreams",
  images: [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ]
}
```

**Problème** : Les mêmes images s'affichent pour le T-shirt et le Hoodie.

---

### ✅ Nouvelle Structure (à implémenter)

```javascript
{
  id: "neon-dreams",
  name: "Neon Dreams",
  
  // 🆕 Images organisées par type de vêtement
  garmentImages: {
    tshirt: [
      "https://cloudinary.com/tshirt-front.jpg",
      "https://cloudinary.com/tshirt-back.jpg",
      "https://cloudinary.com/tshirt-detail.jpg"
    ],
    hoodie: [
      "https://cloudinary.com/hoodie-front.jpg",
      "https://cloudinary.com/hoodie-back.jpg",
      "https://cloudinary.com/hoodie-side.jpg",
      "https://cloudinary.com/hoodie-hood.jpg"
    ]
  },
  
  // Images anciennes conservées pour compatibilité (optionnel)
  images: [
    "https://cloudinary.com/tshirt-front.jpg" // Image par défaut
  ]
}
```

---

## 🔧 Modifications Nécessaires

### 1️⃣ **Admin Panel** (`DesignsTab.vue`)

Modifier le formulaire pour permettre l'upload séparé :

```vue
<template>
  <div class="grid grid-cols-2 gap-6">
    <!-- Section T-Shirt -->
    <div>
      <h3>📱 Images T-Shirt</h3>
      <input type="file" multiple @change="handleTshirtUpload" />
      <!-- Aperçu images T-shirt -->
    </div>
    
    <!-- Section Hoodie -->
    <div>
      <h3>🧥 Images Hoodie</h3>
      <input type="file" multiple @change="handleHoodieUpload" />
      <!-- Aperçu images Hoodie -->
    </div>
  </div>
</template>

<script setup>
const formData = ref({
  name: '',
  slug: '',
  garmentImages: {
    tshirt: [],
    hoodie: []
  }
})

const handleTshirtUpload = async (e) => {
  // Upload vers Cloudinary
  // Ajouter à formData.garmentImages.tshirt
}

const handleHoodieUpload = async (e) => {
  // Upload vers Cloudinary
  // Ajouter à formData.garmentImages.hoodie
}
</script>
```

---

### 2️⃣ **Page Détail Produit** (`DesignDetail.vue`)

Charger les images selon le vêtement sélectionné :

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const selectedType = ref('tshirt') // ou 'hoodie'
const design = ref(null) // Chargé depuis Firestore

// Images dynamiques selon le type sélectionné
const currentImages = computed(() => {
  if (!design.value?.garmentImages) return []
  
  return design.value.garmentImages[selectedType.value] || []
})

// Réinitialiser la galerie quand on change de vêtement
watch(selectedType, () => {
  currentImageIndex.value = 0
})
</script>

<template>
  <div class="image-gallery">
    <img 
      v-for="(img, idx) in currentImages" 
      :key="idx"
      :src="img"
      :alt="`${design.name} - ${selectedType}`"
    />
  </div>
</template>
```

---

### 3️⃣ **Migration des Designs Existants**

Script de migration pour mettre à jour les designs existants :

```javascript
// scripts/migrateDesignImages.js
import { db } from '@/firebase/config'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'

async function migrateDesigns() {
  const designsRef = collection(db, 'designs')
  const snapshot = await getDocs(designsRef)
  
  for (const designDoc of snapshot.docs) {
    const data = designDoc.data()
    
    // Si le design utilise l'ancienne structure
    if (data.images && !data.garmentImages) {
      const newStructure = {
        garmentImages: {
          tshirt: [...data.images],  // Copier les images existantes
          hoodie: [...data.images]   // Même images par défaut
        }
      }
      
      await updateDoc(doc(db, 'designs', designDoc.id), newStructure)
      console.log(`✅ Migré: ${data.name}`)
    }
  }
  
  console.log('🎉 Migration terminée !')
}

migrateDesigns()
```

---

## 🎨 Exemple d'Usage

### Cas d'usage : Design "Cyber Nain"

**T-Shirt** :
- Front : Design centré sur le torse
- Back : Logo au dos
- Detail : Gros plan sur le motif

**Hoodie** :
- Front : Design + logo sur capuche
- Back : Design complet avec capuche visible
- Side : Vue latérale montrant les manches longues
- Hood : Détail de la capuche

---

## 📋 Checklist de Migration

- [ ] Modifier `DesignsTab.vue` pour upload séparé T-shirt/Hoodie
- [ ] Adapter `DesignDetail.vue` pour charger images dynamiques
- [ ] Créer script de migration Firestore
- [ ] Tester avec un design test
- [ ] Migrer tous les designs existants
- [ ] Supprimer l'ancien champ `images` après validation
- [ ] Mettre à jour la documentation

---

## 💡 Avantages

✅ **Meilleure UX** : L'utilisateur voit exactement à quoi ressemble le vêtement qu'il choisit  
✅ **Plus professionnel** : Montre les détails spécifiques (capuche, manches)  
✅ **Flexibilité** : Permet d'ajouter plus d'images pour certains vêtements  
✅ **SEO** : Images spécifiques = meilleur référencement  

---

## 🚀 Prochaines Étapes

1. **Créer un design test** avec les deux types d'images
2. **Valider l'affichage** dans DesignDetail.vue
3. **Migrer progressivement** les designs existants
4. **Optimiser** les performances (lazy loading, WebP, etc.)
