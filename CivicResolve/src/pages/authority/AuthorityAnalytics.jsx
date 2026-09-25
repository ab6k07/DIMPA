import React from 'react';
import StatCard from '../../components/common/StatCard.jsx';
import BarChart from '../../components/common/BarChart.jsx';
import CityMap from '../../components/map/CityMap.jsx';
import { DEPTS, CATS } from '../../data/constants.js';
import { formatDate } from '../../utils/formatters.js';

export const AuthorityAnalytics = ({ c }) => {
  const i = c.inc;
  const res = i.filter((x) => ['Resolved', 'Closed'].includes(x.status)).length;
  const resRate = i.length ? Math.round((res / i.length) * 100) + '%' : '0%';

  const dates = [
    '2026-09-10',
    '2026-09-15',
    '2026-09-20',
    '2026-09-21',
    '2026-09-22',
    '2026-09-23',
    '2026-09-24',
  ];

  return (
    <div className="grid gap-4">
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard l="Total incidents" v={i.length} />
        <StatCard l="Resolution rate" v={resRate} c="#15803d" />
        <StatCard l="Avg resolution time" v="2.6 d" />
        <StatCard
          l="Critical"
          v={i.filter((x) => x.pri === 'Critical').length}
          c="#dc2626"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="card">
          <b>Incidents over time</b>
          <div className="mt-3">
            <BarChart
              d={dates.map((d) => [
                formatDate(d),
                i.filter((x) => x.date === d).length,
              ])}
            />
          </div>
        </div>

        <div className="card">
          <b>Department workload (open)</b>
          <div className="mt-3">
            <BarChart
              d={DEPTS.map((d) => [
                d,
                i.filter(
                  (x) =>
                    x.dept === d && !['Resolved', 'Closed'].includes(x.status)
                ).length,
              ])}
            />
          </div>
        </div>

        <div className="card">
          <b>Category distribution</b>
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
          <b>Resolution performance</b>
          <div className="mt-3">
            <BarChart
              d={[
                ['Within SLA', res],
                ['Breached', Math.max(0, i.length - res - 2)],
                ['Open', i.length - res],
              ]}
            />
          </div>
        </div>
      </div>

      <b>Geographic distribution</b>
      <CityMap items={i} heat={true} />
    </div>
  );
};

export default AuthorityAnalytics;
