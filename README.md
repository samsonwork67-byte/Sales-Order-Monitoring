# Sales Order Monitoring Web App

A responsive web app for monitoring sales orders across multiple branches. Built with React 19, Vite, and Tailwind CSS v4.

Live demo: https://samsonwork67-byte.github.io/Sales-Order-Monitoring/

## Features

- **Dashboard** — Summary cards for total orders, open/pending, completed (invoiced + delivered), cancelled, and total order value
- **Order Listing** — Sortable table with order number, customer, branch/site, order date, status, and amount
- **Search & Filtering** — Full-text search plus dropdown filters by status and branch/site
- **Order Details** — Click any row to view full details in a modal
- **Responsive Design** — Works on desktop, tablet, and mobile
- **UX States** — Loading spinner, empty state, and error banner with retry

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Lucide React (icons)
- No state management library — React hooks only

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

The production build goes to `dist/`.

## Architecture

Small single-page app with no router and no global state library. All state (filters, pagination, sort, data, loading/error) lives in `App.jsx` and is passed down as props.

- `src/api/salesOrders.js` is the only file that talks to the network.
- Components under `src/components/` are presentational.
- Tailwind v4 is wired through the Vite plugin; icons come from lucide-react.

Flow: user changes a filter/sort/page → state updates → `loadOrders` runs → API call → data comes back → table re-renders.

## API Integration

The app talks to a mock REST API hosted by Harrisons.

| Item | Value |
|---|---|
| Base URL | `https://hiring.harrisons.my/api/mock/sales-orders` |
| Auth | `x-assessment-key: hssb-assessment-mock-2026` |
| Methods | GET only (read-only) |

### Endpoints Used

- `GET /api/mock/sales-orders` — paginated list with summary (`page`, `pageSize`, `status`, `site`, `q`, `sort`, `order`)
- `GET /api/mock/sales-orders/meta` — statuses, sites, and API metadata (loaded once on mount)
- `GET /api/mock/sales-orders/{salesId}` — single order detail

Non-OK responses throw and are shown in an error banner with a retry button.

## Key Technical Decisions

- **Server-side filtering/sorting/pagination** — the client never slices data; all params go to the API.
- **No global state lib** — hooks are enough for this scope.
- **Debounced search (400ms)** to avoid hitting the API on every keystroke; filter/sort changes reset to page 1.
- **Detail modal reuses list-row data** instead of refetching — feels instant.
- **Explicit UX states** — spinner while loading, empty state, error banner with retry.

## Project Structure

```
src/
├── api/
│   └── salesOrders.js        # API client functions
├── components/
│   ├── Dashboard.jsx          # Summary KPI cards
│   ├── ErrorBanner.jsx        # Error display with retry
│   ├── Filters.jsx            # Search bar + dropdowns
│   ├── Header.jsx             # App header/nav bar
│   ├── OrderDetailModal.jsx   # Order detail overlay
│   ├── OrderTable.jsx         # Sortable data table
│   └── Pagination.jsx         # Page navigation controls
├── App.jsx                    # Main application component
├── index.css                  # Tailwind imports + custom styles
└── main.jsx                   # Entry point
```

## Deployment

Deployed to GitHub Pages via the workflow in `.github/workflows/deploy.yml`. On push to `main`, it installs dependencies, builds, and publishes `dist/`. `vite.config.js` uses `base: './'` so assets resolve under the repo subpath.

To enable: repo → Settings → Pages → Source → GitHub Actions.

## Notes

- `node_modules/` and `dist/` are gitignored — run `npm install` and `npm run build` after cloning.
- `.git/` is local only and never pushed to GitHub.
