/**
 * Composable pour gérer les options de livraison
 * NainVert - Système de livraison
 */

import { ref, computed, watch } from 'vue'
import { 
  calculateShippingOptions, 
  calculateShippingCost,
  getFreeShippingMessage,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_OPTIONS
} from '@/services/shipping'

export function useShipping() {
  // État
  const selectedMethod = ref('colissimo')
  const shippingCountry = ref('France')
  const shippingPostalCode = ref('')
  const loading = ref(false)
  
  /**
   * Calcule les options de livraison pour un panier
   * @param {Array} items - Articles du panier
   * @returns {Array} - Options disponibles avec prix
   */
  const getShippingOptions = (items) => {
    if (!items || items.length === 0) return []
    
    return calculateShippingOptions(
      items, 
      shippingCountry.value, 
      shippingPostalCode.value
    )
  }
  
  /**
   * Calcule le coût de livraison pour la méthode sélectionnée
   * @param {Array} items - Articles du panier
   * @returns {number} - Coût de livraison
   */
  const getShippingCost = (items) => {
    if (!items || items.length === 0) return 0
    
    return calculateShippingCost(
      selectedMethod.value,
      items,
      shippingCountry.value,
      shippingPostalCode.value
    )
  }
  
  /**
   * Vérifie si la livraison est gratuite
   * @param {number} subtotal - Sous-total du panier
   * @returns {Object} - { isFree, remaining, message }
   */
  const checkFreeShipping = (subtotal) => {
    return getFreeShippingMessage(subtotal)
  }
  
  /**
   * Sélectionne une méthode de livraison
   * @param {string} method - ID de la méthode
   */
  const selectMethod = (method) => {
    selectedMethod.value = method
  }
  
  /**
   * Met à jour l'adresse de livraison
   * @param {Object} address - { country, postalCode }
   */
  const updateAddress = (address) => {
    if (address.country) shippingCountry.value = address.country
    if (address.postalCode) shippingPostalCode.value = address.postalCode
  }
  
  /**
   * Obtient les infos de la méthode sélectionnée
   */
  const selectedMethodInfo = computed(() => {
    return SHIPPING_OPTIONS.find(opt => opt.id === selectedMethod.value) || null
  })
  
  /**
   * Réinitialise les options
   */
  const reset = () => {
    selectedMethod.value = 'colissimo'
    shippingCountry.value = 'France'
    shippingPostalCode.value = ''
  }
  
  return {
    // État
    selectedMethod,
    shippingCountry,
    shippingPostalCode,
    loading,
    
    // Constantes
    FREE_SHIPPING_THRESHOLD,
    SHIPPING_OPTIONS,
    
    // Computed
    selectedMethodInfo,
    
    // Actions
    getShippingOptions,
    getShippingCost,
    checkFreeShipping,
    selectMethod,
    updateAddress,
    reset
  }
}
