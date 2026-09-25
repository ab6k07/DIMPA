import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header.jsx';
import Skeleton from './components/common/Skeleton.jsx';
import Empty from './components/common/Empty.jsx';
import Toast from './components/common/Toast.jsx';
import Icon from './components/icons/Icon.jsx';

import CitizenDashboard from './pages/citizen/CitizenDashboard.jsx';
import ReportIssue from './pages/citizen/ReportIssue.jsx';
import MyReports from './pages/citizen/MyReports.jsx';
import AIAssistant from './pages/citizen/AIAssistant.jsx';
import IncidentMapPage from './pages/citizen/IncidentMapPage.jsx';
import NotificationsPage from './pages/citizen/NotificationsPage.jsx';
import ProfilePage from './pages/citizen/ProfilePage.jsx';

import AuthorityOverview from './pages/authority/AuthorityOverview.jsx';
import AuthorityIncidents from './pages/authority/AuthorityIncidents.jsx';
import AuthorityTeams from './pages/authority/AuthorityTeams.jsx';
import AuthorityAnalytics from './pages/authority/AuthorityAnalytics.jsx';
import AuthoritySettings from './pages/authority/AuthoritySettings.jsx';

import OfficerTasks from './pages/officer/OfficerTasks.jsx';

import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';

import api from './services/api.js';
import { NAV } from './data/constants.js';
import { useAuth } from './context/AuthContext.jsx';

export function App() {
  const [hash, setHash] = useState(
    typeof window !== 'undefined' ? window.location.hash : ''
  );
  const [inc, setInc] = useState(null);
  const [nt, setNt] = useState([]);
  const [toast, setToast] = useState(null);
  const [err, setErr] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  const load = () => {
    setErr(false);
    Promise.all([api.getIncidents(), api.getNotifications()])
      .then(([a, b]) => {
        setInc(a);
        setNt(b);
      })
      .catch(() => setErr(true));
  };

  useEffect(() => {
    load();
  }, []);

  const { isAuthenticated, loading: authLoading, user: authUser } = useAuth();

  const r = hash.replace(/^#\/?/, '').split('/');

  const isAuthPage = r[0] === 'login' || r[0] === 'register';

  // While AuthContext is still resolving the stored token, show a blank loading screen
  if (authLoading) {
    return (
      <div className="min-h-full flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <Skeleton />
      </div>
    );
  }

  // Unauthenticated visitors trying to reach app pages → redirect to #login
  if (!isAuthenticated && !isAuthPage) {
    window.location.hash = '#login';
    return null;
  }

  // Authenticated users trying to visit #login or #register → redirect to their dashboard
  if (isAuthenticated && isAuthPage) {
    const role_ = authUser?.role;
    if (role_ === 'AUTHORITY') window.location.hash = '#authority/overview';
    else if (role_ === 'FIELD_OFFICER') window.location.hash = '#officer/tasks';
    else window.location.hash = '#citizen/dashboard';
    return null;
  }



  const role =
    NAV[r[0]] || r[0] === 'officer' ? r[0] : 'citizen';

  const page =
    r[1] ||
    (role === 'citizen'
      ? 'dashboard'
      : role === 'authority'
        ? 'overview'
        : 'tasks');
  const id = r[2];

  const tst = (m) => {
    setToast(m);
    clearTimeout(window.__t);
    window.__t = setTimeout(() => setToast(null), 2600);
  };

  const refresh = async () => {
    setInc(await api.getIncidents());
    setNt(await api.getNotifications());
  };

  const go = (p) => {
    window.location.hash = '#/' + p;
    window.scrollTo(0, 0);
  };

  const upd = async (i, p, m) => {
    await api.updateIncident(i, p, m);
    await refresh();
    tst(m || 'Updated');
  };

  const act = async (fn, i, v) => {
    await api[fn](i, v);
    await refresh();
    tst('Updated ' + i);
  };

  const c = {
    inc: inc || [],
    nt,
    go,
    tst,
    upd,
    act,
    refresh,
  };

  const unread = nt.filter((n) => !n.read).length;

  let body;

  if (isAuthPage) {
    body =
      r[0] === 'login'
        ? <LoginPage go={go} tst={tst} />
        : <RegisterPage go={go} tst={tst} />;
  } else if (err) {
    body = (
      <div className="card text-center">
        <b>Couldn't load data</b>
        <div className="mut my-2">Check your connection and try again.</div>
        <button className="btn" onClick={load}>
          Retry
        </button>
      </div>
    );
  } else if (!inc) {
    body = <Skeleton />;
  } else if (role === 'citizen') {
    const citizenPages = {
      dashboard: <CitizenDashboard c={c} />,
      report: <ReportIssue c={c} />,
      reports: <MyReports c={c} id={id} />,
      map: <IncidentMapPage c={c} base="citizen/reports" />,
      assistant: <AIAssistant c={c} />,
      notifications: <NotificationsPage c={c} />,
      profile: <ProfilePage />,
    };
    body =
      citizenPages[page] || (
        <Empty
          t="Page not found"
          s="Use the navigation above."
        />
      );
  } else if (role === 'authority') {
    const authorityPages = {
      overview: <AuthorityOverview c={c} />,
      incidents: <AuthorityIncidents c={c} id={id} />,
      map: <IncidentMapPage c={c} base="authority/incidents" />,
      departments: <AuthorityTeams c={c} kind="dep" />,
      officers: <AuthorityTeams c={c} kind="off" />,
      analytics: <AuthorityAnalytics c={c} />,
      notifications: <NotificationsPage c={c} />,
      settings: <AuthoritySettings c={c} />,
    };
    body =
      authorityPages[page] || (
        <Empty t="Page not found" s="Use the sidebar." />
      );
  } else {
    body = <OfficerTasks c={c} id={id} />;
  }

  const nav = NAV[role];
  const side = role === 'authority';

  // Auth pages get a clean, minimal layout — no Header, no sidebar
  if (isAuthPage) {
    return (
      <div className="min-h-full flex flex-col" style={{ background: 'var(--bg)' }}>
        <main className="flex-1 p-4 md:p-6">
          {body}
        </main>
        <Toast message={toast} />
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <Header
        role={role}
        page={page}
        dark={dark}
        setDark={setDark}
        unread={unread}
        go={go}
        nav={nav}
        side={side}
      />

      <div className={side ? 'flex flex-col md:flex-row flex-1' : 'flex-1'}>
        {side && (
          <nav
            className="md:w-56 md:shrink-0 flex md:flex-col gap-1 p-3 overflow-x-auto border-b md:border-b-0 md:border-r ln"
            style={{ background: 'var(--card)' }}
            aria-label="Authority"
          >
            {nav.map(([k, l, ic]) => (
              <button
                key={k}
                type="button"
                className={'nav ' + (page === k ? 'on' : '')}
                onClick={() => go('authority/' + k)}
              >
                <Icon n={ic} />
                {l}
              </button>
            ))}
          </nav>
        )}

        <main
          className={
            'flex-1 p-4 md:p-6 min-w-0 ' +
            (role === 'officer'
              ? 'max-w-md w-full mx-auto'
              : 'max-w-6xl w-full mx-auto')
          }
        >
          {body}
        </main>
      </div>

      <Toast message={toast} />
    </div>
  );
}

export default App;
