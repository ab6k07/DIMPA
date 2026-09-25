import React from 'react';
import Icon from '../icons/Icon.jsx';

export const Empty = ({ t, s }) => {
  return (
    <div className="card text-center py-10">
      <div className="mut mb-1">
        <Icon n="list" s={28} />
      </div>
      <b>{t}</b>
      <div className="mut mt-1">{s}</div>
    </div>
  );
};

export default Empty;
