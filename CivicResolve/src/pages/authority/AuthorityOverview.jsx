import React from 'react';
import StatCard from '../../components/common/StatCard.jsx';
import BarChart from '../../components/common/BarChart.jsx';
import IncidentTable from '../../components/incidents/IncidentTable.jsx';
import { CATS, STAT, PRI, CL } from '../../data/constants.js';

export const AuthorityOverview = ({ c }) => {
  const i = c.inc;
  const cnt = (k, a) => a.map((x) => [x, i.filter((y) => y[k] === x).length]);

  return (
    <div className="grid gap-4">
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>
        Operations overview
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard l="Total incidents" v={i.length} />
        <StatCard
          l="Critical"
          v={i.filter((x) => x.pri === 'Critical').length}
          c="#dc2626"
        />
        <StatCard
          l="In progress"
          v={i.filter((x) => x.status === 'In Progress').length}
          c="#b45309"
        />
        <StatCard
          l="Resolved today"
          v={i.filter((x) => x.status === 'Resolved').length}
          c="#15803d"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="card">
          <b>By category</b>
          <div className="mt-3">
            <BarChart
              d={Object.keys(CATS).map((k) => [
                k,
                i.filter((x) => x.cat === k).length,
                CATS[k][1],
              ])}
            />
          </div>
        </div>

        <div className="card">
          <b>By status</b>
          <div className="mt-3">
            <BarChart
              d={cnt('status', STAT).map(([a, b]) => [a, b, CL[a][1]])}
            />
          </div>
        </div>

        <div className="card">
          <b>By priority</b>
          <div className="mt-3">
            <BarChart d={cnt('pri', PRI).map(([a, b]) => [a, b, CL[a][1]])} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between mb-2">
          <b>Recent incidents</b>
          <button
            className="btn2"
            onClick={() => c.go('authority/incidents')}
          >
            View all
          </button>
        </div>
        <IncidentTable list={i.slice(0, 5)} c={c} />
      </div>
    </div>
  );
};

export default AuthorityOverview;
