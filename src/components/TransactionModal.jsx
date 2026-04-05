import { useState } from 'react';
import { CATEGORIES } from '../utils';

export default function TransactionModal({ tx, onSave, onClose }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    ...tx,
    amount: tx ? Math.abs(tx.amount) : '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.description.trim() || !form.amount || !form.date) return;
    const amt = parseFloat(form.amount);
    onSave({ ...form, id: tx?.id || Date.now(), amount: form.type === 'expense' ? -Math.abs(amt) : Math.abs(amt) });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-hd">
          <span className="modal-title">{tx ? 'Edit Transaction' : 'New Transaction'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="e.g. Monthly groceries"/>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input className="form-control" type="number" min="0" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0"/>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-control" type="date" value={form.date} onChange={e => set('date', e.target.value)}/>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-control" value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" value={form.category} onChange={e => set('category', e.target.value)}>
              {Object.keys(CATEGORIES).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        </div>

        <div className="modal-ft">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {tx ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}
