import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

export default function Login() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle, currentUser, firebaseReady } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
      useEffect(() => {
        if (currentUser) {
          navigate('/forum')
        }
      }, [currentUser, navigate])

  async function handleGoogleSignIn(e) {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      
      // Check if Firebase is ready
      if (!firebaseReady) {
        throw new Error('Firebase is not configured. Please set up Firebase first.')
      }
      
      await signInWithGoogle()
      // Navigation will happen automatically via useEffect when currentUser updates
      setTimeout(() => {
        navigate('/forum')
      }, 100)
    } catch (err) {
      console.error('Sign in error:', err)
      
      // Provide helpful error messages
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.')
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups for this site and try again.')
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized. Please add localhost to Firebase authorized domains (Authentication > Settings).')
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is not enabled. Please enable it in Firebase Console (Authentication > Sign-in method > Google).')
      } else if (err.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.' || err.code === 'auth/invalid-api-key' || (err.message && err.message.includes('api-key-not-valid'))) {
        setError('API key is not valid. Please check: 1) Enable Google sign-in in Firebase, 2) Add localhost to authorized domains, 3) Check API key restrictions in Google Cloud Console.')
      } else if (err.message && err.message.includes('Firebase is not configured')) {
        setError('Firebase is not configured. Please check your Firebase configuration.')
      } else {
        const errorMsg = err.message || 'Unknown error occurred'
        const errorCode = err.code ? ` (${err.code})` : ''
        setError(`Failed to sign in: ${errorMsg}${errorCode}. Check browser console for details.`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to CyberLearn</h2>
        <p>Sign in with your Google account to continue</p>
        
        {!firebaseReady && (
          <div className="warning-message">
            <strong>⚠️ Firebase Not Configured</strong>
            <p>To enable sign-in, please set up Firebase following the instructions in your Firebase Console.</p>
            <p>For now, you can browse the site, but authentication features won't work.</p>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        <button
          onClick={handleGoogleSignIn}
          disabled={loading || !firebaseReady}
          className="btn btn-google"
        >
          {loading ? (
            'Signing in...'
          ) : (
            <>
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>
        
        <p className="login-footer">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}


