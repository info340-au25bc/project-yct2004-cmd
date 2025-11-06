import React, { useState } from 'react'

const initialQuizzes = [
  { id: 1, title: 'Network Security Fundamentals', difficulty: 'beginner', questions: 15, rating: 4.2 },
  { id: 2, title: 'Cryptography & Encryption', difficulty: 'intermediate', questions: 20, rating: 4.8 },
  { id: 3, title: 'Incident Response', difficulty: 'advanced', questions: 25, rating: 4.5 }
]

export default function Home(){
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('')

  const filtered = initialQuizzes.filter(q => {
    const matchesQuery = q.title.toLowerCase().includes(query.toLowerCase())
    const matchesLevel = level ? q.difficulty === level : true
    return matchesQuery && matchesLevel
  })

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <h2>Master Cybersecurity Through Interactive Learning</h2>
          <p>Join thousands of learners preparing for Security+ and other certifications.</p>
        </div>
      </section>

      <section className="search-section">
        <h3>Find Quizzes</h3>
        <div className="search-controls">
          <input aria-label="Search quizzes" placeholder="Search quizzes..." value={query} onChange={e=>setQuery(e.target.value)} />
          <select value={level} onChange={e=>setLevel(e.target.value)}>
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </section>

      <section className="featured-section">
        <h3>Featured Quizzes</h3>
        <div className="quiz-grid">
          {filtered.map(q => (
            <article className="quiz-card" key={q.id}>
              <div className="quiz-content">
                <h4>{q.title}</h4>
                <p>{q.questions} Questions — Rating {q.rating}</p>
                <div className="quiz-meta">
                  <span className={`difficulty ${q.difficulty}`}>{q.difficulty}</span>
                </div>
                <a className="btn btn-card" href="/quiz">Take Quiz</a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
