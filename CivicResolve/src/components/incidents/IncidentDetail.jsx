import React, { useState } from 'react';
import Icon from '../icons/Icon.jsx';
import Badge from '../common/Badge.jsx';
import Select from '../common/Select.jsx';
import Timeline from '../common/Timeline.jsx';
import CityMap from '../map/CityMap.jsx';
import { PRI, STAT, DEPTS, OFFS } from '../../data/constants.js';
import { formatDate } from '../../utils/formatters.js';

export const IncidentDetail = ({ i, c, manage, back }) => {
  const [note, setNote] = useState('');

  if (!i) {
    return (
      <div className="card">
        <b>Incident not found</b>
        <div className="mut my-2">It may have been removed or the link is wrong.</div>
        <button className="btn2" onClick={back}>
          Go back
        </button>
      </div>
    );
  }

  const F = (l, v) => (
    <div>
      <div className="lbl">{l}</div>
      <div>{v || '—'}</div>
    </div>
  );

  return (
    <div className="grid gap-4">
      <button className="btn2 w-fit" onClick={back}>
        <Icon n="back" />
        Back
      </button>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Left Column: Details, Assessment, Management, History */}
        <div className="lg:col-span-3 grid gap-4 content-start">
          <div className="card">
            <div className="flex flex-wrap gap-2 items-center mb-2">
              <b>{i.id}</b>
              <Badge t={i.pri} />
              <Badge t={i.status} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 6px' }}>
              {i.title}
            </h2>
            <p className="mut" style={{ margin: '0 0 14px' }}>
              {i.desc}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {F('Category', i.cat)}
              {F('Location', i.loc)}
              {F('Submitted', formatDate(i.date))}
              {F('Department', i.dept)}
              {F('Officer', i.officer)}
              {F('Priority', i.pri)}
            </div>
          </div>

          {manage && (
            <>
              <div className="card">
                <b>AI assessment</b>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                  {F('Detected category', i.cat)}
                  {F('Confidence', i.conf + '%')}
                  {F('Priority score', i.score + '/100')}
                  {F('Duplicate probability', i.dup + '%')}
                </div>
              </div>

              <div className="card grid gap-3">
                <b>Manage incident</b>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="lbl">Priority</label>
                    <Select
                      l="Priority"
                      v={i.pri}
                      o={PRI}
                      set={(v) => c.upd(i.id, { pri: v }, 'Priority set to ' + v)}
                    />
                  </div>
                  <div>
                    <label className="lbl">Status</label>
                    <Select
                      l="Status"
                      v={i.status}
                      o={STAT}
                      set={(v) => c.act('updateStatus', i.id, v)}
                    />
                  </div>
                  <div>
                    <label className="lbl">Department</label>
                    <Select
                      l="Department"
                      v={i.dept}
                      o={DEPTS}
                      set={(v) => c.act('assignDepartment', i.id, v)}
                    />
                  </div>
                  <div>
                    <label className="lbl">Field officer</label>
                    <Select
                      l="Officer"
                      v={i.officer}
                      all="Unassigned"
                      o={OFFS}
                      set={(v) => v && c.act('assignOfficer', i.id, v)}
                    />
                  </div>
                </div>

                <div>
                  <label className="lbl">Internal note</label>
                  <textarea
                    className="inp"
                    rows="2"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Visible to staff only"
                  />
                </div>
                <button
                  className="btn w-fit"
                  onClick={() => {
                    if (!note.trim()) return c.tst('Write a note first');
                    c.upd(i.id, { notes: [...i.notes, note] }, 'Internal note added');
                    setNote('');
                  }}
                >
                  Add note
                </button>
                {i.notes &&
                  i.notes.map((n, k) => (
                    <div
                      key={k}
                      className="mut"
                      style={{
                        fontSize: 13,
                        borderLeft: '2px solid var(--acc)',
                        paddingLeft: 8,
                      }}
                    >
                      {n}
                    </div>
                  ))}
              </div>
            </>
          )}

          <div className="card">
            <b>Activity history</b>
            <div className="grid gap-2 mt-3">
              {i.hist.map((x, k) => (
                <div key={k} className="flex gap-3">
                  <span className="mut w-16 shrink-0" style={{ fontSize: 12 }}>
                    {x[0]}
                  </span>
                  <span>{x[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Map, Evidence, Timeline */}
        <div className="lg:col-span-2 grid gap-4 content-start">
          <CityMap items={[i]} single={true} />
          <div className="card">
            <div className="lbl">Citizen evidence</div>
            <div
              style={{
                height: 130,
                borderRadius: 5,
                background:
                  'repeating-linear-gradient(45deg,var(--line),var(--line) 8px,var(--card) 8px,var(--card) 16px)',
                display: 'grid',
                placeItems: 'center',
              }}
              className="mut"
            >
              IMG_{i.id.slice(4)}.jpg
            </div>
          </div>
          <div className="card">
            <b>Status</b>
            <div className="mt-3">
              <Timeline i={i} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetail;
