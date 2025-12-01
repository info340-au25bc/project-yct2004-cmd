import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const makeNavClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link'
  const { currentUser, logout } = useAuth()

  async function handleLogout() {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <header>
      <div className="navbar">
        <Link to="/" className="nav-brand">
          <span className="logo">🔒</span>
          <div className="nav-text">
            <h1>CyberLearn</h1>
            <p className="nav-tagline">Cybersecurity Learning Platform</p>
          </div>
        </Link>

        <nav aria-label="Main navigation">
          <ul className="nav-links">
            <li>
              <NavLink to="/" end className={makeNavClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/quiz" className={makeNavClass}>
                Quizzes
              </NavLink>
            </li>
            <li>
              <NavLink to="/ranking" className={makeNavClass}>
                Leaderboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/resources" className={makeNavClass}>
                Resources
              </NavLink>
            </li>
            <li>
              <NavLink to="/proposal" className={makeNavClass}>
                Proposal
              </NavLink>
            </li>
            {currentUser && (
              <>
                <li>
                  <NavLink to="/forum" className={makeNavClass}>
                    Forum
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/groups" className={makeNavClass}>
                    Groups
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/testquestions" className={makeNavClass}>
                    Create Questions
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="user-section">
          {currentUser ? (
            <div className="user-info">
              <img 
                src={currentUser.photoURL || 'https://via.placeholder.com/32'} 
                alt={currentUser.displayName || 'User'} 
                className="user-avatar"
              />
              <span className="user-name">{currentUser.displayName || currentUser.email}</span>
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
