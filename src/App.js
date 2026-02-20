import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard1Page from './pages/Dashboard1Page';
import Dashboard2Page from './pages/Dashboard2Page';
import './index.css';

const App = () => {
  return (
    <Router>
      <div>
        {/* Navigation */}
        <nav style={{ background: 'var(--dark)', padding: '0 40px', display: 'flex', gap: 0 }}>
          <NavLink
            to="/dashboard1"
            style={({ isActive }) => ({
              padding: '14px 28px',
              fontFamily: 'Syne, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
              borderBottom: isActive ? '3px solid var(--gold)' : '3px solid transparent',
              textDecoration: 'none',
              letterSpacing: '0.5px',
              display: 'inline-block',
            })}
          >
            📊 Dashboard 1 — Monthly Revenue
          </NavLink>
          <NavLink
            to="/dashboard2"
            style={({ isActive }) => ({
              padding: '14px 28px',
              fontFamily: 'Syne, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
              borderBottom: isActive ? '3px solid var(--gold)' : '3px solid transparent',
              textDecoration: 'none',
              letterSpacing: '0.5px',
              display: 'inline-block',
            })}
          >
            📅 Dashboard 2 — Weekly Progress
          </NavLink>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/dashboard1" element={<Dashboard1Page />} />
          <Route path="/dashboard2" element={<Dashboard2Page />} />
          <Route path="*" element={<Dashboard1Page />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;