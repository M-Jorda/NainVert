# 🎮 Easter Eggs - NainVert

## Où les trouver ?

### 🏠 Page d'accueil (Home)
- **🌈** Dans le sous-titre "Streetwear Psychédélique" → Citation sur la conscience élevée
- **🦋** Dans "Esprits Libres" → Citation sur la liberté

### 🔝 Header (toutes les pages)
- **VERT** (dans le logo NAINVERT) → Histoire du Nain Vert

### 👕 Cartes produits
- **✨** Sur les produits "Nouveauté" → Citations aléatoires sur l'énergie, la créativité, l'esprit rebelle ou les rêves

### 📧 Page Contact
- **🧘** Dans le texte d'introduction → Citation sur l'instant présent

### 👣 Footer (toutes les pages)
- **🍀** Dans le copyright → Légende NainVert
- **🌌** Dans "Made with ♥" → Connexion cosmique

## 🎨 Contenu des Easter Eggs

Les easter eggs révèlent des citations inspirantes et philosophiques :

1. **🍀 Le Nain Vert** - L'histoire de la marque
2. **🌈 Conscience Élevée** - Citation d'Einstein adaptée
3. **🦋 Liberté** - Sur la liberté intérieure
4. **⚡ Énergie Vitale** - Tesla sur l'énergie
5. **🌿 Retour aux Sources** - John Muir sur la nature
6. **🎨 Créativité Infinie** - Sur l'intelligence créative
7. **🔥 Esprit Rebelle** - Steve Jobs adapté
8. **🧘 Instant Présent** - Thich Nhat Hanh sur la pleine conscience
9. **💫 Rêve Lucide** - Sur les rêveurs
10. **🌌 Connexion Cosmique** - Rumi adapté

## 🛠️ Technique

- **Composant** : `EasterEggModal.vue` - Modale élégante avec animations
- **Composable** : `useEasterEgg.js` - Gestion des états et contenus
- **Animations** : Effets de glow, rotation au hover, fade-in de la modale
- **Accessibilité** : Fermeture avec Escape, attributs ARIA

## 💡 Ajouter un nouvel Easter Egg

1. Éditer `src/composables/useEasterEgg.js`
2. Ajouter une nouvelle entrée dans `easterEggContents`
3. Placer un emoji cliquable avec `@click="openEasterEgg('votre_cle')"`

Exemple :
```vue
<span 
  class="easter-egg-trigger"
  @click="openEasterEgg('nouvelle_citation')"
  title="🎯"
>
  🎯
</span>
```
