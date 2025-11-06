// Fonction pour charger les produits depuis localStorage ou données par défaut
function loadProducts() {
  const stored = localStorage.getItem('nainvert_products')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error('Erreur lors du chargement des produits depuis localStorage', e)
    }
  }
  return defaultProducts
}

const defaultProducts = [
  {
    id: 1,
    name: 'Neon Dreams T-Shirt',
    slug: 'neon-dreams-tshirt',
    type: 'tshirt',
    price: 35,
    description: 'T-shirt premium en coton* avec design psychédélique exclusif. Impression haute qualité qui résiste au temps.',
    images: [
      '/products/tshirt-1-front.jpg',
      '/products/tshirt-1-back.jpg',
      '/products/tshirt-1-detail.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    inStock: true,
    details: {
      material: '100% Coton*',
      weight: '180g/m²',
      fit: 'Coupe régulière',
      care: 'Lavage en machine à 30°C'
    }
  },
  {
    id: 2,
    name: 'Acid Wave T-Shirt',
    slug: 'acid-wave-tshirt',
    type: 'tshirt',
    price: 38,
    description: 'T-shirt oversized avec motif ondulé hypnotique. Design unique qui attire tous les regards.',
    images: [
      '/products/tshirt-2-front.jpg',
      '/products/tshirt-2-back.jpg',
      '/products/tshirt-2-detail.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Noir'],
    inStock: true,
    details: {
      material: '100% Coton*',
      weight: '220g/m²',
      fit: 'Coupe oversize',
      care: 'Lavage en machine à 30°C'
    }
  },
  {
    id: 3,
    name: 'Electric Jungle Hoodie',
    slug: 'electric-jungle-hoodie',
    type: 'hoodie',
    price: 75,
    description: 'Pull à capuche premium avec design jungle électrique. Doublure douce et chaude pour un confort optimal.',
    images: [
      '/products/hoodie-1-front.jpg',
      '/products/hoodie-1-back.jpg',
      '/products/hoodie-1-detail.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Noir', 'Vert foncé'],
    inStock: true,
    details: {
      material: '80% Coton, 20% Polyester',
      weight: '320g/m²',
      fit: 'Coupe régulière',
      care: 'Lavage en machine à 30°C, séchage à l\'air libre'
    }
  },
  {
    id: 4,
    name: 'Cyber Trip Crewneck',
    slug: 'cyber-trip-crewneck',
    type: 'hoodie',
    price: 65,
    description: 'Sweatshirt col rond avec broderie 3D psychédélique. Parfait pour les soirées fraîches.',
    images: [
      '/products/hoodie-2-front.jpg',
      '/products/hoodie-2-back.jpg',
      '/products/hoodie-2-detail.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: ['Noir'],
    inStock: true,
    details: {
      material: '85% Coton, 15% Polyester',
      weight: '300g/m²',
      fit: 'Coupe régulière',
      care: 'Lavage en machine à 30°C'
    }
  }
]

// Export des produits (chargés depuis localStorage ou défauts)
export const products = loadProducts()

// Fonction helper pour obtenir un produit par slug
export function getProductBySlug(slug) {
  const currentProducts = loadProducts()
  return currentProducts.find(product => product.slug === slug)
}

// Fonction helper pour obtenir les produits par type
export function getProductsByType(type) {
  const currentProducts = loadProducts()
  return currentProducts.filter(product => product.type === type)
}

// Fonction helper pour obtenir les produits en vedette
export function getFeaturedProducts() {
  const currentProducts = loadProducts()
  return currentProducts.filter(product => product.featured)
}
