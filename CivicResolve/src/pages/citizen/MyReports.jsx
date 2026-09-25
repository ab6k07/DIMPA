import React, { useState } from 'react';
import Badge from '../../components/common/Badge.jsx';
import Empty from '../../components/common/Empty.jsx';
import Timeline from '../../components/common/Timeline.jsx';
import IncidentDetail from '../../components/incidents/IncidentDetail.jsx';
import { STAT } from '../../data/constants.js';
import { formatDate } from '../../utils/formatters.js';

export const MyReports = ({ c, id }) => {
  const [tab, setTab] = useState('All');
  const m = c.inc.filter((x) => x.mine);

  if (id) {
    return (
      <IncidentDetail
        i={m.find((x) => x.id === id)}
        c={c}
        back={() => c.go('citizen/reports')}
      />
    );
  }

  const list = tab === 'All' ? m : m.filter((x) => x.status === tab);

  return (
    <div className="grid gap-4">
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>My reports</h1>

      <div className="flex gap-1 overflow-x-auto" role="tablist">
        {['All', ...STAT].map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={'nav ' + (tab === t ? 'on' : '')}
            onClick={() => setTab(t)}
          >
            {t}{' '}
            <span className="mut">
              {t === 'All' ? m.length : m.filter((x) => x.status === t).length}
            </span>
          </button>
        ))}
      </div>

      {list.length ? (
        list.map((i) => (
          <div
            key={i.id}
            className="card grid md:grid-cols-3 gap-4 cursor-pointer"
            onClick={() => c.go('citizen/reports/' + i.id)}
          >
            <div className="md:col-span-2 grid gap-1">
              <div className="flex gap-2 items-center">
                <b>{i.id}</b>
                <Badge t={i.pri} />
                <Badge t={i.status} />
              </div>
              <div style={{ fontWeight: 500 }}>{i.title}</div>
              <div className="mut" style={{ fontSize: 13 }}>
                {i.cat} · {i.loc}
                <br />
                {i.dept} Dept · Officer: {i.officer || 'Not yet assigned'}
                <br />
                Created {formatDate(i.date)} · Updated{' '}
                {i.hist[i.hist.length - 1][0]}
              </div>
            </div>
            <div style={{ fontSize: 12 }}>
              <Timeline i={i} />
            </div>
          </div>
        ))
      ) : (
        <Empty
          t={'No ' + tab.toLowerCase() + ' reports'}
          s="Nothing to show here right now."
        />
      )}
    </div>
  );
};

export default MyReports;
