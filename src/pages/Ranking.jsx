import React, { useState } from 'react'

const initialLeaders = [
  { id: 1, name: 'Alex Rodriguez', title: 'Cybersecurity Engineer', points: 28420, quizzes: 127, accuracy: 92, streak: 15, badges: ['🏆', '🥇', '🔥'], rank: 1 },
  { id: 2, name: 'Sarah Chen', title: 'Security Analyst', points: 24850, quizzes: 112, accuracy: 89, streak: 12, badges: ['🥈', '📚'], rank: 2 },
  { id: 3, name: 'Maria Garcia', title: 'Penetration Tester', points: 22190, quizzes: 98, accuracy: 87, streak: 10, badges: ['🥉', '🎯'], rank: 3 },
  { id: 4, name: 'You', title: 'Student', points: 21450, quizzes: 47, accuracy: 89, streak: 12, badges: ['🏆', '🥈', '🥉'], rank: 4, isCurrentUser: true },
  { id: 5, name: 'David Kim', title: 'IT Manager', points: 19820, quizzes: 42, accuracy: 87, streak: 8, badges: ['🏆', '🥈'], rank: 5 },
  { id: 6, name: 'Jennifer Liu', title: 'Security Consultant', points: 18650, quizzes: 39, accuracy: 92, streak: 15, badges: ['🏆', '🏆', '🥈'], rank: 6 }
]

const achievements = [
  { icon: '🏆', title: 'Quiz Master', description: 'Complete 50 quizzes with 90%+ accuracy', progress: 94, target: 50, current: 47 },
  { icon: '🔥', title: 'Streak Master', description: 'Maintain a 30-day study streak', progress: 40, target: 30, current: 12 },
  { icon: '🎯', title: 'Accuracy Expert', description: 'Achieve 95% accuracy across all quizzes', progress: 89, target: 95, current: 89 },
  { icon: '⚡', title: 'Speed Demon', description: 'Complete 10 quizzes in under 5 minutes each', progress: 70, target: 10, current: 7 }
]

export default function Ranking(){
  const [timeframe, setTimeframe] = useState('all-time')
  const [category, setCategory] = useState('overall')
  const [certification, setCertification] = useState('all')

  const filteredLeaders = initialLeaders.filter(leader => {
    // In a real app, this would filter based on timeframe and category
    return true
  })

  const topThree = filteredLeaders.slice(0, 3)
  const remaining = filteredLeaders.slice(3)

  return (
    <main>
      <section className="leaderboard-header">
        <h2>🏆 Global Leaderboard</h2>
        <p>Compete with cybersecurity learners worldwide and climb the rankings!</p>
        <div className="leaderboard-filters">
          <form className="filter-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="timeframe">Timeframe</label>
              <select 
                id="timeframe" 
                name="timeframe"
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
                name="category"
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
                name="certification"
                value={certification}
                onChange={(e) => setCertification(e.target.value)}
              >
                <option value="all">All Certifications</option>
                <option value="security-plus">Security+</option>
                <option value="cissp">CISSP</option>
                <option value="ceh">CEH</option>
              </select>
            </div>
            <button type="submit" className="btn btn-search">Filter</button>
          </form>
        </div>
      </section>

      <section className="top-performers">
        <h3>Top Performers</h3>
        <div className="podium">
          {topThree.length > 1 && (
            <div className="podium-place second">
              <div className="medal">🥈</div>
              <div className="player-info">
                <h4>{topThree[1].name}</h4>
                <p>{topThree[1].title}</p>
                <div className="score">{topThree[1].points.toLocaleString()} pts</div>
              </div>
            </div>
          )}
          {topThree.length > 0 && (
            <div className="podium-place first">
              <div className="medal">🥇</div>
              <div className="player-info">
                <h4>{topThree[0].name}</h4>
                <p>{topThree[0].title}</p>
                <div className="score">{topThree[0].points.toLocaleString()} pts</div>
              </div>
            </div>
          )}
          {topThree.length > 2 && (
            <div className="podium-place third">
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

      <section className="leaderboard-table">
        <h3>Full Rankings</h3>
        <div className="table-container">
          <table className="leaderboard-table-content">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Points</th>
                <th>Quizzes</th>
                <th>Accuracy</th>
                <th>Streak</th>
                <th>Badges</th>
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
                  <td>{leader.quizzes}</td>
                  <td>{leader.accuracy}%</td>
                  <td>{leader.streak} days</td>
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
          {achievements.map((achievement, idx) => (
            <div key={idx} className="badge-card">
              <div className="badge-icon">{achievement.icon}</div>
              <h4>{achievement.title}</h4>
              <p>{achievement.description}</p>
              <div className="badge-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${achievement.progress}%` }}></div>
                </div>
                <span>
                  {typeof achievement.current === 'number' && typeof achievement.target === 'number' 
                    ? `${achievement.current}/${achievement.target}` 
                    : `${achievement.progress}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
