import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../components/icons/Icon.jsx';
import api from '../../services/api.js';

export const AIAssistant = ({ c }) => {
  const [msgs, setM] = useState([
    {
      r: 'a',
      t: "Hello, I'm the Civic Assistant. I can help you report and track municipal issues.",
    },
  ]);
  const [v, setV] = useState('');
  const [typ, setTyp] = useState(false);
  const [draft, setD] = useState(null);
  const end = useRef(null);

  useEffect(() => {
    end.current && end.current.scrollIntoView({ block: 'nearest' });
  }, [msgs, typ]);

  const reply = async (t) => {
    const l = t.toLowerCase();
    const m = t.match(/INC-\d+/i);

    if (m) {
      const i = c.inc.find((x) => x.id === m[0].toUpperCase());
      return i
        ? `${i.id} is "${i.title}". Status: ${i.status}, priority ${i.pri}, handled by ${i.dept} Department${
            i.officer ? ' (Officer ' + i.officer + ').' : '.'
          }`
        : `I couldn't find ${m[0]}. Please check the ID.`;
    }

    if (draft && /^(yes|submit|ok|sure)/.test(l)) {
      const n = await api.createIncident(draft);
      await c.refresh();
      setD(null);
      return `Done. ${n.id} has been submitted and routed to ${n.dept} Department.`;
    }

    if (draft && /no/.test(l)) {
      setD(null);
      return "No problem, I've discarded the draft.";
    }

    if (/pothole|road/.test(l) && !/main gate|near|at /.test(l)) {
      setD({
        title: 'Pothole reported via assistant',
        desc: 'Large pothole reported through the Civic Assistant.',
        cat: 'Road Damage',
        sev: 'High',
        loc: '',
      });
      return 'I can help you report it. Could you share the location and, if possible, a photo of the pothole?';
    }

    if (draft && !draft.loc) {
      setD({ ...draft, loc: t });
      return "Thank you. I've identified this as a road damage issue. Would you like to submit the report? (yes / no)";
    }

    if (/garbage|waste/.test(l)) {
      setD({
        title: 'Garbage accumulation',
        desc: 'Garbage accumulation reported through the Civic Assistant.',
        cat: 'Waste',
        sev: 'Medium',
        loc: '',
      });
      return 'Sorry to hear that. Where is the garbage located?';
    }

    if (/complaint|my report/.test(l)) {
      const m2 = c.inc.filter((x) => x.mine);
      return `You have ${m2.length} reports; ${
        m2.filter((x) => x.status !== 'Resolved' && x.status !== 'Closed').length
      } are still open. Ask me to track one by ID.`;
    }

    if (/service|center|nearest/.test(l)) {
      return 'Your nearest ward service center is BBMP Ward Office, BTM 2nd Stage (about 1.2 km), open 9 AM to 5 PM on weekdays.';
    }

    return 'I can report potholes, garbage and other issues, or track an incident by ID such as INC-1042.';
  };

  const send = async (t) => {
    t = t.trim();
    if (!t || typ) return;
    setV('');
    setM((p) => [...p, { r: 'u', t }]);
    setTyp(true);
    const a = await new Promise((r) => setTimeout(() => r(reply(t)), 700));
    setTyp(false);
    setM((p) => [...p, { r: 'a', t: a }]);
  };

  return (
    <div
      className="max-w-2xl mx-auto card p-0 flex flex-col"
      style={{ padding: 0, height: 'calc(100vh - 150px)', minHeight: 420 }}
    >
      <div className="p-4 border-b ln flex gap-3 items-center">
        <span
          style={{
            background: 'var(--accbg)',
            color: 'var(--acc)',
            padding: 8,
            borderRadius: 5,
          }}
        >
          <Icon n="bot" s={20} />
        </span>
        <div>
          <b>Civic Assistant</b>
          <div className="mut" style={{ fontSize: 12 }}>
            Get help reporting and tracking municipal issues.
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 grid gap-3 content-start"
        aria-live="polite"
      >
        {msgs.map((m, k) => (
          <div
            key={k}
            className={m.r === 'u' ? 'justify-self-end' : 'justify-self-start'}
            style={{
              maxWidth: '82%',
              padding: '8px 12px',
              borderRadius: 6,
              background: m.r === 'u' ? 'var(--navy)' : 'var(--accbg)',
              color: m.r === 'u' ? 'var(--bg)' : 'var(--ink)',
            }}
          >
            {m.t}
          </div>
        ))}
        {typ && (
          <div className="mut" style={{ fontSize: 12 }}>
            Assistant is typing…
          </div>
        )}
        <div ref={end} />
      </div>

      <div className="px-4 flex gap-2 overflow-x-auto pb-2">
        {[
          'Report a pothole',
          'Check my complaint',
          'Report garbage',
          'Where is my nearest service center?',
          'Track incident INC-1042',
        ].map((p) => (
          <button
            key={p}
            type="button"
            className="btn2 shrink-0"
            style={{ fontSize: 12, borderRadius: 99 }}
            onClick={() => send(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="p-3 border-t ln flex gap-2">
        <button
          type="button"
          className="btn2"
          aria-label="Attach"
          onClick={() => {
            setM((p) => [...p, { r: 'u', t: '[photo attached: pothole.jpg]' }]);
            c.tst('Attachment added');
          }}
        >
          <Icon n="clip" />
        </button>
        <input
          className="inp"
          aria-label="Message"
          placeholder="Type your message"
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(v)}
        />
        <button
          type="button"
          className="btn2"
          aria-label="Voice"
          onClick={() => c.tst('Voice input is disabled in this demo')}
        >
          <Icon n="mic" />
        </button>
        <button
          type="button"
          className="btn"
          aria-label="Send"
          onClick={() => send(v)}
        >
          <Icon n="send" />
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
