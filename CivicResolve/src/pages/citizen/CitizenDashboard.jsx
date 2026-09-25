import React from 'react';
import Icon from '../../components/icons/Icon.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import IncidentRow from '../../components/incidents/IncidentRow.jsx';
import Empty from '../../components/common/Empty.jsx';
import CityMap from '../../components/map/CityMap.jsx';
import MapLegend from '../../components/map/MapLegend.jsx';

import { useAuth } from '../../context/AuthContext.jsx';

export const CitizenDashboard = ({ c }) => {
  const { user } = useAuth();
  const firstName = user ? user.full_name.split(' ')[0] : 'Citizen';
  const m = c.inc.filter((x) => x.mine);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
          Welcome back, {firstName}
          </h1>
          <div className="mut">
            Report a civic issue and help improve your city.
          </div>
        </div>
        <button className="btn" onClick={() => c.go('citizen/report')}>
          <Icon n="plus" />
          Report an Issue
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          l="Active reports"
          v={m.filter((x) => ['Pending', 'Assigned'].includes(x.status)).length}
        />
        <StatCard
          l="In progress"
          v={m.filter((x) => x.status === 'In Progress').length}
          c="#b45309"
        />
        <StatCard
          l="Resolved"
          v={m.filter((x) => x.status === 'Resolved').length}
          c="#15803d"
        />
        <StatCard l="Total reports" v={m.length} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="grid gap-2 content-start">
          <b>Recent reports</b>
          {m.length ? (
            m.slice(0, 4).map((i) => (
              <IncidentRow
                key={i.id}
                i={i}
                go={(id) => c.go('citizen/reports/' + id)}
              />
            ))
          ) : (
            <Empty t="No reports yet" s="Submit your first issue." />
          )}
        </div>
        <div className="grid gap-2 content-start">
          <b>Incidents near you</b>
          <CityMap
            items={c.inc}
            onPick={(i) => c.go('citizen/reports/' + i.id)}
          />
          <MapLegend />
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
