import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function Filters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  site,
  onSiteChange,
  meta,
  hasActiveFilters,
  onClearFilters,
}) {
  const statuses = meta?.facets?.statuses || [];
  const sites = meta?.facets?.sites || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer, account, reference…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
              placeholder:text-gray-400 transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="h-4 w-4 text-gray-400 hidden sm:block" />

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
              text-gray-700 cursor-pointer transition-all min-w-[140px]"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.value} ({s.count})
              </option>
            ))}
          </select>

          {/* Site filter */}
          <select
            value={site}
            onChange={(e) => onSiteChange(e.target.value)}
            className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
              text-gray-700 cursor-pointer transition-all min-w-[130px]"
          >
            <option value="">All Sites</option>
            {sites.map((s) => (
              <option key={s.value} value={s.value}>
                {s.value} ({s.count})
              </option>
            ))}
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700
                font-medium px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 flex-wrap">
          <span className="text-xs text-gray-500">Active filters:</span>
          {status && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              Status: {status}
              <button onClick={() => onStatusChange('')} className="hover:text-blue-900">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {site && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              Site: {site}
              <button onClick={() => onSiteChange('')} className="hover:text-purple-900">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              Search: "{search}"
              <button onClick={() => onSearchChange('')} className="hover:text-gray-900">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
