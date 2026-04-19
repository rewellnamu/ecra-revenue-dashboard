import React, { useState } from 'react';
import YOYTable from './YOYTable';
import useSubCounties from '../../hooks/useSubCounties';

const Dashboard2 = () => {
  const [filters, setFilters] = useState({
    financial_year: 'FY2025/2026',
  });

  const { subCounties } = useSubCounties();

  const selectStyle = {
    background: '#f0f4f2',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '13px',
    color: 'var(--dark)',
    fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer',
    outline: 'none',
    width: '100%',
  };

  const labelStyle = {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--gray)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    whiteSpace: 'nowrap',
  };

  return (
    <div className="dashboard-wrapper" style={{ padding: '24px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
        <span style={{ background: 'var(--gold)', color: 'white', fontFamily: 'DM Mono, monospace', fontSize: '10px', padding: '3px 10px', borderRadius: '4px', letterSpacing: '1px' }}>
          DASHBOARD 2
        </span>
      </div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 800, marginBottom: '4px' }}>
        Year-on-Year Revenue Comparison
      </div>
      <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '16px' }}>
        Compare revenue streams across years · Source: <code>rev_reports</code>
      </div>

      <div className="filter-bar" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <span style={labelStyle}>Filters</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '140px' }}>
          <span style={labelStyle}>Year</span>
          <select style={selectStyle} value={filters.financial_year} onChange={e => setFilters({ financial_year: e.target.value })}>
            <option value="FY2025/2026">FY2025/2026</option>
            <option value="FY2024/2025">FY2024/2025</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        {[2025, 2026].map(year => (
          <div key={year} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--gray)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: year === 2026 ? 'var(--green)' : '#1a5c38' }}></div>
            {year} {year === 2026 ? '(current)' : ''}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', background: 'var(--gold-light)', border: '1px solid var(--gold)', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', color: 'var(--gold)', fontFamily: 'DM Mono, monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>👆</span>
          <span>Scroll table horizontally to see all sub-counties</span>
        </div>
      </div>

      <div style={{ background: 'var(--green-pale)', border: '1px solid #c8dfd2', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
        <div style={{ fontSize: '12px', color: 'var(--gray)', lineHeight: '1.6' }}>
          <strong style={{ color: 'var(--green)' }}>How to use: </strong>
          Click any revenue stream row to expand and see month-by-month breakdown.
        </div>
      </div>

      <YOYTable filters={filters} subCounties={subCounties} />
    </div>
  );
};

export default Dashboard2;