import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { subscribeToData, pushData } from '../utils/database'

export default function Forum({ currentUser }) {
  const [discussions, setDiscussions] = useState([])
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '', category: 'General' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Default discussions
  const defaultDiscussions = [
    {
      id: 1,
      title: 'Best resources for Security+ exam?',
      author: 'Alex Rodriguez',
      category: 'Study Tips',
      replies: 12,
      views: 245,
      lastActivity: '2 hours ago',
      tags: ['Security+', 'Resources'],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      title: 'How to prepare for CISSP?',
      author: 'Sarah Chen',
      category: 'Certification',
      replies: 8,
      views: 189,
      lastActivity: '5 hours ago',
      tags: ['CISSP', 'Preparation'],
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      title: 'Network security fundamentals discussion',
      author: 'Maria Garcia',
      category: 'Technical',
      replies: 15,
      views: 312,
      lastActivity: '1 day ago',
      tags: ['Network Security', 'Fundamentals'],
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  // Load discussions
  useEffect(() => {
    // Start with defaults
    setDiscussions(defaultDiscussions)
    
    // Try to load from Firebase
    try {
      const unsubscribe = subscribeToData('discussions', (data) => {
        if (data) {
          const discussionsArray = Object.values(data)
            .filter(d => d !== null && d !== undefined)
            .sort((a, b) => {
              const dateA = new Date(a.createdAt || 0).getTime()
              const dateB = new Date(b.createdAt || 0).getTime()
              return dateB - dateA
            })
          
          // Merge with defaults (avoid duplicates)
          const firebaseIds = new Set(discussionsArray.map(d => d.id))
          const defaultsToAdd = defaultDiscussions.filter(d => !firebaseIds.has(d.id))
          
          setDiscussions([...discussionsArray, ...defaultsToAdd])
        }
      })

      return () => {
        if (unsubscribe && typeof unsubscribe === 'function') {
          unsubscribe()
        }
      }
    } catch (error) {
      console.error('Error loading discussions:', error)
    }
  }, [])

  async function handleCreateDiscussion(e) {
    e.preventDefault()
    
    if (!newDiscussion.title.trim()) {
      setMessage({ text: 'Please enter a discussion title', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
      return
    }

    if (!currentUser) {
      setMessage({ text: 'Please sign in to create discussions', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
      return
    }

    const discussion = {
      id: Date.now(),
      title: newDiscussion.title,
      author: currentUser.displayName || currentUser.email || 'Anonymous',
      authorId: currentUser.uid,
      category: newDiscussion.category || 'General',
      replies: 0,
      views: 0,
      lastActivity: 'Just now',
      tags: [],
      content: newDiscussion.content || 'No content provided.',
      createdAt: new Date().toISOString()
    }

    // Optimistic UI update
    setDiscussions([discussion, ...discussions])
    setNewDiscussion({ title: '', content: '', category: 'General' })
    setMessage({ text: 'Discussion created successfully!', type: 'success' })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)

    // Save to Firebase
    try {
      await pushData('discussions', discussion)
    } catch (error) {
      console.error('Error saving discussion:', error)
      setMessage({ text: 'Error saving discussion. Please try again.', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
      // Remove from local state if Firebase save failed
      setDiscussions(prev => prev.filter(d => d.id !== discussion.id))
    }
  }

  return (
    <main className="forum-page">
      <section className="forum-header" aria-labelledby="forum-heading">
        <div>
          <h1 id="forum-heading">💬 Community Forum</h1>
          <p>Connect with fellow learners, share knowledge, and form study groups</p>
        </div>
        <Link to="/groups" className="btn btn-primary">
          Create Study Group
        </Link>
      </section>

      <div className="forum-content">
        {message.text && (
          <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
            {message.text}
          </div>
        )}

        <section className="create-discussion">
          <h3>Start a New Discussion</h3>
          <form onSubmit={handleCreateDiscussion} className="discussion-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Discussion title..."
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <select
                  value={newDiscussion.category}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, category: e.target.value })}
                >
                  <option value="General">General</option>
                  <option value="Study Tips">Study Tips</option>
                  <option value="Certification">Certification</option>
                  <option value="Technical">Technical</option>
                </select>
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Discussion content (optional)..."
                  value={newDiscussion.content || ''}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                  rows="3"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Create Discussion
            </button>
          </form>
        </section>

        <section className="discussions-list">
          <h3>Recent Discussions</h3>
          {loading ? (
            <div className="loading-state">
              <p>Loading discussions...</p>
            </div>
          ) : (
            <div className="discussions-grid">
              {discussions.length === 0 ? (
                <div className="empty-state">
                  <p>No discussions yet. Be the first to start one!</p>
                </div>
              ) : (
                discussions.map(discussion => (
                  <div key={discussion.id} className="discussion-card">
                    <div className="discussion-header">
                      <h4>{discussion.title}</h4>
                      <span className="category-badge">{discussion.category}</span>
                    </div>
                    <div className="discussion-meta">
                      <span>By {discussion.author}</span>
                      <span>{discussion.replies} replies</span>
                      <span>{discussion.views} views</span>
                    </div>
                    <div className="discussion-footer">
                      <div className="tags">
                        {discussion.tags && discussion.tags.map((tag, idx) => (
                          <span key={idx} className="tag">{tag}</span>
                        ))}
                      </div>
                      <span className="last-activity">{discussion.lastActivity}</span>
                    </div>
                    <Link to={`/forum/discussion/${discussion.id}`} className="btn btn-outline">
                      View Discussion
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
