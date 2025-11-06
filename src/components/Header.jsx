import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <div className="nav-brand">
        <h1 className="brand">CyberLearn</h1>
      </div>
      <nav aria-label="Main navigation">
        <ul className="nav-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/quiz">Quizzes</NavLink></li>
          <li><NavLink to="/ranking">Leaderboard</NavLink></li>
          <li><NavLink to="/resources">Resources</NavLink></li>
          <li><NavLink to="/proposal">Proposal</NavLink></li>
          <li><NavLink to="/groups">Groups</NavLink></li>
        </ul>
      </nav>
    </header>
  )
}
