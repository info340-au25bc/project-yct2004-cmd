import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CommentSection from '../components/CommentSection'

// Expanded quiz database
const allQuizzes = {
  'network-security': {
    id: 'network-security',
    title: 'Network Security Fundamentals',
    description: 'Test your knowledge of firewalls, VPNs, and network protocols. Perfect for Security+ preparation.',
    difficulty: 'beginner',
    questions: [
      {
        id: 1,
        text: 'Which of the following is the primary purpose of a firewall in network security?',
        options: [
          { id: 'a', text: 'To encrypt data transmission between networks' },
          { id: 'b', text: 'To monitor and control incoming and outgoing network traffic' },
          { id: 'c', text: 'To authenticate users before granting network access' },
          { id: 'd', text: 'To provide backup storage for network data' }
        ],
        correct: 'b',
        explanation: 'A firewall acts as a barrier between trusted and untrusted networks, monitoring and controlling traffic based on security rules.'
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
        correct: 'a',
        explanation: 'Symmetric encryption uses a single shared key for both encryption and decryption, while asymmetric encryption uses a pair of keys (public and private).'
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
        correct: 'b',
        explanation: 'The incident response process typically follows: Detection → Containment → Analysis → Recovery → Post-Incident Review.'
      },
      {
        id: 4,
        text: 'What does VPN stand for?',
        options: [
          { id: 'a', text: 'Virtual Private Network' },
          { id: 'b', text: 'Very Protected Network' },
          { id: 'c', text: 'Verified Public Network' },
          { id: 'd', text: 'Virtual Public Network' }
        ],
        correct: 'a',
        explanation: 'VPN stands for Virtual Private Network, which creates a secure connection over a public network.'
      },
      {
        id: 5,
        text: 'Which port is commonly used for HTTPS?',
        options: [
          { id: 'a', text: '80' },
          { id: 'b', text: '443' },
          { id: 'c', text: '21' },
          { id: 'd', text: '25' }
        ],
        correct: 'b',
        explanation: 'Port 443 is the standard port for HTTPS (HTTP Secure) traffic.'
      }
    ]
  },
  'cryptography': {
    id: 'cryptography',
    title: 'Cryptography & Encryption',
    description: 'Master symmetric and asymmetric encryption, hashing algorithms, and digital certificates.',
    difficulty: 'intermediate',
    questions: [
      {
        id: 1,
        text: 'What is the main advantage of asymmetric encryption over symmetric encryption?',
        options: [
          { id: 'a', text: 'It is faster' },
          { id: 'b', text: 'It doesn\'t require key exchange' },
          { id: 'c', text: 'It uses less computational resources' },
          { id: 'd', text: 'It provides better security for key distribution' }
        ],
        correct: 'd',
        explanation: 'Asymmetric encryption solves the key distribution problem by using public/private key pairs, eliminating the need to securely share a secret key.'
      },
      {
        id: 2,
        text: 'What is a hash function used for?',
        options: [
          { id: 'a', text: 'Encrypting data' },
          { id: 'b', text: 'Creating a fixed-size output from variable-size input' },
          { id: 'c', text: 'Compressing files' },
          { id: 'd', text: 'Authenticating users' }
        ],
        correct: 'b',
        explanation: 'Hash functions create a fixed-size output (hash) from variable-size input, commonly used for data integrity verification.'
      },
      {
        id: 3,
        text: 'Which algorithm is commonly used for digital signatures?',
        options: [
          { id: 'a', text: 'AES' },
          { id: 'b', text: 'RSA' },
          { id: 'c', text: 'MD5' },
          { id: 'd', text: 'DES' }
        ],
        correct: 'b',
        explanation: 'RSA (Rivest-Shamir-Adleman) is commonly used for digital signatures in asymmetric cryptography.'
      },
      {
        id: 4,
        text: 'What is the purpose of a digital certificate?',
        options: [
          { id: 'a', text: 'To encrypt data' },
          { id: 'b', text: 'To verify the identity of a public key owner' },
          { id: 'c', text: 'To compress files' },
          { id: 'd', text: 'To authenticate users' }
        ],
        correct: 'b',
        explanation: 'Digital certificates bind a public key to an identity, allowing verification of the key owner.'
      },
      {
        id: 5,
        text: 'What does AES stand for?',
        options: [
          { id: 'a', text: 'Advanced Encryption Standard' },
          { id: 'b', text: 'Asymmetric Encryption System' },
          { id: 'c', text: 'Automated Encryption Service' },
          { id: 'd', text: 'Applied Encryption Standard' }
        ],
        correct: 'a',
        explanation: 'AES stands for Advanced Encryption Standard, a symmetric encryption algorithm widely used today.'
      }
    ]
  },
  'incident-response': {
    id: 'incident-response',
    title: 'Incident Response',
    description: 'Learn the steps of incident response, from detection to recovery and lessons learned.',
    difficulty: 'advanced',
    questions: [
      {
        id: 1,
        text: 'What is the first step in the incident response process?',
        options: [
          { id: 'a', text: 'Recovery' },
          { id: 'b', text: 'Detection' },
          { id: 'c', text: 'Containment' },
          { id: 'd', text: 'Analysis' }
        ],
        correct: 'b',
        explanation: 'Detection is the first step where a security incident is identified.'
      },
      {
        id: 2,
        text: 'What is the purpose of containment in incident response?',
        options: [
          { id: 'a', text: 'To analyze the attack' },
          { id: 'b', text: 'To prevent further damage' },
          { id: 'c', text: 'To recover systems' },
          { id: 'd', text: 'To document the incident' }
        ],
        correct: 'b',
        explanation: 'Containment aims to prevent the incident from causing further damage to systems and data.'
      },
      {
        id: 3,
        text: 'What should be included in an incident response plan?',
        options: [
          { id: 'a', text: 'Only technical procedures' },
          { id: 'b', text: 'Roles, procedures, and communication plans' },
          { id: 'c', text: 'Only recovery steps' },
          { id: 'd', text: 'Only detection methods' }
        ],
        correct: 'b',
        explanation: 'An incident response plan should include roles, procedures, communication plans, and all phases of incident handling.'
      },
      {
        id: 4,
        text: 'What is the final phase of incident response?',
        options: [
          { id: 'a', text: 'Detection' },
          { id: 'b', text: 'Containment' },
          { id: 'c', text: 'Post-Incident Review' },
          { id: 'd', text: 'Recovery' }
        ],
        correct: 'c',
        explanation: 'Post-Incident Review is the final phase where lessons learned are documented and improvements are made.'
      },
      {
        id: 5,
        text: 'What is the goal of the recovery phase?',
        options: [
          { id: 'a', text: 'To detect incidents' },
          { id: 'b', text: 'To restore systems to normal operation' },
          { id: 'c', text: 'To contain threats' },
          { id: 'd', text: 'To analyze attacks' }
        ],
        correct: 'b',
        explanation: 'The recovery phase focuses on restoring affected systems and services to normal operation.'
      }
    ]
  },
  'risk-management': {
    id: 'risk-management',
    title: 'Risk Management',
    description: 'Understand risk assessment, mitigation strategies, and security controls.',
    difficulty: 'intermediate',
    questions: [
      {
        id: 1,
        text: 'What is the formula for calculating risk?',
        options: [
          { id: 'a', text: 'Risk = Threat × Vulnerability' },
          { id: 'b', text: 'Risk = Threat × Vulnerability × Impact' },
          { id: 'c', text: 'Risk = Vulnerability × Impact' },
          { id: 'd', text: 'Risk = Threat + Vulnerability' }
        ],
        correct: 'b',
        explanation: 'Risk is calculated as Threat × Vulnerability × Impact, considering all three factors.'
      },
      {
        id: 2,
        text: 'What is risk mitigation?',
        options: [
          { id: 'a', text: 'Ignoring risks' },
          { id: 'b', text: 'Reducing the likelihood or impact of risks' },
          { id: 'c', text: 'Accepting all risks' },
          { id: 'd', text: 'Transferring all risks' }
        ],
        correct: 'b',
        explanation: 'Risk mitigation involves taking actions to reduce the likelihood or impact of identified risks.'
      },
      {
        id: 3,
        text: 'What is a risk register?',
        options: [
          { id: 'a', text: 'A list of all identified risks' },
          { id: 'b', text: 'A security control' },
          { id: 'c', text: 'A threat assessment tool' },
          { id: 'd', text: 'A vulnerability scanner' }
        ],
        correct: 'a',
        explanation: 'A risk register is a document that lists all identified risks, their characteristics, and mitigation strategies.'
      }
    ]
  },
  'compliance': {
    id: 'compliance',
    title: 'Compliance & Regulations',
    description: 'Learn about GDPR, HIPAA, PCI-DSS, and other compliance frameworks.',
    difficulty: 'intermediate',
    questions: [
      {
        id: 1,
        text: 'What does GDPR stand for?',
        options: [
          { id: 'a', text: 'General Data Protection Regulation' },
          { id: 'b', text: 'Global Data Privacy Rules' },
          { id: 'c', text: 'Government Data Protection Rules' },
          { id: 'd', text: 'General Data Privacy Regulation' }
        ],
        correct: 'a',
        explanation: 'GDPR stands for General Data Protection Regulation, a European Union data protection law.'
      },
      {
        id: 2,
        text: 'What is the primary purpose of PCI-DSS?',
        options: [
          { id: 'a', text: 'To protect healthcare data' },
          { id: 'b', text: 'To secure payment card data' },
          { id: 'c', text: 'To protect personal information' },
          { id: 'd', text: 'To regulate financial institutions' }
        ],
        correct: 'b',
        explanation: 'PCI-DSS (Payment Card Industry Data Security Standard) is designed to secure payment card data.'
      },
      {
        id: 3,
        text: 'What does HIPAA protect?',
        options: [
          { id: 'a', text: 'Payment card information' },
          { id: 'b', text: 'Protected health information (PHI)' },
          { id: 'c', text: 'Financial records' },
          { id: 'd', text: 'Personal identification numbers' }
        ],
        correct: 'b',
        explanation: 'HIPAA (Health Insurance Portability and Accountability Act) protects protected health information (PHI).'
      }
    ]
  }
}

