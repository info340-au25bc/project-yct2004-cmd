import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import QuizPage from './pages/QuizPage'
import Proposal from './pages/Proposal'
import GroupCreation from './pages/GroupCreation'
import Resources from './pages/Resources'
import Ranking from './pages/Ranking'
import TestQuestions from './pages/TestQuestions'
import '../project-draft/style.css'
import '../project-draft/css/proposal.css'

export default function App(){
  return (
    <BrowserRouter>
      <div className="app-root">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/proposal" element={<Proposal />} />
          <Route path="/groups" element={<GroupCreation />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/testquestions" element={<TestQuestions />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
