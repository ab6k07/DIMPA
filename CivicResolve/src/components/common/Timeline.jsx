import React from 'react';
import Icon from '../icons/Icon.jsx';
import { STEPS, SI } from '../../data/constants.js';

export const Timeline = ({ i }) => {
  const n = SI[i.status] || 0;

  return (
    <ol className="grid gap-0">
      {STEPS.map((s, k) => (
        <li key={s} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 99,
                background: k < n ? 'var(--acc)' : 'var(--line)',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
              }}
            >
              {k < n && <Icon n="check" s={9} />}
            </span>
            {k < 5 && (
              <span
                style={{
                  width: 2,
                  height: 18,
                  background: k < n - 1 ? 'var(--acc)' : 'var(--line)',
                }}
              />
            )}
          </div>
          <span
            className={k < n ? '' : 'mut'}
            style={{ marginTop: -2 }}
          >
            {s}
          </span>
        </li>
      ))}
    </ol>
  );
};

export default Timeline;
