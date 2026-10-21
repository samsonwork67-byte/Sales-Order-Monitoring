# Sales Order Monitoring Web App

A responsive web application for monitoring sales orders across multiple branches. Built with React, Vite, and Tailwind CSS.

## Features

- **Dashboard** — Summary cards showing total orders, open/pending, completed (invoiced + delivered), cancelled, and total order value
- **Order Listing** — Sortable table with order number, customer, branch/site, order date, status, and amount
- **Search & Filtering** — Full-text search plus dropdown filters by status and branch/site
- **Order Details** — Click any order row to view full details in a modal
- **Responsive Design** — Works on desktop, tablet, and mobile
- **UX States** — Loading skeletons, empty state messaging, error banners with retry

## Tech Stack

- **React 19** with Vite
- **Tailwind CSS v4** for styling
- **Lucide React** for icons
- No additional state management library needed (React hooks)

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

## API Integration

The app connects to a mock REST API:

| Item | Value |
|---|---|
| Base URL | `https://hiring.harrisons.my/api/mock/sales-orders` |
| Auth | `x-assessment-key: hssb-assessment-mock-2026` |
| Methods | GET only (read-only) |

### Endpoints Used

- `GET /api/mock/sales-orders` — Paginated list with summary
- `GET /api/mock/sales-orders/meta` — Statuses, sites, and API metadata
- `GET /api/mock/sales-orders/{salesId}` — Single order detail

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
