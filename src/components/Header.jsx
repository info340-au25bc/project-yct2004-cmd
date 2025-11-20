import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  const makeNavClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link'

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
            <li>
              <NavLink to="/groups" className={makeNavClass}>
                Groups
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
