import React from 'react';
import { CATS } from '../../data/constants.js';

export const MapLegend = () => {
  return (
    <div className="flex flex-wrap gap-3 mut" style={{ fontSize: 12 }}>
      {Object.entries(CATS).map(([k, v]) => (
        <span key={k} className="flex items-center gap-1">
          <i
            style={{
              width: 9,
              height: 9,
              borderRadius: 9,
              background: v[1],
              display: 'inline-block',
            }}
          />
          {k}
        </span>
      ))}
    </div>
  );
};

export default MapLegend;
