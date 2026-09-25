import React from 'react';
import Logo from '../common/Logo.jsx';
import Icon from '../icons/Icon.jsx';
import UserMenu from '../auth/UserMenu.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const Header = ({
  role,
  page,
  dark,
  setDark,
  unread,
  go,
  nav,
  side,
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <header
      className="border-b ln sticky top-0 z-20"
      style={{
        background: 'var(--card)',
        top: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-2 flex-wrap">
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            if (isAuthenticated) {
              if (role === 'authority') go('authority/overview');
              else if (role === 'officer') go('officer/tasks');
              else go('citizen/dashboard');
            } else {
              go('login');
            }
          }}
        >
          <Logo />
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <UserMenu go={go} />
          ) : (
            <button
              type="button"
              className="btn"
              style={{ fontSize: 13, padding: '6px 12px' }}
              onClick={() => go('login')}
            >
              Sign in
            </button>
          )}

          <button
            type="button"
            className="btn2"
            aria-label="Toggle theme"
            onClick={() => setDark(!dark)}
            title="Toggle color theme"
          >
            <Icon n="moon" />
          </button>

          {isAuthenticated && (
            <button
              type="button"
              className="btn2 relative"
              aria-label="Notifications"
              onClick={() =>
                go(role === 'officer' ? 'officer/tasks' : role + '/notifications')
              }
              title="Notifications"
            >
              <Icon n="bell" />
              {unread > 0 && (
                <span
                  className="badge"
                  style={{ background: '#dc2626', color: '#fff' }}
                >
                  {unread}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {isAuthenticated && !side && nav && (
        <nav
          className="flex gap-1 px-3 pb-2 overflow-x-auto"
          aria-label="Primary"
        >
          {nav.map(([k, l, ic]) => (
            <button
              key={k}
              type="button"
              className={'nav ' + (page === k ? 'on' : '')}
              onClick={() => go(role + '/' + k)}
            >
              <Icon n={ic} />
              {l}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
