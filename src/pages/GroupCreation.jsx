import React, { useState } from 'react'

const sampleResources = [
  'Professor Messer Security+ Course',
  'CompTIA Security+ Study Guide',
  'Cybrary',
  'Udemy Cybersecurity Courses'
]

export default function GroupCreation(){
  const [form, setForm] = useState({ name: '', description: '', resource: '', maxMembers: 8 })
  const [created, setCreated] = useState(null)

  function handleChange(e){
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e){
    e.preventDefault()
    setCreated({ ...form })
  }

  return (
    <main>
      <section className="group-form-section">
        <h2>Create a Study Group</h2>
        <form onSubmit={handleSubmit} aria-label="Create study group">
          <div className="form-group">
            <label>Group Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Group Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Select a Resource</label>
            <select name="resource" value={form.resource} onChange={handleChange} required>
              <option value="">-- choose --</option>
              {sampleResources.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Maximum Members</label>
            <input type="number" name="maxMembers" value={form.maxMembers} onChange={handleChange} min={2} max={20} />
          </div>
          <button className="btn" type="submit">Create Group</button>
        </form>

        {created && (
          <div className="created-summary">
            <h3>Group Created</h3>
            <p>Name: {created.name}</p>
            <p>Resource: {created.resource}</p>
            <p>Max Members: {created.maxMembers}</p>
          </div>
        )}
      </section>
    </main>
  )
}