export default function QuizPage(){
  const { quizId } = useParams()
  const [selectedQuizId, setSelectedQuizId] = useState(quizId || 'network-security')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selected, setSelected] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [showQuizSelector, setShowQuizSelector] = useState(!quizId)

  const currentQuiz = allQuizzes[selectedQuizId] || allQuizzes['network-security']
  const question = currentQuiz.questions[currentQuestion]
  const totalQuestions = currentQuiz.questions.length
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
      setSelected(answers[currentQuiz.questions[currentQuestion + 1]?.id] || '')
      setSubmitted(false)
    } else {
      setShowResults(true)
    }
  }

  function handlePrevious(){
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setSelected(answers[currentQuiz.questions[currentQuestion - 1]?.id] || '')
      setSubmitted(false)
    }
  }

  function startQuiz(quizId) {
    setSelectedQuizId(quizId)
    setCurrentQuestion(0)
    setSelected('')
    setAnswers({})
    setSubmitted(false)
    setShowResults(false)
    setShowQuizSelector(false)
  }

  const score = Object.keys(answers).reduce((acc, qId) => {
    const q = currentQuiz.questions.find(q => q.id === parseInt(qId))
    return acc + (answers[qId] === q?.correct ? 1 : 0)
  }, 0)

  if (showQuizSelector) {
    return (
      <main>
        <section className="quiz-selector-section">
          <h2>Select a Quiz</h2>
          <p>Choose a quiz to test your cybersecurity knowledge</p>
          <div className="quizzes-grid">
            {Object.values(allQuizzes).map(quiz => (
              <div key={quiz.id} className="quiz-selector-card">
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
                <div className="quiz-meta">
                  <span className={`difficulty ${quiz.difficulty}`}>{quiz.difficulty}</span>
                  <span className="question-count">{quiz.questions.length} Questions</span>
                </div>
                <button
                  onClick={() => startQuiz(quiz.id)}
                  className="btn btn-primary"
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    )
  }

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
              <button
                className="btn btn-secondary"
                onClick={() => setShowQuizSelector(true)}
              >
                Choose Another Quiz
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
          <h2>{currentQuiz.title}</h2>
          <p>{currentQuiz.description}</p>
          <div className="quiz-stats">
            <span className="stat">{totalQuestions} Questions</span>
            <span className="stat">{currentQuiz.difficulty}</span>
            <button
              onClick={() => setShowQuizSelector(true)}
              className="btn btn-sm btn-outline"
            >
              Change Quiz
            </button>
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
                  <div className="correct">
                    <p>✓ Correct! Well done.</p>
                    {question.explanation && (
                      <p className="explanation">{question.explanation}</p>
                    )}
                  </div>
                ) : (
                  <div className="incorrect">
                    <p>✗ Incorrect. The correct answer is option {question.correct.toUpperCase()}.</p>
                    {question.explanation && (
                      <p className="explanation">{question.explanation}</p>
                    )}
                  </div>
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
            {currentQuiz.questions.map((q, idx) => {
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

      <CommentSection itemId={`quiz-${selectedQuizId}`} itemType="quiz" />
    </main>
  )
}
