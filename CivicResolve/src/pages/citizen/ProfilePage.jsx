import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await api.updateProfile({ full_name: fullName, phone });
      await refreshUser();
      setMsg('Profile updated successfully.');
      setEditing(false);
    } catch (err) {
      setMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <b style={{ fontSize: 18 }}>{user.full_name}</b>
          <div className="mut" style={{ fontSize: 12 }}>
            Account ID: #{user.id} · Role: <b>{user.role}</b>
          </div>
        </div>
        <span
          className="badge"
          style={{ background: 'var(--accbg)', color: 'var(--acc)' }}
        >
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {msg && (
        <div
          className="p-2 rounded text-sm"
          style={{ background: 'var(--accbg)', color: 'var(--acc)' }}
        >
          {msg}
        </div>
      )}

      {!editing ? (
        <div className="grid gap-3">
          <div>
            <div className="lbl">Email address</div>
            <div>{user.email}</div>
          </div>
          <div>
            <div className="lbl">Phone number</div>
            <div>{user.phone || 'Not provided'}</div>
          </div>
          <div>
            <div className="lbl">Member since</div>
            <div className="mut">
              {new Date(user.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t ln">
            <span>SMS alerts</span>
            <input type="checkbox" defaultChecked aria-label="SMS alerts" />
          </div>
          <div className="flex justify-between items-center">
            <span>Email updates</span>
            <input type="checkbox" defaultChecked aria-label="Email updates" />
          </div>

          <button
            type="button"
            className="btn2 w-fit mt-2"
            onClick={() => {
              setFullName(user.full_name);
              setPhone(user.phone || '');
              setEditing(true);
            }}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="grid gap-3">
          <div>
            <label className="lbl">Full Name</label>
            <input
              type="text"
              className="inp"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="lbl">Phone number</label>
            <input
              type="tel"
              className="inp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 ..."
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="btn2"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
