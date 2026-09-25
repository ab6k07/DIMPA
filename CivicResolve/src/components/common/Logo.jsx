import React from 'react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        stroke="var(--navy)"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M16 29S5 20 5 12a11 11 0 0122 0c0 8-11 17-11 17z" />
        <circle cx="16" cy="12" r="2.5" fill="var(--acc)" stroke="none" />
        <path
          d="M11 17v-4M21 17v-6M16 12l-5 1M16 12l5-1"
          stroke="var(--acc)"
        />
      </svg>
      <div className="leading-tight">
        <b style={{ color: 'var(--navy)', fontSize: 16 }}>CivicResolve</b>
        <div className="mut hidden sm:block" style={{ fontSize: 10 }}>
          Smarter reporting. Faster resolution. Better cities.
        </div>
      </div>
    </div>
  );
};

export default Logo;
