import React, { useState } from 'react';
import TargetsTable from '../components/Dashboard3/TargetsTable';

const Dashboard3Page = () => {
  const [filters, setFilters] = useState({
    financial_year: 'FY2025/2026',
  });

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

      {/* Badge + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
        <span style={{
          background: '#1a4a7a',
          color: 'white',
          fontFamily: 'DM Mono, monospace',
          fontSize: '10px',
          padding: '3px 10px',
          borderRadius: '4px',
          letterSpacing: '1px',
        }}>
          DASHBOARD 3
        </span>
      </div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 800, marginBottom: '4px' }}>
        Revenue Targets
      </div>
      <div style={{ fontSize: '13px', color: 'var(--gray)', marginBottom: '16px' }}>
        Annual &amp; monthly targets per sub-county · Source: <code>rev_targets</code>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar" style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap',
      }}>
        <span style={labelStyle}>Filters</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '140px' }}>
          <span style={labelStyle}>Financial Year</span>
          <select
            style={selectStyle}
            value={filters.financial_year}
            onChange={e => setFilters({ financial_year: e.target.value })}
          >
            <option value="FY2025/2026">FY2025/2026</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Sub-Counties', value: '6', icon: '🗺️' },
          { label: 'Revenue Streams', value: '12', icon: '📊' },
          { label: 'Financial Year', value: filters.financial_year, icon: '📅' },
        ].map(card => (
          <div key={card.label} style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flex: '1',
            minWidth: '160px',
          }}>
            <span style={{ fontSize: '20px' }}>{card.icon}</span>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '15px', color: 'var(--dark)' }}>
                {card.value}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {card.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
        <div style={{
          background: 'var(--gold-light)',
          border: '1px solid var(--gold)',
          borderRadius: '6px',
          padding: '4px 10px',
          fontSize: '11px',
          color: 'var(--gold)',
          fontFamily: 'DM Mono, monospace',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span>👆</span>
          <span>Scroll table horizontally to see all sub-counties</span>
        </div>
      </div>

      {/* Info banner */}
      <div style={{
        background: 'var(--green-pale)',
        border: '1px solid #c8dfd2',
        borderRadius: '10px',
        padding: '12px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
      }}>
        <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
        <div style={{ fontSize: '12px', color: 'var(--gray)', lineHeight: '1.6' }}>
          <strong style={{ color: 'var(--green)' }}>How to use: </strong>
          Toggle between <strong>Annual</strong> and <strong>Monthly</strong> targets using the buttons in the table header.
          Each row is a revenue stream; each column is a sub-county. The rightmost column shows the total target across all sub-counties.
        </div>
      </div>

      {/* Targets Table */}
      <TargetsTable filters={filters} />
    </div>
  );
};

export default Dashboard3Page;