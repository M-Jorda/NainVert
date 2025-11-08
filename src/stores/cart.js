import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'nainvert-cart'

export const useCartStore = defineStore('cart', () => {
  // Charger le panier depuis localStorage au démarrage
  const loadCartFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error)
      return []
    }
  }

  // Sauvegarder le panier dans localStorage
  const saveCartToStorage = (cartItems) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du panier:', error)
    }
  }

  // State
  const items = ref(loadCartFromStorage())
  const isOpen = ref(false)

  // Watcher pour sauvegarder automatiquement le panier
  watch(items, (newItems) => {
    saveCartToStorage(newItems)
  }, { deep: true })

  // Getters
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  function addItem(product, size) {
    const existingItem = items.value.find(
      item => item.id === product.id && item.size === size
    )

    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0],
        size: size,
        quantity: 1,
        designId: product.designId || product.design || null // Ajout du designId pour la gestion du stock
      })
    }

    // Notification de succès (peut être remplacé par un toast)
    console.log(`${product.name} ajouté au panier`)
  }

  function removeItem(itemId, size) {
    const index = items.value.findIndex(
      item => item.id === itemId && item.size === size
    )
    
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(itemId, size, quantity) {
    const item = items.value.find(
      item => item.id === itemId && item.size === size
    )

    if (item) {
      if (quantity <= 0) {
        removeItem(itemId, size)
      } else {
        item.quantity = quantity
      }
    }
  }

  function incrementQuantity(itemId, size) {
    const item = items.value.find(
      item => item.id === itemId && item.size === size
    )
    
    if (item) {
      item.quantity++
    }
  }

  function decrementQuantity(itemId, size) {
    const item = items.value.find(
      item => item.id === itemId && item.size === size
    )
    
    if (item) {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        removeItem(itemId, size)
      }
    }
  }

  function clearCart() {
    items.value = []
  }

  function toggleCart() {
    isOpen.value = !isOpen.value
  }

  function openCart() {
    isOpen.value = true
  }

  function closeCart() {
    isOpen.value = false
  }

  return {
    // State
    items,
    isOpen,
    
    // Getters
    itemCount,
    totalPrice,
    isEmpty,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart
  }
})
