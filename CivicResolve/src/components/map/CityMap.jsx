import React from 'react';
import { CATS, PRI } from '../../data/constants.js';

export const CityMap = ({ items = [], onPick, heat, tall, single }) => {
  return (
    <div className="card p-0 overflow-hidden" style={{ padding: 0 }}>
      <svg
        viewBox="0 0 100 60"
        style={{
          width: '100%',
          height: tall ? 420 : 240,
          display: 'block',
          background: 'var(--accbg)',
        }}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="City incident map"
      >
        <defs>
          <radialGradient id="hg">
            <stop offset="0" stopColor="#dc2626" stopOpacity=".55" />
            <stop offset="1" stopColor="#dc2626" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d="M0 12H100M0 30H100M0 48H100M20 0V60M50 0V60M78 0V60M0 55L100 5"
          stroke="var(--card)"
          strokeWidth="2.2"
          fill="none"
        />
        <path
          d="M0 12H100M0 30H100M0 48H100M20 0V60M50 0V60M78 0V60"
          stroke="var(--line)"
          strokeWidth=".3"
          fill="none"
        />
        <rect x="60" y="34" width="14" height="10" fill="#bfdbfe" opacity=".5" />

        {heat &&
          items.map((i) => (
            <circle
              key={'h' + i.id}
              cx={i.x}
              cy={i.y}
              r={6 + Math.max(0, PRI.indexOf(i.pri)) * 2.5}
              fill="url(#hg)"
            />
          ))}

        {items.map((i) => {
          const catColor = (CATS[i.cat] && CATS[i.cat][1]) || '#0f766e';
          return (
            <g
              key={i.id}
              tabIndex={0}
              role="button"
              aria-label={`${i.id} ${i.title}`}
              style={{ cursor: onPick ? 'pointer' : 'default' }}
              onClick={() => onPick && onPick(i)}
              onKeyDown={(e) => e.key === 'Enter' && onPick && onPick(i)}
            >
              <circle
                cx={i.x}
                cy={i.y}
                r={single ? 2.4 : 1.9}
                fill={catColor}
                stroke="#fff"
                strokeWidth=".5"
              />
              {i.pri === 'Critical' && (
                <circle
                  cx={i.x}
                  cy={i.y}
                  r="3.2"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth=".4"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CityMap;
