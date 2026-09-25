import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Logo from '../../components/common/Logo.jsx';
import Icon from '../../components/icons/Icon.jsx';

export const LoginPage = ({ go, tst }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigateByRole = (role) => {
    if (role === 'AUTHORITY') {
      go('authority/overview');
    } else if (role === 'FIELD_OFFICER') {
      go('officer/tasks');
    } else {
      go('citizen/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (typeof tst === 'function') {
        tst(`Welcome back, ${user.full_name}!`);
      }
      navigateByRole(user.role);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Logins that make real backend API calls
  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setError('');
    setLoading(true);
    try {
      const user = await login(demoEmail, demoPassword);
      if (typeof tst === 'function') {
        tst(`Logged in as ${user.full_name} (${user.role})`);
      }
      navigateByRole(user.role);
    } catch (err) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 grid gap-5">
      <div className="text-center grid gap-2 justify-items-center">
        <Logo />
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: '8px 0 0' }}>
          Sign in to CivicResolve
        </h1>
        <div className="mut">
          Municipal Incident Management & Resolution Platform
        </div>
      </div>

      <div className="card grid gap-4">
        {error && (
          <div
            className="p-3 rounded text-sm"
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              border: '1px solid #fca5a5',
              borderRadius: 6,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-3">
          <div>
            <label className="lbl">Email address</label>
            <input
              type="email"
              className="inp"
              placeholder="e.g. citizen@civicresolve.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="lbl">Password</label>
            <input
              type="password"
              className="inp"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn justify-center mt-2"
            disabled={loading}
          >
            {loading ? 'Authenticating…' : 'Sign in'}
          </button>
        </form>

        <div className="text-center pt-2 border-t ln" style={{ fontSize: 13 }}>
          <span className="mut">Need an account? </span>
          <button
            type="button"
            className="font-medium"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--acc)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
            onClick={() => go('register')}
          >
            Register as a Citizen
          </button>
        </div>
      </div>

      {/* Development Quick-Login Helper */}
      <div
        className="card p-3"
        style={{
          borderStyle: 'dashed',
          background: 'var(--card)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Icon n="gear" s={14} />
          <b style={{ fontSize: 12 }}>Capstone Evaluation: One-Click Demo Access</b>
        </div>
        <div className="mut mb-3" style={{ fontSize: 11 }}>
          Clicking an account executes a live JWT authentication flow against the FastAPI backend.
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          <button
            type="button"
            className="btn2 justify-center"
            style={{ fontSize: 12, padding: '6px 8px' }}
            disabled={loading}
            onClick={() =>
              handleQuickLogin('citizen@civicresolve.in', 'Citizen@123')
            }
          >
            Citizen Demo
          </button>

          <button
            type="button"
            className="btn2 justify-center"
            style={{ fontSize: 12, padding: '6px 8px' }}
            disabled={loading}
            onClick={() =>
              handleQuickLogin('authority@civicresolve.in', 'Authority@123')
            }
          >
            Authority Demo
          </button>

          <button
            type="button"
            className="btn2 justify-center"
            style={{ fontSize: 12, padding: '6px 8px' }}
            disabled={loading}
            onClick={() =>
              handleQuickLogin('officer@civicresolve.in', 'Officer@123')
            }
          >
            Officer Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
