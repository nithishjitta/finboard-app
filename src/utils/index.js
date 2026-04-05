// ─── Currency Formatter ────────────────────────────────────────────────────
export function fmt(n) {
  const abs = Math.abs(n);
  if (abs >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (abs >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  if (abs >= 1000)     return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${Math.abs(n).toLocaleString('en-IN')}`;
}

// ─── Date Formatter ────────────────────────────────────────────────────────
export function fmtDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function fmtShortDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

// ─── Category Config ───────────────────────────────────────────────────────
export const CATEGORIES = {
  Food:          { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  Transport:     { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  Shopping:      { color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  Health:        { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  Entertainment: { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)'  },
  Utilities:     { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)'  },
  Salary:        { color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  Freelance:     { color: '#84cc16', bg: 'rgba(132,204,22,0.12)' },
  Investment:    { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  Rent:          { color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
};

// ─── Category SVG Icons (professional, not emoji) ─────────────────────────
export const CATEGORY_ICONS = {
  Food: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l1-7h16l1 7"/><path d="M3 11h18v2a8 8 0 01-16 0v-2z"/><path d="M12 11V4"/></svg>`,
  Transport: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M16 21V7"/><path d="M8 21V7"/><circle cx="6" cy="17" r="1" fill="currentColor" stroke="none"/><circle cx="18" cy="17" r="1" fill="currentColor" stroke="none"/></svg>`,
  Shopping: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
  Health: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
  Entertainment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
  Utilities: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  Salary: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>`,
  Freelance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  Investment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
  Rent: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
};

// ─── Generate unique ID ────────────────────────────────────────────────────
export function genId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}
