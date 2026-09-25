import React from 'react';
import Icon from '../../components/icons/Icon.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import Badge from '../../components/common/Badge.jsx';
import Empty from '../../components/common/Empty.jsx';
import CityMap from '../../components/map/CityMap.jsx';
import IncidentDetail from '../../components/incidents/IncidentDetail.jsx';

export const OfficerTasks = ({ c, id }) => {
  const { user } = useAuth();
  const me = user ? user.full_name : 'Field Officer';
  const l = c.inc.filter((i) => i.officer === me);
  const i = id && c.inc.find((x) => x.id === id);

  if (id) {
    if (!i) {
      return <IncidentDetail i={null} back={() => c.go('officer/tasks')} />;
    }

    const A = (t, p, m) => (
      <button
        type="button"
        className="btn"
        onClick={() => c.upd(i.id, p, m)}
      >
        {t}
      </button>
    );

    return (
      <div className="grid gap-3">
        <button
          type="button"
          className="btn2 w-fit"
          onClick={() => c.go('officer/tasks')}
        >
          <Icon n="back" />
          Tasks
        </button>

        <div className="card">
          <div className="flex gap-2 mb-2">
            <b>{i.id}</b>
            <Badge t={i.pri} />
            <Badge t={i.status} />
          </div>
          <b style={{ fontSize: 17 }}>{i.title}</b>
          <p className="mut">{i.desc}</p>
          <div className="mut">
            {i.loc} · {i.dept} Dept
          </div>
        </div>

        <CityMap items={[i]} single={true} />

        <div className="grid grid-cols-2 gap-2">
          {i.status === 'Assigned' &&
            A('Accept Task', {}, 'Task accepted by ' + me)}

          {['Assigned', 'Pending'].includes(i.status) &&
            A('Start Work', { status: 'In Progress' }, 'Work started by ' + me)}

          <label className="btn2 justify-center cursor-pointer">
            <Icon n="up" />
            Upload Evidence
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                e.target.files[0] &&
                c.upd(
                  i.id,
                  {},
                  'Evidence uploaded: ' + e.target.files[0].name
                )
              }
            />
          </label>

          {i.status === 'In Progress' &&
            A('Mark Resolved', { status: 'Resolved' }, 'Marked resolved by ' + me)}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>
          Good morning, Officer
        </h1>
        <div className="mut">
          {me} ·{' '}
          {l.filter((x) => !['Resolved', 'Closed'].includes(x.status)).length}{' '}
          active assignments today
        </div>
      </div>

      {l.length ? (
        l.map((t, k) => (
          <button
            key={t.id}
            type="button"
            className="card text-left grid gap-1"
            style={{ cursor: 'pointer' }}
            onClick={() => c.go('officer/tasks/' + t.id)}
          >
            <div className="flex gap-2 items-center">
              <b>{t.id}</b>
              <Badge t={t.pri} />
              <Badge t={t.status} />
            </div>
            <div>{t.title}</div>
            <div className="mut" style={{ fontSize: 12 }}>
              {(1.2 + k * 1.7).toFixed(1)} km away · {t.loc}
            </div>
          </button>
        ))
      ) : (
        <Empty
          t="No assignments"
          s="New tasks will appear here."
        />
      )}
    </div>
  );
};

export default OfficerTasks;
