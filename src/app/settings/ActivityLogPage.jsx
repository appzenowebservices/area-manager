// src/pages/settings/ActivityLogPage.jsx
import { useState, useMemo } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import { getLogs, clearLogs } from "../../store/activityStore";
import { buildDailyDigest, formatDigestEmail } from "../../store/sessionStore";

const CATEGORIES = ["All", "auth", "orders", "vendors", "leads", "earnings", "navigation", "reports"];
const SEVERITIES  = ["All", "info", "warning", "critical"];

const CAT_COLORS = {
  auth:       { bg:"#fbebe9", color:"#8b150e" },
  orders:     { bg:"#f5ebe0", color:"#ae2012" },
  vendors:    { bg:"#d3ebd8", color:"#0a671a" },
  leads:      { bg:"#f5ebe0", color:"#4a5d23" },
  earnings:   { bg:"#faedcc", color:"#a67a22" },
  navigation: { bg:"#f5ebe0", color:"#5d4037" },
  reports:    { bg:"#eaf6ed", color:"#2196f3" },
};
const SEV_COLORS = {
  info:     { bg:"#eaf6ed", color:"#2196f3" },
  warning:  { bg:"#faedcc", color:"#a67a22" },
  critical: { bg:"#fbebe9", color:"#8b150e" },
};

