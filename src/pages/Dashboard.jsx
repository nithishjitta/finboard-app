import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { fmt, fmtShortDate, CATEGORIES } from '../utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

/* ─── Category SVG icons (pure SVG, no emoji) ─── */
const CAT_PATHS = {
  Food: (
    <>
      <path d="M18 8h1a4 4 0 010 8h-1"/>
      <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/>
      <line x1="10" y1="1" x2="10" y2="4"/>
      <line x1="14" y1="1" x2="14" y2="4"/>
    </>
  ),
  Transport: (
    <>
      <rect x="1" y="3" width="15" height="13" rx="2"/>
      <path d="M16 8h4l3 5v3h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </>
  ),
  Shopping: (
    <>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </>
  ),
  Health: (
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  ),
  Entertainment: (
    <>
      <circle cx="12" cy="12" r="10"/>
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
    </>
  ),
  Utilities: (
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  ),
  Salary: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <path d="M12 9v6M9 12h6"/>
    </>
  ),
  Freelance: (
    <>
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </>
  ),
  Investment: (
    <>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </>
  ),
  Rent: (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </>
  ),
};

function CatIcon({ cat, size = 15 }) {
  return (
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      width={size} height={size} style={{ display: 'block', flexShrink: 0 }}
    >
      {CAT_PATHS[cat] ?? <circle cx="12" cy="12" r="10"/>}
    </svg>
  );
}

/* ─── SVG icon for greeting wave (replaces 👋) ─── */
function WaveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-text)" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width={18} height={18}
      style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 6 }}>
      <path d="M7.5 5.5C8.5 4.2 10.5 4 12 5l6 5c1.2 1 1.5 2.8.5 4l-5 6c-1 1.2-2.8 1.5-4 .5L4 16c-1.2-1-1.3-2.8-.3-4l3.8-4.5"/>
      <path d="M15 11l2-2.5"/>
      <path d="M9.5 19.5c-.8.6-2 .5-2.7-.4L4 16"/>
    </svg>
  );
}

/* ─── Savings status icon (replaces 🎉 👍 ⚠️) ─── */
function SavingsStatusIcon({ rate }) {
  if (rate >= 30) {
    // Trophy / excellent
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
        <path d="M6 9H4a2 2 0 000 4h2"/>
        <path d="M18 9h2a2 2 0 010 4h-2"/>
        <path d="M8 21h8M12 17v4"/>
        <path d="M6 3h12v9a6 6 0 01-12 0V3z"/>
      </svg>
    );
  }
  if (rate >= 15) {
    // Thumbs up / good
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
        <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/>
        <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
      </svg>
    );
  }
  // Warning / needs work
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width={14} height={14}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function SavingsStatusLabel({ rate }) {
  if (rate >= 30) return <span className="status-badge excellent"><SavingsStatusIcon rate={rate}/> Excellent</span>;
  if (rate >= 15) return <span className="status-badge good"><SavingsStatusIcon rate={rate}/> Good</span>;
  return <span className="status-badge low"><SavingsStatusIcon rate={rate}/> Needs work</span>;
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="ct-label">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="ct-row">
          <span className="ct-dot" style={{ background: p.color }}/>
          <span className="ct-name">{p.name}</span>
          <span className="ct-val">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function StatBar({ pct, color }) {
  return (
    <div className="stat-bar">
      <div className="stat-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, background: color }}/>
    </div>
  );
}

/* ─── Inline SVG icons for stat cards ─── */
function IconUp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  );
}
function IconDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
      <path d="M12 5v14M5 12l7 7 7-7"/>
    </svg>
  );
}
function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
}
function IconSavings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  );
}
function IconInfo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-text)" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width={13} height={13}
      style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4M12 8h.01"/>
    </svg>
  );
}

