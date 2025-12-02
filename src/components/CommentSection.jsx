import React, { useState, useEffect } from 'react'
import { subscribeToData, pushData, writeData } from '../utils/database'
import './CommentSection.css'

export default function CommentSection({ itemId, itemType = 'quiz', currentUser }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState({})
  const [message, setMessage] = useState({ text: '', type: '' })

  // Load comments from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToData(`comments/${itemId}`, (data) => {
      if (data) {
        // Convert Firebase object to array and sort by timestamp
        const commentsArray = Object.entries(data).map(([key, comment]) => ({
          ...comment,
          firebaseKey: key // Store Firebase key for updates
        })).sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp)
        })
        setComments(commentsArray)
      } else {
        // Default comments if no data
        const defaultComments = [
          {
            id: 1,
            author: 'Alex Rodriguez',
            text: 'Great quiz! The network security questions really helped me understand firewalls better.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            replies: []
          },
          {
            id: 2,
            author: 'Sarah Chen',
            text: 'I found question 3 challenging. Can someone explain the difference between symmetric and asymmetric encryption?',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            replies: []
          }
        ]
        setComments(defaultComments)
      }
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [itemId])

  async function handleSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    
    if (!newComment.trim()) {
      setMessage({ text: 'Please enter a comment before posting', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
      return
    }

    if (!currentUser) {
      setMessage({ text: 'Please sign in to post comments', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
      return
    }

    const comment = {
      id: Date.now(),
      author: currentUser.displayName || currentUser.email || 'Anonymous',
      authorId: currentUser.uid || 'anonymous',
      text: newComment.trim(),
      timestamp: new Date().toISOString(),
      replies: []
    }

    try {
      await pushData(`comments/${itemId}`, comment)
      setNewComment('')
      setMessage({ text: 'Comment posted successfully!', type: 'success' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    } catch (error) {
      console.error('Error posting comment:', error)
      setMessage({ text: 'Failed to post comment. Please try again.', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    }
  }

  async function handleReply(commentId) {
    const replyTextValue = replyText[commentId]
    if (!replyTextValue || !replyTextValue.trim()) return

    if (!currentUser) {
      setMessage({ text: 'Please sign in to reply to comments', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
      return
    }

    const reply = {
      id: Date.now(),
      author: currentUser.displayName || currentUser.email || 'Anonymous',
      authorId: currentUser.uid || 'anonymous',
      text: replyTextValue,
      timestamp: new Date().toISOString()
    }

    try {
      // Update comment with new reply
      const comment = comments.find(c => c.id === commentId)
      if (comment && comment.firebaseKey) {
        const updatedReplies = [...(comment.replies || []), reply]
        const updatedComment = {
          ...comment,
          replies: updatedReplies
        }
        // Remove firebaseKey before saving
        delete updatedComment.firebaseKey
        
        // Update comment in Firebase
        await writeData(`comments/${itemId}/${comment.firebaseKey}`, updatedComment)
      } else {
        // If comment doesn't have firebaseKey, update local state
        const updatedComments = comments.map(c => {
          if (c.id === commentId) {
            return {
              ...c,
              replies: [...(c.replies || []), reply]
            }
          }
          return c
        })
        setComments(updatedComments)
      }

      setReplyText({ ...replyText, [commentId]: '' })
      setReplyingTo(null)
    } catch (error) {
      console.error('Error posting reply:', error)
      setMessage({ text: 'Error posting reply. Please try again.', type: 'error' })
      setTimeout(() => setMessage({ text: '', type: '' }), 3000)
    }
  }

  function formatTimeAgo(timestamp) {
    if (!timestamp) return 'Just now'
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now - time) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return time.toLocaleDateString()
  }

  return (
    <div className="comment-section">
      {message.text && (
        <div className={`message ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
          {message.text}
        </div>
      )}
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e)
              }
            }}
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!newComment.trim() || !currentUser}
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
                  <span className="comment-time">{formatTimeAgo(comment.timestamp)}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
                <button 
                  className="btn-reply"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                >
                  Reply
                </button>
              </div>

              {/* Replies Section */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="replies-section">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="reply-item">
                      <div className="reply-content">
                        <div className="reply-header">
                          <span className="reply-author">{reply.author}</span>
                          <span className="reply-time">{formatTimeAgo(reply.timestamp)}</span>
                        </div>
                        <p className="reply-text">{reply.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="reply-form-section">
                  <textarea
                    value={replyText[comment.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                    placeholder="Write a reply..."
                    className="reply-input"
                    rows="2"
                  />
                  <div className="reply-actions">
                    <button
                      onClick={() => handleReply(comment.id)}
                      className="btn btn-primary btn-sm"
                      disabled={!replyText[comment.id]?.trim()}
                    >
                      Post Reply
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyText({ ...replyText, [comment.id]: '' })
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}





