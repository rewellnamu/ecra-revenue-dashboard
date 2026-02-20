import React from 'react';

const Header = () => {

  return (
    <header style={{ background: 'var(--green)', color: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
      <div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '65px' }}>
        {/* Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '11px', color: 'white', flexShrink: 0 }}>
            ECRA
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(13px, 2.5vw, 17px)', letterSpacing: '0.5px' }}>
              Embu County Revenue Authority
            </div>
            <div style={{ fontSize: '10px', opacity: 0.7, letterSpacing: '1px', textTransform: 'uppercase' }}>
              Public Revenue Dashboard
            </div>
          </div>
        </div>

        {/* Right side — hidden on mobile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', opacity: 0.85 }}>
          <span style={{ display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>Financial Year: FY2025/2026</span>
          <div style={{ background: 'var(--gold)', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
            <span style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', display: 'inline-block' }}></span>
            LIVE
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;