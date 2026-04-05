# FinBoard

A personal finance dashboard I built to practice React state management, role-based UI, and data visualization. Tracks income, expenses, and spending patterns across categories.

**Live demo:** [https://finboard-app-rho.vercel.app/](https://finboard-app-rho.vercel.app/)

---

## Getting started

```bash
npm install
npm run dev
```

Runs at [http://localhost:5173](http://localhost:5173)

---

## Login

Two demo accounts are pre-loaded:

| Role   | Email                  | Password   |
|--------|------------------------|------------|
| Admin  | arjun@finboard.app     | admin123   |
| Viewer | priya@finboard.app     | viewer123  |

The login screen has quick-fill buttons so you don't have to type these out.

---

## What's in it

**Dashboard** — balance summary cards, a 7-month income vs expenses area chart, spending donut by category, and a recent transactions list.

**Transactions** — paginated table with search, filter by type/category, sort by date or amount, and CSV export. Admins can add, edit, and delete records. Viewers see the data but not the action buttons.

**Insights** — savings rate with a health indicator, top spending category, avg expense size, monthly bar chart, proportional category bars, and a month-over-month comparison table.

**Profile** — account info, a permissions breakdown by role, and sign out.

---

## Role-based access

There's no backend auth here — roles come from the user record in `users.json`. The UI adapts based on who's logged in:

- **Admin** sees add/edit/delete controls on the Transactions page
- **Viewer** sees all the data but mutations are hidden and a notice is shown instead

To switch roles, log out and log back in with the other account.

---

## Stack

- React 19 + Vite
- Recharts for charts
- Plain CSS with custom properties (no component library)
- DM Sans + JetBrains Mono

---

## Project structure

```
src/
├── context/
│   └── AppContext.jsx       # useReducer + Context, handles auth and data
├── data/
│   ├── transactions.json
│   ├── monthly.json
│   └── users.json
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Transactions.jsx
│   ├── Insights.jsx
│   └── Profile.jsx
├── components/
│   └── TransactionModal.jsx
├── utils/
│   ├── index.js             # fmt(), fmtDate(), CATEGORIES config
│   └── api.js               # Mock API with simulated delay
├── App.jsx
├── main.jsx
└── index.css
```

---

## Mock API

`src/utils/api.js` wraps all data operations with a simulated fetch delay so the async patterns are real. To connect a live backend, replace the functions there — everything in the components already uses `await`.

---

## Notes

- Data is in-memory per session. Refreshing resets to the seed data in the JSON files.
- The monthly chart data is static — in a real app this would be aggregated server-side from the transactions table.
- localStorage persists your auth session and theme preference between page refreshes.