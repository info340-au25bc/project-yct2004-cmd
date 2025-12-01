import React, { useState } from 'react'
import './CommentSection.css'

export default function CommentSection({ itemId, itemType = 'quiz' }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Alex Rodriguez',
      text: 'Great quiz! The network security questions really helped me understand firewalls better.',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      author: 'Sarah Chen',
      text: 'I found question 3 challenging. Can someone explain the difference between symmetric and asymmetric encryption?',
      timestamp: '1 day ago'
    }
  ])
  const [newComment, setNewComment] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      author: 'You', // In production, this would come from auth
      text: newComment,
      timestamp: 'Just now'
    }

    setComments([comment, ...comments])
    setNewComment('')
  }

  return (
    <div className="comment-section">
      <h3>💬 Discussion Forum</h3>
      <p className="comment-subtitle">Share your thoughts, ask questions, and help others learn</p>

      <form onSubmit={handleSubmit} className="comment-form">
        <div className="comment-input-wrapper">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment or ask a question..."
            className="comment-input"
            rows="3"
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!newComment.trim()}
        >
          Post Comment
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to start the discussion!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-time">{comment.timestamp}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}


