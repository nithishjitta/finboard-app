import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { login, state } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = e => { e.preventDefault(); login(email, password); };

  const fillDemo = role => {
    if (role === 'admin') { setEmail('arjun@finboard.app'); setPassword('admin123'); }
    else { setEmail('priya@finboard.app'); setPassword('viewer123'); }
  };

  return (
    <div className="login-root">
      <div className="login-bg">
        <div className="login-orb o1"/>
        <div className="login-orb o2"/>
        <div className="login-grid"/>
      </div>

      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">
            <svg viewBox="0 0 42 42" fill="none">
              <rect width="42" height="42" rx="12" fill="var(--accent)"/>
              <path d="M10 28l7-11 5 7 4-5 6 9" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="30" cy="13" r="3" fill="#000"/>
            </svg>
          </div>
          <div>
            <div className="login-brand-name">FinBoard</div>
            <div className="login-brand-sub">Personal Finance Dashboard</div>
          </div>
        </div>

        <div className="login-heading">
          <h1>Welcome back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="email">Email address</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.5 6.5l7.5 5 7.5-5"/><rect x="2" y="4" width="16" height="12" rx="2"/></svg>
              </span>
              <input id="email" type="email" autoComplete="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required/>
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="9" width="12" height="8" rx="2"/><path d="M7 9V6a3 3 0 016 0v3"/></svg>
              </span>
              <input id="password" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required/>
              <button type="button" className="login-show-pass" onClick={() => setShowPass(s => !s)}>
                {showPass
                  ? <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><line x1="2" y1="2" x2="18" y2="18"/></svg>
                  : <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="10" cy="10" r="2"/></svg>
                }
              </button>
            </div>
          </div>

          {state.authError && (
            <div className="login-error">
              <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z"/></svg>
              {state.authError}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={state.authLoading} style={{ marginTop: 8 }}>
            {state.authLoading
              ? <span className="login-spinner"/>
              : <><span>Sign in</span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 8h10M9 4l4 4-4 4"/></svg></>
            }
          </button>
        </form>

        <div className="login-divider"><span>Quick demo access</span></div>
        <div className="login-demo-btns">
          <button className="demo-btn admin" onClick={() => fillDemo('admin')}>
            <span className="demo-badge">Admin</span>
            <span>Full access · arjun@finboard.app</span>
          </button>
          <button className="demo-btn viewer" onClick={() => fillDemo('viewer')}>
            <span className="demo-badge">Viewer</span>
            <span>Read only · priya@finboard.app</span>
          </button>
        </div>
      </div>
    </div>
  );
}
