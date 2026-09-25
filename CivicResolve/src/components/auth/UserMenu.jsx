import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Badge from '../common/Badge.jsx';
import Icon from '../icons/Icon.jsx';

export const UserMenu = ({ go }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const roleLabelMap = {
    CITIZEN: 'Citizen',
    AUTHORITY: 'Authority',
    FIELD_OFFICER: 'Field Officer',
  };

  const handleLogout = async () => {
    await logout();
    go('login');
  };

  const handleProfileClick = () => {
    if (user.role === 'CITIZEN') {
      go('citizen/profile');
    } else if (user.role === 'AUTHORITY') {
      go('authority/settings');
    } else {
      go('officer/tasks');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="flex items-center gap-2 p-1.5 rounded hover:opacity-90"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 6,
          cursor: 'pointer',
        }}
        onClick={handleProfileClick}
        title="View profile"
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: 'var(--navy)',
            color: 'var(--bg)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
        </span>
        <div className="text-left hidden sm:block leading-tight">
          <div style={{ fontWeight: 600, fontSize: 13 }}>{user.full_name}</div>
          <div className="mut" style={{ fontSize: 11 }}>
            {user.email}
          </div>
        </div>
      </button>

      <span
        className="badge"
        style={{
          background:
            user.role === 'AUTHORITY'
              ? '#dbeafe'
              : user.role === 'FIELD_OFFICER'
              ? '#fef3c7'
              : 'var(--accbg)',
          color:
            user.role === 'AUTHORITY'
              ? '#1e40af'
              : user.role === 'FIELD_OFFICER'
              ? '#92400e'
              : 'var(--acc)',
        }}
      >
        {roleLabelMap[user.role] || user.role}
      </span>

      <button
        type="button"
        className="btn2"
        style={{ padding: '6px 10px', fontSize: 12 }}
        onClick={handleLogout}
        title="Sign out"
      >
        <Icon n="x" s={14} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
};

export default UserMenu;
