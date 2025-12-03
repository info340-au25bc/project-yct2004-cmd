import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const initialQuizzes = [
  { 
    id: 'network-security', 
    title: 'Network Security Fundamentals', 
    difficulty: 'beginner', 
    questions: 5, 
    rating: 4.2,
    description: 'Test your knowledge of firewalls, VPNs, and network protocols. Perfect for Security+ preparation.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop'
  },
  { 
    id: 'cryptography', 
    title: 'Cryptography & Encryption', 
    difficulty: 'intermediate', 
    questions: 5, 
    rating: 4.8,
    description: 'Master symmetric and asymmetric encryption, hashing algorithms, and digital certificates.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop'
  },
  { 
    id: 'incident-response', 
    title: 'Incident Response', 
    difficulty: 'advanced', 
    questions: 5, 
    rating: 4.5,
    description: 'Learn the steps of incident response, from detection to recovery and lessons learned.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop'
  },
  { 
    id: 'risk-management', 
    title: 'Risk Management', 
    difficulty: 'intermediate', 
    questions: 3, 
    rating: 4.3,
    description: 'Understand risk assessment, mitigation strategies, and security controls.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop'
  },
  { 
    id: 'compliance', 
    title: 'Compliance & Regulations', 
    difficulty: 'intermediate', 
    questions: 3, 
    rating: 4.6,
    description: 'Learn about GDPR, HIPAA, PCI-DSS, and other compliance frameworks.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop'
  }
]

const studyGroups = [
  {
    id: 1,
    name: 'Security+ Study Group',
    description: 'Weekly study sessions for CompTIA Security+ exam preparation',
    members: 245,
    maxMembers: 300,
    nextSession: 'Tomorrow 7 PM'
  },
  {
    id: 2,
    name: 'CISSP Discussion',
    description: 'Advanced cybersecurity professionals sharing insights',
    members: 89,
    maxMembers: 100,
    nextSession: 'Friday 6 PM'
  },
  {
    id: 3,
    name: 'Career Changers',
    description: 'Support group for professionals transitioning to cybersecurity',
    members: 156,
    maxMembers: 200,
    nextSession: 'Sunday 2 PM'
  }
]

export default function Home(){
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('')
  const [certification, setCertification] = useState('')

  const filtered = initialQuizzes.filter(q => {
    const matchesQuery = q.title.toLowerCase().includes(query.toLowerCase())
    const matchesLevel = level ? q.difficulty === level : true
    return matchesQuery && matchesLevel
  })

  const quizCards = filtered.map(q => (
    <article className="quiz-card" key={q.id} role="listitem">
      <div className="quiz-image">
        <img src={q.image} alt={`${q.title} quiz preview`} className="card-img" />
      </div>
      <div className="quiz-content">
        <h4>{q.title}</h4>
        <p>{q.description}</p>
        <div className="quiz-meta">
          <span className={`difficulty ${q.difficulty}`}>{q.difficulty}</span>
          <span className="questions">{q.questions} Questions</span>
          <span className="rating">★★★★☆ ({q.rating})</span>
        </div>
        <Link to={`/quiz/${q.id}`} className="btn btn-card" aria-label={`Take ${q.title} quiz`}>Take Quiz</Link>
      </div>
    </article>
  ))

  const groupCards = studyGroups.map(group => (
    <div className="group-card" key={group.id}>
      <h4>{group.name}</h4>
      <p>{group.description}</p>
      <div className="group-meta">
        <span className="members">{group.members} members</span>
        <span className="next-session">Next: {group.nextSession}</span>
      </div>
      <Link to="/login" className="btn btn-outline">Join Group</Link>
    </div>
  ))

  return (
    <main>
      <section className="search-section" aria-labelledby="search-heading">
        <h2 id="search-heading">Find Your Perfect Study Material</h2>
        <form className="search-form" role="search" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="search-topic">Search Topic</label>
            <input 
              type="text" 
              id="search-topic" 
              placeholder="e.g., Network Security, Cryptography" 
              aria-label="Search for cybersecurity topics"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="difficulty">Difficulty Level</label>
            <select 
              id="difficulty" 
              aria-label="Select difficulty level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="certification">Certification</label>
            <select 
              id="certification" 
              aria-label="Select certification type"
              value={certification}
              onChange={(e) => setCertification(e.target.value)}
            >
              <option value="">All Certifications</option>
              <option value="security-plus">CompTIA Security+</option>
              <option value="cissp">CISSP</option>
              <option value="ceh">CEH</option>
              <option value="cism">CISM</option>
            </select>
          </div>
          <button type="submit" className="btn btn-search" aria-label="Search for quizzes">Search</button>
        </form>
      </section>

      <section className="stats-section" aria-labelledby="stats-heading">
        <h2 id="stats-heading">Join Our Growing Community</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">15,000+</div>
            <div className="stat-label">Active Learners</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Expert-Created Quizzes</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">95%</div>
            <div className="stat-label">Pass Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Community Support</div>
          </div>
        </div>
      </section>

      <section className="quizzes-section" aria-labelledby="quizzes-heading">
        <h2 id="quizzes-heading">Featured Quizzes</h2>
        <div className="quizzes-grid" role="list" aria-label="Available quizzes">
          {quizCards}
        </div>
      </section>

      <section className="study-groups-section" aria-labelledby="groups-heading">
        <h2 id="groups-heading">Active Study Groups</h2>
        <div className="groups-grid">
          {groupCards}
        </div>
      </section>
    </main>
  )
}

