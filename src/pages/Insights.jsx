import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { fmt, CATEGORIES } from '../utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, Legend,
} from 'recharts';

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="ct-label">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="ct-row">
          <span className="ct-dot" style={{ background: p.color || p.fill }}/>
          <span className="ct-name">{p.name}</span>
          <span className="ct-val">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

const CAT_PATHS = {
  Food:          <><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></>,
  Transport:     <><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
  Shopping:      <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></>,
  Health:        <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>,
  Entertainment: <><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></>,
  Utilities:     <><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></>,
  Salary:        <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M12 9v6M9 12h6"/></>,
  Freelance:     <><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></>,
  Investment:    <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
  Rent:          <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
};
function CatIcon({ cat, size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
      {CAT_PATHS[cat] ?? <circle cx="12" cy="12" r="10"/>}
    </svg>
  );
}

export default function Insights() {
  const { state } = useApp();
  const { transactions, monthly, dataLoading } = state;

  const catSpend = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, color: CATEGORIES[name]?.color || '#888' }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalExp = catSpend.reduce((s, c) => s + c.value, 0);
  const maxSpend = catSpend[0]?.value || 1;

  const monthlyFull = useMemo(() =>
    monthly.map(m => ({ ...m, balance: m.income - m.expenses, savings: Math.round(((m.income - m.expenses) / m.income) * 100) })),
    [monthly]
  );

  const savingsRate = useMemo(() => {
    const inc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    return inc > 0 ? Math.round(((inc - exp) / inc) * 100) : 0;
  }, [transactions]);

  const avgExpense = useMemo(() => {
    const exps = transactions.filter(t => t.type === 'expense');
    return exps.length ? Math.abs(exps.reduce((s, t) => s + t.amount, 0) / exps.length) : 0;
  }, [transactions]);

  const highestMonth = monthlyFull.reduce((a, b) => !a || b.expenses > a.expenses ? b : a, null);
  const top     = catSpend[0];
  const topCat  = CATEGORIES[top?.name] || {};
  const srColor = savingsRate >= 30 ? 'var(--c-green)' : savingsRate >= 15 ? 'var(--c-amber)' : 'var(--c-red)';

  /* Radar data — category spend normalized to % */
  const radarData = catSpend.slice(0, 6).map(c => ({
    cat: c.name.slice(0, 5),
    value: Math.round((c.value / totalExp) * 100),
  }));

  if (dataLoading) return <div className="page-loader"><div className="loader-ring"/></div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Insights</h1>
          <p className="page-subtitle">Spending patterns, trends and analysis</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-icon" style={{ background: topCat.bg, color: topCat.color }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={17} height={17}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div className="insight-label">Top Category</div>
          <div className="insight-value" style={{ color: topCat.color || 'var(--text-1)' }}>{top?.name || '—'}</div>
          <div className="insight-sub">{fmt(top?.value || 0)} · {Math.round(((top?.value || 0) / totalExp) * 100)}% of spend</div>
        </div>

        <div className="insight-card">
          <div className="insight-icon" style={{ background: `color-mix(in srgb, ${srColor} 12%, transparent)`, color: srColor }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={17} height={17}>
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
          <div className="insight-label">Savings Rate</div>
          <div className="insight-value" style={{ color: srColor }}>{savingsRate}%</div>
          <div className="insight-sub">{savingsRate >= 30 ? '🎉 Excellent' : savingsRate >= 15 ? '👍 Good — aim for 30%' : '⚠️ Below 15% target'}</div>
        </div>

        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'rgba(96,165,250,0.12)', color: 'var(--c-blue)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={17} height={17}>
              <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </div>
          <div className="insight-label">Avg Expense</div>
          <div className="insight-value" style={{ color: 'var(--c-blue)' }}>{fmt(avgExpense)}</div>
          <div className="insight-sub">Per expense transaction</div>
        </div>

        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'rgba(251,191,36,0.12)', color: 'var(--c-amber)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={17} height={17}>
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div className="insight-label">Peak Spending Month</div>
          <div className="insight-value" style={{ color: 'var(--c-amber)' }}>{highestMonth?.month || '—'}</div>
          <div className="insight-sub">{fmt(highestMonth?.expenses || 0)} total</div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="charts-row" style={{ marginBottom: 16 }}>
        {/* Grouped bar chart */}
        <div className="chart-card">
          <div className="chart-head">
            <span className="chart-title">Monthly Income vs Expenses</span>
            <div className="chart-legend">
              <span className="chart-legend-item"><span className="chart-legend-dot" style={{ background: 'var(--c-green)' }}/> Income</span>
              <span className="chart-legend-item"><span className="chart-legend-dot" style={{ background: 'var(--c-red)' }}/> Expenses</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={218}>
            <BarChart data={monthlyFull} margin={{ top: 6, right: 4, bottom: 0, left: -8 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}K`} width={38}/>
              <Tooltip content={<ChartTip/>}/>
              <Bar dataKey="income"   name="Income"   fill="#34d399" radius={[4,4,0,0]}/>
              <Bar dataKey="expenses" name="Expenses" fill="#f87171" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar — spending shape */}
        <div className="chart-card">
          <div className="chart-head">
            <span className="chart-title">Spending Shape</span>
            <span className="chart-sub">% of total per category</span>
          </div>
          <ResponsiveContainer width="100%" height={218}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="var(--border)"/>
              <PolarAngleAxis dataKey="cat" tick={{ fill: 'var(--text-2)', fontSize: 11, fontWeight: 500 }}/>
              <PolarRadiusAxis angle={30} domain={[0, 40]} tick={{ fill: 'var(--text-4)', fontSize: 9 }} axisLine={false}/>
              <Radar name="Spend %" dataKey="value" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.18} strokeWidth={2}/>
              <Tooltip formatter={v => `${v}%`} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-hover)', borderRadius: 8, fontSize: 12, color: 'var(--text-1)' }}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="charts-row" style={{ marginBottom: 16 }}>
        {/* Net balance line */}
        <div className="chart-card">
          <div className="chart-head">
            <span className="chart-title">Net Balance Trend</span>
            <span className="chart-sub">Monthly surplus</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyFull} margin={{ top: 6, right: 4, bottom: 0, left: -8 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="var(--border)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}K`} width={42}/>
              <Tooltip content={<ChartTip/>}/>
              <Line type="monotone" dataKey="balance" name="Net Balance" stroke="var(--accent)" strokeWidth={2.2}
                dot={{ fill: 'var(--accent)', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: 'var(--accent)', strokeWidth: 0 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category horizontal bars */}
        <div className="chart-card">
          <div className="chart-head"><span className="chart-title">Category Breakdown</span></div>
          <div className="bar-rows" style={{ marginTop: 6 }}>
            {catSpend.map(c => (
              <div key={c.name} className="bar-item">
                <div className="bar-label">{c.name}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(c.value / maxSpend) * 100}%`, background: c.color }}/>
                </div>
                <div className="bar-val">{fmt(c.value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Month-over-month table */}
      <div className="section-card">
        <div className="section-head"><span className="section-title">Month-over-Month Summary</span></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th style={{ textAlign: 'right' }}>Income</th>
                <th style={{ textAlign: 'right' }}>Expenses</th>
                <th style={{ textAlign: 'right' }}>Net Balance</th>
                <th style={{ textAlign: 'right' }}>Savings %</th>
              </tr>
            </thead>
            <tbody>
              {monthlyFull.map(m => {
                const c = m.savings >= 30 ? 'var(--c-green)' : m.savings >= 15 ? 'var(--c-amber)' : 'var(--c-red)';
                return (
                  <tr key={m.month}>
                    <td style={{ fontWeight: 700, color: 'var(--text-1)' }}>{m.month} 2026</td>
                    <td style={{ textAlign: 'right' }}><span className="td-amount income">+{fmt(m.income)}</span></td>
                    <td style={{ textAlign: 'right' }}><span className="td-amount expense">−{fmt(m.expenses)}</span></td>
                    <td style={{ textAlign: 'right' }}><span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: m.balance >= 0 ? 'var(--c-green)' : 'var(--c-red)' }}>{fmt(m.balance)}</span></td>
                    <td style={{ textAlign: 'right' }}><span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: c }}>{m.savings}%</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}