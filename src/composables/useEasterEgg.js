import { ref } from 'vue'

// Contenu des easter eggs
export const easterEggContents = {
  nainVert: {
    icon: '🍀',
    title: 'Le Nain Vert',
    text: 'Dans un monde de géants, les nains verts sont ceux qui osent être différents. Ils portent leur couleur avec fierté, symbole d\'une nature libre et sauvage.',
    author: 'Légende NainVert'
  },
  
  psychedelic: {
    icon: '🌈',
    title: 'Conscience Élevée',
    text: 'La réalité n\'est qu\'une illusion, certes très persistante. Ouvre ton esprit aux couleurs que tu ne vois pas encore.',
    author: 'Albert Einstein (adapté)'
  },
  
  freedom: {
    icon: '🦋',
    title: 'Liberté',
    text: 'Tu es libre au moment où tu ne cherches plus à l\'extérieur ce que tu peux être à l\'intérieur.',
    author: null
  },
  
  energy: {
    icon: '⚡',
    title: 'Énergie Vitale',
    text: 'Tout est énergie, et c\'est tout ce qu\'il y a à comprendre dans la vie. Aligne-toi à la fréquence de la réalité que tu souhaites et cette réalité se manifestera.',
    author: 'Nikola Tesla (adapté)'
  },
  
  nature: {
    icon: '🌿',
    title: 'Retour aux Sources',
    text: 'Dans chaque promenade dans la nature, on reçoit bien plus que ce que l\'on cherche. Le vert est la couleur de l\'espoir, de la renaissance.',
    author: 'John Muir (adapté)'
  },
  
  creativity: {
    icon: '🎨',
    title: 'Créativité Infinie',
    text: 'La créativité, c\'est l\'intelligence qui s\'amuse. Laisse ton imagination danser avec les couleurs psychédéliques de ton esprit.',
    author: null
  },
  
  rebel: {
    icon: '🔥',
    title: 'Esprit Rebelle',
    text: 'Ceux qui sont assez fous pour penser qu\'ils peuvent changer le monde sont ceux qui le font. Sois le nain vert dans un monde de conformité.',
    author: 'Steve Jobs (adapté)'
  },
  
  present: {
    icon: '🧘',
    title: 'Instant Présent',
    text: 'La vie n\'est disponible que dans le moment présent. Respire, tu es vivant. Le vert autour de toi est le souffle de la Terre.',
    author: 'Thich Nhat Hanh (adapté)'
  },
  
  dream: {
    icon: '💫',
    title: 'Rêve Lucide',
    text: 'Nous sommes les rêveurs de rêves. Le streetwear n\'est pas qu\'un vêtement, c\'est une déclaration de ton monde intérieur.',
    author: null
  },
  
  cosmic: {
    icon: '🌌',
    title: 'Connexion Cosmique',
    text: 'Tu n\'es pas une goutte dans l\'océan, tu es l\'océan tout entier dans une goutte. Chaque fil de ton vêtement porte l\'énergie de l\'univers.',
    author: 'Rumi (adapté)'
  }
}

export function useEasterEgg() {
  const isModalOpen = ref(false)
  const currentContent = ref(easterEggContents.nainVert)

  const openEasterEgg = (contentKey) => {
    if (easterEggContents[contentKey]) {
      currentContent.value = easterEggContents[contentKey]
      isModalOpen.value = true
    }
  }

  const closeEasterEgg = () => {
    isModalOpen.value = false
  }

  return {
    isModalOpen,
    currentContent,
    openEasterEgg,
    closeEasterEgg
  }
}
