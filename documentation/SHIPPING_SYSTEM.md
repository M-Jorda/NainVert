# Système de Livraison NainVert

## Vue d'ensemble

Le système de livraison de NainVert propose 3 transporteurs avec calcul automatique des frais selon le poids et la zone de livraison.

## Transporteurs disponibles

### 1. Colissimo (La Poste)
- **Délai** : 2-3 jours ouvrés
- **Suivi** : Oui
- **Assurance** : Incluse

### 2. Chronopost
- **Délai** : 24h
- **Suivi** : Oui
- **Assurance** : Incluse
- **Note** : Option express pour livraison rapide

### 3. Mondial Relay
- **Délai** : 3-5 jours ouvrés
- **Suivi** : Oui
- **Note** : Livraison en point relais, option la plus économique

## Zones de livraison

| Zone | Pays/Régions |
|------|-------------|
| **France** | France métropolitaine |
| **DOM-TOM** | Guadeloupe, Martinique, Guyane, Réunion, Mayotte |
| **Europe** | UE + Suisse, Norvège, UK |

## Grille tarifaire

### France Métropolitaine

| Poids | Colissimo | Chronopost | Mondial Relay |
|-------|-----------|------------|---------------|
| ≤ 250g | 4.95€ | 9.90€ | 3.90€ |
| ≤ 500g | 6.35€ | 13.90€ | 4.50€ |
| ≤ 750g | 7.25€ | 15.90€ | 5.20€ |
| ≤ 1kg | 7.95€ | 17.90€ | 5.90€ |
| ≤ 2kg | 8.95€ | 21.90€ | 6.90€ |

### DOM-TOM (Colissimo uniquement)

| Poids | Prix |
|-------|------|
| ≤ 250g | 9.50€ |
| ≤ 500g | 13.20€ |
| ≤ 750g | 16.90€ |
| ≤ 1kg | 20.60€ |
| ≤ 2kg | 27.00€ |

### Europe (Colissimo uniquement)

| Poids | Prix |
|-------|------|
| ≤ 250g | 12.55€ |
| ≤ 500g | 14.45€ |
| ≤ 750g | 16.25€ |
| ≤ 1kg | 18.05€ |
| ≤ 2kg | 22.85€ |

## Livraison Gratuite

**Seuil : 80€** de commande (hors frais de livraison)

- Applicable sur tous les transporteurs
- Applicable sur toutes les zones
- Indicateur visuel dans le panier avec barre de progression

## Poids des produits

| Produit | Poids |
|---------|-------|
| T-Shirt | 250g |
| Hoodie | 550g |

## Fichiers concernés

- `src/services/shipping.js` - Service de calcul des frais
- `src/composables/useShipping.js` - Composable Vue
- `src/components/ShippingSelector.vue` - Sélecteur de mode de livraison
- `src/components/Cart.vue` - Indicateur livraison gratuite
- `src/components/CheckoutModalStripe.vue` - Étape de sélection livraison
- `src/components/OrderSummary.vue` - Affichage des frais

## Intégration dans le Checkout

Le checkout se déroule en 4 étapes :

1. **Informations** - Coordonnées client
2. **Livraison** - Choix du transporteur (NEW)
3. **Paiement** - Stripe
4. **Confirmation** - Récapitulatif

## API Future (Colissimo Pro)

Pour une intégration API complète avec Colissimo :

1. Créer un compte pro sur espaceclient.colissimo.fr
2. Obtenir les clés API
3. Activer les services :
   - `Colissimo Home` - Livraison à domicile
   - `Colissimo Pickup` - Points de retrait
   - `Colissimo Return` - Retours

Cette intégration permettra :
- Génération automatique d'étiquettes
- Suivi en temps réel
- Notification automatique au client
- Gestion des retours

## Assurance Livraison

Options d'assurance complémentaire à étudier :
- **Colissimo Expert** : +5€, assurance jusqu'à 1000€
- **Assurance tierce** : Shipup, SendCloud
