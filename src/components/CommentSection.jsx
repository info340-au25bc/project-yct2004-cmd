import React, { useState, useEffect } from 'react'
import { subscribeToData, pushData, writeData } from '../utils/database'

export default function CommentSection({ itemId, itemType = 'quiz', currentUser }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState({})
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load comments from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToData(`comments/${itemId}`, (data) => {
      if (data) {
        // Convert Firebase object to array and sort by timestamp (newest first)
        const commentsArray = Object.entries(data)
          .filter(([key, comment]) => comment !== null && comment !== undefined)
          .map(([key, comment]) => ({
            ...comment,
            firebaseKey: key // Store Firebase key for updates
          }))
          .sort((a, b) => {
            const dateA = new Date(a.timestamp || 0).getTime()
            const dateB = new Date(b.timestamp || 0).getTime()
            return dateB - dateA
          })
        
        // Merge with local comments to avoid duplicates
        setComments(prev => {
          // Create a map of existing comments by id
          const existingMap = new Map()
          
          // First, add all existing local comments
          prev.forEach(c => {
            if (c && c.id) {
              existingMap.set(c.id, c)
            }
          })
          
          // Then, add/update comments from Firebase (Firebase data takes precedence)
          commentsArray.forEach(c => {
            if (c && c.id) {
              existingMap.set(c.id, c)
            }
          })
          
          // Convert back to array and sort
          const merged = Array.from(existingMap.values()).sort((a, b) => {
            const dateA = new Date(a.timestamp || 0).getTime()
            const dateB = new Date(b.timestamp || 0).getTime()
            return dateB - dateA
          })
          
          return merged
        })
      } else {
        // Keep local comments if they exist, otherwise show empty
        setComments(prev => prev.length > 0 ? prev : [])
      }
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [itemId])

  async function handleSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    
    // Prevent double submission
    if (isSubmitting) {
      return
    }
    
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

    setIsSubmitting(true)
    const commentText = newComment.trim()
    
    const comment = {
      id: Date.now(),
      author: currentUser.displayName || currentUser.email || 'Anonymous',
      authorId: currentUser.uid || 'anonymous',
      text: commentText,
      timestamp: new Date().toISOString(),
      replies: []
    }

    // Add comment to local state immediately for instant feedback
    setComments(prev => [comment, ...prev])
    
    // Clear input immediately
    setNewComment('')
    setIsSubmitting(false)
    
    // Show success message
    setMessage({ text: 'Comment posted successfully!', type: 'success' })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)

    // Save to Firebase in the background
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firebase save timeout')), 10000)
      )
      
      const savePromise = pushData(`comments/${itemId}`, comment)
      await Promise.race([savePromise, timeoutPromise])
      
      // Update the comment with Firebase key if needed
      if (commentKey) {
        setComments(prev => prev.map(c => 
          c.id === comment.id ? { ...c, firebaseKey: commentKey } : c
        ))
      }
    } catch (error) {
      console.error('Error saving comment to Firebase (but comment is shown locally):', error)
      // Don't show error to user since comment is already visible
      // The subscription will eventually sync it
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
        <div className={`message ${
          message.type === 'error' ? 'error-message' : 
          message.type === 'info' ? 'info-message' : 
          'success-message'
        }`}>
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
          disabled={!newComment.trim() || !currentUser || isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
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





