import React, { useState } from 'react'

const resources = [
  {
    id: 1,
    title: 'Professor Messer Security+ Course',
    type: 'Video Course',
    description: 'Comprehensive free video series covering all CompTIA Security+ SY0-601 objectives. Over 100 hours of expert instruction.',
    url: 'https://www.professormesser.com/security-plus/sy0-601/sy0-601-training-course/',
    difficulty: 'beginner',
    duration: '100+ hours',
    rating: 4.9,
    featured: true
  },
  {
    id: 2,
    title: 'CompTIA Security+ Study Guide',
    type: 'Book',
    description: 'Official study guide covering all exam objectives with practice questions and hands-on labs.',
    url: 'https://www.amazon.com/CompTIA-Security-Certification-SY0-601/dp/1264268749',
    difficulty: 'intermediate',
    pages: '800+ pages',
    rating: 4.6
  },
  {
    id: 3,
    title: 'Cybrary Cybersecurity Courses',
    type: 'Course',
    description: 'Free cybersecurity courses covering ethical hacking, incident response, and security fundamentals.',
    url: 'https://www.cybrary.it/',
    difficulty: 'beginner',
    courses: '50+ courses',
    rating: 4.4
  },
  {
    id: 4,
    title: 'CISA Free Cybersecurity Services & Tools',
    type: 'Tool',
    description: 'Government-provided tools for cybersecurity protection, including vulnerability scanning and incident response resources.',
    url: 'https://www.cisa.gov/resources-tools/resources/free-cybersecurity-services-and-tools',
    difficulty: 'intermediate',
    category: 'Government Tools'
  },
  {
    id: 5,
    title: 'CybersecTools - 2600+ Free Tools',
    type: 'Tool',
    description: 'Extensive collection of free cybersecurity utilities for penetration testing, network analysis, and security assessment.',
    url: 'https://cybersectools.com/free',
    difficulty: 'advanced',
    category: 'Penetration Testing'
  },
  {
    id: 6,
    title: 'KnowBe4 - Free Awareness & Phishing Tools',
    type: 'Tool',
    description: 'Tools for phishing simulation and security awareness training, perfect for organizational cybersecurity education.',
    url: 'https://www.knowbe4.com/free-cybersecurity-tools',
    difficulty: 'beginner',
    category: 'Awareness Training'
  }
]

const categories = [
  { icon: '🎥', title: 'Video Courses', description: 'Expert-led video tutorials and courses', count: 25 },
  { icon: '📖', title: 'Books & eBooks', description: 'Comprehensive study guides and textbooks', count: 18 },
  { icon: '🔧', title: 'Tools & Software', description: 'Security tools and practice environments', count: 12 },
  { icon: '📰', title: 'Articles & Blogs', description: 'Latest insights and industry news', count: 35 }
]

const certifications = [
  {
    name: 'CompTIA Security+',
    logo: '🔒',
    description: 'Entry-level cybersecurity certification covering network security, compliance, and risk management.',
    resources: [
      { icon: '🎥', text: 'Professor Messer Course' },
      { icon: '📖', text: 'Official Study Guide' },
      { icon: '🔧', text: 'Practice Tests' }
    ]
  },
  {
    name: 'CISSP',
    logo: '🏆',
    description: 'Advanced certification for experienced security professionals covering 8 security domains.',
    resources: [
      { icon: '🎥', text: 'CISSP Training Videos' },
      { icon: '📖', text: 'CISSP Study Guide' },
      { icon: '🔧', text: 'Domain Practice Tests' }
    ]
  },
  {
    name: 'CEH',
    logo: '⚔️',
    description: 'Ethical Hacking certification focusing on penetration testing and vulnerability assessment.',
    resources: [
      { icon: '🎥', text: 'Ethical Hacking Course' },
      { icon: '📖', text: 'CEH Study Guide' },
      { icon: '🔧', text: 'Lab Environment' }
    ]
  }
]

export default function Resources(){
  const [searchQuery, setSearchQuery] = useState('')
  const [resourceType, setResourceType] = useState('')
  const [difficulty, setDifficulty] = useState('')

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = resourceType ? resource.type.toLowerCase() === resourceType.toLowerCase() : true
    const matchesDifficulty = difficulty ? resource.difficulty === difficulty : true
    return matchesSearch && matchesType && matchesDifficulty
  })

  return (
    <main>
      <section className="resources-header">
        <h2>📚 Cybersecurity Learning Resources</h2>
        <p>Expert-curated materials to accelerate your cybersecurity journey</p>
        <div className="resource-search">
          <form className="resource-search-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="resource-search">Search Resources</label>
              <input 
                type="text" 
                id="resource-search" 
                placeholder="e.g., Network Security, Cryptography" 
                aria-label="Search for cybersecurity resources"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="resource-type">Resource Type</label>
              <select 
                id="resource-type" 
                name="type"
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Video Course">Videos</option>
                <option value="Book">Books</option>
                <option value="Course">Courses</option>
                <option value="Tool">Tools</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="difficulty-level">Difficulty</label>
              <select 
                id="difficulty-level" 
                name="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <button type="submit" className="btn btn-search">Search</button>
          </form>
        </div>
      </section>

      <section className="featured-resources">
        <h3>🌟 Featured Resources</h3>
        <div className="resource-grid">
          {filteredResources.map(resource => (
            <article key={resource.id} className={`resource-card ${resource.featured ? 'featured' : ''}`}>
              <div className="resource-content">
                {resource.featured && <div className="resource-badge">Most Popular</div>}
                <div className="resource-type">{resource.type}</div>
                <h4>{resource.title}</h4>
                <p>{resource.description}</p>
                <div className="resource-meta">
                  {resource.duration && <span className="duration">{resource.duration}</span>}
                  {resource.pages && <span className="pages">{resource.pages}</span>}
                  {resource.courses && <span className="courses">{resource.courses}</span>}
                  {resource.rating && <span className="rating">★★★★☆ ({resource.rating})</span>}
                  <span className={`level ${resource.difficulty}`}>{resource.difficulty}</span>
                </div>
                <div className="resource-actions">
                  <a href={resource.url} target="_blank" rel="noreferrer" className="btn btn-primary">
                    {resource.type === 'Tool' ? 'Access Tool' : resource.type === 'Book' ? 'Get Book' : 'Watch Now'}
                  </a>
                  <button className="btn btn-outline">Save</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="resource-categories">
        <h3>Browse by Category</h3>
        <div className="categories-grid">
          {categories.map((category, idx) => (
            <div key={idx} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <h4>{category.title}</h4>
              <p>{category.description}</p>
              <div className="category-count">{category.count} resources</div>
              <button className="btn btn-outline">Browse {category.title}</button>
            </div>
          ))}
        </div>
      </section>

      <section className="certification-paths">
        <h3>Certification Learning Paths</h3>
        <div className="cert-grid">
          {certifications.map((cert, idx) => (
            <div key={idx} className="cert-card">
              <div className="cert-header">
                <span className="cert-logo" style={{ fontSize: '2rem' }}>{cert.logo}</span>
                <h4>{cert.name}</h4>
              </div>
              <p>{cert.description}</p>
              <div className="cert-resources">
                {cert.resources.map((resource, rIdx) => (
                  <div key={rIdx} className="resource-item">
                    <span className="resource-icon">{resource.icon}</span>
                    <span>{resource.text}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary">Start Learning</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
