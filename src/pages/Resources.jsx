import React, { useState } from 'react'
import CommentSection from '../components/CommentSection'

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


export default function Resources({ currentUser }){
  const [searchQuery, setSearchQuery] = useState('')
  const [resourceType, setResourceType] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = resourceType ? resource.type.toLowerCase() === resourceType.toLowerCase() : true
    const matchesDifficulty = difficulty ? resource.difficulty === difficulty : true
    return matchesSearch && matchesType && matchesDifficulty
  })

  function handleBrowseCategory(categoryTitle) {
    // Filter resources by category type
    const categoryMap = {
      'Video Courses': 'Video Course',
      'Books & eBooks': 'Book',
      'Tools & Software': 'Tool',
      'Articles & Blogs': 'Article'
    }
    
    const type = categoryMap[categoryTitle] || ''
    setResourceType(type)
    setSearchQuery('')
    setDifficulty('')
    
    // Show feedback message
    setMessage({ 
      text: `Showing ${categoryTitle.toLowerCase()}. Scroll down to see filtered resources.`, 
      type: 'info' 
    })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    
    // Scroll to resources section
    setTimeout(() => {
      const resourcesSection = document.querySelector('.featured-resources')
      if (resourcesSection) {
        resourcesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  return (
    <main>
      {message.text && (
        <div 
          className={`message ${message.type === 'error' ? 'error-message' : message.type === 'info' ? 'info-message' : 'success-message'}`}
          role="alert"
          aria-live="polite"
        >
          {message.text}
        </div>
      )}
      <section className="resources-header" aria-labelledby="resources-heading">
        <h1 id="resources-heading">📚 Cybersecurity Learning Resources</h1>
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
            <button type="submit" className="btn btn-search" aria-label="Search for resources">Search</button>
          </form>
        </div>
      </section>

      <section className="featured-resources" aria-labelledby="featured-heading">
        <h2 id="featured-heading">🌟 Featured Resources</h2>
        <div className="resource-grid" role="list" aria-label="Featured resources">
          {filteredResources.map(resource => (
            <article key={resource.id} className={`resource-card ${resource.featured ? 'featured' : ''}`} role="listitem">
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
                  <a href={resource.url} target="_blank" rel="noreferrer" className="btn btn-primary" aria-label={`${resource.type === 'Tool' ? 'Access' : resource.type === 'Book' ? 'Get' : 'Watch'} ${resource.title}`}>
                    {resource.type === 'Tool' ? 'Access Tool' : resource.type === 'Book' ? 'Get Book' : 'Watch Now'}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="resource-categories" aria-labelledby="categories-heading">
        <h2 id="categories-heading">Browse by Category</h2>
        <div className="categories-grid">
          {categories.map((category, idx) => (
            <div key={idx} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <h4>{category.title}</h4>
              <p>{category.description}</p>
              <div className="category-count">{category.count} resources</div>
              <button 
                type="button"
                className="btn btn-outline"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleBrowseCategory(category.title)
                }}
              >
                Browse {category.title}
              </button>
            </div>
          ))}
        </div>
      </section>

      <CommentSection itemId="resources-page" itemType="resource" currentUser={currentUser} />
    </main>
  )
}
