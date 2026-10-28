import { Search, X, Plus } from "lucide-react";
import { BrandCard } from "../brand/BrandCard";
import { BrandButton } from "../brand/BrandButton";
import { VENDOR_CATEGORIES, VENDOR_STATUSES, VENDOR_AREAS } from "../../data/vendorsData";

const selectCls =
  "h-11 min-w-32 rounded-2xl border-2 border-secondary-200 bg-secondary-50 px-3 text-sm font-bold text-secondary-800 outline-none transition-colors focus:border-primary-600";

export default function VendorFilters({
  search,
  onSearch,
  status,
  onStatus,
  category,
  onCategory,
  area,
  onArea,
  total,
  onReset,
  onAdd,
}) {
  const hasFilters =
    search || status !== "All" || category !== "All" || area !== "All";

  return (
    <BrandCard className="p-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            placeholder="Search vendor name, phone, owner…"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            className="h-11 w-full rounded-2xl border-2 border-secondary-200 bg-secondary-50 pl-10 pr-9 text-sm font-semibold text-secondary-900 outline-none transition-colors placeholder:text-text-muted focus:border-primary-600 focus:bg-background-section"
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

        <select className={selectCls} value={status} onChange={(event) => onStatus(event.target.value)}>
          {VENDOR_STATUSES.map((value) => (
            <option key={value} value={value}>
              {value === "All" ? "All Statuses" : value}
            </option>
          ))}
        </select>

        <select className={selectCls} value={category} onChange={(event) => onCategory(event.target.value)}>
          {VENDOR_CATEGORIES.map((value) => (
            <option key={value} value={value}>
              {value === "All" ? "All Categories" : value}
            </option>
          ))}
        </select>

        <select className={selectCls} value={area} onChange={(event) => onArea(event.target.value)}>
          {VENDOR_AREAS.map((value) => (
            <option key={value} value={value}>
              {value === "All" ? "All Areas" : value}
            </option>
          ))}
        </select>

        <BrandButton variant="primary" className="h-11 px-4" onClick={onAdd}>
          <Plus className="h-4 w-4" /> Add Vendor
        </BrandButton>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-xs font-bold text-secondary-600">
          Showing <strong className="text-primary-600">{total}</strong> vendor
          {total !== 1 ? "s" : ""}
        </span>
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-xs font-black text-primary-600 hover:underline"
          >
            ✕ Clear filters
          </button>
        )}
      </div>
    </BrandCard>
  );
}
