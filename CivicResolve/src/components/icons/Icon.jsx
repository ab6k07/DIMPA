import React from 'react';
import { iconPaths } from './paths.js';

export const Icon = ({ n, s = 17, className = '' }) => {
  const path = iconPaths[n];
  if (!path) return null;

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={path} />
    </svg>
  );
};

export default Icon;
