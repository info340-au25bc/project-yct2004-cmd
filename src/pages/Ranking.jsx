import React from 'react'

const sampleLeaders = [
  { id: 1, name: 'alice', points: 2847 },
  { id: 2, name: 'bob', points: 2610 },
  { id: 3, name: 'charlie', points: 2390 }
]

export default function Ranking(){
  return (
    <main>
      <h2>Leaderboard</h2>
      <ol>
        {sampleLeaders.map(l => (
          <li key={l.id}>{l.name} — {l.points} pts</li>
        ))}
      </ol>
    </main>
  )
}
