import React from 'react';

export const Skeleton = () => {
  return (
    <div className="grid gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="sk" style={{ height: 64 }} />
      ))}
    </div>
  );
};

export default Skeleton;
