import React from 'react';

const Header = () => {
  return (
    <header style={{ background: 'var(--green)', color: 'white', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '44px', height: '44px', background: 'var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '13px', color: 'white' }}>
          ECRA
        </div>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '17px', letterSpacing: '0.5px' }}>
            Embu County Revenue Authority
          </div>
          <div style={{ fontSize: '11px', opacity: 0.7, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Public Revenue Dashboard
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', opacity: 0.85 }}>
        <span>Financial Year: FY2025/2026</span>
        <div style={{ background: 'var(--gold)', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }}></span>
          LIVE DATA
        </div>
      </div>
    </header>
  );
};

export default Header;