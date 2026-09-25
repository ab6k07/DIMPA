import React from 'react';
import { CL } from '../../data/constants.js';

export const Badge = ({ t }) => {
  const colors = CL[t] || ['#e5e7eb', '#374151'];
  return (
    <span
      className="badge"
      style={{
        background: colors[0],
        color: colors[1],
      }}
    >
      {t}
    </span>
  );
};

export default Badge;
