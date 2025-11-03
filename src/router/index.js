import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Products from '@/pages/Products.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import Contact from '@/pages/Contact.vue'
import Admin from '@/pages/Admin.vue'
import Honeypot from '@/pages/Honeypot.vue'
import NotFound from '@/pages/NotFound.vue'
import Shipping from '@/pages/Shipping.vue'
import Returns from '@/pages/Returns.vue'
import Terms from '@/pages/Terms.vue'
import Legal from '@/pages/Legal.vue'
import DevTools from '@/pages/DevTools.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'NainVert - Streetwear Psychédélique',
      description: 'Découvrez notre collection exclusive de vêtements streetwear psychédéliques'
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: {
      title: 'Nos Articles - NainVert',
      description: 'Parcourez notre collection de t-shirts et pulls psychédéliques'
    }
  },
  {
    path: '/products/:slug',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: {
      title: 'Produit - NainVert'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: {
      title: 'Contact - NainVert',
      description: 'Contactez-nous pour toute question ou suggestion'
    }
  },
  {
    path: '/rho',
    name: 'RealAdmin',
    component: Admin,
    meta: {
      title: 'NainVert - Administration'
    }
  },
  {
    path: '/admin',
    name: 'Honeypot',
    component: Honeypot,
    meta: {
      title: 'Admin Panel - NainVert'
    }
  },
  {
    path: '/dev-tools',
    name: 'DevTools',
    component: DevTools,
    meta: {
      title: 'Dev Tools - NainVert'
    }
  },
  {
    path: '/shipping',
    name: 'Shipping',
    component: Shipping,
    meta: {
      title: 'Livraison - NainVert',
      description: 'Informations sur les délais et frais de livraison'
    }
  },
  {
    path: '/returns',
    name: 'Returns',
    component: Returns,
    meta: {
      title: 'Retours & Remboursements - NainVert',
      description: 'Conditions de retour et remboursement'
    }
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms,
    meta: {
      title: 'CGV - NainVert',
      description: 'Conditions Générales de Vente'
    }
  },
  {
    path: '/legal',
    name: 'Legal',
    component: Legal,
    meta: {
      title: 'Mentions Légales - NainVert',
      description: 'Mentions légales et protection des données'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '404 - Page non trouvée - NainVert',
      description: 'Cette page n\'existe pas'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Update document title and meta tags
router.beforeEach((to, from, next) => {
  // Update title
  const title = to.meta.title || 'NainVert'
  document.title = title

  // Update meta description
  const description = to.meta.description
  if (description) {
    let descriptionMeta = document.querySelector('meta[name="description"]')
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', description)
    } else {
      descriptionMeta = document.createElement('meta')
      descriptionMeta.name = 'description'
      descriptionMeta.content = description
      document.head.appendChild(descriptionMeta)
    }
  }

  next()
})

export default router
