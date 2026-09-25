import React from 'react';
import { DEPTS, OFFS } from '../../data/constants.js';

export const AuthorityTeams = ({ c, kind }) => {
  const dep = kind === 'dep';
  const rows = dep ? DEPTS : OFFS;

  return (
    <div className="grid gap-3">
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>
        {dep ? 'Departments' : 'Field officers'}
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rows.map((r) => {
          const l = c.inc.filter((i) => (dep ? i.dept : i.officer) === r);
          const open = l.filter(
            (i) => !['Resolved', 'Closed'].includes(i.status)
          ).length;

          return (
            <div key={r} className="card">
              <b>{r}</b>
              <div className="mut">{dep ? 'Department' : 'Field officer'}</div>
              <div className="flex gap-6 mt-3">
                <div>
                  <div style={{ fontSize: 22, fontWeight: 600 }}>{open}</div>
                  <div className="mut" style={{ fontSize: 12 }}>
                    Open
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 600 }}>
                    {l.length - open}
                  </div>
                  <div className="mut" style={{ fontSize: 12 }}>
                    Closed
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AuthorityTeams;
