import { X, FileText, MapPin, User, Calendar, DollarSign, Package, Truck } from 'lucide-react';
import { useEffect } from 'react';

const STATUS_STYLES = {
  'Open order': 'bg-amber-100 text-amber-800 border-amber-200',
  Invoiced: 'bg-blue-100 text-blue-800 border-blue-200',
  Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200',
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(val) {
  if (val == null) return '—';
  return `RM ${val.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function DetailRow({ icon: Icon, label, value, mono }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-gray-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <p className={`text-sm text-gray-900 mt-0.5 ${mono ? 'font-mono' : ''}`}>
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

export default function OrderDetailModal({ order, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const statusStyle = STATUS_STYLES[order.SalesStatus] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-mono">{order.SalesId}</h2>
            <p className="text-sm text-gray-500">{order.SalesName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-1">
          {/* Status badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${statusStyle}`}>
              {order.SalesStatus}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {order.DocumentStatus}
            </span>
          </div>

          {/* Order info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <DetailRow icon={User} label="Customer Account" value={order.CustAccount} mono />
            <DetailRow icon={MapPin} label="Branch / Site" value={order.InventSiteId} />
            <DetailRow icon={Calendar} label="Created" value={formatDate(order.CreatedDateTime1)} />
            <DetailRow icon={Calendar} label="Requested Shipping" value={formatDate(order.ShippingDateRequested)} />
            <DetailRow icon={User} label="Sales Taker" value={order.SalesTaker} />
            <DetailRow icon={FileText} label="Customer Ref" value={order.CustomerRef} mono />
            <DetailRow icon={Package} label="Item Group" value={order.DOT_ItemGroupId} />
            <DetailRow icon={Truck} label="Sales District" value={order.SalesDistrictDescription} />
            <DetailRow icon={MapPin} label="Delivery District" value={order.HAR_DeliveryDistrictDescription} />
            <DetailRow icon={FileText} label="Sales Group" value={order.SalesGroup} />
            <DetailRow icon={FileText} label="Sales Type" value={order.SalesType} />
            <DetailRow icon={FileText} label="Release Status" value={order.ReleaseStatus} />
          </div>

          {/* Financial summary */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Financial Summary</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                <p className="text-sm font-bold text-blue-700">{formatCurrency(order.HAR_TotalSOAmount)}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Invoiced</p>
                <p className="text-sm font-bold text-green-700">{formatCurrency(order.HAR_InvoicedAmount)}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Balance</p>
                <p className="text-sm font-bold text-amber-700">{formatCurrency(order.HAR_BalanceAmount)}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(order.DOT_SONotes || order.DOT_SFANotes) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
              {order.DOT_SONotes && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-2">{order.DOT_SONotes}</p>
              )}
              {order.DOT_SFANotes && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{order.DOT_SFANotes}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
