import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config'

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

export function isFirebaseReady() {
  return isFirebaseConfigured && auth !== null
}





