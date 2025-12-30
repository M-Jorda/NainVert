/**
 * Service Stripe pour NainVert
 * Gère l'intégration avec Stripe pour les paiements
 */

import { loadStripe } from '@stripe/stripe-js'

// Clé publique Stripe (mode test)
// ⚠️ Remplacer par votre vraie clé pk_test_... 
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_VOTRE_CLE_ICI'

// Instance Stripe (lazy loaded)
let stripePromise = null

/**
 * Récupère l'instance Stripe (singleton)
 * @returns {Promise<Stripe>}
 */
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY)
  }
  return stripePromise
}

/**
 * Formate un montant en centimes pour Stripe
 * @param {number} amount - Montant en euros
 * @returns {number} - Montant en centimes
 */
export const formatAmountForStripe = (amount) => {
  return Math.round(amount * 100)
}

/**
 * Formate un montant de centimes vers euros
 * @param {number} cents - Montant en centimes
 * @returns {number} - Montant en euros
 */
export const formatAmountFromStripe = (cents) => {
  return cents / 100
}

/**
 * Vérifie si Stripe est correctement configuré
 * @returns {boolean}
 */
export const isStripeConfigured = () => {
  const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  return key && key.startsWith('pk_') && key !== 'pk_test_VOTRE_CLE_ICI'
}

export default {
  getStripe,
  formatAmountForStripe,
  formatAmountFromStripe,
  isStripeConfigured
}
