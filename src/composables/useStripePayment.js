/**
 * Composable pour gérer les paiements Stripe
 * NainVert - Système de paiement
 */

import { ref, computed } from 'vue'
import { getStripe, formatAmountForStripe, isStripeConfigured } from '@/services/stripe'

// État global du paiement
const paymentLoading = ref(false)
const paymentError = ref(null)
const paymentSuccess = ref(false)
const paymentIntentId = ref(null)
const clientSecret = ref(null)

export function useStripePayment() {
  
  /**
   * Crée un PaymentIntent côté serveur (via Firebase Function)
   * @param {Object} params
   * @param {number} params.amount - Montant en euros
   * @param {string} params.orderId - ID de la commande
   * @param {Object} params.customer - Infos client
   * @returns {Promise<{clientSecret: string, paymentIntentId: string}>}
   */
  const createPaymentIntent = async ({ amount, orderId, customer }) => {
    paymentLoading.value = true
    paymentError.value = null
    
    try {
      // URL de votre Firebase Cloud Function
      // ⚠️ À remplacer par l'URL de votre fonction déployée
      const FUNCTION_URL = import.meta.env.VITE_STRIPE_FUNCTION_URL || 
        'https://us-central1-VOTRE_PROJECT_ID.cloudfunctions.net/createPaymentIntent'
      
      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: formatAmountForStripe(amount), // En centimes
          currency: 'eur',
          orderId,
          customer: {
            email: customer.email,
            name: customer.name
          },
          metadata: {
            orderId,
            customerEmail: customer.email
          }
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la création du paiement')
      }
      
      const data = await response.json()
      
      clientSecret.value = data.clientSecret
      paymentIntentId.value = data.paymentIntentId
      
      return {
        clientSecret: data.clientSecret,
        paymentIntentId: data.paymentIntentId
      }
      
    } catch (err) {
      console.error('❌ Erreur création PaymentIntent:', err)
      paymentError.value = err.message
      throw err
    } finally {
      paymentLoading.value = false
    }
  }
  
  /**
   * Confirme le paiement avec les éléments Stripe
   * @param {Object} params
   * @param {Object} params.elements - Stripe Elements instance
   * @param {string} params.returnUrl - URL de retour après 3D Secure
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const confirmPayment = async ({ elements, returnUrl }) => {
    paymentLoading.value = true
    paymentError.value = null
    
    try {
      const stripe = await getStripe()
      
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl || window.location.origin + '/confirmation'
        },
        redirect: 'if_required' // Ne redirige que si 3D Secure est requis
      })
      
      if (error) {
        // Erreur Stripe (carte refusée, etc.)
        paymentError.value = translateStripeError(error)
        return { success: false, error: paymentError.value }
      }
      
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        paymentSuccess.value = true
        return { 
          success: true, 
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status
        }
      }
      
      // Paiement en cours (3D Secure, etc.)
      return { 
        success: false, 
        requiresAction: true,
        status: paymentIntent?.status 
      }
      
    } catch (err) {
      console.error('❌ Erreur confirmation paiement:', err)
      paymentError.value = err.message
      return { success: false, error: err.message }
    } finally {
      paymentLoading.value = false
    }
  }
  
  /**
   * Traduit les erreurs Stripe en français
   * @param {Object} error - Erreur Stripe
   * @returns {string}
   */
  const translateStripeError = (error) => {
    const translations = {
      'card_declined': 'Votre carte a été refusée',
      'expired_card': 'Votre carte a expiré',
      'incorrect_cvc': 'Le code de sécurité est incorrect',
      'processing_error': 'Erreur de traitement. Veuillez réessayer.',
      'incorrect_number': 'Le numéro de carte est incorrect',
      'invalid_expiry_month': 'Le mois d\'expiration est invalide',
      'invalid_expiry_year': 'L\'année d\'expiration est invalide',
      'insufficient_funds': 'Fonds insuffisants sur la carte',
      'authentication_required': 'Authentification requise (3D Secure)'
    }
    
    return translations[error.code] || error.message || 'Une erreur est survenue'
  }
  
  /**
   * Réinitialise l'état du paiement
   */
  const resetPayment = () => {
    paymentLoading.value = false
    paymentError.value = null
    paymentSuccess.value = false
    paymentIntentId.value = null
    clientSecret.value = null
  }
  
  /**
   * Vérifie si Stripe est configuré
   */
  const stripeReady = computed(() => isStripeConfigured())
  
  return {
    // État
    paymentLoading,
    paymentError,
    paymentSuccess,
    paymentIntentId,
    clientSecret,
    stripeReady,
    
    // Actions
    createPaymentIntent,
    confirmPayment,
    resetPayment,
    translateStripeError
  }
}
