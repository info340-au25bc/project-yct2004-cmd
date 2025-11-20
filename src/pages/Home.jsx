import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const initialQuizzes = [
  { 
    id: 1, 
    title: 'Network Security Fundamentals', 
    difficulty: 'beginner', 
    questions: 15, 
    rating: 4.2,
    description: 'Test your knowledge of firewalls, VPNs, and network protocols. Perfect for Security+ preparation.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop'
  },
  { 
    id: 2, 
    title: 'Cryptography & Encryption', 
    difficulty: 'intermediate', 
    questions: 20, 
    rating: 4.8,
    description: 'Master symmetric and asymmetric encryption, hashing algorithms, and digital certificates.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop'
  },
  { 
    id: 3, 
    title: 'Incident Response', 
    difficulty: 'advanced', 
    questions: 25, 
    rating: 4.5,
    description: 'Learn the steps of incident response, from detection to recovery and lessons learned.',
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

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Master Cybersecurity Through Interactive Learning</h2>
          <p>Join thousands of learners preparing for CompTIA Security+ and other cybersecurity certifications through community-driven quizzes, study groups, and expert-curated resources.</p>
          <div className="hero-buttons">
            <Link to="/quiz" className="btn btn-primary">Start Learning</Link>
            <Link to="/resources" className="btn btn-secondary">Browse Resources</Link>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="search-section">
        <h3>Find Your Perfect Study Material</h3>
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
          <button type="submit" className="btn btn-search">Search</button>
        </form>
      </section>

      {/* Featured Quizzes Section */}
      <section className="featured-section">
        <h3>Featured Quizzes</h3>
        <div className="quiz-grid">
          {filtered.map(q => (
            <article className="quiz-card" key={q.id}>
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
                <Link to="/quiz" className="btn btn-card" onClick={() => window.scrollTo(0, 0)}>Take Quiz</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <h3>Join Our Growing Community</h3>
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

      {/* Study Groups Section */}
      <section className="study-groups-section">
        <h3>Join Study Groups</h3>
        <div className="groups-grid">
          {studyGroups.map(group => (
            <div className="group-card" key={group.id}>
              <h4>{group.name}</h4>
              <p>{group.description}</p>
              <div className="group-meta">
                <span className="members">{group.members} members</span>
                <span className="next-session">Next: {group.nextSession}</span>
              </div>
              <Link to="/groups" className="btn btn-outline">Join Group</Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
