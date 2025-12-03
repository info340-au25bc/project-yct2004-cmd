import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { subscribeToAuthState, isFirebaseReady } from './utils/auth'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './components/Login'
import Home from './pages/Home'
import QuizPage from './pages/QuizPage'
import Proposal from './pages/Proposal'
import GroupCreation from './pages/GroupCreation'
import Resources from './pages/Resources'
import Ranking from './pages/Ranking'
import TestQuestions from './pages/TestQuestions'
import Forum from './pages/Forum'
import DiscussionDetail from './pages/DiscussionDetail'

// Protected Route Component
function ProtectedRoute({ children, currentUser }) {
  return currentUser ? children : <Navigate to="/login" />
}

function AppRoutes({ currentUser, firebaseReady, onSignIn, onLogout }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz" element={<QuizPage currentUser={currentUser} />} />
      <Route path="/quiz/:quizId" element={<QuizPage currentUser={currentUser} />} />
      <Route 
        path="/forum" 
        element={
          <ProtectedRoute currentUser={currentUser}>
            <Forum currentUser={currentUser} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/forum/discussion/:id" 
        element={
          <ProtectedRoute currentUser={currentUser}>
            <DiscussionDetail currentUser={currentUser} />
          </ProtectedRoute>
        } 
      />
      <Route path="/proposal" element={<Proposal />} />
      <Route 
        path="/login" 
        element={
          <Login 
            currentUser={currentUser} 
            firebaseReady={firebaseReady}
            onSignIn={onSignIn}
          />
        } 
      />
      <Route 
        path="/groups" 
        element={
          <ProtectedRoute currentUser={currentUser}>
            <GroupCreation currentUser={currentUser} />
          </ProtectedRoute>
        } 
      />
      <Route path="/resources" element={<Resources currentUser={currentUser} />} />
      <Route path="/ranking" element={<Ranking currentUser={currentUser} />} />
      <Route 
        path="/testquestions" 
        element={
          <ProtectedRoute currentUser={currentUser}>
            <TestQuestions currentUser={currentUser} />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

export default function App(){
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [firebaseReady, setFirebaseReady] = useState(false)

  // Check Firebase configuration
  useEffect(() => {
    const ready = isFirebaseReady()
    setFirebaseReady(ready)
    if (ready) {
      console.log('✅ Firebase is ready in App component')
    } else {
      console.warn('⚠️ Firebase is NOT ready in App component')
    }
  }, [])

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Sign in handler
  async function handleSignIn() {
    // This will be called from Login component
    // Auth state will update automatically via subscribeToAuthState
  }

  // Logout handler
  async function handleLogout() {
    const { logout } = await import('./utils/auth')
    try {
      await logout()
      // Auth state will update automatically via subscribeToAuthState
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  if (loading) {
    return (
      <div className="app-root">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem'
        }}>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="app-root">
        <Header 
          currentUser={currentUser} 
          firebaseReady={firebaseReady}
          onLogout={handleLogout}
        />
        <AppRoutes 
          currentUser={currentUser}
          firebaseReady={firebaseReady}
          onSignIn={handleSignIn}
          onLogout={handleLogout}
        />
        <Footer />
      </div>
    </BrowserRouter>
  )
}
