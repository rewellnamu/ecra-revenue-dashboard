import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard1Page from './pages/Dashboard1Page';
import Dashboard2Page from './pages/Dashboard2Page';
import Dashboard3Page from './pages/Dashboard3Page';
import './index.css';

const navLinkStyle = ({ isActive }) => ({
  padding: '14px 24px',
  fontFamily: 'Syne, sans-serif',
  fontSize: '13px',
  fontWeight: 600,
  color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
  borderBottom: isActive ? '3px solid var(--gold)' : '3px solid transparent',
  textDecoration: 'none',
  letterSpacing: '0.5px',
  display: 'inline-block',
  whiteSpace: 'nowrap',
});

const mobileNavLinkStyle = ({ isActive }) => ({
  flex: 1,
  padding: '10px 0',
  textAlign: 'center',
  textDecoration: 'none',
  color: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
  fontFamily: 'Syne, sans-serif',
  fontSize: '11px',
  fontWeight: 600,
  borderTop: isActive ? '2px solid var(--gold)' : '2px solid transparent',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '3px',
});

const App = () => {
  return (
    <Router>
      <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>

        {/* Top nav — visible on desktop */}
        <div className="desktop-nav" style={{ background: 'var(--dark)', padding: '0 20px', display: 'flex', gap: 0 }}>
          <NavLink to="/dashboard1" style={navLinkStyle}>
            📊 Monthly Revenue
          </NavLink>
          <NavLink to="/dashboard2" style={navLinkStyle}>
            📅 YOY
          </NavLink>
          <NavLink to="/dashboard3" style={navLinkStyle}>
            🎯 Targets
          </NavLink>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/dashboard1" element={<Dashboard1Page />} />
          <Route path="/dashboard2" element={<Dashboard2Page />} />
          <Route path="/dashboard3" element={<Dashboard3Page />} />
          <Route path="*" element={<Dashboard1Page />} />
        </Routes>

        {/* Bottom tab bar — mobile only */}
        <div className="mobile-nav" style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--dark)',
          display: 'flex',
          borderTop: '2px solid var(--green)',
          zIndex: 100,
        }}>
          <NavLink to="/dashboard1" style={mobileNavLinkStyle}>
            <span style={{ fontSize: '20px' }}>📊</span>
            Monthly
          </NavLink>
          <NavLink to="/dashboard2" style={mobileNavLinkStyle}>
            <span style={{ fontSize: '20px' }}>📅</span>
            YOY
          </NavLink>
          <NavLink to="/dashboard3" style={mobileNavLinkStyle}>
            <span style={{ fontSize: '20px' }}>🎯</span>
            Targets
          </NavLink>
        </div>

      </div>
    </Router>
  );
};

export default App;