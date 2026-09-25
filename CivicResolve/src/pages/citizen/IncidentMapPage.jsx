import React, { useState } from 'react';
import Select from '../../components/common/Select.jsx';
import CityMap from '../../components/map/CityMap.jsx';
import MapLegend from '../../components/map/MapLegend.jsx';
import { CATS, PRI, STAT, DEPTS } from '../../data/constants.js';

export const IncidentMapPage = ({ c, base = 'citizen/reports' }) => {
  const [cat, setCat] = useState('');
  const [pri, setPri] = useState('');
  const [st, setSt] = useState('');
  const [dp, setDp] = useState('');
  const [heat, setHeat] = useState(false);

  const filteredIncidents = c.inc.filter(
    (i) =>
      (!cat || i.cat === cat) &&
      (!pri || i.pri === pri) &&
      (!st || i.status === st) &&
      (!dp || i.dept === dp)
  );

  return (
    <div className="grid gap-3">
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Incident map</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <Select
          l="Category"
          v={cat}
          set={setCat}
          o={Object.keys(CATS)}
          all="All categories"
        />
        <Select
          l="Priority"
          v={pri}
          set={setPri}
          o={PRI}
          all="All priorities"
        />
        <Select
          l="Status"
          v={st}
          set={setSt}
          o={STAT}
          all="All statuses"
        />
        <Select
          l="Department"
          v={dp}
          set={setDp}
          o={DEPTS}
          all="All departments"
        />
        <label className="btn2 justify-center cursor-pointer">
          <input
            type="checkbox"
            checked={heat}
            onChange={(e) => setHeat(e.target.checked)}
            className="mr-1"
          />
          Heatmap
        </label>
      </div>

      <CityMap
        items={filteredIncidents}
        heat={heat}
        tall={true}
        onPick={(i) => c.go(base + '/' + i.id)}
      />

      <div className="flex justify-between items-center flex-wrap gap-2">
        <MapLegend />
        <span className="mut">{filteredIncidents.length} incidents</span>
      </div>
    </div>
  );
};

export default IncidentMapPage;
