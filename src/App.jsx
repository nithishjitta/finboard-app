import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import './index.css';

export function Icon({ children, size = 20, style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      width={size} height={size} style={{ flexShrink: 0, display: 'block', ...style }}>
      {children}
    </svg>
  );
}

const NAV = [
  {
    id: 'dashboard', label: 'Dashboard',
    icon: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  },
  {
    id: 'transactions', label: 'Transactions',
    icon: <><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="3" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="3" cy="18" r="1" fill="currentColor" stroke="none"/></>,
  },
  {
    id: 'insights', label: 'Insights',
    icon: <><path d="M3 3v18h18"/><path d="M7 16l4-8 4 5 3-3"/></>,
  },
  {
    id: 'profile', label: 'Profile',
    icon: <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></>,
  },
];

function AppShell() {
  const { state, dispatch } = useApp();
  const { activeTab, user, darkMode, sidebarOpen } = state;
  const setTab = id => dispatch({ type: 'SET_TAB', tab: id });
  const currentPage = NAV.find(n => n.id === activeTab)?.label ?? '';

  return (
    <div className={`app-shell ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>

      {/* ── Sidebar (desktop only) ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">
            <svg viewBox="0 0 30 30" fill="none" width="30" height="30">
              <rect width="30" height="30" rx="8" fill="var(--accent)"/>
              <path d="M6 21l5-9 4 5 3-4 5 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="21.5" cy="8.5" r="2.5" fill="rgba(255,255,255,0.9)"/>
            </svg>
          </div>
          {sidebarOpen && <span className="brand-name">FinBoard</span>}
        </div>

        <nav className="sidebar-nav">
          {sidebarOpen && <div className="nav-section-label">Menu</div>}
          {NAV.map(n => (
            <button key={n.id} className={`nav-btn ${activeTab === n.id ? 'active' : ''}`}
              onClick={() => setTab(n.id)} title={!sidebarOpen ? n.label : undefined}>
              <span className="nav-icon-wrap">
                <Icon size={17}>{n.icon}</Icon>
              </span>
              {sidebarOpen && <span className="nav-label">{n.label}</span>}
              {sidebarOpen && activeTab === n.id && <span className="nav-active-dot"/>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {sidebarOpen && (
            <div className="user-mini" onClick={() => setTab('profile')}>
              <div className="user-mini-av">{user?.avatar}</div>
              <div className="user-mini-info">
                <div className="user-mini-name">{user?.name}</div>
                <span className={`user-mini-role ${user?.role}`}>{user?.role}</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="topbar-left">
          {/* Collapse toggle — only visible on desktop; hidden on mobile via CSS */}
          <button className="topbar-btn topbar-menu-btn"
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} title="Toggle sidebar">
            <Icon size={17}>
              <line x1="3" y1="5" x2="21" y2="5"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="19" x2="21" y2="19"/>
            </Icon>
          </button>
          <span className="topbar-page-title">{currentPage}</span>
        </div>
        <div className="topbar-right">
          <button className="topbar-btn" onClick={() => dispatch({ type: 'SET_DARK', val: !darkMode })}
            title={darkMode ? 'Switch to light' : 'Switch to dark'}>
            {darkMode
              ? /* Sun — shown when dark, click goes light */
                <Icon size={17}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></Icon>
              : /* Moon — shown when light, click goes dark */
                <Icon size={17}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Icon>
            }
          </button>
          <div className="topbar-avatar" onClick={() => setTab('profile')} title="My profile">
            {user?.avatar}
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="main-content">
        {activeTab === 'dashboard'    && <Dashboard />}
        {activeTab === 'transactions' && <Transactions />}
        {activeTab === 'insights'     && <Insights />}
        {activeTab === 'profile'      && <Profile />}
      </main>

      {/* ── Mobile bottom navigation (replaces sidebar on mobile) ── */}
      <nav className="mobile-nav">
        {NAV.map(n => (
          <button key={n.id} className={`mn-btn ${activeTab === n.id ? 'active' : ''}`} onClick={() => setTab(n.id)}>
            <Icon size={20}>{n.icon}</Icon>
            <span>{n.label}</span>
            {activeTab === n.id && <span className="mn-dot"/>}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  const { state } = useApp();
  return state.user ? <AppShell /> : <Login />;
}