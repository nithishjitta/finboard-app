import transactionsRaw from '../data/transactions.json';
import monthlyRaw from '../data/monthly.json';
import usersRaw from '../data/users.json';

// Simulate network latency
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// In-memory store (acts like a backend DB)
let _transactions = [...transactionsRaw];
let _monthly = [...monthlyRaw];
const _users = [...usersRaw];

// ─── Auth ──────────────────────────────────────────────────────────────────
export const api = {
  auth: {
    async login(email, password) {
      await delay(500);
      const user = _users.find(u => u.email === email && u.password === password);
      if (!user) throw new Error('Invalid email or password');
      const { password: _, ...safeUser } = user;
      return { user: safeUser, token: `mock-token-${safeUser.id}-${Date.now()}` };
    },
    async logout() {
      await delay(100);
      return { success: true };
    },
  },

  // ─── Transactions ────────────────────────────────────────────────────────
  transactions: {
    async getAll() {
      await delay(200);
      return [..._transactions];
    },
    async add(tx) {
      await delay(300);
      const newTx = { ...tx, id: Date.now() };
      _transactions = [newTx, ..._transactions];
      return newTx;
    },
    async update(tx) {
      await delay(300);
      _transactions = _transactions.map(t => t.id === tx.id ? { ...t, ...tx } : t);
      return tx;
    },
    async delete(id) {
      await delay(200);
      _transactions = _transactions.filter(t => t.id !== id);
      return { success: true };
    },
  },

  // ─── Monthly Summary ─────────────────────────────────────────────────────
  monthly: {
    async getAll() {
      await delay(150);
      return _monthly.map(m => ({ ...m, balance: m.income - m.expenses }));
    },
  },
};
