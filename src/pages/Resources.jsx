import React from 'react'

const resources = [
  { id: 1, title: 'Professor Messer Security+ Course', url: 'https://www.professormesser.com' },
  { id: 2, title: 'CompTIA Security+ Study Guide', url: 'https://www.amazon.com' },
  { id: 3, title: 'Google Phishing Quiz', url: 'https://phishingquiz.withgoogle.com/' }
]

export default function Resources(){
  return (
    <main>
      <h2>Resources</h2>
      <ul>
        {resources.map(r => (
          <li key={r.id}><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a></li>
        ))}
      </ul>
    </main>
  )
}
