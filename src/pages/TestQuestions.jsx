import React, { useState, useEffect } from 'react'
import { subscribeToData, pushData, deleteData } from '../utils/database'

export default function TestQuestions({ currentUser }) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    explanation: '',
    category: '',
    difficulty: ''
  })
  const [showForm, setShowForm] = useState(false)
  const [feedback, setFeedback] = useState({})
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToData('questions', (data) => {
      if (data) {
        const questionsArray = Object.values(data)
          .filter(q => q !== null && q !== undefined)
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime()
            const dateB = new Date(b.createdAt || 0).getTime()
            return dateB - dateA
          })

        setQuestions(prev => {
          const existingMap = new Map()

          prev.forEach(q => {
            if (q && q.id) {
              existingMap.set(q.id, q)
            }
          })

          questionsArray.forEach(q => {
            if (q && q.id) {
              existingMap.set(q.id, q)
            }
          })

          const merged = Array.from(existingMap.values()).sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime()
            const dateB = new Date(b.createdAt || 0).getTime()
            return dateB - dateA
          })

          return merged
        })
      } else {
        setQuestions(prev => prev.length > 0 ? prev : [])
      }
      setLoading(false)
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, []) 

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    const errors = []
    if (!formData.question?.trim()) errors.push('Question text is required')
    if (!formData.category) errors.push('Category is required')
    if (!formData.difficulty) errors.push('Difficulty level is required')
    if (!formData.optionA?.trim()) errors.push('Option A is required')
    if (!formData.optionB?.trim()) errors.push('Option B is required')
    if (!formData.optionC?.trim()) errors.push('Option C is required')
    if (!formData.optionD?.trim()) errors.push('Option D is required')
    if (!formData.correctAnswer) errors.push('Correct answer must be selected')

    if (errors.length > 0) {
      setMessage({ text: errors.join('. '), type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 5000)
      return
    }

    if (!currentUser) {
      setMessage({ text: 'You must be logged in to create questions', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
      return
    }

    setIsSubmitting(true)
    setMessage({ text: 'Creating question...', type: 'info' })

    const newQuestion = {
      id: Date.now(),
      question: formData.question.trim(),
      optionA: formData.optionA.trim(),
      optionB: formData.optionB.trim(),
      optionC: formData.optionC.trim(),
      optionD: formData.optionD.trim(),
      correctAnswer: formData.correctAnswer,
      explanation: formData.explanation?.trim() || '',
      category: formData.category,
      difficulty: formData.difficulty,
      author: currentUser.displayName || currentUser.email || 'Anonymous',
      authorId: currentUser.uid,
      createdAt: new Date().toISOString(),
      feedback: []
    }

    try {
      setQuestions(prev => [newQuestion, ...prev])

      setFormData({
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: '',
        explanation: '',
        category: '',
        difficulty: ''
      })

      setShowForm(false)
      setIsSubmitting(false)

      setMessage({ text: 'Question created successfully!', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 5000)


      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firebase save timeout')), 10000)
        )

        const savePromise = pushData('questions', newQuestion)
        const saveResult = await Promise.race([savePromise, timeoutPromise])
        const questionKey = saveResult && (saveResult.key || saveResult.name || saveResult)

        if (questionKey) {
          setQuestions(prev => prev.map(q =>
            q.id === newQuestion.id ? { ...q, firebaseKey: questionKey } : q
          ))
        }
      } catch (firebaseError) {
        console.error('Error saving to Firebase (but question is shown locally):', firebaseError)
      }
    } catch (error) {
      console.error('Error creating question:', error)
      setIsSubmitting(false)
      setMessage({ 
        text: `Error creating question: ${error.message || 'Please try again.'}`, 
        type: 'error' 
      })
      setTimeout(() => setMessage({ text: '', type: '' }), 5000)
    }
  }

  function handleFeedback(questionId, feedbackText) {
    const question = questions.find(q => q.id === questionId)
    if (!question) return

    const newFeedback = {
      id: Date.now(),
      author: 'Anonymous User',
      text: feedbackText,
      timestamp: new Date().toISOString()
    }

    question.feedback = [...(question.feedback || []), newFeedback]
    setQuestions([...questions])
    setFeedback({ ...feedback, [questionId]: '' })
  }

  const [deleteConfirm, setDeleteConfirm] = useState(null)

  function handleDelete(questionId) {
    setDeleteConfirm(questionId)
  }

  async function confirmDelete(questionId) {
    try {
      const unsubscribe = subscribeToData('questions', async (data) => {
        if (data) {
          const questionsArray = Object.entries(data)
          const foundEntry = questionsArray.find(([key, q]) => q.id === questionId)
          if (foundEntry) {
            await deleteData(`questions/${foundEntry[0]}`)
          }
        }
      })
      setDeleteConfirm(null)
      setMessage({ text: 'Question deleted successfully', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (error) {
      console.error('Error deleting question:', error)
      setMessage({ text: 'Error deleting question. Please try again.', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    }
  }

  function cancelDelete() {
    setDeleteConfirm(null)
  }

  const questionCards = questions.map(question => {
    const feedbackItems = question.feedback && question.feedback.length > 0
      ? question.feedback.map(fb => (
          <div key={fb.id} className="feedback-item">
            <div className="feedback-header">
              <strong>{fb.author}</strong>
              <span className="feedback-time">
                {new Date(fb.timestamp).toLocaleDateString()}
              </span>
            </div>
            <p>{fb.text}</p>
          </div>
        ))
      : null

    return (
      <div key={question.id} className="question-card">
        <div className="question-header">
          <div className="question-meta">
            <span className={`category-badge ${question.category}`}>
              {question.category || 'General'}
            </span>
            <span className={`difficulty-badge ${question.difficulty}`}>
              {question.difficulty || 'Not set'}
            </span>
          </div>
          <button
            onClick={() => handleDelete(question.id)}
            className="btn-delete"
            aria-label="Delete question"
          >
            🗑️ Delete
          </button>
          {deleteConfirm === question.id && (
            <div className="delete-confirmation">
              <p>Are you sure you want to delete this question?</p>
              <button onClick={() => confirmDelete(question.id)} className="btn btn-danger">Yes, Delete</button>
              <button onClick={cancelDelete} className="btn btn-outline">Cancel</button>
            </div>
          )}
        </div>

        <p className="question-text">{question.question}</p>

        <div className="question-options">
          <div className={`option ${question.correctAnswer === 'a' ? 'correct' : ''}`}>
            <strong>A:</strong> {question.optionA}
          </div>
          <div className={`option ${question.correctAnswer === 'b' ? 'correct' : ''}`}>
            <strong>B:</strong> {question.optionB}
          </div>
          <div className={`option ${question.correctAnswer === 'c' ? 'correct' : ''}`}>
            <strong>C:</strong> {question.optionC}
          </div>
          <div className={`option ${question.correctAnswer === 'd' ? 'correct' : ''}`}>
            <strong>D:</strong> {question.optionD}
          </div>
        </div>

        {question.explanation && (
          <div className="question-explanation">
            <strong>Explanation:</strong> {question.explanation}
          </div>
        )}

        <div className="question-footer">
          <span className="question-author">By: {question.author}</span>
          <span className="question-date">
            {new Date(question.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="feedback-section">
          <h4>💬 Feedback & Comments</h4>
          <div className="feedback-form">
            <textarea
              value={feedback[question.id] || ''}
              onChange={(e) => setFeedback({ ...feedback, [question.id]: e.target.value })}
              placeholder="Provide feedback or report an issue with this question..."
              rows="2"
              className="feedback-input"
            />
            <button
              onClick={() => handleFeedback(question.id, feedback[question.id])}
              disabled={!feedback[question.id]?.trim()}
              className="btn btn-sm btn-primary"
            >
              Submit Feedback
            </button>
          </div>

          {question.feedback && question.feedback.length > 0 && (
            <div className="feedback-list">
              {feedbackItems}
            </div>
          )}
        </div>
      </div>
    )
  })

  return (
    <main className="test-questions-page">
      {message.text && (
        <div
          className={`message ${
            message.type === 'error' ? 'error-message' : 
            message.type === 'info' ? 'info-message' : 
            'success-message'
          }`}
          role="status"
          aria-live="polite"
        >
          {message.text}
        </div>
      )}
      <section className="questions-header">
        <div>
          <h1>📝 Question Creator</h1>
          <p>Create and share cybersecurity quiz questions with the community</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ Create New Question'}
        </button>
      </section>

      {showForm && (
        <section className="question-form-section">
          <h3>Create a New Question</h3>
          <form onSubmit={handleSubmit} className="question-form">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category...</option>
                <option value="network-security">Network Security</option>
                <option value="cryptography">Cryptography</option>
                <option value="incident-response">Incident Response</option>
                <option value="risk-management">Risk Management</option>
                <option value="compliance">Compliance</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty Level *</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
              >
                <option value="">Select difficulty...</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="question">Question Text *</label>
              <textarea
                id="question"
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Enter your question here..."
                rows="3"
                required
              />
            </div>

            <div className="options-grid">
              <div className="form-group">
                <label htmlFor="optionA">Option A *</label>
                <input
                  type="text"
                  id="optionA"
                  name="optionA"
                  value={formData.optionA}
                  onChange={handleChange}
                  placeholder="First option"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="optionB">Option B *</label>
                <input
                  type="text"
                  id="optionB"
                  name="optionB"
                  value={formData.optionB}
                  onChange={handleChange}
                  placeholder="Second option"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="optionC">Option C *</label>
                <input
                  type="text"
                  id="optionC"
                  name="optionC"
                  value={formData.optionC}
                  onChange={handleChange}
                  placeholder="Third option"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="optionD">Option D *</label>
                <input
                  type="text"
                  id="optionD"
                  name="optionD"
                  value={formData.optionD}
                  onChange={handleChange}
                  placeholder="Fourth option"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="correctAnswer">Correct Answer *</label>
              <select
                id="correctAnswer"
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleChange}
                required
              >
                <option value="">Select correct answer...</option>
                <option value="a">Option A</option>
                <option value="b">Option B</option>
                <option value="c">Option C</option>
                <option value="d">Option D</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="explanation">Explanation (Optional)</label>
              <textarea
                id="explanation"
                name="explanation"
                value={formData.explanation}
                onChange={handleChange}
                placeholder="Explain why this is the correct answer..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Question'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false)
                  setFormData({
                    question: '',
                    optionA: '',
                    optionB: '',
                    optionC: '',
                    optionD: '',
                    correctAnswer: '',
                    explanation: '',
                    category: '',
                    difficulty: ''
                  })
                }}
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="questions-list-section">
        <h2>Community Questions</h2>

        {questions.length === 0 ? (
          <div className="empty-state">
            <p>📚 No questions created yet.</p>
            <p>Be the first to create a question and help the community learn!</p>
          </div>
        ) : (
          <div className="questions-list">
            {questionCards}
          </div>
        )}
      </section>
    </main>
  )
}

