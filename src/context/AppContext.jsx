import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const AppContext = createContext(null);
const STORAGE_KEY = 'finboard_v2';

const initialState = {
  user: null,
  token: null,
  authLoading: false,
  authError: null,
  transactions: [],
  monthly: [],
  dataLoading: false,
  activeTab: 'dashboard',
  darkMode: true,
  filters: { search: '', type: 'all', category: 'all', sortBy: 'date-desc' },
  sidebarOpen: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':     return { ...state, authLoading: true, authError: null };
    case 'AUTH_SUCCESS':   return { ...state, authLoading: false, user: action.user, token: action.token };
    case 'AUTH_FAIL':      return { ...state, authLoading: false, authError: action.error };
    case 'AUTH_LOGOUT':    return { ...initialState, darkMode: state.darkMode };
    case 'DATA_LOADING':   return { ...state, dataLoading: true };
    case 'DATA_LOADED':    return { ...state, dataLoading: false, transactions: action.transactions, monthly: action.monthly };
    case 'ADD_TX':         return { ...state, transactions: [action.tx, ...state.transactions] };
    case 'EDIT_TX':        return { ...state, transactions: state.transactions.map(t => t.id === action.tx.id ? action.tx : t) };
    case 'DELETE_TX':      return { ...state, transactions: state.transactions.filter(t => t.id !== action.id) };
    case 'SET_TAB':        return { ...state, activeTab: action.tab };
    case 'SET_DARK':       return { ...state, darkMode: action.val };
    case 'SET_FILTER':     return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'TOGGLE_SIDEBAR': return { ...state, sidebarOpen: !state.sidebarOpen };
    default:               return state;
  }
}

export function AppProvider({ children }) {
  const persisted = (() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (!s) return null;
      const p = JSON.parse(s);
      return { user: p.user, token: p.token, darkMode: p.darkMode, activeTab: p.activeTab };
    } catch { return null; }
  })();

  const [state, dispatch] = useReducer(reducer, { ...initialState, ...(persisted || {}) });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: state.user, token: state.token, darkMode: state.darkMode, activeTab: state.activeTab,
    }));
  }, [state.user, state.token, state.darkMode, state.activeTab]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');
  }, [state.darkMode]);

  useEffect(() => {
    if (!state.user) return;
    dispatch({ type: 'DATA_LOADING' });
    Promise.all([api.transactions.getAll(), api.monthly.getAll()])
      .then(([transactions, monthly]) => dispatch({ type: 'DATA_LOADED', transactions, monthly }))
      .catch(console.error);
  }, [state.user]);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { user, token } = await api.auth.login(email, password);
      dispatch({ type: 'AUTH_SUCCESS', user, token });
    } catch (e) {
      dispatch({ type: 'AUTH_FAIL', error: e.message });
    }
  }, []);

  const logout = useCallback(async () => {
    await api.auth.logout();
    dispatch({ type: 'AUTH_LOGOUT' });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const addTransaction = useCallback(async (tx) => {
    const newTx = await api.transactions.add(tx);
    dispatch({ type: 'ADD_TX', tx: newTx });
    return newTx;
  }, []);

  const editTransaction = useCallback(async (tx) => {
    const updated = await api.transactions.update(tx);
    dispatch({ type: 'EDIT_TX', tx: updated });
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    await api.transactions.delete(id);
    dispatch({ type: 'DELETE_TX', id });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout, addTransaction, editTransaction, deleteTransaction }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
