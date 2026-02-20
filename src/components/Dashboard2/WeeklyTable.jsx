import React, { useState } from 'react';
import { mockRevReportsWeekly } from '../../data/mockData';
import StatusBadge from '../shared/StatusBadge';

const fmt = (amount) => amount ? `KES ${amount.toLocaleString()}` : '—';

const getLast5Weeks = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() + mondayOffset);
  const weeks = [];

  for (let i = 4; i >= 0; i--) {
    const start = new Date(currentMonday);
    start.setDate(currentMonday.getDate() - i * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    weeks.push({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
      label: `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
      isCurrent: i === 0,
    });
  }
  return weeks;
};

const WeeklyTable = ({ filters = {} }) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const weeks = getLast5Weeks();

  // Apply filters
  const filteredData = mockRevReportsWeekly.filter(r => {
    if (filters.financial_year && r.financial_year !== filters.financial_year) return false;
    if (filters.sub_county_id && filters.sub_county_id !== 'all' && r.sub_county_id !== parseInt(filters.sub_county_id)) return false;
    return true;
  });

  const streams = [...new Set(mockRevReportsWeekly.map(r => r.rev_stream))];

  const getWeekAmount = (stream, weekStart) => {
    return filteredData
      .filter(r => r.rev_stream === stream && r.start_date === weekStart)
      .reduce((sum, r) => sum + (r.amount || 0), 0);
  };

  const getWeekTotal = (weekStart) => {
    return filteredData
      .filter(r => r.start_date === weekStart)
      .reduce((sum, r) => sum + (r.amount || 0), 0);
  };

  const getWeekStatus = (stream, weekStart) => {
    const rec = filteredData.find(r => r.rev_stream === stream && r.start_date === weekStart);
    return rec ? rec.status : null;
  };

  const grandTotal = filteredData.reduce((sum, r) => sum + (r.amount || 0), 0);

  if (streams.length === 0) {
    return (
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '60px', textAlign: 'center', color: 'var(--gray)' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>No data found</div>
        <div style={{ fontSize: '13px' }}>Try adjusting your filters</div>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Table header bar */}
      <div style={{ background: 'var(--dark)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'white', fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '1px', opacity: 0.7 }}>TABLE: rev_reports_weekly</span>
        <span style={{ color: 'var(--gold)', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}>Last 5 calendar weeks · ⭐ = current week</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>
              <th style={{ background: 'var(--dark)', color: 'white', padding: '12px 16px', textAlign: 'left', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '12px', borderRight: '1px solid rgba(255,255,255,0.1)', minWidth: '160px' }}>
                Revenue Stream
              </th>
              {weeks.map((w, i) => (
                <th key={i} style={{
                  background: w.isCurrent ? 'var(--gold)' : 'var(--green)',
                  color: 'white',
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 600,
                  fontSize: '12px',
                  borderRight: '1px solid rgba(255,255,255,0.1)',
                  minWidth: '150px',
                }}>
                  Week {i + 1} {w.isCurrent && '⭐'}
                  <div style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', opacity: 0.85, fontWeight: 400, marginTop: '3px' }}>{w.label}</div>
                </th>
              ))}
              <th style={{ background: 'var(--dark)', color: 'var(--gold)', padding: '12px 16px', textAlign: 'right', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', minWidth: '140px' }}>
                5-Week Total
              </th>
            </tr>
          </thead>
          <tbody>
            {streams.map(stream => {
              const streamTotal = weeks.reduce((sum, w) => sum + getWeekAmount(stream, w.start), 0);
              const isHovered = hoveredRow === stream;

              return (
                <tr
                  key={stream}
                  onMouseEnter={() => setHoveredRow(stream)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{
                    padding: '12px 16px',
                    background: isHovered ? '#d8f0e4' : 'var(--green-pale)',
                    borderBottom: '1px solid var(--border)',
                    borderRight: '1px solid var(--border)',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: '12px',
                    color: 'var(--green)',
                    transition: 'background 0.15s',
                  }}>
                    {stream}
                  </td>
                  {weeks.map((w, i) => {
                    const amount = getWeekAmount(stream, w.start);
                    const status = getWeekStatus(stream, w.start);
                    return (
                      <td key={i} style={{
                        padding: '11px 14px',
                        textAlign: 'right',
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '12px',
                        borderRight: '1px solid var(--border)',
                        borderBottom: '1px solid var(--border)',
                        background: isHovered ? '#f5faf7' : w.isCurrent ? '#fffbf0' : 'white',
                        color: w.isCurrent ? 'var(--gold)' : 'var(--dark)',
                        fontWeight: w.isCurrent ? 600 : 400,
                        transition: 'background 0.15s',
                      }}>
                        {amount > 0 ? fmt(amount) : <span style={{ color: '#ccc' }}>—</span>}
                        {status && <StatusBadge status={status} />}
                      </td>
                    );
                  })}
                  {/* Row total */}
                  <td style={{
                    padding: '11px 14px',
                    textAlign: 'right',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: isHovered ? '#f5faf7' : '#f8faf9',
                    color: 'var(--green)',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.15s',
                  }}>
                    {streamTotal > 0 ? fmt(streamTotal) : '—'}
                  </td>
                </tr>
              );
            })}

            {/* Weekly totals row */}
            <tr>
              <td style={{ padding: '12px 16px', background: 'var(--dark)', color: 'var(--gold)', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '12px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                WEEKLY TOTAL
              </td>
              {weeks.map((w, i) => (
                <td key={i} style={{
                  padding: '12px 14px',
                  background: 'var(--dark)',
                  color: w.isCurrent ? '#ffd700' : 'var(--gold)',
                  textAlign: 'right',
                  fontFamily: 'DM Mono, monospace',
                  fontWeight: 600,
                  fontSize: '13px',
                  borderRight: '1px solid rgba(255,255,255,0.1)',
                }}>
                  {fmt(getWeekTotal(w.start))}
                </td>
              ))}
              {/* Grand total */}
              <td style={{ padding: '12px 14px', background: 'var(--green)', color: 'white', textAlign: 'right', fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: '13px' }}>
                {fmt(grandTotal)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyTable;