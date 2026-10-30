import { RotateCcw, Search, X } from "lucide-react";
import { ORDER_STATUSES } from "../../data/ordersData";

const PAYMENT_STATUSES = ["All", "Pending", "Paid", "Failed", "Refunded"];

const fieldCls =
  "h-11 rounded-2xl border-2 border-secondary-200 bg-secondary-50 px-3 text-sm font-bold text-secondary-800 outline-none transition-colors focus:border-primary-600 focus:bg-background-section";

export default function OrderFilters({
  search,
  onSearch,
  status,
  onStatus,
  paymentStatus,
  onPaymentStatus,
  dateFrom,
  onDateFrom,
  dateTo,
  onDateTo,
  total,
  onReset,
}) {
  const hasFilters =
    search ||
    status !== "All" ||
    paymentStatus !== "All" ||
    dateFrom ||
    dateTo;

  return (
    <div className="rounded-3xl border-2 border-secondary-200 bg-background-section p-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            placeholder="Search order ID, customer, phone, vendor…"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            className="h-11 w-full rounded-2xl border-2 border-secondary-200 bg-secondary-50 pl-10 pr-9 text-sm font-bold text-secondary-900 outline-none transition-colors placeholder:text-secondary-400 focus:border-primary-600 focus:bg-background-section"
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-primary-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <select
          className={fieldCls}
          value={status}
          onChange={(event) => onStatus(event.target.value)}
        >
          {ORDER_STATUSES.map((value) => (
            <option key={value} value={value}>
              {value === "All" ? "All Statuses" : value}
            </option>
          ))}
        </select>

        <select
          className={fieldCls}
          value={paymentStatus}
          onChange={(event) => onPaymentStatus(event.target.value)}
        >
          {PAYMENT_STATUSES.map((value) => (
            <option key={value} value={value}>
              {value === "All" ? "All Payments" : value}
            </option>
          ))}
        </select>

        <input
          className={fieldCls}
          type="date"
          value={dateFrom}
          onChange={(event) => onDateFrom(event.target.value)}
          title="From date"
        />
        <input
          className={fieldCls}
          type="date"
          value={dateTo}
          onChange={(event) => onDateTo(event.target.value)}
          title="To date"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-secondary-100 pt-3">
        <span className="text-xs font-bold text-secondary-600">
          Showing <strong className="text-primary-600">{total}</strong> order
          {total !== 1 ? "s" : ""}
        </span>
        {hasFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-black text-primary-600 hover:underline"
          >
            <RotateCcw className="h-3 w-3" /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
