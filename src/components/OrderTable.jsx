import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react';

const STATUS_STYLES = {
  'Open order': 'bg-amber-100 text-amber-800',
  Invoiced: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-red-100 text-red-800',
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}>
      {status}
    </span>
  );
}

function SortIcon({ column, currentSort, currentOrder }) {
  if (currentSort !== column) {
    return <ArrowUpDown className="h-3.5 w-3.5 text-gray-300" />;
  }
  return currentOrder === 'asc' ? (
    <ArrowUp className="h-3.5 w-3.5 text-blue-600" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-blue-600" />
  );
}

const columns = [
  { key: 'SalesId', label: 'Order #', sortable: true },
  { key: 'SalesName', label: 'Customer', sortable: false },
  { key: 'InventSiteId', label: 'Branch / Site', sortable: true },
  { key: 'CreatedDateTime1', label: 'Order Date', sortable: true },
  { key: 'SalesStatus', label: 'Status', sortable: true },
  { key: 'HAR_TotalSOAmount', label: 'Amount (RM)', sortable: true, align: 'right' },
  { key: 'actions', label: '', sortable: false },
];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatAmount(val) {
  if (val == null) return '—';
  return val.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function OrderTable({ orders, sort, order, onSort, onSelectOrder }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap
                  ${col.sortable ? 'cursor-pointer hover:text-gray-900 select-none' : ''}
                  ${col.align === 'right' ? 'text-right' : ''}`}
                onClick={col.sortable ? () => onSort(col.key) : undefined}
              >
                <span className="inline-flex items-center gap-1.5">
                  {col.label}
                  {col.sortable && (
                    <SortIcon column={col.key} currentSort={sort} currentOrder={order} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((row) => (
            <tr
              key={row.SalesId}
              className="hover:bg-blue-50/50 transition-colors cursor-pointer"
              onClick={() => onSelectOrder(row)}
            >
              <td className="px-4 py-3.5 font-mono font-semibold text-blue-700 whitespace-nowrap">
                {row.SalesId}
              </td>
              <td className="px-4 py-3.5">
                <div className="font-medium text-gray-900 truncate max-w-[200px]">
                  {row.SalesName}
                </div>
                <div className="text-xs text-gray-500">{row.CustAccount}</div>
              </td>
              <td className="px-4 py-3.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                  {row.InventSiteId}
                </span>
              </td>
              <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                {formatDate(row.CreatedDateTime1)}
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={row.SalesStatus} />
              </td>
              <td className="px-4 py-3.5 text-right font-mono tabular-nums text-gray-900 whitespace-nowrap">
                {formatAmount(row.HAR_TotalSOAmount)}
              </td>
              <td className="px-4 py-3.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOrder(row);
                  }}
                  className="p-1.5 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors"
                  title="View details"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