export default function ActivityLogPage() {
  const [logs,       setLogs]       = useState(getLogs());
  const [category,   setCategory]   = useState("All");
  const [severity,   setSeverity]   = useState("All");
  const [search,     setSearch]     = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [showClear,  setShowClear]  = useState(false);

  const filtered = useMemo(() => {
    const now   = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const week  = new Date(today); week.setDate(today.getDate() - 7);
    const month = new Date(today); month.setMonth(today.getMonth() - 1);

    return logs.filter(l => {
      const d = new Date(l.timestamp);
      const matchDate =
        dateFilter === "all"   ? true :
        dateFilter === "today" ? d >= today :
        dateFilter === "week"  ? d >= week  : d >= month;

      const q = search.toLowerCase();
      const matchSearch = !search ||
        l.action.toLowerCase().includes(q) ||
        l.detail.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q);

      const matchCat = category === "All" || l.category === category;
      const matchSev = severity === "All" || l.severity === severity;

      return matchDate && matchSearch && matchCat && matchSev;
    });
  }, [logs, category, severity, search, dateFilter]);

  const handleClear = () => {
    clearLogs();
    setLogs([]);
    setShowClear(false);
  };

  const handleExportCSV = () => {
    const rows = filtered.map(l => ({
      Timestamp: new Date(l.timestamp).toLocaleString("en-IN"),
      Type: l.type, Category: l.category, Action: l.action,
      Detail: l.detail, User: l.user, Page: l.page, Severity: l.severity,
    }));
    const headers = Object.keys(rows[0] || {});
    const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${String(r[h] || "").replace(/"/g,'""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href=url; a.download="activity-log.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyDigest = () => {
    const digest = buildDailyDigest();
    navigator.clipboard.writeText(formatDigestEmail(digest));
  };

  // Counts
  const warnings  = logs.filter(l => l.severity === "warning").length;
  const criticals = logs.filter(l => l.severity === "critical").length;
  const todayCount= logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length;

  return (
    <PageWrapper>
      <style>{css}</style>

      {/* Header */}
      <div className="alp-header">
        <div>
          <h1 className="alp-title">Activity Log</h1>
          <p className="alp-sub">Complete audit trail of all Area Manager actions</p>
        </div>
        <div className="alp-actions">
          <button className="alp-btn alp-btn-green" onClick={handleExportCSV}>⬇ Export CSV</button>
          <button className="alp-btn alp-btn-blue"  onClick={handleCopyDigest}>📋 Copy Digest</button>
          <button className="alp-btn alp-btn-red"   onClick={() => setShowClear(true)}>🗑 Clear Logs</button>
        </div>
      </div>

      {/* Summary */}
      <div className="alp-summary">
        <div className="alp-sum-chip" style={{ background:"#fdfbf7" }}>
          <span className="alp-sum-val" style={{ color:"#ae2012" }}>{logs.length}</span>
          <span className="alp-sum-label">Total Logs</span>
        </div>
        <div className="alp-sum-chip" style={{ background:"#d3ebd8" }}>
          <span className="alp-sum-val" style={{ color:"#0c831f" }}>{todayCount}</span>
          <span className="alp-sum-label">Today</span>
        </div>
        <div className="alp-sum-chip" style={{ background:"#faedcc" }}>
          <span className="alp-sum-val" style={{ color:"#e9c46a" }}>{warnings}</span>
          <span className="alp-sum-label">Warnings</span>
        </div>
        <div className="alp-sum-chip" style={{ background:"#fbebe9" }}>
          <span className="alp-sum-val" style={{ color:"#d32f2f" }}>{criticals}</span>
          <span className="alp-sum-label">Critical</span>
        </div>
      </div>

      {/* Filters */}
      <div className="alp-filters">
        {/* Search */}
        <div className="alp-search-wrap">
          <span style={{ color:"#a68b66" }}>🔍</span>
          <input className="alp-search" placeholder="Search action, detail, type..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="alp-clear" onClick={() => setSearch("")}>✕</button>}
        </div>

        {/* Date range */}
        <div className="alp-date-tabs">
          {[["today","Today"],["week","This Week"],["month","This Month"],["all","All Time"]].map(([k,l]) => (
            <button key={k} className={`alp-date-tab ${dateFilter===k?"alp-date-active":""}`} onClick={() => setDateFilter(k)}>{l}</button>
          ))}
        </div>

        <select className="alp-select" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
        </select>

        <select className="alp-select" value={severity} onChange={e => setSeverity(e.target.value)}>
          {SEVERITIES.map(s => <option key={s} value={s}>{s === "All" ? "All Severity" : s}</option>)}
        </select>

        <span className="alp-count">
          Showing <strong>{filtered.length}</strong> of {logs.length}
        </span>
      </div>

      {/* Log Table */}
      <div className="alp-table-card">
        {filtered.length === 0 ? (
          <div className="alp-empty">
            <span style={{ fontSize:"2.5rem" }}>📋</span>
            <p>No activity logs found for selected filters</p>
            <p style={{ fontSize:"0.76rem" }}>Start using the app — actions will be logged here automatically</p>
          </div>
        ) : (
          <div className="alp-log-list">
            {filtered.map((log, i) => (
              <div key={log.id} className={`alp-log-item ${log.severity !== "info" ? "alp-log-highlight" : ""}`}>
                <div className="alp-log-left">
                  <div className="alp-log-time">
                    {new Date(log.timestamp).toLocaleString("en-IN", {
                      day:"numeric", month:"short", hour:"2-digit", minute:"2-digit", hour12:true,
                    })}
                  </div>
                  <div className="alp-log-badges">
                    <span className="alp-cat-badge" style={{ background: CAT_COLORS[log.category]?.bg, color: CAT_COLORS[log.category]?.color }}>
                      {log.category}
                    </span>
                    <span className="alp-sev-badge" style={{ background: SEV_COLORS[log.severity]?.bg, color: SEV_COLORS[log.severity]?.color }}>
                      {log.severity}
                    </span>
                  </div>
                </div>
                <div className="alp-log-middle">
                  <div className="alp-log-action">{log.action}</div>
                  {log.detail && <div className="alp-log-detail">{log.detail}</div>}
                  <div className="alp-log-meta">📄 {log.page} &nbsp;·&nbsp; 👤 {log.user}</div>
                </div>
                <div className="alp-log-type">{log.type.replace(/_/g," ")}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clear Confirm Modal */}
      {showClear && (
        <>
          <div className="alp-modal-backdrop" onClick={() => setShowClear(false)} />
          <div className="alp-confirm-modal">
            <div style={{ fontSize:"2.5rem", textAlign:"center" }}>⚠️</div>
            <h3 className="alp-cm-title">Clear All Logs?</h3>
            <p className="alp-cm-sub">This will permanently delete all {logs.length} activity records. This cannot be undone.</p>
            <div className="alp-cm-btns">
              <button className="alp-btn alp-btn-gray" onClick={() => setShowClear(false)}>Cancel</button>
              <button className="alp-btn alp-btn-red"  onClick={handleClear}>Yes, Clear All</button>
            </div>
          </div>
        </>
      )}
    </PageWrapper>
  );
}

const css = `
  .alp-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.2rem; flex-wrap:wrap; gap:12px; }
  .alp-title { font-family:'Sora',sans-serif; font-size:clamp(1.2rem,3vw,1.5rem); font-weight:800; color:#2d241e; letter-spacing:-0.02em; margin:0; }
  .alp-sub { font-size:0.82rem; color:#a68b66; margin-top:3px; }
  .alp-actions { display:flex; gap:8px; flex-wrap:wrap; }
  .alp-btn { padding:0.5rem 1rem; border:none; border-radius:9px; font-size:0.82rem; font-weight:700; font-family:inherit; cursor:pointer; transition:opacity 0.15s; white-space:nowrap; }
  .alp-btn:hover { opacity:0.85; }
  .alp-btn-green { background:#d3ebd8; color:#0a671a; }
  .alp-btn-blue  { background:#fdfbf7; color:#ae2012; }
  .alp-btn-red   { background:#fbebe9; color:#8b150e; }
  .alp-btn-gray  { background:#f5ebe0; color:#5d4037; }

  .alp-summary { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:1.1rem; }
  .alp-sum-chip { display:flex; flex-direction:column; align-items:center; gap:2px; padding:0.65rem 1.2rem; border-radius:12px; flex:1; min-width:80px; }
  .alp-sum-val { font-family:'Sora',sans-serif; font-size:1.3rem; font-weight:800; line-height:1; }
  .alp-sum-label { font-size:0.68rem; color:#7d6b5d; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; }

  .alp-filters { display:flex; gap:8px; flex-wrap:wrap; align-items:center; background:#fff; border:1px solid #e9d8bf; border-radius:14px; padding:0.85rem 1.1rem; margin-bottom:1rem; }
  .alp-search-wrap { display:flex; align-items:center; flex:1; min-width:200px; background:#fdfbf7; border:1.5px solid #e9d8bf; border-radius:10px; padding:0 0.75rem; gap:6px; transition:border-color 0.2s; }
  .alp-search-wrap:focus-within { border-color:#ae2012; }
  .alp-search { flex:1; height:38px; border:none; outline:none; background:transparent; font-size:0.84rem; color:#2d241e; font-family:inherit; }
  .alp-clear { background:none; border:none; color:#a68b66; cursor:pointer; }
  .alp-date-tabs { display:flex; background:#fdfbf7; border-radius:9px; padding:3px; gap:2px; }
  .alp-date-tab { padding:0.3rem 0.7rem; border:none; border-radius:7px; background:transparent; color:#7d6b5d; font-size:0.76rem; font-weight:600; cursor:pointer; font-family:inherit; white-space:nowrap; transition:all 0.15s; }
  .alp-date-active { background:#fff; color:#ae2012; box-shadow:0 1px 4px rgba(45, 36, 30,0.1); }
  .alp-select { height:38px; padding:0 0.7rem; border:1.5px solid #e9d8bf; border-radius:9px; background:#fdfbf7; font-size:0.82rem; color:#4a3f35; font-family:inherit; outline:none; }
  .alp-count { font-size:0.78rem; color:#7d6b5d; white-space:nowrap; }
  .alp-count strong { color:#ae2012; }

  .alp-table-card { background:#fff; border:1px solid #e9d8bf; border-radius:14px; overflow:hidden; }
  .alp-log-list { display:flex; flex-direction:column; }
  .alp-log-item { display:flex; align-items:flex-start; gap:12px; padding:0.85rem 1rem; border-bottom:1px solid #fdfbf7; transition:background 0.1s; }
  .alp-log-item:last-child { border-bottom:none; }
  .alp-log-item:hover { background:#fdfbf7; }
  .alp-log-highlight { background:#fdf6e4; }
  .alp-log-highlight:hover { background:#faedcc; }
  .alp-log-left { display:flex; flex-direction:column; gap:5px; flex-shrink:0; min-width:130px; }
  .alp-log-time { font-size:0.72rem; color:#a68b66; font-weight:600; white-space:nowrap; }
  .alp-log-badges { display:flex; flex-direction:column; gap:3px; }
  .alp-cat-badge { padding:1px 7px; border-radius:99px; font-size:0.64rem; font-weight:700; text-transform:uppercase; width:fit-content; }
  .alp-sev-badge { padding:1px 7px; border-radius:99px; font-size:0.64rem; font-weight:700; text-transform:uppercase; width:fit-content; }
  .alp-log-middle { flex:1; min-width:0; }
  .alp-log-action { font-size:0.84rem; font-weight:700; color:#2d241e; margin-bottom:2px; }
  .alp-log-detail { font-size:0.76rem; color:#7d6b5d; margin-bottom:3px; }
  .alp-log-meta { font-size:0.68rem; color:#a68b66; }
  .alp-log-type { font-size:0.68rem; font-weight:700; color:#a68b66; white-space:nowrap; flex-shrink:0; background:#f5ebe0; padding:2px 7px; border-radius:6px; align-self:flex-start; }
  .alp-empty { display:flex; flex-direction:column; align-items:center; gap:8px; padding:4rem 1rem; color:#a68b66; text-align:center; }
  .alp-empty p { margin:0; font-size:0.85rem; }

  .alp-modal-backdrop { position:fixed; inset:0; background:rgba(45, 36, 30,0.5); z-index:1300; backdrop-filter:blur(2px); }
  .alp-confirm-modal { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:1301; width:min(380px,92vw); background:#fff; border-radius:18px; padding:2rem; box-shadow:0 20px 60px rgba(45, 36, 30,0.2); display:flex; flex-direction:column; gap:12px; align-items:center; }
  .alp-cm-title { font-family:'Sora',sans-serif; font-size:1.1rem; font-weight:800; color:#2d241e; margin:0; text-align:center; }
  .alp-cm-sub { font-size:0.82rem; color:#7d6b5d; text-align:center; margin:0; line-height:1.5; }
  .alp-cm-btns { display:flex; gap:10px; width:100%; }
  .alp-cm-btns .alp-btn { flex:1; padding:0.7rem; }

  @media (max-width:768px) {
    .alp-log-item { flex-direction:column; }
    .alp-log-left { flex-direction:row; align-items:center; }
    .alp-log-badges { flex-direction:row; }
  }
  @media (max-width:480px) {
    .alp-date-tabs { display:grid; grid-template-columns:1fr 1fr; }
  }
`;
