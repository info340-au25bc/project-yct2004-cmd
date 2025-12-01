import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [firebaseReady, setFirebaseReady] = useState(false)

  // Check Firebase configuration
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      setFirebaseReady(true)
    } else {
      setFirebaseReady(false)
      setLoading(false)
      console.warn('Firebase is not configured. Authentication features will not work.')
    }
  }, [])

  // Sign in with Google
  async function signInWithGoogle() {
    if (!firebaseReady || !auth || !googleProvider) {
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
  async function logout() {
    if (!firebaseReady || !auth) {
      setCurrentUser(null)
      return
    }

    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  useEffect(() => {
    if (!firebaseReady || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    }, (error) => {
      console.error('Auth state change error:', error)
      setLoading(false)
    })

    return unsubscribe
  }, [firebaseReady])

  const value = {
    currentUser,
    signInWithGoogle,
    logout,
    firebaseReady
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}


