import { COMPLAINT_SOURCES, COMPLAINT_PRIORITIES, COMPLAINT_STATUSES } from "../../data/complaintsData";

/**
 * ComplaintsFilters
 * File: src/components/complaints/ComplaintsFilters.jsx
 */
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default function ComplaintsFilters({
  search,   onSearch,
  source,   onSource,
  priority, onPriority,
  status,   onStatus,
  total,    onReset,
}) {
  const hasFilters = search || source !== "All" || priority !== "All" || status !== "All";

  return (
    <>
      <style>{css}</style>
      <div className="cf-wrap">
        <div className="cf-row">
          <div className="cf-search-wrap">
            <span className="cf-icon"><SearchIcon /></span>
            <input
              className="cf-search"
              type="text"
              placeholder="Search ID, name, subject, area..."
              value={search}
              onChange={e => onSearch(e.target.value)}
            />
            {search && <button className="cf-clear" onClick={() => onSearch("")}>✕</button>}
          </div>

          <select className="cf-select" value={source} onChange={e => onSource(e.target.value)}>
            {COMPLAINT_SOURCES.map(s => (
              <option key={s} value={s}>{s === "All" ? "All Sources" : s}</option>
            ))}
          </select>

          <select className="cf-select" value={priority} onChange={e => onPriority(e.target.value)}>
            {COMPLAINT_PRIORITIES.map(p => (
              <option key={p} value={p}>{p === "All" ? "All Priorities" : p}</option>
            ))}
          </select>

          <select className="cf-select" value={status} onChange={e => onStatus(e.target.value)}>
            {COMPLAINT_STATUSES.map(s => (
              <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
            ))}
          </select>
        </div>

        <div className="cf-meta">
          <span className="cf-count">
            Showing <strong>{total}</strong> complaint{total !== 1 ? "s" : ""}
          </span>
          {hasFilters && (
            <button className="cf-reset" onClick={onReset}>✕ Clear filters</button>
          )}
        </div>
      </div>
    </>
  );
}

const css = `
  .cf-wrap {
    background: #fff; border: 1px solid #e2e8f0;
    border-radius: 14px; padding: 1rem 1.1rem;
    margin-bottom: 1.1rem; display: flex;
    flex-direction: column; gap: 10px;
  }
  .cf-row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .cf-search-wrap {
    flex: 1; min-width: 200px;
    display: flex; align-items: center;
    background: #f8faff; border: 1.5px solid #e2e8f0;
    border-radius: 10px; padding: 0 0.75rem;
    transition: border-color 0.2s;
  }
  .cf-search-wrap:focus-within { border-color: #1a73e8; box-shadow: 0 0 0 3px rgba(26,115,232,0.1); }
  .cf-icon { color: #94a3b8; display: flex; align-items: center; flex-shrink: 0; }
  .cf-search {
    flex: 1; height: 40px; border: none; outline: none;
    background: transparent; font-size: 0.85rem;
    color: #0f172a; font-family: inherit; padding: 0 8px;
  }
  .cf-search::placeholder { color: #bbb; }
  .cf-clear { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 0.8rem; padding: 2px 4px; }
  .cf-select {
    height: 42px; padding: 0 0.75rem;
    border: 1.5px solid #e2e8f0; border-radius: 10px;
    background: #f8faff; font-size: 0.84rem;
    color: #334155; font-family: inherit;
    outline: none; cursor: pointer;
    transition: border-color 0.2s; min-width: 120px;
  }
  .cf-select:focus { border-color: #1a73e8; }
  .cf-meta { display: flex; justify-content: space-between; align-items: center; }
  .cf-count { font-size: 0.8rem; color: #64748b; }
  .cf-count strong { color: #1a73e8; }
  .cf-reset { background: none; border: none; color: #ef4444; font-size: 0.78rem; font-weight: 600; cursor: pointer; font-family: inherit; padding: 0; }
  @media (max-width: 600px) {
    .cf-search-wrap { min-width: 100%; }
    .cf-select { flex: 1; min-width: 100px; }
  }
`;
