import ComplaintSourceBadge   from "./ComplaintSourceBadge";
import ComplaintPriorityBadge from "./ComplaintPriorityBadge";
import ComplaintStatusBadge   from "./ComplaintStatusBadge";

/**
 * ComplaintCard
 * File: src/components/complaints/ComplaintCard.jsx
 *
 * Props: complaint, onView fn(complaint)
 */
export default function ComplaintCard({ complaint: c, onView }) {
  return (
    <>
      <style>{css}</style>
      <div className="cc-card">
        {/* Top row */}
        <div className="cc-top">
          <span className="cc-id">{c.id}</span>
          <ComplaintStatusBadge status={c.status} size="sm" />
        </div>

        {/* Subject */}
        <div className="cc-subject">{c.subject}</div>

        {/* Badges row */}
        <div className="cc-badges">
          <ComplaintSourceBadge source={c.source} size="sm" />
          <ComplaintPriorityBadge priority={c.priority} size="sm" />
        </div>

        <div className="cc-divider" />

        {/* Info grid */}
        <div className="cc-info-grid">
          <div className="cc-info">
            <span className="cc-info-label">Type</span>
            <span className="cc-info-val">{c.type}</span>
          </div>
          <div className="cc-info">
            <span className="cc-info-label">Reported By</span>
            <span className="cc-info-val">{c.reportedBy.name}</span>
          </div>
          <div className="cc-info">
            <span className="cc-info-label">Area</span>
            <span className="cc-info-val">📍 {c.area}</span>
          </div>
          <div className="cc-info">
            <span className="cc-info-label">Date</span>
            <span className="cc-info-val">{c.createdDate}</span>
          </div>
          <div className="cc-info">
            <span className="cc-info-label">Timeline</span>
            <span className="cc-info-val">🕐 {c.timeline.length} updates</span>
          </div>
          <div className="cc-info">
            <span className="cc-info-label">Ref</span>
            <span className="cc-info-val">{c.reportedBy.ref}</span>
          </div>
        </div>

        <button className="cc-btn" onClick={() => onView(c)}>
          View Full Details →
        </button>
      </div>
    </>
  );
}

const css = `
  .cc-card {
    background: #fff; border: 1px solid #e2e8f0;
    border-radius: 14px; padding: 1rem 1.1rem;
    box-shadow: 0 1px 4px rgba(15,23,42,0.04);
    transition: box-shadow 0.18s;
  }
  .cc-card:hover { box-shadow: 0 4px 14px rgba(26,115,232,0.1); }
  .cc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .cc-id { font-family: 'Sora', sans-serif; font-size: 0.82rem; font-weight: 700; color: #1a73e8; }
  .cc-subject { font-size: 0.9rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; line-height: 1.3; }
  .cc-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 4px; }
  .cc-divider { height: 1px; background: #f1f5f9; margin: 10px 0; }
  .cc-info-grid {
    display: grid; grid-template-columns: repeat(3, minmax(0,1fr));
    gap: 8px 10px; margin-bottom: 10px;
  }
  .cc-info { display: flex; flex-direction: column; gap: 2px; }
  .cc-info-label { font-size: 0.62rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
  .cc-info-val { font-size: 0.78rem; color: #334155; font-weight: 600; }
  .cc-btn {
    width: 100%; padding: 0.6rem;
    background: #e8f0fe; color: #1a73e8;
    border: none; border-radius: 9px;
    font-size: 0.83rem; font-weight: 700;
    font-family: inherit; cursor: pointer;
    transition: background 0.15s;
  }
  .cc-btn:hover { background: #d2e3fc; }
  @media (max-width: 360px) {
    .cc-info-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  }
`;
