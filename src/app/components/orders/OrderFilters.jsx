import { ORDER_STATUSES } from "../../data/ordersData";

/**
 * OrderFilters
 * File: src/components/orders/OrderFilters.jsx
 *
 * Props:
 *  search, onSearch
 *  status, onStatus
 *  area, onArea, areas[]
 *  dateFrom, onDateFrom
 *  dateTo, onDateTo
 *  total (filtered count)
 *  onReset
 */

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default function OrderFilters({
  search, onSearch,
  status, onStatus,
  area, onArea, areas,
  dateFrom, onDateFrom,
  dateTo, onDateTo,
  total,
  onReset,
}) {
  const hasFilters = search || status !== "All" || area !== "All" || dateFrom || dateTo;

  return (
    <>
      <style>{css}</style>
      <div className="of-wrap">
        {/* Row 1: search + dropdowns */}
        <div className="of-row">
          {/* Search */}
          <div className="of-search-wrap">
            <span className="of-search-icon"><SearchIcon /></span>
            <input
              className="of-search"
              type="text"
              placeholder="Search order ID, customer name, phone..."
              value={search}
              onChange={e => onSearch(e.target.value)}
            />
            {search && (
              <button className="of-clear-btn" onClick={() => onSearch("")}>✕</button>
            )}
          </div>

          {/* Status dropdown */}
          <select className="of-select" value={status} onChange={e => onStatus(e.target.value)}>
            {ORDER_STATUSES.map(s => (
              <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
            ))}
          </select>

          {/* Area dropdown */}
          <select className="of-select" value={area} onChange={e => onArea(e.target.value)}>
            <option value="All">All Areas</option>
            {areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          {/* Date from */}
          <input
            className="of-date"
            type="date"
            value={dateFrom}
            onChange={e => onDateFrom(e.target.value)}
            title="From date"
          />

          {/* Date to */}
          <input
            className="of-date"
            type="date"
            value={dateTo}
            onChange={e => onDateTo(e.target.value)}
            title="To date"
          />
        </div>

        {/* Row 2: result count + reset */}
        <div className="of-meta-row">
          <span className="of-count">
            Showing <strong>{total}</strong> order{total !== 1 ? "s" : ""}
          </span>
          {hasFilters && (
            <button className="of-reset" onClick={onReset}>
              ✕ Clear filters
            </button>
          )}
        </div>
      </div>
    </>
  );
}

const css = `
  .of-wrap { background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:1rem 1.1rem; margin-bottom:1.1rem; display:flex; flex-direction:column; gap:10px; }
  .of-row { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
  .of-search-wrap { display:flex; align-items:center; flex:1; min-width:200px; position:relative; background:#f8faff; border:1.5px solid #e2e8f0; border-radius:10px; padding:0 0.75rem; transition:border-color 0.2s; }
  .of-search-wrap:focus-within { border-color:#1a73e8; box-shadow:0 0 0 3px rgba(26,115,232,0.1); }
  .of-search-icon { color:#94a3b8; display:flex; align-items:center; flex-shrink:0; }
  .of-search { flex:1; height:40px; border:none; outline:none; background:transparent; font-size:0.85rem; color:#0f172a; font-family:inherit; padding:0 8px; }
  .of-search::placeholder { color:#bbb; }
  .of-clear-btn { background:none; border:none; color:#94a3b8; cursor:pointer; font-size:0.8rem; padding:2px 4px; }
  .of-select { height:42px; padding:0 0.75rem; border:1.5px solid #e2e8f0; border-radius:10px; background:#f8faff; font-size:0.84rem; color:#334155; font-family:inherit; outline:none; cursor:pointer; transition:border-color 0.2s; min-width:130px; }
  .of-select:focus { border-color:#1a73e8; }
  .of-date { height:42px; padding:0 0.75rem; border:1.5px solid #e2e8f0; border-radius:10px; background:#f8faff; font-size:0.82rem; color:#334155; font-family:inherit; outline:none; cursor:pointer; transition:border-color 0.2s; }
  .of-date:focus { border-color:#1a73e8; }
  .of-meta-row { display:flex; justify-content:space-between; align-items:center; }
  .of-count { font-size:0.8rem; color:#64748b; }
  .of-count strong { color:#1a73e8; }
  .of-reset { background:none; border:none; color:#ef4444; font-size:0.78rem; font-weight:600; cursor:pointer; font-family:inherit; padding:0; }
  @media (max-width:680px) {
    .of-search-wrap { min-width:100%; }
    .of-select, .of-date { flex:1; min-width:120px; }
  }
`;
