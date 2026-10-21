import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchSalesOrders, fetchMeta } from './api/salesOrders';
import Dashboard from './components/Dashboard';
import OrderTable from './components/OrderTable';
import Filters from './components/Filters';
import Pagination from './components/Pagination';
import OrderDetailModal from './components/OrderDetailModal';
import Header from './components/Header';
import ErrorBanner from './components/ErrorBanner';
import { Loader2 } from 'lucide-react';

function App() {
  // Filters & pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [status, setStatus] = useState('');
  const [site, setSite] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('SalesId');
  const [order, setOrder] = useState('asc');

  // Data state
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Debounce ref for search
  const searchTimerRef = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(searchTimerRef.current);
  }, [search]);

  // Fetch metadata on mount
  useEffect(() => {
    fetchMeta()
      .then(setMeta)
      .catch((err) => console.error('Failed to load meta:', err));
  }, []);

  // Fetch orders when filters/pagination change
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSalesOrders({
        page,
        pageSize,
        status: status || undefined,
        site: site || undefined,
        q: debouncedSearch || undefined,
        sort,
        order,
      });
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, status, site, debouncedSearch, sort, order]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Handle sort column click
  const handleSort = (column) => {
    if (sort === column) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSort(column);
      setOrder('asc');
    }
    setPage(1);
  };

  // Handle filter changes - reset page
  const handleStatusChange = (val) => {
    setStatus(val);
    setPage(1);
  };
  const handleSiteChange = (val) => {
    setSite(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setStatus('');
    setSite('');
    setSearch('');
    setDebouncedSearch('');
    setSort('SalesId');
    setOrder('asc');
    setPage(1);
  };

  const hasActiveFilters = status || site || search;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dashboard summary cards */}
        <Dashboard summary={data?.summary} loading={loading && !data} />

        {/* Filters bar */}
        <Filters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={handleStatusChange}
          site={site}
          onSiteChange={handleSiteChange}
          meta={meta}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Error banner */}
        {error && <ErrorBanner message={error} onRetry={loadOrders} />}

        {/* Orders table section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-500 text-sm">Loading orders…</span>
            </div>
          ) : !error && data?.data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <svg className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            !error && (
              <>
                <OrderTable
                  orders={data?.data || []}
                  sort={sort}
                  order={order}
                  onSort={handleSort}
                  onSelectOrder={setSelectedOrder}
                />
                <Pagination
                  page={page}
                  totalPages={data?.totalPages || 1}
                  total={data?.total || 0}
                  pageSize={pageSize}
                  onPageChange={setPage}
                />
              </>
            )
          )}
        </div>
      </main>

      {/* Order detail modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default App;
