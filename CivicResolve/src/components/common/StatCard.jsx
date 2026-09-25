import React from 'react';

export const StatCard = ({ l, v, c }) => {
  return (
    <div className="card">
      <div className="mut" style={{ fontSize: 12 }}>
        {l}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: c || 'var(--ink)',
        }}
      >
        {v}
      </div>
    </div>
  );
};

export default StatCard;
