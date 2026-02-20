import React from 'react';

const StatusBadge = ({ status }) => {
  const isOpen = status === 'open';
  return (
    <span style={{
      display: 'inline-block',
      background: isOpen ? '#fff3cd' : '#d4edda',
      color: isOpen ? '#856404' : '#155724',
      border: `1px solid ${isOpen ? '#ffc107' : '#28a745'}`,
      borderRadius: '20px',
      padding: '1px 8px',
      fontSize: '10px',
      fontFamily: 'DM Mono, monospace',
      marginLeft: '6px',
      verticalAlign: 'middle',
    }}>
      {status}
    </span>
  );
};

export default StatusBadge;