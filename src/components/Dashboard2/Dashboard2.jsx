import React, { useState } from 'react';
import WeeklyTable from './WeeklyTable';

const Dashboard2 = () => {
  const [filters, setFilters] = useState({
    financial_year: 'FY2025/2026',
    sub_county_id: 'all',
  });

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

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

  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() + mondayOffset);
  const currentSunday = new Date(currentMonday);
  currentSunday.setDate(currentMonday.getDate() + 6);
  const weekLabel = `${currentMonday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${currentSunday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  return (
    <div className="dashboard-wrapper" style={{ padding: '24px 40px' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
        <span style={{ background: 'var(--gold)', color: 'white', fontFamily: 'DM Mono, monospace', fontSize: '10px', padding: '3px 10px', borderRadius: '4px', letterSpacing: '1px' }}>
          DASHBOARD 2
        </span>
      </div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 800, marginBottom: '4px' }}>
        Weekly Revenue Progress
      </div>
      <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '20px' }}>
        Last 5 calendar weeks · Source: <code>rev_reports_weekly</code>
      </div>

      {/* Current week banner */}
      <div style={{ background: '#fffbf0', border: '1.5px solid var(--gold)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <span style={{ fontSize: '18px', flexShrink: 0 }}>📅</span>
        <div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--gold)' }}>Current Week (open): </span>
          <span style={{ fontSize: '13px', color: 'var(--dark)' }}>{weekLabel}</span>
          <div style={{ marginTop: '3px', fontSize: '11px', color: 'var(--gray)' }}>Data is still being collected for this week</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span style={labelStyle}>Filters</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '140px' }}>
          <span style={labelStyle}>Year</span>
          <select style={selectStyle} value={filters.financial_year} onChange={e => handleFilter('financial_year', e.target.value)}>
            <option value="FY2025/2026">FY2025/2026</option>
            <option value="FY2024/2025">FY2024/2025</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '140px' }}>
          <span style={labelStyle}>Sub-County</span>
          <select style={selectStyle} value={filters.sub_county_id} onChange={e => handleFilter('sub_county_id', e.target.value)}>
            <option value="all">All Counties</option>
            <option value="1">Embu</option>
            <option value="2">Runyenjes</option>
            <option value="3">Manyatta</option>
            <option value="4">Mbere North</option>
            <option value="5">Mbere South</option>
            <option value="6">Siakago</option>
          </select>
        </div>

        {filters.sub_county_id !== 'all' && (
          <button
            onClick={() => setFilters({ financial_year: 'FY2025/2026', sub_county_id: 'all' })}
            style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#c0392b', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      <WeeklyTable filters={filters} />
    </div>
  );
};

export default Dashboard2;