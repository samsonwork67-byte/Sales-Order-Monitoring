import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
} from 'lucide-react';

const cards = [
  {
    key: 'total',
    label: 'Total Orders',
    field: 'total_orders',
    icon: ShoppingCart,
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-700',
  },
  {
    key: 'open',
    label: 'Open / Pending',
    field: 'open_orders',
    icon: Clock,
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    textColor: 'text-amber-700',
  },
  {
    key: 'completed',
    label: 'Completed',
    compute: (s) => (s?.invoiced_orders || 0) + (s?.delivered_orders || 0),
    subtitle: (s) => `${s?.invoiced_orders || 0} invoiced · ${s?.delivered_orders || 0} delivered`,
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    textColor: 'text-emerald-700',
  },
  {
    key: 'cancelled',
    label: 'Cancelled',
    field: 'cancelled_orders',
    icon: XCircle,
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    textColor: 'text-red-700',
  },
  {
    key: 'value',
    label: 'Total Order Value',
    field: 'total_order_value',
    format: 'currency',
    icon: DollarSign,
    bg: 'bg-violet-50',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    textColor: 'text-violet-700',
  },
];

function formatNumber(val) {
  if (val == null) return '—';
  return val.toLocaleString();
}

function formatCurrency(val) {
  if (val == null) return '—';
  return `RM ${val.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-gray-200" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
      <div className="h-8 w-20 bg-gray-200 rounded mt-1" />
    </div>
  );
}

export default function Dashboard({ summary, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const rawValue = card.compute
          ? card.compute(summary)
          : summary?.[card.field];
        const displayValue =
          card.format === 'currency'
            ? formatCurrency(rawValue)
            : formatNumber(rawValue);
        const sub = card.subtitle ? card.subtitle(summary) : null;

        return (
          <div
            key={card.key}
            className={`${card.bg} rounded-xl border border-gray-200/60 p-5 transition-shadow hover:shadow-md`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`${card.iconBg} rounded-lg p-2`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <span className="text-sm font-medium text-gray-600">
                {card.label}
              </span>
            </div>
            <p className={`text-2xl font-bold ${card.textColor}`}>
              {displayValue}
            </p>
            {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
          </div>
        );
      })}
    </div>
  );
}
