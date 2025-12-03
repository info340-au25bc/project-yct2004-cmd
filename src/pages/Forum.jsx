import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { subscribeToData, pushData } from '../utils/database'

export default function Forum({ currentUser }) {
  const [activeTab, setActiveTab] = useState('discussions')
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

  const [discussions, setDiscussions] = useState(defaultDiscussions)
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '', category: '' })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Load discussions from Firebase
  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToData('discussions', (data) => {
      if (data) {
        const discussionsArray = Object.values(data)
          .filter(d => d !== null && d !== undefined)
          .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime()
            const dateB = new Date(b.createdAt || 0).getTime()
            return dateB - dateA
          })
        
        // Merge with default discussions (avoid duplicates)
        const defaultIds = new Set([1, 2, 3])
        const firebaseIds = new Set(discussionsArray.map(d => d.id))
        const defaultsToAdd = defaultDiscussions.filter(d => !firebaseIds.has(d.id))
        
        setDiscussions([...discussionsArray, ...defaultsToAdd])
      } else {
        // No Firebase data, use defaults
        setDiscussions(defaultDiscussions)
      }
      setLoading(false)
    })

    return () => {
      if (unsubscribe) unsubscribe()
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
    setNewDiscussion({ title: '', content: '', category: '' })
    setMessage({ text: 'Discussion created successfully!', type: 'success' })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)

    // Save to Firebase
    try {
      await pushData('discussions', discussion)
    } catch (error) {
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

      <div className="forum-tabs">
        <button
          className={activeTab === 'discussions' ? 'active' : ''}
          onClick={() => setActiveTab('discussions')}
        >
          Discussions
        </button>
        <button
          className={activeTab === 'groups' ? 'active' : ''}
          onClick={() => setActiveTab('groups')}
        >
          My Groups
        </button>
        <button
          className={activeTab === 'courses' ? 'active' : ''}
          onClick={() => setActiveTab('courses')}
        >
          My Courses
        </button>
      </div>

      {activeTab === 'discussions' && (
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
                    <option value="">Select category...</option>
                    <option value="Study Tips">Study Tips</option>
                    <option value="Certification">Certification</option>
                    <option value="Technical">Technical</option>
                    <option value="General">General</option>
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
                {discussions.map(discussion => (
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
                      {discussion.tags.map((tag, idx) => (
                        <span key={idx} className="tag">{tag}</span>
                      ))}
                    </div>
                    <span className="last-activity">{discussion.lastActivity}</span>
                  </div>
                  <Link to={`/forum/discussion/${discussion.id}`} className="btn btn-outline">
                    View Discussion
                  </Link>
                </div>
              ))}
              </div>
            )}
          </section>
        </div>
      )}

          {activeTab === 'groups' && (
            <div className="forum-content">
              <GroupsTab currentUser={currentUser} />
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="forum-content">
              <CoursesTab currentUser={currentUser} />
            </div>
          )}
    </main>
  )
}

