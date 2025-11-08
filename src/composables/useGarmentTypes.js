export const garmentTypes = {
  tshirt: {
    id: 'tshirt',
    name: 'T-Shirt',
    namePlural: 'T-Shirts',
    icon: '👕',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    details: {
      material: '100% Coton*',
      weight: '180-220g/m²',
      fit: 'Coupe régulière ou oversize',
      care: 'Lavage machine à 30°C, séchage à l\'air libre'
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
    name: 'Pull / Hoodie',
    namePlural: 'Pulls / Hoodies',
    icon: '🧥',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    details: {
      material: '80% Coton, 20% Polyester',
      weight: '300-320g/m²',
      fit: 'Coupe régulière',
      care: 'Lavage machine à 30°C, séchage à l\'air libre'
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
    garmentTypes,
    getTypeById,
    getAllTypes,
    getTypeLabel,
    getTypeIcon
  }
}
