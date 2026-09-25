import React from 'react';

export const Toast = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--navy)',
        color: 'var(--bg)',
        padding: '10px 16px',
        borderRadius: 6,
        zIndex: 50,
        boxShadow: '0 4px 14px #0004',
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
