import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDA80Xrsp8Z4Zt54EP7dV_NQxIPCj25zsA",
  authDomain: "info340-final-project-74082.firebaseapp.com",
  projectId: "info340-final-project-74082",
  storageBucket: "info340-final-project-74082.firebasestorage.app",
  messagingSenderId: "74694856180",
  appId: "1:74694856180:web:b9f3964e69958b89c1fda1",
  measurementId: "G-25TD8VG3NJ",
  databaseURL: "https://info340-final-project-74082-default-rtdb.firebaseio.com/"
}

const isFirebaseConfigured = firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== "YOUR_PROJECT_ID"

let app = null
let auth = null
let googleProvider = null
let db = null

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    googleProvider = new GoogleAuthProvider()
    googleProvider.addScope('profile')
    googleProvider.addScope('email')
    db = getDatabase(app)
    console.log('✅ Firebase initialized successfully!')
    console.log('📊 Database URL:', firebaseConfig.databaseURL)
    console.log('🔗 Database connection:', db ? 'Connected' : 'Not connected')
  } catch (error) {
    console.error('❌ Firebase initialization error:', error)
    console.warn('Firebase initialization failed. Authentication will not work.')
  }
} else {
  console.warn('⚠️ Firebase not configured. Please set up Firebase following FIREBASE_SETUP.md')
  console.warn('Authentication features will not work until Firebase is configured.')
}

export { auth, googleProvider, db, isFirebaseConfigured }
export default app