function GroupsTab({ currentUser }) {
  const [myGroups, setMyGroups] = useState([
    {
      id: 1,
      name: 'Security+ Study Group',
      description: 'Weekly study sessions for CompTIA Security+ exam preparation',
      members: 5,
      maxMembers: 8,
      courses: ['Professor Messer Security+ Course', 'CompTIA Security+ Study Guide']
    }
  ])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [chatMessages, setChatMessages] = useState({})
  const [newMessage, setNewMessage] = useState('')

  function openChat(groupId) {
    setSelectedGroup(groupId)
    if (!chatMessages[groupId]) {
      setChatMessages({
        ...chatMessages,
        [groupId]: [
          {
            id: 1,
            author: 'Alex',
            text: 'Welcome to the group! Let\'s start studying together.',
            timestamp: '2 hours ago',
            avatar: 'https://via.placeholder.com/32'
          }
        ]
      })
    }
  }

  function sendMessage() {
    if (!newMessage.trim() || !selectedGroup) return

    const message = {
      id: Date.now(),
      author: currentUser?.displayName || currentUser?.email || 'You',
      text: newMessage,
      timestamp: 'Just now',
      avatar: currentUser?.photoURL || 'https://via.placeholder.com/32'
    }

    setChatMessages({
      ...chatMessages,
      [selectedGroup]: [...(chatMessages[selectedGroup] || []), message]
    })
    setNewMessage('')
  }

  return (
    <div>
      <div className="groups-header">
        <h3>My Study Groups</h3>
        <Link to="/groups" className="btn btn-primary">Create New Group</Link>
      </div>

      <div className="groups-chat-container">
        <div className="groups-list">
          {myGroups.length === 0 ? (
            <div className="empty-state">
              <p>You haven't joined any groups yet.</p>
              <Link to="/groups" className="btn btn-primary">Browse Groups</Link>
            </div>
          ) : (
            myGroups.map(group => (
              <div
                key={group.id}
                className={`group-item ${selectedGroup === group.id ? 'active' : ''}`}
                onClick={() => openChat(group.id)}
              >
                <div className="group-item-header">
                  <h4>{group.name}</h4>
                  <span className="member-count">{group.members}/{group.maxMembers}</span>
                </div>
                <p>{group.description}</p>
                {group.courses && group.courses.length > 0 && (
                  <div className="group-courses">
                    <strong>Courses:</strong>
                    <ul>
                      {group.courses.map((course, idx) => (
                        <li key={idx}>{course}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {selectedGroup && (
          <div className="chat-panel">
            <div className="chat-header">
              <h4>Group Chat</h4>
              <button onClick={() => setSelectedGroup(null)} className="btn-close">×</button>
            </div>
            <div className="chat-messages">
              {chatMessages[selectedGroup]?.map(msg => (
                <div key={msg.id} className="chat-message">
                  <img src={msg.avatar} alt={msg.author} className="message-avatar" />
                  <div className="message-content">
                    <div className="message-header">
                      <strong>{msg.author}</strong>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage} className="btn btn-primary">Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CoursesTab({ currentUser }) {
  const [myCourses, setMyCourses] = useState([])
  const [availableCourses] = useState([
    'Professor Messer Security+ Course',
    'CompTIA Security+ Study Guide',
    'Cybrary',
    'Udemy Cybersecurity Courses',
    'Coursera Cybersecurity Specializations',
    'SANS Security Awareness Training',
    'CISA Free Cybersecurity Services & Tools',
    'CybersecTools - 2600+ Free Tools',
    'PurpleSec - Free Tools for Small Businesses',
    'KnowBe4 - Free Awareness & Phishing Tools',
    'NIST - Free & Low-Cost Cybersecurity Courses',
    'OpenLearn - Intro to Cybersecurity'
  ])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [courseRatings, setCourseRatings] = useState({})

  function addCourse() {
    if (selectedCourse && !myCourses.includes(selectedCourse)) {
      setMyCourses([...myCourses, selectedCourse])
      setSelectedCourse('')
    }
  }

  function removeCourse(course) {
    setMyCourses(myCourses.filter(c => c !== course))
  }

  function rateCourse(course, rating) {
    setCourseRatings({
      ...courseRatings,
      [course]: rating
    })
  }

  return (
    <div>
      <div className="courses-header">
        <h3>My Course List</h3>
        <p>Manage the courses you want to study</p>
      </div>

      <section className="add-course-section">
        <h4>Add a Course</h4>
        <div className="add-course-form">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="course-select"
          >
            <option value="">Select a course to add...</option>
            {availableCourses
              .filter(course => !myCourses.includes(course))
              .map((course, idx) => (
                <option key={idx} value={course}>{course}</option>
              ))}
          </select>
          <button
            onClick={addCourse}
            className="btn btn-primary"
            disabled={!selectedCourse}
          >
            Add Course
          </button>
        </div>
      </section>

      {myCourses.length > 0 ? (
        <section className="my-courses-section">
          <h4>Your Courses ({myCourses.length})</h4>
          <div className="courses-list">
            {myCourses.map((course, idx) => (
              <div key={idx} className="course-item">
                <div className="course-info">
                  <h5>{course}</h5>
                  <div className="course-rating">
                    <span>Rate:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        className={`star-btn ${courseRatings[course] >= star ? 'active' : ''}`}
                        onClick={() => rateCourse(course, star)}
                      >
                        ★
                      </button>
                    ))}
                    {courseRatings[course] && (
                      <span className="rating-value">({courseRatings[course]}/5)</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeCourse(course)}
                  className="btn btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="empty-state">
          <p>No courses added yet. Add courses to get started!</p>
        </div>
      )}
    </div>
  )
}

