/**
 * Service de calcul des frais de livraison - NainVert
 * Tarifs basés sur Colissimo, Chronopost et Mondial Relay
 *
 * Note: Ces tarifs sont indicatifs et peuvent être mis à jour.
 * Pour des tarifs en temps réel, intégrer l'API du transporteur.
 */

/**
 * Grille tarifaire Colissimo France Métropolitaine 2025
 * Basé sur le poids du colis
 */
const COLISSIMO_RATES = {
  france: [
    { maxWeight: 250, price: 4.95 },    // Jusqu'à 250g
    { maxWeight: 500, price: 6.55 },    // Jusqu'à 500g
    { maxWeight: 750, price: 7.45 },    // Jusqu'à 750g
    { maxWeight: 1000, price: 8.10 },   // Jusqu'à 1kg
    { maxWeight: 2000, price: 9.35 },   // Jusqu'à 2kg
    { maxWeight: 5000, price: 14.35 },  // Jusqu'à 5kg
    { maxWeight: 10000, price: 20.85 }, // Jusqu'à 10kg
    { maxWeight: 30000, price: 29.00 }  // Jusqu'à 30kg
  ],
  // DOM-TOM (tarifs moyens)
  domtom: [
    { maxWeight: 500, price: 9.50 },
    { maxWeight: 1000, price: 15.50 },
    { maxWeight: 2000, price: 22.00 },
    { maxWeight: 5000, price: 42.00 }
  ],
  // Europe (zone 1)
  europe: [
    { maxWeight: 500, price: 12.55 },
    { maxWeight: 1000, price: 16.05 },
    { maxWeight: 2000, price: 19.50 },
    { maxWeight: 5000, price: 28.00 }
  ]
}

/**
 * Tarifs Chronopost Express
 */
const CHRONOPOST_RATES = {
  france: [
    { maxWeight: 500, price: 12.90 },
    { maxWeight: 1000, price: 14.90 },
    { maxWeight: 2000, price: 17.90 },
    { maxWeight: 5000, price: 24.90 }
  ]
}

/**
 * Tarifs Mondial Relay (points relais)
 */
const MONDIAL_RELAY_RATES = {
  france: [
    { maxWeight: 500, price: 3.99 },
    { maxWeight: 1000, price: 4.99 },
    { maxWeight: 2000, price: 5.99 },
    { maxWeight: 5000, price: 8.99 }
  ]
}

/**
 * Poids estimé des articles (en grammes)
 */
const PRODUCT_WEIGHTS = {
  tshirt: 250,   // T-shirt ~250g
  hoodie: 550,   // Hoodie ~550g
  default: 300   // Par défaut
}

/**
 * Options de livraison disponibles
 */
export const SHIPPING_OPTIONS = [
  {
    id: 'mondial_relay',
    name: 'Mondial Relay',
    description: 'Livraison en point relais',
    icon: '📍',
    delay: '4-6 jours ouvrés',
    tracking: true
  },
  {
    id: 'colissimo',
    name: 'Colissimo',
    description: 'Livraison à domicile',
    icon: '📮',
    delay: '2-4 jours ouvrés',
    tracking: true
  },
  {
    id: 'chronopost',
    name: 'Chronopost Express',
    description: 'Livraison express à domicile',
    icon: '🚀',
    delay: '24-48h',
    tracking: true
  }
]

/**
 * Calcule le poids total du panier
 * @param {Array} items - Articles du panier
 * @returns {number} - Poids total en grammes
 */
export function calculateCartWeight(items) {
  // Defensive: ensure array
  if (!Array.isArray(items)) {
    console.warn('calculateCartWeight received non-array:', items)
    return 0
  }
  return items.reduce((total, item) => {
    // ... your logic
  }, 0)
}

/**
 * Détermine la zone de livraison
 * @param {string} country - Pays de livraison
 * @param {string} postalCode - Code postal
 * @returns {string} - Zone (france, domtom, europe)
 */
