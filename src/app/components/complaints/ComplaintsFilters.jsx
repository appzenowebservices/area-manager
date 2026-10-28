import { Search, X } from "lucide-react";
import { BrandCard } from "../brand/BrandCard";
import {
  COMPLAINT_PRIORITIES,
  COMPLAINT_SOURCES,
  COMPLAINT_STATUSES,
} from "../../data/complaintsData";

const selectCls =
  "h-11 rounded-2xl border-2 border-secondary-200 bg-secondary-50 px-3 text-sm font-bold text-secondary-800 outline-none transition-colors focus:border-primary-600";

export default function ComplaintsFilters({
  search,
  onSearch,
  source,
  onSource,
  priority,
  onPriority,
  status,
  onStatus,
  total,
  onReset,
}) {
  const hasFilters =
    search || source !== "All" || priority !== "All" || status !== "All";

  return (
    <BrandCard className="p-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            placeholder="Search ID, name, subject, area…"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            className="h-11 w-full rounded-2xl border-2 border-secondary-200 bg-secondary-50 pl-10 pr-9 text-sm font-semibold text-secondary-900 outline-none focus:border-primary-600 focus:bg-background-section"
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

        <select className={selectCls} value={source} onChange={(event) => onSource(event.target.value)}>
          {COMPLAINT_SOURCES.map((value) => (
            <option key={value} value={value}>
              {value === "All" ? "All Sources" : value}
            </option>
          ))}
        </select>

        <select className={selectCls} value={priority} onChange={(event) => onPriority(event.target.value)}>
          {COMPLAINT_PRIORITIES.map((value) => (
            <option key={value} value={value}>
              {value === "All" ? "All Priorities" : value}
            </option>
          ))}
        </select>

        <select className={selectCls} value={status} onChange={(event) => onStatus(event.target.value)}>
          {COMPLAINT_STATUSES.map((value) => (
            <option key={value} value={value}>
              {value === "All" ? "All Statuses" : value}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-xs font-bold text-secondary-600">
          Showing <strong className="text-primary-600">{total}</strong> complaint
          {total !== 1 ? "s" : ""}
        </span>
        {hasFilters && (
          <button onClick={onReset} className="text-xs font-black text-primary-600 hover:underline">
            ✕ Clear filters
          </button>
        )}
      </div>
    </BrandCard>
  );
}
