import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const quizQuestions = [
  {
    id: 1,
    text: 'Which of the following is the primary purpose of a firewall in network security?',
    options: [
      { id: 'a', text: 'To encrypt data transmission between networks' },
      { id: 'b', text: 'To monitor and control incoming and outgoing network traffic' },
      { id: 'c', text: 'To authenticate users before granting network access' },
      { id: 'd', text: 'To provide backup storage for network data' }
    ],
    correct: 'b'
  },
  {
    id: 2,
    text: 'What is the main difference between symmetric and asymmetric encryption?',
    options: [
      { id: 'a', text: 'Symmetric uses one key, asymmetric uses two keys' },
      { id: 'b', text: 'Symmetric is faster, asymmetric is slower' },
      { id: 'c', text: 'Symmetric is more secure, asymmetric is less secure' },
      { id: 'd', text: 'Symmetric is for emails, asymmetric is for files' }
    ],
    correct: 'a'
  },
  {
    id: 3,
    text: 'What is the first step in the incident response process?',
    options: [
      { id: 'a', text: 'Recovery' },
      { id: 'b', text: 'Detection' },
      { id: 'c', text: 'Containment' },
      { id: 'd', text: 'Analysis' }
    ],
    correct: 'b'
  }
]

export default function QuizPage(){
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selected, setSelected] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const question = quizQuestions[currentQuestion]
  const totalQuestions = quizQuestions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  function handleSubmit(e){
    e.preventDefault()
    if (!selected) return
    setAnswers(prev => ({ ...prev, [question.id]: selected }))
    setSubmitted(true)
  }

  function handleNext(){
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelected(answers[currentQuestion + 2] || '')
      setSubmitted(false)
    } else {
      // Quiz completed
      setShowResults(true)
    }
  }

  function handlePrevious(){
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setSelected(answers[currentQuestion] || '')
      setSubmitted(false)
    }
  }

  const score = Object.keys(answers).reduce((acc, qId) => {
    const q = quizQuestions.find(q => q.id === parseInt(qId))
    return acc + (answers[qId] === q?.correct ? 1 : 0)
  }, 0)

  if (showResults) {
    const percentage = Math.round((score / totalQuestions) * 100)
    return (
      <main>
        <section className="quiz-results">
          <div className="results-card">
            <h3>Quiz Completed!</h3>
            <div className="score-display">
              <div className="score-circle">
                <span className="score-number">{percentage}%</span>
                <span className="score-label">Score</span>
              </div>
            </div>
            <div className="results-summary">
              <div className="summary-item">
                <span className="summary-label">Correct Answers:</span>
                <span className="summary-value">{score}/{totalQuestions}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Points Earned:</span>
                <span className="summary-value">{score * 100} pts</span>
              </div>
            </div>
            <div className="results-actions">
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setCurrentQuestion(0)
                  setSelected('')
                  setAnswers({})
                  setShowResults(false)
                  setSubmitted(false)
                }}
              >
                Retake Quiz
              </button>
              <Link to="/ranking" className="btn btn-secondary">View Leaderboard</Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="quiz-header">
        <div className="quiz-info">
          <h2>Network Security Fundamentals</h2>
          <p>Test your knowledge of firewalls, VPNs, and network protocols. Perfect for Security+ preparation.</p>
          <div className="quiz-stats">
            <span className="stat">{totalQuestions} Questions</span>
            <span className="stat">30 Minutes</span>
            <span className="stat">Beginner Level</span>
          </div>
        </div>
        <div className="quiz-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">Question {currentQuestion + 1} of {totalQuestions}</span>
        </div>
      </section>

      <section className="quiz-question">
        <div className="question-card">
          <div className="question-header">
            <h3>Question {currentQuestion + 1}</h3>
            <div className="question-timer">
              <span className="timer-icon">⏱️</span>
              <span className="timer-text">Time remaining</span>
            </div>
          </div>
          
          <div className="question-content">
            <p>{question.text}</p>
          </div>

          <form className="quiz-form" onSubmit={handleSubmit}>
            <div className="answer-options">
              {question.options.map(opt => (
                <label key={opt.id} className="option-label">
                  <input 
                    type="radio" 
                    name="answer" 
                    value={opt.id} 
                    className="option-input"
                    checked={selected === opt.id}
                    onChange={() => setSelected(opt.id)}
                  />
                  <span className="option-text">{opt.text}</span>
                </label>
              ))}
            </div>

            {submitted && (
              <div className="result">
                {selected === question.correct ? (
                  <p className="correct">✓ Correct! Well done.</p>
                ) : (
                  <p className="incorrect">✗ Incorrect. The correct answer is option {question.correct.toUpperCase()}.</p>
                )}
              </div>
            )}

            <div className="question-actions">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={!selected}
              >
                Submit Answer
              </button>
              {submitted && (
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleNext}
                >
                  {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="quiz-navigation">
        <div className="question-list">
          <h4>Question Overview</h4>
          <div className="question-numbers">
            {quizQuestions.map((q, idx) => {
              const status = idx === currentQuestion ? 'current' : 
                            answers[q.id] ? 'completed' : ''
              return (
                <span 
                  key={q.id} 
                  className={`q-number ${status}`}
                  onClick={() => {
                    setCurrentQuestion(idx)
                    setSelected(answers[q.id] || '')
                    setSubmitted(false)
                  }}
                >
                  {idx + 1}
                </span>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
