// Authentication utility functions (no Context API)
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config'

// Sign in with Google
export async function signInWithGoogle() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error('Firebase is not configured. Please set up Firebase first.')
  }

  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error) {
    console.error('Error signing in with Google:', error)
    if (error.code) {
      error.message = `${error.message} (${error.code})`
    }
    throw error
  }
}

// Sign out
export async function logout() {
  if (!isFirebaseConfigured || !auth) {
    return
  }

  try {
    await signOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

// Subscribe to auth state changes
export function subscribeToAuthState(callback) {
  if (!isFirebaseConfigured || !auth) {
    callback(null)
    return () => {}
  }

  return onAuthStateChanged(auth, callback, (error) => {
    console.error('Auth state change error:', error)
    callback(null)
  })
}

// Check if Firebase is ready
export function isFirebaseReady() {
  return isFirebaseConfigured && auth !== null
}





