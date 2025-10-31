import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Charger la config Firebase
const configPath = join(__dirname, '../src/config/firebase.js')
const configContent = readFileSync(configPath, 'utf-8')
const firebaseConfigMatch = configContent.match(/const firebaseConfig = ({[\s\S]*?})/m)
const firebaseConfig = eval('(' + firebaseConfigMatch[1] + ')')

// Initialiser Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Easter Eggs à importer
const easterEggs = {
  nainVert: {
    icon: '🍀',
    title: 'Le Nain Vert',
    text: 'Dans un monde de géants, les nains verts sont ceux qui osent être différents. Ils portent leur couleur avec fierté, symbole d\'une nature libre et sauvage.',
    author: 'Légende NainVert',
    active: true,
    order: 1
  },
  
  psychedelic: {
    icon: '🌈',
    title: 'Conscience Élevée',
    text: 'La réalité n\'est qu\'une illusion, certes très persistante. Ouvre ton esprit aux couleurs que tu ne vois pas encore.',
    author: 'Albert Einstein (adapté)',
    active: true,
    order: 2
  },
  
  freedom: {
    icon: '🦋',
    title: 'Liberté',
    text: 'Tu es libre au moment où tu ne cherches plus à l\'extérieur ce que tu peux être à l\'intérieur.',
    author: null,
    active: true,
    order: 3
  },
  
  energy: {
    icon: '⚡',
    title: 'Énergie Vitale',
    text: 'Tout est énergie, et c\'est tout ce qu\'il y a à comprendre dans la vie. Aligne-toi à la fréquence de la réalité que tu souhaites et cette réalité se manifestera.',
    author: 'Nikola Tesla (adapté)',
    active: true,
    order: 4
  },
  
  nature: {
    icon: '🌿',
    title: 'Retour aux Sources',
    text: 'Dans chaque promenade dans la nature, on reçoit bien plus que ce que l\'on cherche. Le vert est la couleur de l\'espoir, de la renaissance.',
    author: 'John Muir (adapté)',
    active: true,
    order: 5
  },
  
  creativity: {
    icon: '🎨',
    title: 'Créativité Infinie',
    text: 'La créativité, c\'est l\'intelligence qui s\'amuse. Laisse ton imagination danser avec les couleurs psychédéliques de ton esprit.',
    author: null,
    active: true,
    order: 6
  },
  
  rebel: {
    icon: '🔥',
    title: 'Esprit Rebelle',
    text: 'Ceux qui sont assez fous pour penser qu\'ils peuvent changer le monde sont ceux qui le font. Sois le nain vert dans un monde de conformité.',
    author: 'Steve Jobs (adapté)',
    active: true,
    order: 7
  },
  
  present: {
    icon: '🧘',
    title: 'Instant Présent',
    text: 'La vie n\'est disponible que dans le moment présent. Respire, tu es vivant. Le vert autour de toi est le souffle de la Terre.',
    author: 'Thich Nhat Hanh (adapté)',
    active: true,
    order: 8
  },
  
  dream: {
    icon: '💫',
    title: 'Rêve Lucide',
    text: 'Nous sommes les rêveurs de rêves. Le streetwear n\'est pas qu\'un vêtement, c\'est une déclaration de ton monde intérieur.',
    author: null,
    active: true,
    order: 9
  },
  
  cosmic: {
    icon: '🌌',
    title: 'Connexion Cosmique',
    text: 'Tu n\'es pas une goutte dans l\'océan, tu es l\'océan tout entier dans une goutte. Chaque fil de ton vêtement porte l\'énergie de l\'univers.',
    author: 'Rumi (adapté)',
    active: true,
    order: 10
  }
}

async function importEasterEggs() {
  console.log('🥚 Import des Easter Eggs vers Firestore...\n')

  try {
    const easterEggsCollection = collection(db, 'easterEggs')
    
    for (const [key, data] of Object.entries(easterEggs)) {
      await setDoc(doc(easterEggsCollection, key), data)
      console.log(`✅ Easter Egg importé: ${key} - ${data.title}`)
    }

    console.log('\n🎉 Import terminé ! 10 Easter Eggs importés.')
    console.log('\n📋 Pour vérifier:')
    console.log('   Firebase Console → Firestore → collection "easterEggs"')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error)
    process.exit(1)
  }
}

importEasterEggs()
