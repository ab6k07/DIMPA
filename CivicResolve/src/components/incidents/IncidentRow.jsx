import React from 'react';
import Badge from '../common/Badge.jsx';
import { formatDate } from '../../utils/formatters.js';

export const IncidentRow = ({ i, go }) => {
  return (
    <button
      onClick={() => go(i.id)}
      className="card w-full text-left flex flex-wrap items-center gap-x-4 gap-y-1 hover:opacity-90"
      style={{ cursor: 'pointer' }}
    >
      <b className="w-20">{i.id}</b>
      <span className="flex-1" style={{ minWidth: 160 }}>
        {i.title}
        <div className="mut" style={{ fontSize: 12 }}>
          {i.loc} · {formatDate(i.date)}
        </div>
      </span>
      <Badge t={i.pri} />
      <Badge t={i.status} />
    </button>
  );
};

export default IncidentRow;
