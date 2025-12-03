import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { subscribeToData, pushData, writeData } from '../utils/database'

export default function DiscussionDetail({ currentUser }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [discussion, setDiscussion] = useState(null)
  const [replies, setReplies] = useState([])
  const [newReply, setNewReply] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    // Default discussions (fallback)
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
        content: 'I\'m preparing for the Security+ exam and looking for the best study resources. What materials did you use? Any recommendations for practice tests?',
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
        content: 'I have 5 years of experience in cybersecurity and want to pursue CISSP certification. What\'s the best study plan? How long did it take you to prepare?',
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
        content: 'Let\'s discuss network security fundamentals. What are the key concepts every cybersecurity professional should know? Share your thoughts and experiences.',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Load discussion from Firebase
    const unsubscribeDiscussions = subscribeToData('discussions', (data) => {
      if (data) {
        const discussionsArray = Object.values(data)
        const foundDiscussion = discussionsArray.find(d => d.id === parseInt(id))
        if (foundDiscussion) {
          setDiscussion(foundDiscussion)
          setLoading(false)
        } else {
          // Check default discussions if not in Firebase
          const defaultDiscussion = defaultDiscussions.find(d => d.id === parseInt(id))
          if (defaultDiscussion) {
            setDiscussion(defaultDiscussion)
          }
          setLoading(false)
        }
      } else {
        // No Firebase data, check defaults
        const defaultDiscussion = defaultDiscussions.find(d => d.id === parseInt(id))
        if (defaultDiscussion) {
          setDiscussion(defaultDiscussion)
        }
        setLoading(false)
      }
    })

    // Load replies from Firebase
    const unsubscribeReplies = subscribeToData(`discussionReplies/${id}`, (data) => {
      if (data) {
        const repliesArray = Object.values(data)
          .filter(r => r !== null && r !== undefined)
          .sort((a, b) => {
            const dateA = new Date(a.timestamp || 0).getTime()
            const dateB = new Date(b.timestamp || 0).getTime()
            return dateA - dateB
          })
        setReplies(repliesArray)
      } else {
        setReplies([])
      }
    })

    return () => {
      if (unsubscribeDiscussions) unsubscribeDiscussions()
      if (unsubscribeReplies) unsubscribeReplies()
    }
  }, [id])

  async function handleSubmitReply(e) {
    e.preventDefault()
    if (!newReply.trim()) {
      setMessage({ text: 'Reply cannot be empty.', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
      return
    }
    if (!currentUser) {
      setMessage({ text: 'Please sign in to post a reply.', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
      return
    }

    const reply = {
      id: Date.now(),
      author: currentUser.displayName || currentUser.email || 'Anonymous',
      authorId: currentUser.uid || 'anonymous',
      content: newReply,
      timestamp: new Date().toISOString(),
      avatar: currentUser.photoURL || 'https://via.placeholder.com/40'
    }

    // Add reply to local state immediately
    const updatedReplies = [...replies, reply]
    setReplies(updatedReplies)

    try {
      // Save reply to Firebase
      await pushData(`discussionReplies/${id}`, reply)
      
      // Update discussion reply count in Firebase
      if (discussion) {
        const updatedDiscussion = {
          ...discussion,
          replies: updatedReplies.length,
          lastActivity: new Date().toISOString()
        }
        setDiscussion(updatedDiscussion)
        
        // Update in Firebase
        try {
          const unsubscribe = subscribeToData('discussions', async (data) => {
            if (data) {
              const discussionsArray = Object.entries(data)
              const foundEntry = discussionsArray.find(([key, d]) => d.id === parseInt(id))
              if (foundEntry) {
                await writeData(`discussions/${foundEntry[0]}`, updatedDiscussion)
              }
            }
            if (unsubscribe) unsubscribe()
          })
        } catch (error) {
          // Firebase update failed, but that's okay - reply is saved
        }
      }
      
      setNewReply('')
      setMessage({ text: 'Reply posted successfully!', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (error) {
      setMessage({ text: 'Error posting reply. Please try again.', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
      // Remove from local state if Firebase save failed
      setReplies(replies)
    }
  }

  function formatTimeAgo(timestamp) {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now - time) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return time.toLocaleDateString()
  }

  if (loading) {
    return (
      <main className="discussion-detail-page">
        <div className="loading">Loading discussion...</div>
      </main>
    )
  }

  if (!discussion) {
    return (
      <main className="discussion-detail-page">
        <div className="error-state">
          <h2>Discussion not found</h2>
          <p>The discussion you're looking for doesn't exist.</p>
          <Link to="/forum" className="btn btn-primary">Back to Forum</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="discussion-detail-page">
      {message.text && (
        <div className={`message ${message.type === 'error' ? 'error-message' : message.type === 'success' ? 'success-message' : 'info-message'}`}>
          {message.text}
        </div>
      )}
      <div className="discussion-container">
        <div className="discussion-header-section">
          <Link to="/forum" className="back-link">← Back to Forum</Link>
          <div className="discussion-title-section">
            <div className="title-row">
              <h1>{discussion.title}</h1>
              <span className="category-badge">{discussion.category}</span>
            </div>
            <div className="discussion-meta-info">
              <div className="author-info">
                <img 
                  src="https://via.placeholder.com/40" 
                  alt={discussion.author} 
                  className="author-avatar"
                />
                <div>
                  <strong>{discussion.author}</strong>
                  <span className="meta-text">{formatTimeAgo(discussion.createdAt || discussion.lastActivity)}</span>
                </div>
              </div>
              <div className="discussion-stats">
                <span>{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
                <span>{discussion.views || 0} views</span>
              </div>
            </div>
            {discussion.tags && discussion.tags.length > 0 && (
              <div className="discussion-tags">
                {discussion.tags.map((tag, idx) => (
                  <span key={idx} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="discussion-content">
          <div className="original-post">
            <div className="post-content">
              <p>{discussion.content || 'No content provided.'}</p>
            </div>
          </div>
        </div>

        <div className="replies-section">
          <h2>
            {replies.length === 0 
              ? 'No replies yet' 
              : `${replies.length} ${replies.length === 1 ? 'Reply' : 'Replies'}`}
          </h2>

          {replies.length > 0 && (
            <div className="replies-list">
              {replies.map(reply => (
                <div key={reply.id} className="reply-item">
                  <img 
                    src={reply.avatar} 
                    alt={reply.author} 
                    className="reply-avatar"
                  />
                  <div className="reply-content">
                    <div className="reply-header">
                      <strong>{reply.author}</strong>
                      <span className="reply-time">{formatTimeAgo(reply.timestamp)}</span>
                    </div>
                    <p>{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentUser ? (
            <form onSubmit={handleSubmitReply} className="reply-form">
              <div className="reply-form-header">
                <img 
                  src={currentUser.photoURL || 'https://via.placeholder.com/40'} 
                  alt={currentUser.displayName || 'You'} 
                  className="reply-form-avatar"
                />
                <div>
                  <strong>Post a reply as {currentUser.displayName || currentUser.email}</strong>
                </div>
              </div>
              <textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Share your thoughts, ask questions, or provide helpful information..."
                rows="6"
                required
                className="reply-textarea"
              />
              <div className="reply-form-actions">
                <button type="submit" className="btn btn-primary">
                  Post Reply
                </button>
                <button 
                  type="button" 
                  onClick={() => setNewReply('')}
                  className="btn btn-outline"
                >
                  Clear
                </button>
              </div>
            </form>
          ) : (
            <div className="login-prompt">
              <p>Please <Link to="/login">sign in</Link> to post a reply.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}




