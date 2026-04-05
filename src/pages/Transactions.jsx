import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { fmt, fmtDate, CATEGORIES } from '../utils';
import TransactionModal from '../components/TransactionModal';

const PAGE_SIZE = 8;

const CAT_ICONS = {
  Food: '<path d="M3 11l1-7h16l1 7"/><path d="M3 11h18v2a8 8 0 01-16 0v-2z"/><path d="M12 11V4"/>',
  Transport: '<rect x="2" y="7" width="20" height="10" rx="2"/><circle cx="6" cy="17" r="1.5" fill="currentColor" stroke="none"/><circle cx="18" cy="17" r="1.5" fill="currentColor" stroke="none"/>',
  Shopping: '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>',
  Health: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l8.84 8.84 8.84-8.84a5.5 5.5 0 000-7.78z"/>',
  Entertainment: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
  Utilities: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  Salary: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>',
  Freelance: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  Investment: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
  Rent: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
};

export default function Transactions() {
  const { state, dispatch, addTransaction, editTransaction, deleteTransaction } = useApp();
  const { transactions, filters, user } = state;
  const isAdmin = user?.role === 'admin';

  const [modal, setModal] = useState(null);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const setFilter = (k, v) => { dispatch({ type: 'SET_FILTER', payload: { [k]: v } }); setPage(1); };

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    if (filters.type !== 'all') list = list.filter(t => t.type === filters.type);
    if (filters.category !== 'all') list = list.filter(t => t.category === filters.category);
    switch (filters.sortBy) {
      case 'date-desc':   list.sort((a, b) => new Date(b.date) - new Date(a.date)); break;
      case 'date-asc':    list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case 'amount-desc': list.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount)); break;
      case 'amount-asc':  list.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount)); break;
    }
    return list;
  }, [transactions, filters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSave = async tx => {
    if (modal === 'add') await addTransaction(tx);
    else await editTransaction(tx);
    setModal(null);
  };

  const handleDelete = async id => {
    if (!confirm('Delete this transaction?')) return;
    setDeletingId(id);
    await deleteTransaction(id);
    setDeletingId(null);
  };

  const exportCSV = () => {
    const header = 'Date,Description,Category,Type,Amount\n';
    const rows = filtered.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'transactions.csv';
    a.click();
  };

  const pages = (() => {
    const p = []; const s = Math.max(1, page - 2); const e = Math.min(totalPages, s + 4);
    for (let i = s; i <= e; i++) p.push(i); return p;
  })();

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">{filtered.length} record{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-ghost btn-sm" onClick={exportCSV}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 2v8M5 7l3 3 3-3M2 11v1a2 2 0 002 2h8a2 2 0 002-2v-1"/></svg>
            Export CSV
          </button>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setModal('add')}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>
              Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="section-card">
        <div className="section-head" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="section-title">All Transactions</span>
            <span className="section-badge">{transactions.length} total</span>
          </div>
          <div className="filters-bar">
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--text-3)', pointerEvents: 'none' }}>
                <circle cx="6.5" cy="6.5" r="4"/><path d="M11 11l3 3"/>
              </svg>
              <input className="filter-input" style={{ paddingLeft: 32 }} placeholder="Search transactions…"
                value={filters.search} onChange={e => setFilter('search', e.target.value)}/>
            </div>
            <select className="filter-select" value={filters.type} onChange={e => setFilter('type', e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select className="filter-select" value={filters.category} onChange={e => setFilter('category', e.target.value)}>
              <option value="all">All Categories</option>
              {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="filter-select" value={filters.sortBy} onChange={e => setFilter('sortBy', e.target.value)}>
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {paged.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No transactions found</div>
            <div className="empty-sub">Try adjusting your search or filters</div>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                    {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {paged.map(tx => {
                    const cat = CATEGORIES[tx.category] || {};
                    return (
                      <tr key={tx.id}>
                        <td>
                          <div className="td-desc">
                            <div className="td-icon" style={{ background: cat.bg, color: cat.color }}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                                dangerouslySetInnerHTML={{ __html: CAT_ICONS[tx.category] || '<circle cx="12" cy="12" r="10"/>' }}/>
                            </div>
                            <span className="td-name">{tx.description}</span>
                          </div>
                        </td>
                        <td><span className="td-date">{fmtDate(tx.date)}</span></td>
                        <td>
                          <span className="td-cat" style={{ color: cat.color, borderColor: cat.bg }}>
                            {tx.category}
                          </span>
                        </td>
                        <td><span className={`td-type ${tx.type}`}>{tx.type}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={`td-amount ${tx.type}`}>
                            {tx.type === 'income' ? '+' : '−'}{fmt(Math.abs(tx.amount))}
                          </span>
                        </td>
                        {isAdmin && (
                          <td>
                            <div className="td-actions">
                              <button className="act-btn" onClick={() => setModal(tx)} title="Edit">
                                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z"/></svg>
                              </button>
                              <button className={`act-btn del ${deletingId === tx.id ? 'loading' : ''}`} onClick={() => handleDelete(tx.id)} title="Delete">
                                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9"/></svg>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
                <div className="pg-btns">
                  <button className="pg-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
                  {pages.map(p => <button key={p} className={`pg-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>)}
                  <button className="pg-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {!isAdmin && (
        <div className="viewer-notice">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5h.01"/></svg>
          Viewer mode — switch to Admin to add, edit, or delete transactions
        </div>
      )}

      {modal && (
        <TransactionModal tx={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)}/>
      )}
    </div>
  );
}
