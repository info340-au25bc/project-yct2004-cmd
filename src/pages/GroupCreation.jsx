import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './GroupCreation.css'

const sampleResources = [
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
]

const existingGroups = [
  {
    id: 1,
    name: 'Security+ Fundamentals',
    description: 'Studying Professor Messer\'s Security+ course together. Perfect for beginners!',
    members: 5,
    maxMembers: 8,
    difficulty: 'beginner'
  },
  {
    id: 2,
    name: 'CISSP Study Group',
    description: 'Advanced cybersecurity professionals preparing for CISSP certification.',
    members: 3,
    maxMembers: 6,
    difficulty: 'advanced'
  },
  {
    id: 3,
    name: 'Network Security Basics',
    description: 'Learning network security fundamentals through hands-on labs and discussions.',
    members: 7,
    maxMembers: 10,
    difficulty: 'intermediate'
  }
]

export default function GroupCreation({ currentUser }){
  const navigate = useNavigate()
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    resource: '', 
    maxMembers: 8,
    difficulty: '',
    schedule: '',
    timezone: ''
  })
  const [created, setCreated] = useState(null)
  const [errors, setErrors] = useState({})
  const [joinedGroups, setJoinedGroups] = useState([])

  function handleChange(e){
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function validateForm(){
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Group name is required'
    if (!form.resource) newErrors.resource = 'Please select a resource'
    if (!form.difficulty) newErrors.difficulty = 'Please select difficulty level'
    if (!form.schedule) newErrors.schedule = 'Please select a study schedule'
    if (!form.timezone) newErrors.timezone = 'Please select timezone'
    if (form.maxMembers < 2 || form.maxMembers > 20) {
      newErrors.maxMembers = 'Members must be between 2 and 20'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e){
    e.preventDefault()
    if (validateForm()) {
      const newGroup = { ...form, id: Date.now(), members: 1 }
      setCreated(newGroup)
      setJoinedGroups([...joinedGroups, newGroup])
      // Reset form
      setForm({ 
        name: '', 
        description: '', 
        resource: '', 
        maxMembers: 8,
        difficulty: '',
        schedule: '',
        timezone: ''
      })
      setTimeout(() => {
        navigate('/forum')
      }, 2000)
    }
  }

  const [joinMessage, setJoinMessage] = useState('')

  function handleJoinGroup(groupId) {
    const group = existingGroups.find(g => g.id === groupId)
    if (group && !joinedGroups.find(g => g.id === groupId)) {
      setJoinedGroups([...joinedGroups, { ...group, joined: true }])
      setJoinMessage(`You've joined ${group.name}! Redirecting to Forum...`)
      setTimeout(() => {
        navigate('/forum')
      }, 1500)
    }
  }

  return (
    <main>
      <section className="hero-section">
        <h2>Create a Study Group</h2>
        <p>Form a study group with fellow cybersecurity learners. Choose a resource to focus on and collaborate to master the material together!</p>
      </section>

      <section className="group-form-section">
        <h3>Group Creation Form</h3>
        <form onSubmit={handleSubmit} aria-label="Create study group">
          <div className="form-group">
            <label htmlFor="group-name">Group Name:</label>
            <input 
              type="text" 
              id="group-name" 
              name="name" 
              placeholder="e.g., Security+ Study Group" 
              value={form.name}
              onChange={handleChange}
              required
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="group-description">Group Description:</label>
            <textarea 
              id="group-description" 
              name="description" 
              rows="4" 
              placeholder="Describe your group's goals, study schedule, and target audience..."
              value={form.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="resource-selection">Select a Resource for Your Group:</label>
            <select 
              id="resource-selection" 
              name="resource" 
              value={form.resource}
              onChange={handleChange}
              required
              className={errors.resource ? 'error' : ''}
            >
              <option value="">--Please choose an option--</option>
              {sampleResources.map((resource, idx) => (
                <option key={idx} value={resource}>{resource}</option>
              ))}
            </select>
            {errors.resource && <span className="error-message">{errors.resource}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="max-members">Maximum Members:</label>
              <input 
                type="number" 
                id="max-members" 
                name="maxMembers" 
                min="2" 
                max="20" 
                value={form.maxMembers}
                onChange={handleChange}
                required
                className={errors.maxMembers ? 'error' : ''}
              />
              {errors.maxMembers && <span className="error-message">{errors.maxMembers}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="difficulty-level">Target Difficulty Level:</label>
              <select 
                id="difficulty-level" 
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                required
                className={errors.difficulty ? 'error' : ''}
              >
                <option value="">Select difficulty...</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.difficulty && <span className="error-message">{errors.difficulty}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="study-schedule">Preferred Study Schedule:</label>
              <select 
                id="study-schedule" 
                name="schedule"
                value={form.schedule}
                onChange={handleChange}
                required
                className={errors.schedule ? 'error' : ''}
              >
                <option value="">Select schedule...</option>
                <option value="weekday-mornings">Weekday Mornings</option>
                <option value="weekday-evenings">Weekday Evenings</option>
                <option value="weekends">Weekends</option>
                <option value="flexible">Flexible</option>
              </select>
              {errors.schedule && <span className="error-message">{errors.schedule}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="timezone">Timezone:</label>
              <select 
                id="timezone" 
                name="timezone"
                value={form.timezone}
                onChange={handleChange}
                required
                className={errors.timezone ? 'error' : ''}
              >
                <option value="">Select timezone...</option>
                <option value="pst">Pacific (PST)</option>
                <option value="mst">Mountain (MST)</option>
                <option value="cst">Central (CST)</option>
                <option value="est">Eastern (EST)</option>
              </select>
              {errors.timezone && <span className="error-message">{errors.timezone}</span>}
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary start-quiz-btn">Create Group</button>
        </form>

        {created && (
          <div className="created-summary">
            <h3>✅ Group Created Successfully!</h3>
            <div className="created-details">
              <p><strong>Name:</strong> {created.name}</p>
              <p><strong>Resource:</strong> {created.resource}</p>
              <p><strong>Max Members:</strong> {created.maxMembers}</p>
              <p><strong>Difficulty:</strong> {created.difficulty}</p>
              <p><strong>Schedule:</strong> {created.schedule}</p>
              <p><strong>Timezone:</strong> {created.timezone}</p>
              {created.description && <p><strong>Description:</strong> {created.description}</p>}
            </div>
            <p style={{ marginTop: '1rem', color: '#2563eb' }}>
              Redirecting to Forum to start chatting...
            </p>
          </div>
        )}
      </section>

      {joinMessage && (
        <div className="success-message">
          {joinMessage}
        </div>
      )}
      <section className="existing-groups">
        <h2>Join Existing Groups</h2>
        <div className="groups-grid">
          {existingGroups.map(group => (
            <div key={group.id} className="group-card">
              <h3>{group.name}</h3>
              <p>{group.description}</p>
              <div className="group-meta">
                <span className="members">{group.members}/{group.maxMembers} members</span>
                <span className={`difficulty ${group.difficulty}`}>{group.difficulty}</span>
              </div>
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={() => handleJoinGroup(group.id)}
                disabled={joinedGroups.find(g => g.id === group.id)}
              >
                {joinedGroups.find(g => g.id === group.id) ? 'Joined ✓' : 'Join Group'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