export const getShippingZone = (country, postalCode = '') => {
  const countryLower = country?.toLowerCase() || 'france'

  // France métropolitaine
  if (countryLower === 'france' || countryLower === 'fr') {
    // Vérifier si c'est un DOM-TOM
    const domtomCodes = ['97', '98']
    if (postalCode && domtomCodes.some(code => postalCode.startsWith(code))) {
      return 'domtom'
    }
    return 'france'
  }

  // Pays européens
  const europeanCountries = [
    'allemagne', 'germany', 'de',
    'belgique', 'belgium', 'be',
    'espagne', 'spain', 'es',
    'italie', 'italy', 'it',
    'pays-bas', 'netherlands', 'nl',
    'portugal', 'pt',
    'luxembourg', 'lu',
    'autriche', 'austria', 'at',
    'suisse', 'switzerland', 'ch'
  ]

  if (europeanCountries.includes(countryLower)) {
    return 'europe'
  }

  // Par défaut: Europe
  return 'europe'
}

/**
 * Calcule les frais de livraison pour un transporteur
 * @param {string} carrier - Transporteur (colissimo, chronopost, mondial_relay)
 * @param {number} weight - Poids en grammes
 * @param {string} zone - Zone de livraison
 * @returns {number|null} - Prix ou null si non disponible
 */
const getCarrierRate = (carrier, weight, zone) => {
  let rates

  switch (carrier) {
    case 'colissimo':
      rates = COLISSIMO_RATES[zone] || COLISSIMO_RATES.france
      break
    case 'chronopost':
      rates = CHRONOPOST_RATES[zone] || CHRONOPOST_RATES.france
      break
    case 'mondial_relay':
      rates = MONDIAL_RELAY_RATES[zone] || MONDIAL_RELAY_RATES.france
      break
    default:
      return null
  }

  // Trouver le tarif correspondant au poids
  const rate = rates.find(r => weight <= r.maxWeight)
  return rate ? rate.price : null
}

/**
 * Calcule tous les frais de livraison disponibles
 * @param {Array} items - Articles du panier
 * @param {string} country - Pays de livraison
 * @param {string} postalCode - Code postal
 * @returns {Array} - Options de livraison avec prix
 */
export const calculateShippingOptions = (items, country = 'France', postalCode = '') => {
  const weight = calculateCartWeight(items)
  const zone = getShippingZone(country, postalCode)

  return SHIPPING_OPTIONS.map(option => {
    const price = getCarrierRate(option.id, weight, zone)

    return {
      ...option,
      price,
      available: price !== null,
      zone,
      weight
    }
  }).filter(option => option.available)
}

/**
 * Calcule les frais pour une méthode spécifique
 * @param {string} method - Méthode de livraison
 * @param {Array} items - Articles du panier
 * @param {string} country - Pays
 * @param {string} postalCode - Code postal
 * @returns {number} - Prix de livraison
 */
export const calculateShippingCost = (method, items, country = 'France', postalCode = '') => {
  const weight = calculateCartWeight(items)
  const zone = getShippingZone(country, postalCode)

  const price = getCarrierRate(method, weight, zone)
  return price || 0
}

/**
 * Vérifie si la livraison gratuite s'applique
 * @param {number} subtotal - Sous-total du panier
 * @param {number} threshold - Seuil pour la livraison gratuite
 * @returns {boolean}
 */
export const isFreeShipping = (subtotal, threshold = 80) => {
  return subtotal >= threshold
}

/**
 * Seuil de livraison gratuite
 */
export const FREE_SHIPPING_THRESHOLD = 80 // €

/**
 * Obtient le message de livraison gratuite
 * @param {number} subtotal - Sous-total actuel
 * @returns {Object} - { isFree, remaining, message }
 */
export const getFreeShippingMessage = (subtotal) => {
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal

  if (remaining <= 0) {
    return {
      isFree: true,
      remaining: 0,
      message: '🚚✨ 🎉 Livraison gratuite !'
    }
  }

  return {
    isFree: false,
    remaining: Number(remaining.toFixed(2)),
    message: `🚚 Plus que ${remaining.toFixed(2)}€ pour la livraison gratuite !`
  }
}

export default {
  SHIPPING_OPTIONS,
  FREE_SHIPPING_THRESHOLD,
  calculateCartWeight,
  calculateShippingOptions,
  calculateShippingCost,
  getShippingZone,
  isFreeShipping,
  getFreeShippingMessage
}
