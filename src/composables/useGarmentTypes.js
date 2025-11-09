import { ref } from 'vue'

export const garmentTypes = {
  tshirt: {
    id: 'tshirt',
    name: 'T-Shirt',
    namePlural: 'T-Shirts',
    icon: '👕',
    basePrice: 20, // Prix de base du T-shirt
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    details: {
      material: '100% Coton bio certifié',
      weight: '180-220 g/m²',
      fit: 'Coupe régulière unisexe',
      care: 'Lavage machine 30°C, séchage air libre'
    },
    description: 'T-shirt premium en coton avec impression haute qualité. Confortable et durable.',
    features: [
      'Coton premium certifié',
      'Impression résistante aux lavages',
      'Col renforcé',
      'Coupe adaptée au streetwear'
    ]
  },
  hoodie: {
    id: 'hoodie',
    name: 'Hoodie',
    namePlural: 'Hoodies',
    icon: '🧥',
    basePrice: 55, // Prix de base du Hoodie
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    details: {
      material: '80% Coton, 20% Polyester',
      weight: '300-320 g/m²',
      fit: 'Coupe régulière avec capuche',
      care: 'Lavage machine 30°C, séchage air libre'
    },
    description: 'Pull à capuche premium avec doublure douce. Parfait pour les saisons fraîches.',
    features: [
      'Intérieur molletonné doux',
      'Capuche doublée',
      'Poche kangourou',
      'Bords côtelés résistants'
    ]
  }
}

export function useGarmentTypes() {
  
  const getTypeById = (typeId) => {
    return garmentTypes[typeId] || null
  }

  const getAllTypes = () => {
    return Object.values(garmentTypes)
  }

  const getTypeLabel = (typeId) => {
    const type = garmentTypes[typeId]
    return type ? type.name : typeId
  }

  const getTypeIcon = (typeId) => {
    const type = garmentTypes[typeId]
    return type ? type.icon : '👔'
  }

  return {
    garmentTypes: ref(garmentTypes), // Retourner comme ref pour la réactivité
    getTypeById,
    getAllTypes,
    getTypeLabel,
    getTypeIcon
  }
}
