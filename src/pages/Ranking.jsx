import React, { useState, useEffect } from 'react'
import { subscribeToData } from '../utils/database'
import { subscribeToAuthState, isFirebaseReady } from '../utils/auth'
import { db } from '../firebase/config'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function Ranking({ currentUser: propCurrentUser }){
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

  // Force refresh function
  const [refreshKey, setRefreshKey] = useState(0)
  
  const forceRefresh = () => {
    setLoading(true)
    setLeaders([])
    setRefreshKey(prev => prev + 1)
  }

  // Load user stats from Firebase
  useEffect(() => {
    let hasReceivedData = false
    let isMounted = true
    
    // Check if database is available
    if (!db) {
      setLoading(false)
      setLeaders([])
      return () => {} // Return empty cleanup function
    }
    
    // Set a timeout to ensure loading state resolves even if subscription fails
    const loadingTimeout = setTimeout(() => {
      if (!hasReceivedData && isMounted) {
        setLoading(false)
        setLeaders([]) // Ensure empty state if no data received
      }
    }, 3000) // 3 second timeout
    
    let unsubscribe = null
    try {
      unsubscribe = subscribeToData('userStats', (data) => {
        if (!isMounted) return // Don't update if component unmounted
        
        hasReceivedData = true
        clearTimeout(loadingTimeout) // Clear timeout since we got data
        
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        // Convert Firebase object to array
          const statsArray = Object.entries(data).map(([userId, stats]) => {
            if (!stats || typeof stats !== 'object') {
              return null
            }
            return {
          id: userId,
          userId: userId,
              name: stats.userName || stats.name || 'Anonymous',
          title: stats.title || 'Learner',
          points: stats.totalPoints || 0,
          quizzes: stats.totalQuizzes || 0,
          accuracy: stats.accuracy || 0,
          streak: stats.currentStreak || 0,
          isCurrentUser: currentUser && userId === currentUser.uid
            }
          }).filter(Boolean) // Remove any null entries
        
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
      
      // If unsubscribe is not a function, subscription failed
      if (typeof unsubscribe !== 'function') {
        clearTimeout(loadingTimeout)
        setLoading(false)
        setLeaders([])
      }
    } catch (error) {
      console.error('Ranking: Error setting up subscription:', error)
      clearTimeout(loadingTimeout)
      setLoading(false)
      setLeaders([])
    }

    return () => {
      isMounted = false
      clearTimeout(loadingTimeout)
      if (unsubscribe && typeof unsubscribe === 'function') {
        try {
          unsubscribe()
        } catch (error) {
          console.error('Ranking: Error unsubscribing:', error)
        }
      }
    }
  }, [currentUser, refreshKey])


  const filteredLeaders = leaders

  // Get row styling based on rank (top 3 get special colors)
  function getRowStyles(rank) {
    if (rank === 1) {
      return 'leaderboard-row leaderboard-row-gold'
    } else if (rank === 2) {
      return 'leaderboard-row leaderboard-row-silver'
    } else if (rank === 3) {
      return 'leaderboard-row leaderboard-row-bronze'
    }
    return 'leaderboard-row'
  }

  // Get rank badge styling
  function getRankBadge(rank) {
    if (rank === 1) {
      return (
        <span className="rank-badge rank-badge-gold">
          🥇
        </span>
      )
    } else if (rank === 2) {
      return (
        <span className="rank-badge rank-badge-silver">
          🥈
        </span>
      )
    } else if (rank === 3) {
      return (
        <span className="rank-badge rank-badge-bronze">
          🥉
        </span>
      )
    }
    return (
      <span className="rank-badge rank-badge-default">
        {rank}
      </span>
    )
  }

  if (loading) {
    return (
      <main className="leaderboard-page">
        <div className="leaderboard-container">
          <div className="leaderboard-card">
            <div className="leaderboard-loading">
              <div className="spinner"></div>
              <p>Loading leaderboard...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="leaderboard-page" aria-labelledby="leaderboard-heading">
      <div className="leaderboard-container">
        {/* Header Card */}
        <div className="leaderboard-header-card">
          <div className="leaderboard-header-content">
            <div>
              <h1 id="leaderboard-heading">🏆 Leaderboard</h1>
              <p>Track your progress and compete with others!</p>
            </div>
            <button
              onClick={forceRefresh}
              className="btn btn-primary"
              title="Refresh leaderboard"
            >
              🔄 Refresh
            </button>
          </div>
          {!currentUser && (
            <div className="leaderboard-warning">
              <p>
                <strong>⚠️ Note:</strong> You must be logged in for your scores to appear on the leaderboard.
              </p>
            </div>
          )}
        </div>

        {/* Top Performers Chart - Recharts Integration */}
        {filteredLeaders.length > 0 && (
          <div className="leaderboard-chart-card">
            <h2>📊 Top Performers Score Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={filteredLeaders.slice(0, 10).map(leader => ({
                  name: leader.name.length > 15 ? leader.name.substring(0, 12) + '...' : leader.name,
                  points: leader.points,
                  rank: leader.rank
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString()} pts`, 'Points']}
                  labelFormatter={(label) => `User: ${label}`}
                />
                <Legend />
                <Bar dataKey="points" fill="#2563eb" name="Total Points" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Leaderboard Table Card */}
        <div className="leaderboard-table-card">
          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaders.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="leaderboard-empty">
                      <div className="leaderboard-empty-content">
                        <div className="leaderboard-empty-icon">🏆</div>
                        <p className="leaderboard-empty-text">
                          No leaderboard data yet.
                        </p>
                        <p className="leaderboard-empty-subtext">
                          Complete quizzes to see your ranking!
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeaders.map((leader) => (
                    <tr 
                      key={leader.id} 
                      className={`${getRowStyles(leader.rank)} ${leader.isCurrentUser ? 'leaderboard-row-current' : ''}`}
                    >
                      <td className="leaderboard-rank-cell">
                        <div className="leaderboard-rank-content">
                          {getRankBadge(leader.rank)}
                          <span className="leaderboard-rank-number">
                            {leader.rank}
                          </span>
                        </div>
                      </td>
                      <td className="leaderboard-user-cell">
                        <div className="leaderboard-user-content">
                          <div className="leaderboard-user-avatar">
                            {leader.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="leaderboard-user-info">
                            <div className="leaderboard-user-name">
                              {leader.name}
                              {leader.isCurrentUser && (
                                <span className="leaderboard-user-badge">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="leaderboard-points-cell">
                        <span className="leaderboard-points">
                          {leader.points.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
