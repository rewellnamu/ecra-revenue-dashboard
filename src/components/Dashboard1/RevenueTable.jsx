import React, { useState, useEffect } from 'react';
import { fetchRevenueReports } from '../../services/api';
import { subCountyNames } from '../../data/mockData';
import StatusBadge from '../shared/StatusBadge';

const SUB_COUNTIES = [1, 2, 3, 4, 5, 6];
const fmt = (amount) => amount ? `KES ${amount.toLocaleString()}` : '—';

const getAmount = (records, filters) => {
  return records
    .filter(r => Object.entries(filters).every(([k, v]) => v === undefined || r[k] === v))
    .reduce((sum, r) => sum + (r.amount || 0), 0);
};

const RevenueTable = ({ filters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStreams, setExpandedStreams] = useState({});
  const [expandedYears, setExpandedYears] = useState({});
  const [expandedMonths, setExpandedMonths] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchRevenueReports(filters);
        setData(response.data.data);
      } catch (err) {
        console.error('Failed to fetch revenue reports:', err);
        setError('Failed to load data. contact customer service.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [filters]);

  const toggleStream = (stream) => setExpandedStreams(p => ({ ...p, [stream]: !p[stream] }));
  const toggleYear = (key) => setExpandedYears(p => ({ ...p, [key]: !p[key] }));
  const toggleMonth = (key) => setExpandedMonths(p => ({ ...p, [key]: !p[key] }));

  const streams = [...new Set(data.map(r => r.rev_stream))];

  const getYears = (stream) => {
    const order = [2025, 2026, 2027];
    return [...new Set(data.filter(r => r.rev_stream === stream).map(r => r.calendar_year))]
      .sort((a, b) => order.indexOf(a) - order.indexOf(b));
  };

  const getMonths = (stream, year) => {
    const order = ['July','August','September','October','November','December','January','February','March','April','May','June'];
    return [...new Set(data.filter(r => r.rev_stream === stream && r.calendar_year === year).map(r => r.calendar_month))]
      .sort((a, b) => order.indexOf(a) - order.indexOf(b));
  };

  const getSubStreams = (stream, year, month) =>
    [...new Set(data.filter(r => r.rev_stream === stream && r.calendar_year === year && r.calendar_month === month).map(r => r.rev_sub_stream))];

  const getStatus = (stream, year, month) => {
    const rec = data.find(r => r.rev_stream === stream && r.calendar_year === year && r.calendar_month === month);
    return rec ? rec.status : 'closed';
  };

  const thStyle = {
    background: 'var(--green)', color: 'white', padding: '12px 16px',
    textAlign: 'left', fontFamily: 'Syne, sans-serif', fontWeight: 600,
    fontSize: '12px', letterSpacing: '0.3px', whiteSpace: 'nowrap',
  };
  const thNumStyle = { ...thStyle, textAlign: 'right' };
  const rowHover = (id) => ({ onMouseEnter: () => setHoveredRow(id), onMouseLeave: () => setHoveredRow(null) });

  // Loading state
  if (loading) {
    return (
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '80px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--green)', marginBottom: '6px' }}>Loading revenue data...</div>
        <div style={{ fontSize: '13px', color: 'var(--gray)' }}>Fetching from MariaDB</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ background: '#fff5f5', border: '1px solid #ffcccc', borderRadius: '12px', padding: '60px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>❌</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: '#c0392b', marginBottom: '6px' }}>Connection Error</div>
        <div style={{ fontSize: '13px', color: 'var(--gray)' }}>{error}</div>
      </div>
    );
  }

  // Empty state
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
      <div style={{ background: 'var(--dark)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'white', fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '1px', opacity: 0.7 }}>TABLE: rev_reports · {data.length} records</span>
        <span style={{ color: 'var(--gold)', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}>▶ Click row to expand · 3 levels deep</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: '200px' }}>Revenue Stream</th>
              <th style={thStyle}>Financial Year</th>
              <th style={thStyle}>Year / Month</th>
              <th style={thNumStyle}>All Counties</th>
              {SUB_COUNTIES.map(sc => <th key={sc} style={thNumStyle}>{subCountyNames[sc]}</th>)}
            </tr>
          </thead>
          <tbody>
            {streams.map(stream => {
              const streamTotal = getAmount(data, { rev_stream: stream });
              const streamExpanded = expandedStreams[stream];
              const rowId = `stream-${stream}`;

              return (
                <React.Fragment key={stream}>
                  <tr onClick={() => toggleStream(stream)} style={{ cursor: 'pointer' }} {...rowHover(rowId)}>
                    <td style={{ padding: '13px 16px', background: hoveredRow === rowId ? '#d8f0e4' : 'var(--green-pale)', borderBottom: '1px solid #c8dfd2', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--green)', transition: 'background 0.15s' }}>
                      <span style={{ marginRight: '8px', background: streamExpanded ? 'var(--gold)' : 'var(--green)', color: 'white', borderRadius: '4px', padding: '1px 6px', fontSize: '10px' }}>
                        {streamExpanded ? '▼' : '▶'}
                      </span>
                      {stream}
                    </td>
                    <td style={{ padding: '13px 16px', background: hoveredRow === rowId ? '#d8f0e4' : 'var(--green-pale)', borderBottom: '1px solid #c8dfd2', fontWeight: 600, transition: 'background 0.15s' }}>FY2025/2026</td>
                    <td style={{ padding: '13px 16px', background: hoveredRow === rowId ? '#d8f0e4' : 'var(--green-pale)', borderBottom: '1px solid #c8dfd2', transition: 'background 0.15s' }}>—</td>
                    <td style={{ padding: '13px 16px', background: hoveredRow === rowId ? '#d8f0e4' : 'var(--green-pale)', borderBottom: '1px solid #c8dfd2', textAlign: 'right', fontFamily: 'DM Mono, monospace', fontWeight: 600, transition: 'background 0.15s' }}>{fmt(streamTotal)}</td>
                    {SUB_COUNTIES.map(sc => (
                      <td key={sc} style={{ padding: '13px 16px', background: hoveredRow === rowId ? '#d8f0e4' : 'var(--green-pale)', borderBottom: '1px solid #c8dfd2', textAlign: 'right', fontFamily: 'DM Mono, monospace', transition: 'background 0.15s' }}>
                        {fmt(getAmount(data, { rev_stream: stream, sub_county_id: sc }))}
                      </td>
                    ))}
                  </tr>

                  {streamExpanded && getYears(stream).map(year => {
                    const yearKey = `${stream}-${year}`;
                    const yearExpanded = expandedYears[yearKey];
                    const yearTotal = getAmount(data, { rev_stream: stream, calendar_year: year });
                    const yearRowId = `year-${yearKey}`;

                    return (
                      <React.Fragment key={yearKey}>
                        <tr onClick={() => toggleYear(yearKey)} style={{ cursor: 'pointer' }} {...rowHover(yearRowId)}>
                          <td style={{ padding: '11px 16px 11px 36px', background: hoveredRow === yearRowId ? '#f5f9f7' : 'white', borderBottom: '1px solid #e8eeeb', transition: 'background 0.15s' }}></td>
                          <td style={{ padding: '11px 16px', background: hoveredRow === yearRowId ? '#f5f9f7' : 'white', borderBottom: '1px solid #e8eeeb', transition: 'background 0.15s' }}>FY2025/2026</td>
                          <td style={{ padding: '11px 16px', background: hoveredRow === yearRowId ? '#f5f9f7' : 'white', borderBottom: '1px solid #e8eeeb', fontWeight: 600, transition: 'background 0.15s' }}>
                            <span style={{ marginRight: '8px', background: yearExpanded ? 'var(--gold)' : 'var(--green)', color: 'white', borderRadius: '4px', padding: '1px 6px', fontSize: '10px' }}>
                              {yearExpanded ? '▼' : '▶'}
                            </span>
                            {year}
                          </td>
                          <td style={{ padding: '11px 16px', background: hoveredRow === yearRowId ? '#f5f9f7' : 'white', borderBottom: '1px solid #e8eeeb', textAlign: 'right', fontFamily: 'DM Mono, monospace', color: '#1a4a7a', transition: 'background 0.15s' }}>{fmt(yearTotal)}</td>
                          {SUB_COUNTIES.map(sc => (
                            <td key={sc} style={{ padding: '11px 16px', background: hoveredRow === yearRowId ? '#f5f9f7' : 'white', borderBottom: '1px solid #e8eeeb', textAlign: 'right', fontFamily: 'DM Mono, monospace', color: '#1a4a7a', transition: 'background 0.15s' }}>
                              {fmt(getAmount(data, { rev_stream: stream, calendar_year: year, sub_county_id: sc }))}
                            </td>
                          ))}
                        </tr>

                        {yearExpanded && getMonths(stream, year).map(month => {
                          const monthKey = `${stream}-${year}-${month}`;
                          const monthExpanded = expandedMonths[monthKey];
                          const monthTotal = getAmount(data, { rev_stream: stream, calendar_year: year, calendar_month: month });
                          const status = getStatus(stream, year, month);
                          const monthRowId = `month-${monthKey}`;

                          return (
                            <React.Fragment key={monthKey}>
                              <tr onClick={() => toggleMonth(monthKey)} style={{ cursor: 'pointer' }} {...rowHover(monthRowId)}>
                                <td style={{ padding: '9px 16px 9px 56px', background: hoveredRow === monthRowId ? '#f0f7f3' : '#fafcfb', borderBottom: '1px solid #f0f4f2', transition: 'background 0.15s' }}></td>
                                <td style={{ padding: '9px 16px', background: hoveredRow === monthRowId ? '#f0f7f3' : '#fafcfb', borderBottom: '1px solid #f0f4f2', transition: 'background 0.15s' }}></td>
                                <td style={{ padding: '9px 16px 9px 56px', background: hoveredRow === monthRowId ? '#f0f7f3' : '#fafcfb', borderBottom: '1px solid #f0f4f2', color: 'var(--gray)', fontSize: '12px', transition: 'background 0.15s' }}>
                                  <span style={{ marginRight: '8px', background: monthExpanded ? 'var(--gold)' : '#aaa', color: 'white', borderRadius: '4px', padding: '1px 6px', fontSize: '10px' }}>
                                    {monthExpanded ? '▼' : '▶'}
                                  </span>
                                  {month} <StatusBadge status={status} />
                                </td>
                                <td style={{ padding: '9px 16px', background: hoveredRow === monthRowId ? '#f0f7f3' : '#fafcfb', borderBottom: '1px solid #f0f4f2', textAlign: 'right', fontFamily: 'DM Mono, monospace', fontSize: '12px', transition: 'background 0.15s' }}>{fmt(monthTotal)}</td>
                                {SUB_COUNTIES.map(sc => (
                                  <td key={sc} style={{ padding: '9px 16px', background: hoveredRow === monthRowId ? '#f0f7f3' : '#fafcfb', borderBottom: '1px solid #f0f4f2', textAlign: 'right', fontFamily: 'DM Mono, monospace', fontSize: '12px', transition: 'background 0.15s' }}>
                                    {fmt(getAmount(data, { rev_stream: stream, calendar_year: year, calendar_month: month, sub_county_id: sc }))}
                                  </td>
                                ))}
                              </tr>

                              {monthExpanded && getSubStreams(stream, year, month).map(sub => {
                                const subTotal = getAmount(data, { rev_stream: stream, calendar_year: year, calendar_month: month, rev_sub_stream: sub });
                                return (
                                  <tr key={sub}>
                                    <td style={{ padding: '8px 16px 8px 76px', background: 'white', borderBottom: '1px solid #f0f4f2' }}></td>
                                    <td style={{ padding: '8px 16px', background: 'white', borderBottom: '1px solid #f0f4f2' }}></td>
                                    <td style={{ padding: '8px 16px 8px 76px', background: 'white', borderBottom: '1px solid #f0f4f2', color: '#8a9e94', fontSize: '12px', fontStyle: 'italic' }}>↳ {sub}</td>
                                    <td style={{ padding: '8px 16px', background: 'white', borderBottom: '1px solid #f0f4f2', textAlign: 'right', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--gray)' }}>{fmt(subTotal)}</td>
                                    {SUB_COUNTIES.map(sc => (
                                      <td key={sc} style={{ padding: '8px 16px', background: 'white', borderBottom: '1px solid #f0f4f2', textAlign: 'right', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--gray)' }}>
                                        {fmt(getAmount(data, { rev_stream: stream, calendar_year: year, calendar_month: month, rev_sub_stream: sub, sub_county_id: sc }))}
                                      </td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}

            {/* Grand Total */}
            <tr style={{ position: 'sticky', bottom: 0, zIndex: 2 }}>
              <td colSpan={3} style={{ padding: '13px 16px', background: 'var(--dark)', color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
                GRAND TOTAL — {filters.financial_year}
              </td>
              <td style={{ padding: '13px 16px', background: 'var(--dark)', color: 'var(--gold)', textAlign: 'right', fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>
                {fmt(data.reduce((s, r) => s + r.amount, 0))}
              </td>
              {SUB_COUNTIES.map(sc => (
                <td key={sc} style={{ padding: '13px 16px', background: 'var(--dark)', color: 'var(--gold)', textAlign: 'right', fontFamily: 'DM Mono, monospace' }}>
                  {fmt(getAmount(data, { sub_county_id: sc }))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenueTable;