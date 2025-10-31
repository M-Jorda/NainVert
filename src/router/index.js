import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Products from '@/pages/Products.vue'
import ProductDetail from '@/pages/ProductDetail.vue'
import Contact from '@/pages/Contact.vue'
import Admin from '@/pages/Admin.vue'

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
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      title: 'Admin Panel - NainVert'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
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
