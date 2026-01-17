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
      return total + ((item.price ?? 0) * (item.quantity ?? 0))
    }, 0)
  })

  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  function addItem(itemOrProduct, size = null) {
    // Nouveau format : si c'est déjà un objet item complet (depuis SizeSelector)
    if (itemOrProduct.designId && itemOrProduct.type) {
      const existingItem = items.value.find(
        item => item.id === itemOrProduct.id
      )

      if (existingItem) {
        existingItem.quantity++
      } else {
        items.value.push({
          ...itemOrProduct,
          quantity: itemOrProduct.quantity || 1
        })
      }

      console.log(`${itemOrProduct.designName} - ${itemOrProduct.type === 'tshirt' ? 'T-Shirt' : 'Hoodie'} (${itemOrProduct.size}) ajouté au panier`)
      return
    }

    // Ancien format : product + size (rétrocompatibilité)
    const product = itemOrProduct
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
        image: product.images?.[0] ?? null,
        size: size,
        quantity: 1,
        designId: product.designId || product.design || null
      })
    }

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

  function updateItem(oldId, oldSize, updates) {
    const index = items.value.findIndex(
      item => item.id === oldId && item.size === oldSize
    )

    if (index === -1) return false

    const oldItem = items.value[index]
    const newId = `${oldItem.designSlug}-${updates.type || oldItem.type}-${updates.size || oldItem.size}`

    // Check if an item with the new configuration already exists
    const existingIndex = items.value.findIndex(
      item => item.id === newId && item.size === (updates.size || oldItem.size)
    )

    if (existingIndex !== -1 && existingIndex !== index) {
      // Merge quantities if item with same config exists
      items.value[existingIndex].quantity += updates.quantity || oldItem.quantity
      items.value.splice(index, 1)
    } else {
      // Update the item
      items.value[index] = {
        ...oldItem,
        ...updates,
        id: newId
      }
    }

    return true
  }

  function clearCart() {
    items.value = []
  }

  /**
   * Retire les articles en rupture de stock du panier
   * @param {Function} getStockQuantity - Fonction pour obtenir la quantité en stock
   * @returns {Array} - Liste des articles retirés
   */
  function removeOutOfStockItems(getStockQuantity) {
    const removedItems = []

    items.value = items.value.filter(item => {
      const designId = item.designSlug || item.designId
      if (!designId) return true // Garder les items sans designId

      const stockQty = getStockQuantity(designId)
      if (stockQty <= 0) {
        removedItems.push(item)
        return false // Retirer du panier
      }
      return true // Garder dans le panier
    })

    if (removedItems.length > 0) {
      console.log(`🗑️ ${removedItems.length} article(s) retiré(s) du panier (rupture de stock)`)
    }

    return removedItems
  }

  /**
   * Vérifie si tous les articles du panier sont en stock
   * @param {Function} getStockQuantity - Fonction pour obtenir la quantité en stock
   * @returns {Object} - { allInStock: boolean, outOfStockItems: Array }
   */
  function validateCartStock(getStockQuantity) {
    const outOfStockItems = []

    items.value.forEach(item => {
      const designId = item.designSlug || item.designId
      if (!designId) return

      const stockQty = getStockQuantity(designId)
      if (stockQty < item.quantity) {
        outOfStockItems.push({
          ...item,
          availableStock: stockQty
        })
      }
    })

    return {
      allInStock: outOfStockItems.length === 0,
      outOfStockItems
    }
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
    updateItem,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    removeOutOfStockItems,
    validateCartStock,
    toggleCart,
    openCart,
    closeCart
  }
})

// Alias pour compatibilité
export const useCart = useCartStore
