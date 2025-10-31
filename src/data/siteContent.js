// Contenu éditable du site (chargé depuis localStorage ou défauts)

export const defaultSiteContent = {
  // Page d'accueil
  home: {
    hero: {
      title: 'NAIN VERT',
      subtitle: 'Streetwear Psychédélique pour Esprits Libres',
      description: 'Plongez dans une dimension où le style rencontre l\'inattendu. Collection exclusive de vêtements qui défient les codes.',
      ctaPrimary: 'Découvrir la collection',
      ctaSecondary: 'Suivez-nous'
    },
    featuredSection: {
      title: 'Nos Pièces Phares',
      subtitle: 'Découvrez nos créations les plus audacieuses'
    },
    aboutSection: {
      title: 'À Propos de NainVert',
      text: 'NainVert est né d\'une vision : créer des vêtements qui transcendent les codes du streetwear classique. Chaque pièce est pensée comme une œuvre d\'art portable, un statement pour ceux qui osent se démarquer.'
    },
    communitySection: {
      title: 'Rejoignez la Tribu',
      text: 'Suivez-nous sur Instagram pour découvrir nos coulisses, nos nouveautés et participer à notre communauté.',
      ctaText: '@nainvert'
    }
  },

  // Page Contact
  contact: {
    title: 'Contactez-nous',
    subtitle: 'Une question ? Une suggestion ? Besoin d\'aide ? Notre équipe est là pour vous répondre.',
    email: 'contact@nainvert.com',
    instagram: '@nainvert',
    instagramUrl: 'https://instagram.com/nainvert',
    hours: 'Lun - Ven: 9h - 18h',
    socialTitle: 'Suivez-nous',
    socialText: 'Rejoignez notre communauté pour ne rien manquer de nos nouveautés',
    formSubmitButton: 'Envoyer le message',
    successMessage: '✓ Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
    errorMessage: '✗ Une erreur est survenue. Veuillez réessayer plus tard.'
  },

  // Footer
  footer: {
    description: 'Streetwear psychédélique pour esprits libres.',
    instagramUrl: 'https://instagram.com/nainvert',
    copyright: 'NainVert. Tous droits réservés.',
    madeWith: 'Made with ♥ by passionate creators',
    navigation: [
      { label: 'Accueil', path: '/' },
      { label: 'Articles', path: '/products' },
      { label: 'Contact', path: '/contact' }
    ],
    info: [
      { label: 'Livraison', link: '#' },
      { label: 'Retours', link: '#' },
      { label: 'CGV', link: '#' },
      { label: 'Mentions légales', link: '#' }
    ],
    newsletterTitle: 'Newsletter',
    newsletterText: 'Restez informé des nouveautés et drops exclusifs.',
    newsletterButton: 'S\'inscrire'
  }
}

// Fonction pour charger le contenu depuis localStorage
export function loadSiteContent() {
  const stored = localStorage.getItem('nainvert_content')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error('Erreur lors du chargement du contenu', e)
    }
  }
  return defaultSiteContent
}

// Fonction pour sauvegarder le contenu
export function saveSiteContent(content) {
  localStorage.setItem('nainvert_content', JSON.stringify(content))
}

// Export du contenu actuel
export const siteContent = loadSiteContent()
