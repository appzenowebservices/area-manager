import { useState, useMemo } from "react";
import PageWrapper           from "../../components/layout/PageWrapper";
import ComplaintsStatsBar    from "../../components/complaints/ComplaintsStatsBar";
import ComplaintsFilters     from "../../components/complaints/ComplaintsFilters";
import ComplaintsTable       from "../../components/complaints/ComplaintsTable";
import ComplaintCard         from "../../components/complaints/ComplaintCard";
import ComplaintDrawer       from "../../components/complaints/ComplaintDrawer";
import { COMPLAINTS }        from "../../data/complaintsData";

/**
 * ComplaintsPage
 * File: src/pages/complaints/ComplaintsPage.jsx
 *
 * Desktop: table view
 * Mobile:  card list
 * Click → right-side ComplaintDrawer with full timeline + actions
 */
export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState(COMPLAINTS);
  const [search,     setSearch]     = useState("");
  const [source,     setSource]     = useState("All");
  const [priority,   setPriority]   = useState("All");
  const [status,     setStatus]     = useState("All");
  const [selected,   setSelected]   = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return complaints.filter(c => {
      const matchSearch =
        !search ||
        c.id.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.reportedBy.name.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q);
      const matchSource   = source   === "All" || c.source   === source;
      const matchPriority = priority === "All" || c.priority === priority;
      const matchStatus   = status   === "All" || c.status   === status;
      return matchSearch && matchSource && matchPriority && matchStatus;
    });
  }, [search, source, priority, status, complaints]);

  const handleReset = () => {
    setSearch(""); setSource("All"); setPriority("All"); setStatus("All");
  };

  const handleUpdate = (updated) => {
    setComplaints(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelected(updated);
  };

  return (
    <PageWrapper>
      <style>{css}</style>

      {/* Header */}
      <div className="cp-header">
        <div>
          <h1 className="cp-title">Complaints</h1>
          <p className="cp-sub">Manage and resolve all complaints from customers, vendors and delivery partners</p>
        </div>
      </div>

      {/* Stats */}
      <ComplaintsStatsBar />

      {/* Filters */}
      <ComplaintsFilters
        search={search}     onSearch={setSearch}
        source={source}     onSource={setSource}
        priority={priority} onPriority={setPriority}
        status={status}     onStatus={setStatus}
        total={filtered.length}
        onReset={handleReset}
      />

      {/* Desktop table */}
      <div className="cp-desktop">
        <ComplaintsTable complaints={filtered} onView={setSelected} />
      </div>

      {/* Mobile cards */}
      <div className="cp-mobile">
        {filtered.length === 0 ? (
          <div className="cp-empty">
            <span style={{ fontSize: "2.5rem" }}>✅</span>
            <p>No complaints found</p>
          </div>
        ) : (
          <div className="cp-card-list">
            {filtered.map(c => (
              <ComplaintCard key={c.id} complaint={c} onView={setSelected} />
            ))}
          </div>
        )}
      </div>

      {/* Drawer */}
      <ComplaintDrawer
        complaint={selected}
        onClose={() => setSelected(null)}
        onUpdate={handleUpdate}
      />
    </PageWrapper>
  );
}

const css = `
  .cp-header {
    display: flex; justify-content: space-between;
    align-items: flex-start; margin-bottom: 1.2rem;
    flex-wrap: wrap; gap: 10px;
  }
  .cp-title {
    font-family: 'Sora', sans-serif;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    font-weight: 800; color: #2d241e;
    letter-spacing: -0.02em; margin: 0;
  }
  .cp-sub { font-size: 0.82rem; color: #a68b66; margin-top: 3px; }
  .cp-desktop { display: block; }
  .cp-mobile  { display: none; }
  .cp-card-list { display: flex; flex-direction: column; gap: 10px; }
  .cp-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 10px; padding: 4rem 1rem;
    color: #a68b66; font-size: 0.88rem;
  }
  @media (max-width: 768px) {
    .cp-desktop { display: none; }
    .cp-mobile  { display: block; }
  }
`;
