import React, { useState } from 'react';
import Select from '../../components/common/Select.jsx';
import Empty from '../../components/common/Empty.jsx';
import IncidentTable from '../../components/incidents/IncidentTable.jsx';
import IncidentDetail from '../../components/incidents/IncidentDetail.jsx';
import { STAT, PRI, CATS } from '../../data/constants.js';

export const AuthorityIncidents = ({ c, id }) => {
  const [q, setQ] = useState('');
  const [st, setSt] = useState('');
  const [pri, setPri] = useState('');
  const [cat, setCat] = useState('');
  const [from, setFrom] = useState('');
  const [sort, setSort] = useState('new');

  if (id) {
    return (
      <IncidentDetail
        i={c.inc.find((x) => x.id === id)}
        c={c}
        manage={true}
        back={() => c.go('authority/incidents')}
      />
    );
  }

  const l = c.inc
    .filter(
      (i) =>
        (!st || i.status === st) &&
        (!pri || i.pri === pri) &&
        (!cat || i.cat === cat) &&
        (!from || i.date >= from) &&
        (i.title + i.id + i.loc).toLowerCase().includes(q.toLowerCase())
    )
    .sort((a, b) =>
      sort === 'pri'
        ? PRI.indexOf(b.pri) - PRI.indexOf(a.pri)
        : sort === 'old'
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date)
    );

  return (
    <div className="grid gap-3">
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Incidents</h1>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        <input
          className="inp col-span-2"
          aria-label="Search"
          placeholder="Search ID, issue, location"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Select
          l="Status"
          v={st}
          set={setSt}
          o={STAT}
          all="All statuses"
        />
        <Select
          l="Priority"
          v={pri}
          set={setPri}
          o={PRI}
          all="All priorities"
        />
        <Select
          l="Category"
          v={cat}
          set={setCat}
          o={Object.keys(CATS)}
          all="All categories"
        />
        <input
          type="date"
          className="inp"
          aria-label="From date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <span className="mut">Sort</span>
        <select
          className="inp w-auto"
          aria-label="Sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
          <option value="pri">Highest priority</option>
        </select>
        <span className="mut ml-auto">{l.length} results</span>
      </div>

      <div className="card">
        {l.length ? (
          <IncidentTable list={l} c={c} />
        ) : (
          <Empty t="No incidents match" s="Adjust your filters." />
        )}
      </div>
    </div>
  );
};

export default AuthorityIncidents;
