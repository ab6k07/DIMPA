import React from 'react';
import Badge from '../common/Badge.jsx';
import { formatDate } from '../../utils/formatters.js';

export const IncidentTable = ({ list, c }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ fontSize: 13 }}>
        <thead>
          <tr>
            {[
              'ID',
              'Issue',
              'Location',
              'Category',
              'Priority',
              'Department',
              'Officer',
              'Status',
              'Created',
            ].map((x) => (
              <th key={x}>{x}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((i) => (
            <tr
              key={i.id}
              className="cl"
              tabIndex={0}
              onClick={() => c.go('authority/incidents/' + i.id)}
              onKeyDown={(e) =>
                e.key === 'Enter' && c.go('authority/incidents/' + i.id)
              }
            >
              <td>
                <b>{i.id}</b>
              </td>
              <td>{i.title}</td>
              <td>{i.loc}</td>
              <td>{i.cat}</td>
              <td>
                <Badge t={i.pri} />
              </td>
              <td>{i.dept}</td>
              <td>{i.officer || '—'}</td>
              <td>
                <Badge t={i.status} />
              </td>
              <td>{formatDate(i.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentTable;
