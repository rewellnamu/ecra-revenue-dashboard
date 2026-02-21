import React, { useState, useEffect } from 'react';
import { fetchRevenueReports } from '../../services/api';

const YEARS = [2025, 2026];
const SUB_COUNTIES = [
  { id: 'all', label: 'ALL COUNTIES' },
  { id: 1, label: 'Embu' },
  { id: 2, label: 'Runyenjes' },
  { id: 3, label: 'Manyatta' },
  { id: 4, label: 'Mbere North' },
  { id: 5, label: 'Mbere South' },
  { id: 6, label: 'Siakago' },
];

const MONTHS = [
  'July','August','September','October',
  'November','December','January','February',
  'March','April','May','June'
];

const fmt = (amount) => amount > 0 ? `KES ${Number(amount).toLocaleString()}` : '—';

const YOYTable = ({ filters = {} }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStreams, setExpandedStreams] = useState({});

  useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchRevenueReports({});
      setData(response.data.data);
    } catch (err) {
      console.error('Failed to fetch YOY data:', err);
      setError('Failed to load data. Please check the backend is running.');
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, [filters]);

  const toggleStream = (stream) =>
    setExpandedStreams(p => ({ ...p, [stream]: !p[stream] }));

  const streams = [...new Set(data.map(r => r.rev_stream))];

 const getAmount = (stream, month, year, subCountyId) => {
  return data
    .filter(r => {
      if (r.rev_stream !== stream) return false;
      if (Number(r.calendar_year) !== Number(year)) return false;
      if (month !== 'ALL' && r.calendar_month !== month) return false;
      if (subCountyId !== 'all' && Number(r.sub_county_id) !== Number(subCountyId)) return false;
      return true;
    })
    .reduce((sum, r) => sum + (r.amount || 0), 0);
};

  // Loading
  if (loading) {
    return (
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '80px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--green)', marginBottom: '6px' }}>Loading year-on-year data...</div>
        <div style={{ fontSize: '13px', color: 'var(--gray)' }}>Fetching from MariaDB</div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div style={{ background: '#fff5f5', border: '1px solid #ffcccc', borderRadius: '12px', padding: '60px', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>❌</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: '#c0392b', marginBottom: '6px' }}>Connection Error</div>
        <div style={{ fontSize: '13px', color: 'var(--gray)' }}>{error}</div>
      </div>
    );
  }

  // Styles
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

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Header bar */}
      <div style={{ background: 'var(--dark)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'white', fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '1px', opacity: 0.7 }}>
          TABLE: rev_reports · Year-on-Year Comparison
        </span>
        <span style={{ color: 'var(--gold)', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}>
          ▶ Click stream to expand months
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
  {/* Row 1 — Fixed columns + Group headers */}
  <tr>
    <th style={{ ...thBase, background: 'var(--dark)', width: '150px', textAlign: 'left', position: 'sticky', left: 0, zIndex: 3 }}>
      Revenue Stream
    </th>
    <th style={{ ...thBase, background: 'var(--dark)', width: '120px', textAlign: 'left', position: 'sticky', left: '150px', zIndex: 3 }}>
      Calendar Month
    </th>
    {SUB_COUNTIES.map(sc => (
      <th
        key={sc.id}
        colSpan={YEARS.length}
        style={{
          ...thBase,
          background: sc.id === 'all' ? 'var(--green)' : '#1a4a7a',
          borderLeft: '3px solid rgba(255,255,255,0.3)',
          fontSize: '12px',
          padding: '12px 16px',
        }}
      >
        {sc.label}
      </th>
    ))}
  </tr>

  {/* Row 2 — Year columns under each group */}
  <tr>
    <th style={{ ...thBase, background: '#0a1710', position: 'sticky', left: 0, zIndex: 3, textAlign: 'left' }}></th>
    <th style={{ ...thBase, background: '#0a1710', position: 'sticky', left: '150px', zIndex: 3, textAlign: 'left' }}></th>
    {SUB_COUNTIES.map(sc =>
      YEARS.map((year, i) => (
        <th
          key={`${sc.id}-${year}`}
          style={{
            ...thBase,
            background: year === 2026 ? '#2d6b47' : '#1a5c38',
            borderLeft: i === 0 ? '3px solid rgba(255,255,255,0.3)' : 'none',
            fontSize: '11px',
          }}
        >
          {year}
        </th>
      ))
    )}
  </tr>
</thead>

          <tbody>
            {streams.map(stream => {
              const isExpanded = expandedStreams[stream];

              // ALL MONTHS row
              const allMonthsRow = (
                <tr
                  key={`${stream}-all`}
                  onClick={() => toggleStream(stream)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Stream name */}
                  <td style={{
                    padding: '11px 14px',
                    background: 'var(--green-pale)',
                    borderBottom: '1px solid #c8dfd2',
                    borderRight: '1px solid var(--border)',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: '12px',
                    color: 'var(--green)',
                    position: 'sticky',
                    left: 0,
                    zIndex: 1,
                    whiteSpace: 'nowrap',
                  }}>
                    <span style={{ marginRight: '8px', background: isExpanded ? 'var(--gold)' : 'var(--green)', color: 'white', borderRadius: '4px', padding: '1px 6px', fontSize: '10px' }}>
                      {isExpanded ? '▼' : '▶'}
                    </span>
                    {stream}
                  </td>

                  {/* ALL MONTHS label */}
                  <td style={{
                    padding: '11px 14px',
                    background: 'var(--green-pale)',
                    borderBottom: '1px solid #c8dfd2',
                    borderRight: '2px solid var(--border)',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 600,
                    fontSize: '11px',
                    color: 'var(--green)',
                    position: 'sticky',
                    left: '150px',
                    zIndex: 1,
                    whiteSpace: 'nowrap',
                  }}>
                    ALL MONTHS
                  </td>

                  {/* Data cells */}
                  {SUB_COUNTIES.map(sc =>
                    YEARS.map((year, i) => {
                      const amount = getAmount(stream, 'ALL', year, sc.id);
                      return (
                        <td
                          key={`${sc.id}-${year}`}
                          style={{
                            ...cellBase,
                            background: i === 0 ? '#f8faf9' : 'var(--green-pale)',
                            borderLeft: i === 0 ? '2px solid var(--border)' : 'none',
                            color: year === 2026 ? 'var(--green)' : 'var(--dark)',
                            fontWeight: year === 2026 ? 600 : 400,
                          }}
                        >
                          {fmt(amount)}
                        </td>
                      );
                    })
                  )}
                </tr>
              );

              // Month rows
              const monthRows = isExpanded ? MONTHS.map(month => {
                const hasData = SUB_COUNTIES.some(sc =>
                  YEARS.some(year => getAmount(stream, month, year, sc.id) > 0)
                );
                if (!hasData) return null;

                return (
                  <tr key={`${stream}-${month}`}>
                    {/* Empty stream cell */}
                    <td style={{
                      padding: '8px 14px',
                      background: 'white',
                      borderBottom: '1px solid #f0f4f2',
                      borderRight: '1px solid var(--border)',
                      position: 'sticky',
                      left: 0,
                      zIndex: 1,
                    }}></td>

                    {/* Month label */}
                    <td style={{
                      padding: '8px 14px 8px 28px',
                      background: 'white',
                      borderBottom: '1px solid #f0f4f2',
                      borderRight: '2px solid var(--border)',
                      color: 'var(--gray)',
                      fontSize: '12px',
                      position: 'sticky',
                      left: '150px',
                      zIndex: 1,
                      whiteSpace: 'nowrap',
                    }}>
                      {month}
                    </td>

                    {/* Data cells */}
                    {SUB_COUNTIES.map(sc =>
                      YEARS.map((year, i) => {
                        const amount = getAmount(stream, month, year, sc.id);
                        return (
                          <td
                            key={`${sc.id}-${year}`}
                            style={{
                              ...cellBase,
                              background: 'white',
                              borderLeft: i === 0 ? '2px solid var(--border)' : 'none',
                              color: year === 2026 ? '#1a6b3c' : amount > 0 ? 'var(--dark)' : '#ccc',
                            }}
                          >
                            {fmt(amount)}
                          </td>
                        );
                      })
                    )}
                  </tr>
                );
              }).filter(Boolean) : [];

              return [allMonthsRow, ...monthRows];
            })}

            {/* Grand Total Row */}
            <tr>
              <td colSpan={2} style={{
                padding: '12px 16px',
                background: 'var(--dark)',
                color: 'white',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: '12px',
                position: 'sticky',
                left: 0,
                zIndex: 1,
              }}>
                GRAND TOTAL
              </td>
              {SUB_COUNTIES.map(sc =>
                YEARS.map((year, i) => {
                  const total = streams.reduce((sum, stream) => sum + getAmount(stream, 'ALL', year, sc.id), 0);
                  return (
                    <td
                      key={`${sc.id}-${year}`}
                      style={{
                        ...cellBase,
                        background: 'var(--dark)',
                        color: 'var(--gold)',
                        fontWeight: 700,
                        borderLeft: i === 0 ? '2px solid rgba(255,255,255,0.1)' : 'none',
                        borderBottom: 'none',
                      }}
                    >
                      {fmt(total)}
                    </td>
                  );
                })
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YOYTable;