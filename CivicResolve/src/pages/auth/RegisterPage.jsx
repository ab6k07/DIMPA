import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Logo from '../../components/common/Logo.jsx';

export const RegisterPage = ({ go, tst }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const user = await register({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        password,
      });

      tst(`Account created! Welcome, ${user.full_name}!`);
      go('citizen/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 grid gap-5">
      <div className="text-center grid gap-2 justify-items-center">
        <Logo />
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: '8px 0 0' }}>
          Citizen Registration
        </h1>
        <div className="mut">
          Create an account to report civic issues and track resolutions
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
            <label className="lbl">Full Name *</label>
            <input
              type="text"
              className="inp"
              placeholder="e.g. Priya Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="lbl">Email Address *</label>
            <input
              type="email"
              className="inp"
              placeholder="e.g. priya.sharma@example.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="lbl">Phone Number (optional)</label>
            <input
              type="tel"
              className="inp"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="lbl">Password (min 6 characters) *</label>
            <input
              type="password"
              className="inp"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="lbl">Confirm Password *</label>
            <input
              type="password"
              className="inp"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="p-2 rounded bg-slate-50 text-xs mut">
            Account will be created with verified <b>CITIZEN</b> access privileges.
          </div>

          <button
            type="submit"
            className="btn justify-center mt-2"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Citizen Account'}
          </button>
        </form>

        <div className="text-center pt-2 border-t ln" style={{ fontSize: 13 }}>
          <span className="mut">Already registered? </span>
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
            onClick={() => go('login')}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
