import React, { useState } from 'react';
import Icon from '../../components/icons/Icon.jsx';
import Badge from '../../components/common/Badge.jsx';
import CityMap from '../../components/map/CityMap.jsx';
import { CATS, PRI } from '../../data/constants.js';
import api from '../../services/api.js';

export const ReportIssue = ({ c }) => {
  const initialForm = {
    title: '',
    desc: '',
    cat: '',
    files: [],
    loc: '',
    lat: '',
    lng: '',
    sev: 'Medium',
  };

  const [s, setS] = useState(0);
  const [f, setF] = useState(initialForm);
  const [er, setEr] = useState({});
  const [done, setDone] = useState(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [q, setQ] = useState('');

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const names = ['Describe', 'Evidence', 'Location', 'Severity', 'Review'];

  const val = () => {
    const e = {};
    if (s === 0) {
      if (f.title.trim().length < 5) e.title = 'Enter a title (min 5 characters)';
      if (f.desc.trim().length < 15)
        e.desc = 'Describe the issue (min 15 characters)';
      if (!f.cat) e.cat = 'Select a category';
    }
    if (s === 2 && !f.loc.trim()) {
      e.loc = 'Choose or search for a location';
    }
    setEr(e);
    return !Object.keys(e).length;
  };

  const addFiles = (fl) => {
    const ok = [...fl].filter((x) => /^(image|video)\//.test(x.type));
    if (ok.length < fl.length) c.tst('Only images and videos are supported');
    set('files', [...f.files, ...ok.map((x) => x.name)]);
  };

  const submit = async () => {
    setBusy(true);
    const n = await api.createIncident(f);
    await c.refresh();
    setBusy(false);
    setDone(n);
    c.tst('Incident submitted');
  };

  if (done) {
    return (
      <div className="card max-w-xl mx-auto text-center">
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 99,
            background: 'var(--accbg)',
            color: 'var(--acc)',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 10px',
          }}
        >
          <Icon n="check" s={22} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
          Incident Reported Successfully
        </h2>
        <div className="grid grid-cols-2 gap-4 text-left my-5">
          <div>
            <div className="lbl">Incident ID</div>
            <b>{done.id}</b>
          </div>
          <div>
            <div className="lbl">Response category</div>
            {done.pri === 'Critical'
              ? 'Emergency (within 4 hrs)'
              : done.pri === 'High'
              ? 'Priority (within 24 hrs)'
              : 'Standard (within 3 days)'}
          </div>
          <div>
            <div className="lbl">Assigned department</div>
            {done.dept}
          </div>
          <div>
            <div className="lbl">Status</div>
            <Badge t="Pending" />
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          <button
            className="btn"
            onClick={() => c.go('citizen/reports/' + done.id)}
          >
            Track incident
          </button>
          <button
            className="btn2"
            onClick={() => {
              setDone(null);
              setF(initialForm);
              setS(0);
            }}
          >
            Report another
          </button>
        </div>
      </div>
    );
  }

  const sugg = [
    'BTM Layout, Bengaluru',
    'Koramangala 5th Block',
    'HSR Layout Sector 2',
    'Indiranagar 80 Feet Road',
    'Electronic City Phase 1',
  ].filter((x) => x.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="max-w-2xl mx-auto grid gap-4">
      <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>
        Report an issue
      </h1>

      <div className="flex gap-1" role="list">
        {names.map((n, k) => (
          <div key={n} role="listitem" className="flex-1">
            <div
              style={{
                height: 4,
                borderRadius: 3,
                background: k <= s ? 'var(--acc)' : 'var(--line)',
              }}
            />
            <div
              className={k === s ? '' : 'mut'}
              style={{
                fontSize: 11,
                marginTop: 4,
                fontWeight: k === s ? 600 : 400,
              }}
            >
              {k + 1}. {n}
            </div>
          </div>
        ))}
      </div>

      <div className="card grid gap-4">
        {s === 0 && (
          <>
            <div>
              <label className="lbl">Issue title</label>
              <input
                className="inp"
                value={f.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Large pothole near Main Gate"
              />
              {er.title && <div className="err">{er.title}</div>}
            </div>
            <div>
              <label className="lbl">Description</label>
              <textarea
                rows={4}
                className="inp"
                value={f.desc}
                onChange={(e) => set('desc', e.target.value)}
                placeholder="What is the problem and how does it affect people?"
              />
              {er.desc && <div className="err">{er.desc}</div>}
            </div>
            <div>
              <label className="lbl">Category</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(CATS).map((k) => (
                  <button
                    key={k}
                    type="button"
                    className="btn2"
                    aria-pressed={f.cat === k}
                    style={
                      f.cat === k
                        ? {
                            background: 'var(--accbg)',
                            borderColor: 'var(--acc)',
                            color: 'var(--acc)',
                          }
                        : {}
                    }
                    onClick={() => set('cat', k)}
                  >
                    {k}
                  </button>
                ))}
              </div>
              {er.cat && <div className="err">{er.cat}</div>}
            </div>
          </>
        )}

        {s === 1 && (
          <>
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                addFiles(e.dataTransfer.files);
              }}
              className="text-center py-10 cursor-pointer block"
              style={{
                border: '2px dashed ' + (drag ? 'var(--acc)' : 'var(--line)'),
                borderRadius: 6,
              }}
            >
              <div className="mut">
                <Icon n="up" s={26} />
              </div>
              <b>Drag and drop photos or videos</b>
              <div className="mut">
                or click to browse (optional but recommended)
              </div>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </label>
            {f.files.map((n, k) => (
              <div key={k} className="flex justify-between card py-2">
                <span>{n}</span>
                <button
                  type="button"
                  aria-label="Remove"
                  onClick={() =>
                    set(
                      'files',
                      f.files.filter((_, j) => j !== k)
                    )
                  }
                >
                  <Icon n="x" />
                </button>
              </div>
            ))}
          </>
        )}

        {s === 2 && (
          <>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  className="inp"
                  placeholder="Search location"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn2"
                onClick={() => {
                  setF((p) => ({
                    ...p,
                    loc: 'BTM Layout, Bengaluru',
                    lat: '12.9166',
                    lng: '77.6101',
                  }));
                  c.tst('Location detected');
                }}
              >
                <Icon n="pin" />
                Use current
              </button>
            </div>
            {q && (
              <div className="grid">
                {sugg.map((x) => (
                  <button
                    key={x}
                    type="button"
                    className="nav"
                    onClick={() => {
                      setF((p) => ({
                        ...p,
                        loc: x,
                        lat: '12.93',
                        lng: '77.62',
                      }));
                      setQ('');
                    }}
                  >
                    {x}
                  </button>
                ))}
              </div>
            )}
            <CityMap
              items={
                f.loc
                  ? [
                      {
                        id: 'new',
                        title: 'New',
                        cat: f.cat || 'Waste',
                        x: 50,
                        y: 30,
                        pri: 'Low',
                      },
                    ]
                  : []
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="lbl">Latitude</label>
                <input
                  className="inp"
                  value={f.lat}
                  onChange={(e) => set('lat', e.target.value)}
                />
              </div>
              <div>
                <label className="lbl">Longitude</label>
                <input
                  className="inp"
                  value={f.lng}
                  onChange={(e) => set('lng', e.target.value)}
                />
              </div>
            </div>
            <div className="mut">
              Selected: <b style={{ color: 'var(--ink)' }}>{f.loc || 'none'}</b>
            </div>
            {er.loc && <div className="err">{er.loc}</div>}
          </>
        )}

        {s === 3 && (
          <div className="grid grid-cols-2 gap-3">
            {PRI.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => set('sev', p)}
                className="card text-left"
                aria-pressed={f.sev === p}
                style={{
                  cursor: 'pointer',
                  borderColor: f.sev === p ? 'var(--acc)' : 'var(--line)',
                  background: f.sev === p ? 'var(--accbg)' : 'var(--card)',
                }}
              >
                <b>{p}</b>
                <div className="mut" style={{ fontSize: 12 }}>
                  {
                    {
                      Low: 'Minor inconvenience',
                      Medium: 'Affects daily use',
                      High: 'Safety risk',
                      Critical: 'Immediate danger',
                    }[p]
                  }
                </div>
              </button>
            ))}
          </div>
        )}

        {s === 4 && (
          <div className="grid gap-3">
            {[
              ['Title', f.title],
              ['Description', f.desc],
              ['Category', f.cat],
              ['Evidence', f.files.length + ' file(s)'],
              ['Location', f.loc],
              ['Severity', f.sev],
            ].map(([a, b]) => (
              <div key={a} className="flex gap-3">
                <span className="lbl w-24 shrink-0">{a}</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between pt-2">
          <button
            type="button"
            className="btn2"
            disabled={s === 0}
            onClick={() => setS(s - 1)}
          >
            Back
          </button>
          {s < 4 ? (
            <button
              type="button"
              className="btn"
              onClick={() => val() && setS(s + 1)}
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              className="btn"
              disabled={busy}
              onClick={submit}
            >
              {busy ? 'Submitting…' : 'Submit Incident'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