export default function Dashboard() {
  const { state } = useApp();
  const { transactions, monthly, dataLoading, user } = state;

  const stats = useMemo(() => {
    const income   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    const balance  = income - expenses;
    const sr       = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
    return { income, expenses, balance, sr };
  }, [transactions]);

  const catData = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, color: CATEGORIES[name]?.color || '#666' }))
      .sort((a, b) => b.value - a.value).slice(0, 6);
  }, [transactions]);

  const totalCat    = catData.reduce((s, c) => s + c.value, 0);
  const recent      = useMemo(() => [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7), [transactions]);
  const monthlyData = useMemo(() => monthly.map(m => ({ ...m, balance: m.income - m.expenses })), [monthly]);
  const topCats     = catData.slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] ?? '';

  if (dataLoading) return <div className="page-loader"><div className="loader-ring"/></div>;

  return (
    <div className="page-content">

      {/* ── Hero ── */}
      <div className="dash-hero">
        <div className="dash-hero-left">
          <p className="dash-greeting">
            {greeting}, {firstName}
            <WaveIcon/>
          </p>
          <h1 className="dash-headline">Your financial overview</h1>
          <p className="dash-sub">All your numbers, in one place.</p>
        </div>
        <div className="dash-hero-badge">
          <div className="hero-badge-label">Net Balance</div>
          <div className="hero-badge-value">{fmt(stats.balance)}</div>
          <div className="hero-badge-sub">
            Savings rate:&nbsp;<strong style={{ color: 'var(--accent-text)' }}>{stats.sr}%</strong>
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="stats-grid">

        <div className="stat-card green">
          <div className="stat-top">
            <span className="stat-label">Total Income</span>
            <span className="stat-icon-wrap green"><IconUp/></span>
          </div>
          <div className="stat-value green">{fmt(stats.income)}</div>
          <div className="stat-meta">{transactions.filter(t => t.type === 'income').length} income entries</div>
          <StatBar pct={100} color="var(--c-green)"/>
        </div>

        <div className="stat-card red">
          <div className="stat-top">
            <span className="stat-label">Total Expenses</span>
            <span className="stat-icon-wrap red"><IconDown/></span>
          </div>
          <div className="stat-value red">{fmt(stats.expenses)}</div>
          <div className="stat-meta">{transactions.filter(t => t.type === 'expense').length} expense entries</div>
          <StatBar pct={stats.income > 0 ? Math.round((stats.expenses / stats.income) * 100) : 0} color="var(--c-red)"/>
        </div>

        <div className="stat-card blue">
          <div className="stat-top">
            <span className="stat-label">Total Records</span>
            <span className="stat-icon-wrap blue"><IconDoc/></span>
          </div>
          <div className="stat-value blue">{transactions.length}</div>
          <div className="stat-meta">Across all categories</div>
          <StatBar pct={65} color="var(--c-blue)"/>
        </div>

        <div className="stat-card amber">
          <div className="stat-top">
            <span className="stat-label">Savings Rate</span>
            <span className="stat-icon-wrap amber"><IconSavings/></span>
          </div>
          <div className="stat-value amber">{stats.sr}%</div>
          <div className="stat-meta"><SavingsStatusLabel rate={stats.sr}/></div>
          <StatBar pct={stats.sr} color="var(--c-amber)"/>
        </div>

      </div>

      {/* ── Charts row ── */}
      <div className="charts-row">

        {/* Area chart */}
        <div className="chart-card">
          <div className="chart-head">
            <span className="chart-title">Income vs Expenses</span>
            <div className="chart-legend">
              <span className="chart-legend-item">
                <span className="chart-legend-dot" style={{ background: '#34d399' }}/> Income
              </span>
              <span className="chart-legend-item">
                <span className="chart-legend-dot" style={{ background: '#f87171' }}/> Expenses
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 6, right: 4, bottom: 0, left: -8 }}>
              <defs>
                <linearGradient id="gInc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#34d399" stopOpacity={0.25}/>
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#f87171" stopOpacity={0.22}/>
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} width={42}/>
              <Tooltip content={<ChartTip/>}/>
              <Area type="monotone" dataKey="income"   name="Income"   stroke="#34d399" fill="url(#gInc)" strokeWidth={2.2} dot={false} activeDot={{ r: 4, fill: '#34d399', strokeWidth: 0 }}/>
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" fill="url(#gExp)" strokeWidth={2.2} dot={false} activeDot={{ r: 4, fill: '#f87171', strokeWidth: 0 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut + legend */}
        <div className="chart-card">
          <div className="chart-head"><span className="chart-title">Spending Breakdown</span></div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" innerRadius={38} outerRadius={62}
                dataKey="value" paddingAngle={2} strokeWidth={0}>
                {catData.map((e, i) => <Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip
                formatter={v => fmt(v)}
                contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-hover)', borderRadius: 8, fontSize: 12, color: 'var(--text-1)' }}
                itemStyle={{ color: 'var(--text-1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-legend">
            {catData.slice(0, 5).map(c => (
              <div key={c.name} className="dl-row">
                <div className="dl-left">
                  <span className="dl-dot" style={{ background: c.color }}/>
                  <span className="dl-name">{c.name}</span>
                </div>
                <div className="dl-right">
                  <span className="dl-pct">{Math.round((c.value / totalCat) * 100)}%</span>
                  <span className="dl-val">{fmt(c.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Bottom row ── */}
      <div className="dash-bottom-row">

        {/* Recent transactions */}
        <div className="section-card">
          <div className="section-head">
            <span className="section-title">Recent Transactions</span>
            <span className="section-badge">{recent.length} latest</span>
          </div>
          {recent.map(tx => {
            const cat = CATEGORIES[tx.category] || {};
            return (
              <div key={tx.id} className="rtx-row">
                <div className="rtx-icon" style={{ background: cat.bg, color: cat.color }}>
                  <CatIcon cat={tx.category} size={15}/>
                </div>
                <div className="rtx-info">
                  <span className="rtx-name">{tx.description}</span>
                  <span className="rtx-meta">{fmtShortDate(tx.date)} · {tx.category}</span>
                </div>
                <div className="rtx-right">
                  <span className={`rtx-amount ${tx.type}`}>
                    {tx.type === 'income' ? '+' : '−'}{fmt(Math.abs(tx.amount))}
                  </span>
                  <span className={`rtx-pill ${tx.type}`}>{tx.type}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top categories */}
        <div className="section-card" style={{ alignSelf: 'start' }}>
          <div className="section-head">
            <span className="section-title">Top Spending</span>
            <span className="section-badge">by category</span>
          </div>
          <div style={{ padding: '14px 18px' }}>
            {topCats.map((c, i) => (
              <div key={c.name} className="topcat-row">
                <div className="topcat-left">
                  <div className="topcat-rank">{i + 1}</div>
                  <div className="topcat-icon" style={{ background: CATEGORIES[c.name]?.bg, color: c.color }}>
                    <CatIcon cat={c.name} size={13}/>
                  </div>
                  <div>
                    <div className="topcat-name">{c.name}</div>
                    <div className="topcat-pct">{Math.round((c.value / totalCat) * 100)}% of expenses</div>
                  </div>
                </div>
                <div className="topcat-val" style={{ color: c.color }}>{fmt(c.value)}</div>
              </div>
            ))}
            <div className="topcat-insight">
              <IconInfo/>
              <span>
                <strong style={{ color: CATEGORIES[topCats[0]?.name]?.color }}>{topCats[0]?.name}</strong>
                {' '}is your biggest expense at{' '}
                {Math.round(((topCats[0]?.value || 0) / totalCat) * 100)}% of total spending.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}