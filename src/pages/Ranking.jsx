import React, { useState, useMemo } from 'react'

const initialLeaders = [
  { id: 1, name: 'Alex Rodriguez', title: 'Cybersecurity Engineer', points: 28420, quizzes: 127, accuracy: 92, streak: 15, badges: ['🏆', '🥇', '🔥'], rank: 1, certification: 'security-plus' },
  { id: 2, name: 'Sarah Chen', title: 'Security Analyst', points: 24850, quizzes: 112, accuracy: 89, streak: 12, badges: ['🥈', '📚'], rank: 2, certification: 'cissp' },
  { id: 3, name: 'Maria Garcia', title: 'Penetration Tester', points: 22190, quizzes: 98, accuracy: 87, streak: 10, badges: ['🥉', '🎯'], rank: 3, certification: 'ceh' },
  { id: 4, name: 'You', title: 'Student', points: 21450, quizzes: 47, accuracy: 89, streak: 12, badges: ['🏆', '🥈', '🥉'], rank: 4, certification: 'security-plus', isCurrentUser: true },
  { id: 5, name: 'David Kim', title: 'IT Manager', points: 19820, quizzes: 42, accuracy: 87, streak: 8, badges: ['🏆', '🥈'], rank: 5, certification: 'cissp' },
  { id: 6, name: 'Jennifer Liu', title: 'Security Consultant', points: 18650, quizzes: 39, accuracy: 92, streak: 15, badges: ['🏆', '🏆', '🥈'], rank: 6, certification: 'incident-response' }
]

const achievements = [
  { icon: '🏆', title: 'Quiz Master', description: 'Complete 50 quizzes with 90%+ accuracy', target: 50, current: 47 },
  { icon: '🔥', title: 'Streak Master', description: 'Maintain a 30-day study streak', target: 30, current: 12 },
  { icon: '🎯', title: 'Accuracy Expert', description: 'Achieve 95% accuracy across all quizzes', target: 95, current: 89 },
  { icon: '⚡', title: 'Speed Demon', description: 'Complete 10 quizzes in under 5 minutes each', target: 10, current: 7 }
]

export default function Ranking(){
  const [timeframe, setTimeframe] = useState('all-time')
  const [category, setCategory] = useState('overall')
  const [certification, setCertification] = useState('all')

  const filteredLeaders = useMemo(() => {
    return initialLeaders.filter(leader => {
      const matchesCategory = category === 'overall' || leader.title.toLowerCase().includes(category.replace('-', ' '))
      const matchesCert = certification === 'all' || leader.certification === certification
      return matchesCategory && matchesCert
    })
  }, [category, certification])

  const topThree = filteredLeaders.slice(0, 3)
  const remaining = filteredLeaders.slice(3)

  return (
    <main>
      {/* Header */}
      <section className="leaderboard-header">
        <h2>🏆 Global Leaderboard</h2>
        <p>Compete with cybersecurity learners worldwide and climb the rankings!</p>
        <div className="leaderboard-filters">
          <form className="filter-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="timeframe">Timeframe</label>
              <select 
                id="timeframe" 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="all-time">All Time</option>
                <option value="monthly">This Month</option>
                <option value="weekly">This Week</option>
                <option value="daily">Today</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select 
                id="category" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="overall">Overall</option>
                <option value="network-security">Network Security</option>
                <option value="cryptography">Cryptography</option>
                <option value="incident-response">Incident Response</option>
                <option value="risk-management">Risk Management</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="certification">Certification</label>
              <select 
                id="certification" 
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
              >
                <option value="all">All Certifications</option>
                <option value="security-plus">Security+</option>
                <option value="cissp">CISSP</option>
                <option value="ceh">CEH</option>
                <option value="incident-response">Incident Response</option>
              </select>
            </div>
            <button type="submit" className="btn btn-search">Filter</button>
          </form>
        </div>
      </section>

      {/* Podium */}
      <section className="top-performers">
        <h3>Top Performers</h3>
        <div className="podium">
          {topThree[1] && (
            <div className="podium-place second rank-2">
              <div className="medal">🥈</div>
              <div className="player-info">
                <h4>{topThree[1].name}</h4>
                <p>{topThree[1].title}</p>
                <div className="score">{topThree[1].points.toLocaleString()} pts</div>
              </div>
            </div>
          )}
          {topThree[0] && (
            <div className="podium-place first rank-1">
              <div className="medal">🥇</div>
              <div className="player-info">
                <h4>{topThree[0].name}</h4>
                <p>{topThree[0].title}</p>
                <div className="score">{topThree[0].points.toLocaleString()} pts</div>
              </div>
            </div>
          )}
          {topThree[2] && (
            <div className="podium-place third rank-3">
              <div className="medal">🥉</div>
              <div className="player-info">
                <h4>{topThree[2].name}</h4>
                <p>{topThree[2].title}</p>
                <div className="score">{topThree[2].points.toLocaleString()} pts</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Full Table */}
      <section className="leaderboard-table">
        <h3>Full Rankings</h3>
        <div className="table-container">
          <table className="leaderboard-table-content">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Player</th>
                <th scope="col">Points</th>
                <th scope="col">Quizzes</th>
                <th scope="col">Accuracy</th>
                <th scope="col">Streak</th>
                <th scope="col">Badges</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaders.map(leader => (
                <tr key={leader.id} className={leader.isCurrentUser ? 'current-user' : ''}>
                  <td>{leader.rank}</td>
                  <td>
                    <div className="player-cell">
                      <div className="player-details">
                        <span className="player-name">{leader.name}</span>
                        <span className="player-title">{leader.title}</span>
                      </div>
                    </div>
                  </td>
                  <td>{leader.points.toLocaleString()}</td>
                  <td>{leader.quizzes.toLocaleString()}</td>
                  <td>{leader.accuracy}%</td>
                  <td>{leader.streak.toLocaleString()} days</td>
                  <td>
                    <div className="badges">
                      {leader.badges.map((badge, idx) => (
                        <span key={idx} className="badge">{badge}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </section>
      

        <section className="achievements">
          <h3>Achievement Badges</h3>
          <div className="badges-grid">
            {achievements.map((achievement, idx) => {
              const percent = achievement.target 
                ? Math.min((achievement.current / achievement.target) * 100, 100) 
                : 0
              return (
                <div key={idx} className="badge-card">
                  <div className="badge-icon">{achievement.icon}</div>
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                  <div className="badge-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                    <span>{achievement.current}/{achievement.target}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
    </main>
  )
}
