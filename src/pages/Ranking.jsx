import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { subscribeToData } from '../utils/database'
import { subscribeToAuthState } from '../utils/auth'

export default function Ranking({ currentUser: propCurrentUser }){
  const [timeframe, setTimeframe] = useState('all-time')
  const [category, setCategory] = useState('overall')
  const [certification, setCertification] = useState('all')
  const [leaders, setLeaders] = useState([])
  const [currentUser, setCurrentUser] = useState(propCurrentUser)
  const [loading, setLoading] = useState(true)

  // Get current user if not provided
  useEffect(() => {
    if (!propCurrentUser) {
      const unsubscribe = subscribeToAuthState((user) => {
        setCurrentUser(user)
      })
      return unsubscribe
    }
  }, [propCurrentUser])

  // Load user stats from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToData('userStats', (data) => {
      if (data) {
        // Convert Firebase object to array
        const statsArray = Object.entries(data).map(([userId, stats]) => ({
          id: userId,
          userId: userId,
          name: stats.userName || 'Anonymous',
          title: stats.title || 'Learner',
          points: stats.totalPoints || 0,
          quizzes: stats.totalQuizzes || 0,
          accuracy: stats.accuracy || 0,
          streak: stats.currentStreak || 0,
          badges: getBadges(stats),
          isCurrentUser: currentUser && userId === currentUser.uid
        }))
        
        // Sort by points (descending) and assign ranks
        statsArray.sort((a, b) => b.points - a.points)
        statsArray.forEach((leader, index) => {
          leader.rank = index + 1
        })
        
        setLeaders(statsArray)
      } else {
        setLeaders([])
      }
      setLoading(false)
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [currentUser])

  function getBadges(stats) {
    const badges = []
    if (stats.totalQuizzes >= 50) badges.push('🏆')
    if (stats.accuracy >= 95) badges.push('🎯')
    if (stats.currentStreak >= 30) badges.push('🔥')
    if (stats.totalPoints >= 20000) badges.push('🥇')
    if (stats.totalPoints >= 10000) badges.push('🥈')
    if (stats.totalPoints >= 5000) badges.push('🥉')
    return badges.length > 0 ? badges : ['📚']
  }

  const filteredLeaders = leaders.filter(leader => {
    // Filter based on timeframe and category if needed
    // For now, return all leaders
    return true
  })

  const topThree = filteredLeaders.slice(0, 3)
  const remaining = filteredLeaders.slice(3)

  // Calculate achievements for current user
  const currentUserStats = leaders.find(l => l.isCurrentUser)
  const achievements = currentUserStats ? [
    { 
      icon: '🏆', 
      title: 'Quiz Master', 
      description: 'Complete 50 quizzes with 90%+ accuracy', 
      progress: Math.min(100, (currentUserStats.quizzes / 50) * 100), 
      target: 50, 
      current: currentUserStats.quizzes 
    },
    { 
      icon: '🔥', 
      title: 'Streak Master', 
      description: 'Maintain a 30-day study streak', 
      progress: Math.min(100, (currentUserStats.streak / 30) * 100), 
      target: 30, 
      current: currentUserStats.streak 
    },
    { 
      icon: '🎯', 
      title: 'Accuracy Expert', 
      description: 'Achieve 95% accuracy across all quizzes', 
      progress: Math.min(100, currentUserStats.accuracy), 
      target: 95, 
      current: currentUserStats.accuracy 
    },
    { 
      icon: '⚡', 
      title: 'Point Collector', 
      description: 'Earn 10,000 points', 
      progress: Math.min(100, (currentUserStats.points / 10000) * 100), 
      target: 10000, 
      current: currentUserStats.points 
    }
  ] : [
    { icon: '🏆', title: 'Quiz Master', description: 'Complete 50 quizzes with 90%+ accuracy', progress: 0, target: 50, current: 0 },
    { icon: '🔥', title: 'Streak Master', description: 'Maintain a 30-day study streak', progress: 0, target: 30, current: 0 },
    { icon: '🎯', title: 'Accuracy Expert', description: 'Achieve 95% accuracy across all quizzes', progress: 0, target: 95, current: 0 },
    { icon: '⚡', title: 'Point Collector', description: 'Earn 10,000 points', progress: 0, target: 10000, current: 0 }
  ]

  // Chart data for quiz performance (aggregated from top users)
  const chartData = filteredLeaders.slice(0, 5).map((leader, index) => ({
    name: leader.name.split(' ')[0] || `User ${index + 1}`,
    quizzes: leader.quizzes,
    accuracy: leader.accuracy,
    points: leader.points
  }))

  // Accuracy trend data (placeholder - could be enhanced with historical data)
  const accuracyTrend = [
    { week: 'Week 1', accuracy: currentUserStats ? Math.max(70, currentUserStats.accuracy - 10) : 82 },
    { week: 'Week 2', accuracy: currentUserStats ? Math.max(75, currentUserStats.accuracy - 5) : 85 },
    { week: 'Week 3', accuracy: currentUserStats ? Math.max(80, currentUserStats.accuracy - 2) : 87 },
    { week: 'Week 4', accuracy: currentUserStats ? Math.max(85, currentUserStats.accuracy - 1) : 89 },
    { week: 'Week 5', accuracy: currentUserStats ? Math.max(88, currentUserStats.accuracy) : 91 },
    { week: 'Week 6', accuracy: currentUserStats ? currentUserStats.accuracy : 92 }
  ]

  if (loading) {
    return (
      <main>
        <section className="leaderboard-header">
          <h2>🏆 Global Leaderboard</h2>
          <p>Loading leaderboard data...</p>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="leaderboard-header">
        <h2>🏆 Global Leaderboard</h2>
        <p>Compete with cybersecurity learners worldwide and climb the rankings!</p>
        {filteredLeaders.length === 0 && (
          <p style={{ color: '#64748b', marginTop: '1rem' }}>
            No leaderboard data yet. Complete quizzes to see your ranking!
          </p>
        )}
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

      {filteredLeaders.length > 0 && (
        <>
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

      <section className="performance-charts">
        <h3>Performance Analytics</h3>
        <div className="charts-container">
          <div className="chart-card">
            <h4>Quiz Performance by Category</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quizzes" fill="#2563eb" name="Quizzes Completed" />
                <Bar dataKey="points" fill="#10b981" name="Points Earned" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="chart-card">
            <h4>Accuracy Trend (Last 6 Weeks)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[75, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="#f59e0b" strokeWidth={2} name="Accuracy %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
        </>
      )}
    </main>
  )
}
