import React, { useState, useEffect } from 'react';
import { fetchRevenueTargets } from '../../services/api';

const fmt = (amount) =>
  amount > 0 ? `KES ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—';

const TargetsTable = ({ filters = {}, subCounties = [] }) => {
  const SUB_COUNTIES = subCounties.map(sc => ({ id: sc.id, label: sc.name }));

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('annual');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchRevenueTargets(filters);
        setData(response.data.data);
      } catch (err) {
        console.error('Failed to fetch revenue targets:', err);
        setError('Failed to load targets. Please check the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filters]);

  if (loading) {
    return (
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '80px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--green)', marginBottom: '6px' }}>
          Loading revenue targets...
        </div>
        <div style={{ fontSize: '13px', color: 'var(--gray)' }}>Fetching from MariaDB</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#fff5f5', border: '1px solid #ffcccc', borderRadius: '12px', padding: '60px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>❌</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: '#c0392b', marginBottom: '6px' }}>
          Connection Error
        </div>
        <div style={{ fontSize: '13px', color: 'var(--gray)' }}>{error}</div>
      </div>
    );
  }

  const streams = [...new Set(data.map(r => r.rev_stream))].sort();

  const getTarget = (stream, subCountyId, field) => {
    const row = data.find(
      r => r.rev_stream === stream && Number(r.sub_county_id) === Number(subCountyId)
    );
    return row ? (row[field] || 0) : 0;
  };

  const getRowTotal = (stream, field) =>
    SUB_COUNTIES.reduce((sum, sc) => sum + getTarget(stream, sc.id, field), 0);

  const getColTotal = (subCountyId, field) =>
    streams.reduce((sum, stream) => sum + getTarget(stream, subCountyId, field), 0);

  const grandTotal = (field) =>
    streams.reduce((sum, stream) => sum + getRowTotal(stream, field), 0);

  const targetField = viewMode === 'annual' ? 'annual_target' : 'monthly_target';

  const thBase = {
    padding: '10px 12px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 600,
    fontSize: '11px',
    letterSpacing: '0.3px',
    whiteSpace: 'nowrap',
    borderRight: '1px solid rgba(255,255,255,0.1)',
    textAlign: 'center',
    color: 'white',
  };

  const cellBase = {
    padding: '9px 12px',
    fontSize: '12px',
    fontFamily: 'DM Mono, monospace',
    textAlign: 'right',
    borderRight: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
    whiteSpace: 'nowrap',
  };

  const toggleBtnStyle = (active) => ({
    padding: '5px 14px',
    fontFamily: 'DM Mono, monospace',
    fontSize: '11px',
    letterSpacing: '0.5px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    background: active ? 'var(--green)' : '#f0f4f2',
    color: active ? 'white' : 'var(--gray)',
    fontWeight: active ? 700 : 400,
    transition: 'all 0.15s',
  });

  // Show loading skeleton if subCounties not loaded yet
  if (SUB_COUNTIES.length === 0) {
    return (
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '60px', textAlign: 'center', color: 'var(--gray)' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>Loading sub-county data...</div>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Header bar */}
      <div style={{ background: 'var(--dark)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ color: 'white', fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '1px', opacity: 0.7 }}>
          TABLE: rev_targets · Revenue Targets by Sub-County
        </span>
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '7px', padding: '4px' }}>
          <button style={toggleBtnStyle(viewMode === 'annual')} onClick={() => setViewMode('annual')}>
            ANNUAL
          </button>
          <button style={toggleBtnStyle(viewMode === 'monthly')} onClick={() => setViewMode('monthly')}>
            MONTHLY
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr>
              <th style={{ ...thBase, background: 'var(--dark)', width: '180px', textAlign: 'left' }}>
                Revenue Stream
              </th>
              {SUB_COUNTIES.map(sc => (
                <th key={sc.id} style={{
                  ...thBase,
                  background: '#1a4a7a',
                  borderLeft: '2px solid rgba(255,255,255,0.2)',
                  minWidth: '140px',
                }}>
                  {sc.label}
                </th>
              ))}
              <th style={{
                ...thBase,
                background: 'var(--green)',
                borderLeft: '3px solid rgba(255,255,255,0.3)',
                minWidth: '150px',
              }}>
                TOTAL
              </th>
            </tr>
          </thead>

          <tbody>
            {streams.map((stream, idx) => {
              const rowTotal = getRowTotal(stream, targetField);
              const isEven = idx % 2 === 0;

              return (
                <tr key={stream}>
                  <td style={{
                    padding: '11px 14px',
                    background: isEven ? 'var(--green-pale)' : 'white',
                    borderBottom: '1px solid #e8f0eb',
                    borderRight: '1px solid var(--border)',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: '12px',
                    color: 'var(--green)',
                    whiteSpace: 'nowrap',
                  }}>
                    {stream}
                  </td>
                  {SUB_COUNTIES.map((sc) => {
                    const val = getTarget(stream, sc.id, targetField);
                    return (
                      <td key={sc.id} style={{
                        ...cellBase,
                        background: isEven ? '#fafcfb' : 'white',
                        borderLeft: '2px solid var(--border)',
                        color: val > 0 ? 'var(--dark)' : '#ccc',
                      }}>
                        {fmt(val)}
                      </td>
                    );
                  })}
                  <td style={{
                    ...cellBase,
                    background: isEven ? '#eef6f1' : '#f5faf7',
                    borderLeft: '3px solid #c8dfd2',
                    color: 'var(--green)',
                    fontWeight: 700,
                  }}>
                    {fmt(rowTotal)}
                  </td>
                </tr>
              );
            })}

            {/* Column totals */}
            <tr>
              <td style={{
                padding: '12px 14px',
                background: 'var(--dark)',
                color: 'white',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: '12px',
              }}>
                GRAND TOTAL
              </td>
              {SUB_COUNTIES.map(sc => (
                <td key={sc.id} style={{
                  ...cellBase,
                  background: 'var(--dark)',
                  color: 'var(--gold)',
                  fontWeight: 700,
                  borderLeft: '2px solid rgba(255,255,255,0.08)',
                  borderBottom: 'none',
                }}>
                  {fmt(getColTotal(sc.id, targetField))}
                </td>
              ))}
              <td style={{
                ...cellBase,
                background: 'var(--green)',
                color: 'white',
                fontWeight: 700,
                borderLeft: '3px solid rgba(255,255,255,0.2)',
                borderBottom: 'none',
              }}>
                {fmt(grandTotal(targetField))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ padding: '10px 20px', background: '#f9fafb', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--gray)', fontFamily: 'DM Mono, monospace', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <span>📅 Financial Year: {filters.financial_year || 'FY2025/2026'}</span>
        <span>·</span>
        <span>
          Showing {viewMode === 'annual' ? 'annual' : 'monthly'} targets · {streams.length} revenue stream{streams.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

export default TargetsTable;