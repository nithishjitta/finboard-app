import { useApp } from '../context/AppContext';
import { fmt } from '../utils';
import { useMemo } from 'react';

export default function Profile() {
  const { state, logout } = useApp();
  const { user, transactions } = state;

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    return { income, expenses, balance: income - expenses, count: transactions.length };
  }, [transactions]);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Account details and preferences</p>
        </div>
      </div>

      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-av-ring">
            <div className="profile-av">{user?.avatar}</div>
          </div>
          <div className="profile-name">{user?.name}</div>
          <div className="profile-email">{user?.email}</div>
          <span className={`profile-role-badge ${user?.role}`}>{user?.role}</span>
          <div className="profile-joined">
            Member since {new Date(user?.joined).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </div>

          <div className="profile-stats">
            <div className="ps-item">
              <span className="ps-val green">{fmt(stats.income)}</span>
              <span className="ps-label">Income</span>
            </div>
            <div className="ps-divider"/>
            <div className="ps-item">
              <span className="ps-val red">{fmt(stats.expenses)}</span>
              <span className="ps-label">Expenses</span>
            </div>
            <div className="ps-divider"/>
            <div className="ps-item">
              <span className="ps-val">{stats.count}</span>
              <span className="ps-label">Records</span>
            </div>
          </div>

          <button className="logout-btn" onClick={logout}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M11 3h2a1 1 0 011 1v8a1 1 0 01-1 1h-2M7 11l4-3-4-3M10 8H2"/></svg>
            Sign Out
          </button>
        </div>

        <div>
          <div className="section-card" style={{ marginBottom: 16 }}>
            <div className="section-head"><span className="section-title">Account Details</span></div>
            <div>
              {[
                ['Full Name', user?.name],
                ['Email Address', user?.email],
                ['Role', user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)],
                ['Member Since', new Date(user?.joined).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })],
              ].map(([k, v]) => (
                <div key={k} className="info-row">
                  <span className="info-key">{k}</span>
                  <span className="info-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="section-head"><span className="section-title">Permissions</span></div>
            <div>
              {[
                ['View Dashboard',       true],
                ['View Transactions',    true],
                ['View Insights',        true],
                ['Add Transactions',     user?.role === 'admin'],
                ['Edit Transactions',    user?.role === 'admin'],
                ['Delete Transactions',  user?.role === 'admin'],
              ].map(([label, allowed]) => (
                <div key={label} className="info-row">
                  <span className="info-key">{label}</span>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600,
                    padding: '3px 9px', borderRadius: 6, letterSpacing: '0.06em',
                    background: allowed ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.1)',
                    color: allowed ? 'var(--c-green)' : 'var(--c-red)',
                    border: `1px solid ${allowed ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
                  }}>
                    {allowed ? 'ALLOWED' : 'DENIED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
