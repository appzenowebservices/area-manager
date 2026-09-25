// src/components/vendors/VendorFilters.jsx
import { VENDOR_CATEGORIES, VENDOR_STATUSES, VENDOR_AREAS } from "../../data/vendorsData";

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

/**
 * VendorFilters
 * Props: search, onSearch, status, onStatus, category, onCategory, area, onArea, total, onReset, onAdd
 */
export default function VendorFilters({
  search, onSearch,
  status, onStatus,
  category, onCategory,
  area, onArea,
  total, onReset, onAdd,
}) {
  const hasFilters = search || status !== "All" || category !== "All" || area !== "All";

  return (
    <>
      <style>{css}</style>
      <div className="vf-wrap">
        <div className="vf-row">
          {/* Search */}
          <div className="vf-search-wrap">
            <span className="vf-search-icon"><SearchIcon /></span>
            <input
              className="vf-search"
              type="text"
              placeholder="Search vendor name, phone, owner..."
              value={search}
              onChange={e => onSearch(e.target.value)}
            />
            {search && <button className="vf-clear" onClick={() => onSearch("")}>✕</button>}
          </div>

          <select className="vf-select" value={status} onChange={e => onStatus(e.target.value)}>
            {VENDOR_STATUSES.map(s => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
          </select>

          <select className="vf-select" value={category} onChange={e => onCategory(e.target.value)}>
            {VENDOR_CATEGORIES.map(c => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
          </select>

          <select className="vf-select" value={area} onChange={e => onArea(e.target.value)}>
            {VENDOR_AREAS.map(a => <option key={a} value={a}>{a === "All" ? "All Areas" : a}</option>)}
          </select>

          <button className="vf-add-btn" onClick={onAdd}>
            ➕ Add Vendor
          </button>
        </div>

        <div className="vf-meta-row">
          <span className="vf-count">Showing <strong>{total}</strong> vendor{total !== 1 ? "s" : ""}</span>
          {hasFilters && <button className="vf-reset" onClick={onReset}>✕ Clear filters</button>}
        </div>
      </div>
    </>
  );
}

const css = `
  .vf-wrap { background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:1rem 1.1rem; margin-bottom:1.1rem; display:flex; flex-direction:column; gap:10px; }
  .vf-row { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
  .vf-search-wrap { display:flex; align-items:center; flex:1; min-width:200px; position:relative; background:#f8faff; border:1.5px solid #e2e8f0; border-radius:10px; padding:0 0.75rem; transition:border-color 0.2s; }
  .vf-search-wrap:focus-within { border-color:#1a73e8; box-shadow:0 0 0 3px rgba(26,115,232,0.1); }
  .vf-search-icon { color:#94a3b8; display:flex; align-items:center; flex-shrink:0; }
  .vf-search { flex:1; height:40px; border:none; outline:none; background:transparent; font-size:0.85rem; color:#0f172a; font-family:inherit; padding:0 8px; }
  .vf-search::placeholder { color:#bbb; }
  .vf-clear { background:none; border:none; color:#94a3b8; cursor:pointer; font-size:0.8rem; padding:2px 4px; }
  .vf-select { height:42px; padding:0 0.75rem; border:1.5px solid #e2e8f0; border-radius:10px; background:#f8faff; font-size:0.84rem; color:#334155; font-family:inherit; outline:none; cursor:pointer; transition:border-color 0.2s; min-width:130px; }
  .vf-select:focus { border-color:#1a73e8; }
  .vf-add-btn { height:42px; padding:0 1.2rem; background:#1a73e8; color:#fff; border:none; border-radius:10px; font-size:0.85rem; font-weight:700; font-family:inherit; cursor:pointer; white-space:nowrap; transition:background 0.15s; flex-shrink:0; }
  .vf-add-btn:hover { background:#1557b0; }
  .vf-meta-row { display:flex; justify-content:space-between; align-items:center; }
  .vf-count { font-size:0.8rem; color:#64748b; }
  .vf-count strong { color:#1a73e8; }
  .vf-reset { background:none; border:none; color:#ef4444; font-size:0.78rem; font-weight:600; cursor:pointer; font-family:inherit; padding:0; }
  @media (max-width:680px) {
    .vf-search-wrap { min-width:100%; }
    .vf-select { flex:1; min-width:120px; }
    .vf-add-btn { width:100%; justify-content:center; }
  }
`;
