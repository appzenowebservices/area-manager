import { DELIVERY_STATUS } from "../../data/deliveryData";

/**
 * DeliveryFilters
 * File: src/components/delivery/DeliveryFilters.jsx
 *
 * Props:
 *   search, onSearch
 *   status, onStatus
 *   area,   onArea,  areas[]
 *   total   number
 *   onReset fn
 */

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default function DeliveryFilters({
  search, onSearch,
  status, onStatus,
  area,   onArea,   areas,
  total,
  onReset,
}) {
  const hasFilters = search || status !== "All" || area !== "All";

  return (
    <>
      <style>{css}</style>
      <div className="df-wrap">
        <div className="df-row">
          {/* Search */}
          <div className="df-search-wrap">
            <span className="df-search-icon"><SearchIcon /></span>
            <input
              className="df-search"
              type="text"
              placeholder="Search by name, phone, area..."
              value={search}
              onChange={e => onSearch(e.target.value)}
            />
            {search && (
              <button className="df-clear" onClick={() => onSearch("")}>✕</button>
            )}
          </div>

          {/* Status */}
          <select className="df-select" value={status} onChange={e => onStatus(e.target.value)}>
            {DELIVERY_STATUS.map(s => (
              <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
            ))}
          </select>

          {/* Area */}
          <select className="df-select" value={area} onChange={e => onArea(e.target.value)}>
            <option value="All">All Areas</option>
            {areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div className="df-meta">
          <span className="df-count">
            Showing <strong>{total}</strong> partner{total !== 1 ? "s" : ""}
          </span>
          {hasFilters && (
            <button className="df-reset" onClick={onReset}>✕ Clear filters</button>
          )}
        </div>
      </div>
    </>
  );
}

const css = `
  .df-wrap {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 1rem 1.1rem;
    margin-bottom: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .df-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }
  .df-search-wrap {
    flex: 1;
    min-width: 200px;
    display: flex;
    align-items: center;
    background: #f8faff;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    padding: 0 0.75rem;
    transition: border-color 0.2s;
  }
  .df-search-wrap:focus-within {
    border-color: #1a73e8;
    box-shadow: 0 0 0 3px rgba(26,115,232,0.1);
  }
  .df-search-icon { color: #94a3b8; display: flex; align-items: center; flex-shrink: 0; }
  .df-search {
    flex: 1;
    height: 40px;
    border: none;
    outline: none;
    background: transparent;
    font-size: 0.85rem;
    color: #0f172a;
    font-family: inherit;
    padding: 0 8px;
  }
  .df-search::placeholder { color: #bbb; }
  .df-clear {
    background: none; border: none;
    color: #94a3b8; cursor: pointer;
    font-size: 0.8rem; padding: 2px 4px;
  }
  .df-select {
    height: 42px;
    padding: 0 0.75rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    background: #f8faff;
    font-size: 0.84rem;
    color: #334155;
    font-family: inherit;
    outline: none;
    cursor: pointer;
    transition: border-color 0.2s;
    min-width: 130px;
  }
  .df-select:focus { border-color: #1a73e8; }
  .df-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .df-count { font-size: 0.8rem; color: #64748b; }
  .df-count strong { color: #1a73e8; }
  .df-reset {
    background: none; border: none;
    color: #ef4444; font-size: 0.78rem;
    font-weight: 600; cursor: pointer;
    font-family: inherit; padding: 0;
  }
  @media (max-width: 600px) {
    .df-search-wrap { min-width: 100%; }
    .df-select { flex: 1; min-width: 120px; }
  }
`;
