import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './DiscussionDetail.css'

export default function DiscussionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [discussion, setDiscussion] = useState(null)
  const [replies, setReplies] = useState([])
  const [newReply, setNewReply] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load discussion and replies from localStorage
    const discussions = JSON.parse(localStorage.getItem('forumDiscussions') || '[]')
    const foundDiscussion = discussions.find(d => d.id === parseInt(id))
    
    if (foundDiscussion) {
      setDiscussion(foundDiscussion)
      // Load replies for this discussion
      const allReplies = JSON.parse(localStorage.getItem('forumReplies') || '{}')
      setReplies(allReplies[id] || [])
    } else {
      // Check if it's one of the default discussions
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
      
      const defaultDiscussion = defaultDiscussions.find(d => d.id === parseInt(id))
      if (defaultDiscussion) {
        setDiscussion(defaultDiscussion)
        // Load default replies for these discussions
        const defaultReplies = {
          1: [
            {
              id: 1,
              author: 'John Smith',
              content: 'I highly recommend Professor Messer\'s free Security+ course on YouTube. It covers all the objectives and is very comprehensive.',
              timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
              avatar: 'https://via.placeholder.com/40'
            },
            {
              id: 2,
              author: 'Emily Johnson',
              content: 'The CompTIA Security+ Study Guide by Darril Gibson is excellent. Also, make sure to take practice exams from ExamCompass.',
              timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
              avatar: 'https://via.placeholder.com/40'
            }
          ],
          2: [
            {
              id: 1,
              author: 'Michael Brown',
              content: 'I passed CISSP after 6 months of study. I used the Official Study Guide and took a bootcamp. The key is understanding the concepts, not just memorizing.',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              avatar: 'https://via.placeholder.com/40'
            }
          ],
          3: [
            {
              id: 1,
              author: 'David Lee',
              content: 'Network security fundamentals include understanding firewalls, VPNs, IDS/IPS, network segmentation, and secure protocols like TLS/SSL.',
              timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
              avatar: 'https://via.placeholder.com/40'
            }
          ]
        }
        setReplies(defaultReplies[id] || [])
      }
    }
    
    setLoading(false)
  }, [id])

  function handleSubmitReply(e) {
    e.preventDefault()
    if (!newReply.trim() || !currentUser) return

    const reply = {
      id: Date.now(),
      author: currentUser.displayName || currentUser.email || 'Anonymous',
      content: newReply,
      timestamp: new Date().toISOString(),
      avatar: currentUser.photoURL || 'https://via.placeholder.com/40'
    }

    const updatedReplies = [...replies, reply]
    setReplies(updatedReplies)

    // Save to localStorage
    const allReplies = JSON.parse(localStorage.getItem('forumReplies') || '{}')
    allReplies[id] = updatedReplies
    localStorage.setItem('forumReplies', JSON.stringify(allReplies))

    // Update discussion reply count
    if (discussion) {
      const discussions = JSON.parse(localStorage.getItem('forumDiscussions') || '[]')
      const updatedDiscussions = discussions.map(d => {
        if (d.id === parseInt(id)) {
          return { ...d, replies: updatedReplies.length, lastActivity: 'Just now' }
        }
        return d
      })
      localStorage.setItem('forumDiscussions', JSON.stringify(updatedDiscussions))
      setDiscussion({ ...discussion, replies: updatedReplies.length, lastActivity: 'Just now' })
    }

    setNewReply('')
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

