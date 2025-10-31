# 🎨 NainVert - Guide de Style & Design

## 🌈 Identité Visuelle

### Concept
**Streetwear Psychédélique** - Fusion entre l'art psychédélique des années 60-70 et la culture streetwear moderne. L'objectif est de créer une expérience visuelle audacieuse tout en maintenant une UX agréable et professionnelle.

## 🎨 Palette de Couleurs

### Couleurs Principales

```css
--black: #0a0a0a              /* Noir profond - Fond principal */
--black-light: #1a1a1a        /* Noir clair - Cartes, sections */
--black-lighter: #2a2a2a      /* Noir plus clair - Bordures, inputs */
```

### Couleurs Néon Psychédéliques

```css
--neon-green: #39FF14         /* Vert néon électrique - Primaire */
--cyan-green: #00FF88         /* Vert cyan - Secondaire */
--lime-green: #B0FF00         /* Vert lime - Accents */
--dark-green: #0d4d0d         /* Vert foncé - Subtil */
```

### Textes

```css
--text-primary: #ffffff       /* Titres, texte important */
--text-secondary: #b0b0b0     /* Descriptions, sous-titres */
--text-muted: #666666         /* Texte secondaire, labels */
```

### Usage des Couleurs

| Élément | Couleur | Exemple |
|---------|---------|---------|
| Background principal | `--black` | Body, sections |
| Cartes/Conteneurs | `--black-light` | ProductCard, Footer |
| Boutons primaires | Gradient `--neon-green` → `--cyan-green` | CTA, Ajout panier |
| Boutons secondaires | Border `--neon-green` | Liens secondaires |
| Liens/Hover | `--neon-green` | Navigation, liens |
| Prix | `--neon-green` | Prix produits |
| Accents/Badges | `--lime-green` | Nouveauté, featured |

## 📝 Typographie

### Police Principale
**Montserrat** - Google Fonts
- Modern, géométrique, très lisible
- Bonne hiérarchie de poids (300-900)

```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

### Hiérarchie

| Élément | Taille | Poids | Usage |
|---------|--------|-------|-------|
| H1 Hero | 6rem (responsive) | 900 | Page d'accueil |
| H1 Page | 4rem (responsive) | 900 | Titres pages |
| H2 | 3rem (responsive) | 800 | Sections |
| H3 | 2rem (responsive) | 700 | Sous-sections |
| Body | 1rem (16px) | 400 | Texte standard |
| Button | 1rem | 600 | Boutons |
| Small | 0.9rem | 400-600 | Métadonnées |

### Text Styles Spéciaux

```css
/* Gradient Text */
.text-gradient {
  background: linear-gradient(135deg, var(--neon-green), var(--cyan-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Neon Glow */
.neon-text {
  color: var(--neon-green);
  text-shadow: 0 0 10px var(--neon-green), 0 0 20px var(--neon-green);
}
```

## 🔲 Composants de Base

### Boutons

#### Primary Button
```html
<button class="btn btn-primary">
  Ajouter au panier
</button>
```
- Gradient vert néon
- Ombre néon au hover
- Transform: translateY(-2px)

#### Secondary Button
```html
<button class="btn btn-secondary">
  Découvrir
</button>
```
- Border vert néon
- Background transparent
- Fill vert au hover

#### Ghost Button
```html
<button class="btn btn-ghost">
  Annuler
</button>
```
- Border grise
- Minimal, discret

### Cards

```html
<div class="card">
  <!-- Contenu -->
</div>
```
- Background: `--black-light`
- Border: `--black-lighter`
- Border radius: 12px
- Hover: translateY(-5px) + border neon

### Inputs

```html
<input type="text" class="form-input" />
```
- Background: `--black-lighter`
- Border: 2px solid (même couleur que bg)
- Focus: Border `--neon-green` + glow subtle

## ✨ Animations & Effets

### Transitions Standard
```css
--transition-fast: 0.2s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.5s ease;
```

### Effets Clés

#### Hover Cards
- Transform: `translateY(-8px)`
- Border: `--neon-green`
- Box-shadow: néon subtil

#### Pulse Animation
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```
Usage: Badge panier, éléments importants

#### Glow Animation
```css
@keyframes glow {
  0%, 100% { text-shadow: 0 0 10px var(--neon-green); }
  50% { text-shadow: 0 0 30px var(--neon-green); }
}
```
Usage: Logo, titres importants

#### Page Transitions
- Fade in/out
- Duration: 300ms
- Smooth, subtil

## 🎯 Principes de Design

### 1. Contraste Maximum
Le fond noir + vert néon crée un contraste fort, psychédélique mais lisible

### 2. Espacement Généreux
```css
--spacing-xs: 0.5rem  (8px)
--spacing-sm: 1rem    (16px)
--spacing-md: 1.5rem  (24px)
--spacing-lg: 2rem    (32px)
--spacing-xl: 3rem    (48px)
--spacing-xxl: 4rem   (64px)
```

### 3. Border Radius Cohérent
```css
--radius-sm: 4px      /* Petits éléments */
--radius-md: 8px      /* Buttons, inputs */
--radius-lg: 12px     /* Cards */
--radius-xl: 16px     /* Sections */
```

### 4. Hiérarchie Visuelle Claire
- Titres: Grand, gras, vert néon
- Texte: Gris clair, lisible
- Actions: Boutons vert vif qui ressortent

### 5. Responsive First
- Mobile: 1 colonne, menu hamburger
- Tablette: 2 colonnes, navigation simplifiée
- Desktop: 3-4 colonnes, navigation complète

## 📱 Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablette */
@media (min-width: 768px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1024px) { }
```

## 🌟 Éléments Psychédéliques

### Cercles Flottants (Hero)
- Gradients radiaux
- Animation float 20s infinie
- Opacity 0.1 (subtil)
- Positionnement absolu

### Effets Néon
- Text-shadow multiple
- Box-shadow avec spread
- Glow subtil, pas agressif

### Dégradés
- Toujours 135deg (diagonal)
- Du neon-green vers cyan-green ou lime-green
- Usage: Boutons, textes importants, accents

## 🎨 Guide d'Usage

### ✅ À Faire
- Utiliser les variables CSS
- Maintenir le contraste noir/vert
- Animations subtiles et fluides
- Espacement généreux
- Texte lisible (min 14px)

### ❌ À Éviter
- Couleurs en dehors de la palette
- Animations trop agressives/rapides
- Néons trop saturés (garder opacity)
- Texte trop petit
- Espacement incohérent
- Border radius incohérent

## 🖼️ Images Produits

### Recommandations
- **Format**: WebP (ou JPG haute qualité)
- **Dimensions**: 800x1000px minimum
- **Ratio**: 4:5 (portrait)
- **Poids**: < 200KB (optimisé)
- **Style**: 
  - Fond uni noir ou gris foncé
  - Éclairage professionnel
  - 3 angles: face, dos, détail
  - Cohérence entre tous les produits

### Édition
- Contraste élevé
- Saturation légèrement boostée
- Netteté optimale
- Ombres portées subtiles

## 🎭 Mood Board

**Inspirations:**
- Psychédélie années 60-70 (Grateful Dead, Pink Floyd)
- Cyberpunk (néons, contraste)
- Streetwear moderne (Supreme, Palace, Stüssy)
- Rave culture (couleurs vives, énergie)

**Mots-clés:**
Électrique, Vibrant, Audacieux, Hypnotique, Énergétique, Avant-gardiste, Underground

---

**Maintenir cette cohérence visuelle sur toutes les pages et composants !** 🌿✨
