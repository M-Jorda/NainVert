import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// Configuration Firebase
// ⚠️ IMPORTANT: Remplace ces valeurs par celles de ton projet Firebase
// Tu les trouveras dans: Console Firebase > Paramètres du projet > Applications
const firebaseConfig = {
  apiKey: "AIzaSyCVYNc5nhSpjxyKtyTkG5HrQ3LA3vVCDn8",
  authDomain: "nainvert-2561c.firebaseapp.com",
  projectId: "nainvert-2561c",
  storageBucket: "nainvert-2561c.firebasestorage.app",
  messagingSenderId: "16726954023",
  appId: "1:16726954023:web:99ba7c15d4aecc7c4d7e02",
  measurementId: "G-PH2TWG5E8C"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig)

// Services Firebase
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)

export default app
