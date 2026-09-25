import React from 'react';

export const BarChart = ({ d }) => {
  const m = Math.max(1, ...d.map((x) => x[1]));

  return (
    <div className="grid gap-2">
      {d.map(([l, v, c]) => (
        <div key={l} className="flex items-center gap-2">
          <span className="mut w-24 shrink-0 truncate" style={{ fontSize: 12 }}>
            {l}
          </span>
          <div
            className="flex-1"
            style={{
              background: 'var(--line)',
              height: 10,
              borderRadius: 3,
            }}
          >
            <div
              style={{
                width: `${(v / m) * 100}%`,
                background: c || 'var(--acc)',
                height: 10,
                borderRadius: 3,
                transition: 'width .4s',
              }}
            />
          </div>
          <b style={{ fontSize: 12, width: 22 }}>{v}</b>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
