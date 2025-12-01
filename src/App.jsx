import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
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
import './App.css'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()
  return currentUser ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route 
            path="/forum" 
            element={
              <ProtectedRoute>
                <Forum />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forum/discussion/:id" 
            element={
              <ProtectedRoute>
                <DiscussionDetail />
              </ProtectedRoute>
            } 
          />
      <Route path="/proposal" element={<Proposal />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/groups" 
        element={
          <ProtectedRoute>
            <GroupCreation />
          </ProtectedRoute>
        } 
      />
      <Route path="/resources" element={<Resources />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route 
        path="/testquestions" 
        element={
          <ProtectedRoute>
            <TestQuestions />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-root">
          <Header />
          <AppRoutes />
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
