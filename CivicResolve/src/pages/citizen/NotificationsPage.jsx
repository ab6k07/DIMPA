import React from 'react';
import Empty from '../../components/common/Empty.jsx';
import api from '../../services/api.js';

export const NotificationsPage = ({ c }) => {
  return (
    <div className="max-w-2xl mx-auto grid gap-3">
      <div className="flex justify-between items-center">
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>
          Notifications
        </h1>
        <button
          className="btn2"
          onClick={async () => {
            await api.readAll();
            await c.refresh();
            c.tst('All marked as read');
          }}
        >
          Mark all read
        </button>
      </div>

      {c.nt.length ? (
        c.nt.map((n) => (
          <div key={n.id} className="card flex gap-3 items-start">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 9,
                marginTop: 6,
                background: n.read ? 'var(--line)' : 'var(--acc)',
              }}
            />
            <div className="flex-1">
              {n.t}
              <div className="mut" style={{ fontSize: 12 }}>
                {n.time}
              </div>
            </div>
          </div>
        ))
      ) : (
        <Empty
          t="You're all caught up"
          s="New updates will appear here."
        />
      )}
    </div>
  );
};

export default NotificationsPage;
