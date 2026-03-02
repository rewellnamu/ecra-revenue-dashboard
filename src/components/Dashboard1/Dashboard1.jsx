import React, { useState } from 'react';
import RevenueTable from './RevenueTable';

const Dashboard1 = () => {
  const [filters, setFilters] = useState({
    financial_year: 'FY2025/2026',
    sub_county_id: 'all',
    status: 'all',
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

  return (
    <div className="dashboard-wrapper" style={{ padding: '24px 40px' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
        <span style={{ background: 'var(--green)', color: 'white', fontFamily: 'DM Mono, monospace', fontSize: '10px', padding: '3px 10px', borderRadius: '4px', letterSpacing: '1px' }}>
          DASHBOARD 1
        </span>
      </div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 800, marginBottom: '4px' }}>
        Revenue Stream Overview
      </div>
      <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '20px' }}>
        Tap row to expand · Source: <code>rev_reports</code>
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
            <option value="1">Embu West</option>
            <option value="2">Embu North</option>
            <option value="3">Runyenjes</option>
            <option value="4">Mbeere North</option>
            <option value="5">Mbeere South</option>
            <option value="6">Mwea</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '140px' }}>
          <span style={labelStyle}>Status</span>
          <select style={selectStyle} value={filters.status} onChange={e => handleFilter('status', e.target.value)}>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {(filters.sub_county_id !== 'all' || filters.status !== 'all') && (
          <button
            onClick={() => setFilters({ financial_year: 'FY2025/2026', sub_county_id: 'all', status: 'all' })}
            style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#c0392b', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap' }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Table */}
      <RevenueTable filters={filters} />
    </div>
  );
};

export default Dashboard1;