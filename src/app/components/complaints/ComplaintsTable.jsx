import ComplaintSourceBadge   from "./ComplaintSourceBadge";
import ComplaintPriorityBadge from "./ComplaintPriorityBadge";
import ComplaintStatusBadge   from "./ComplaintStatusBadge";

/**
 * ComplaintsTable
 * File: src/components/complaints/ComplaintsTable.jsx
 *
 * Props: complaints[], onView fn(complaint)
 */
export default function ComplaintsTable({ complaints, onView }) {
  return (
    <>
      <style>{css}</style>
      <div className="cmt-wrap">
        <table className="cmt-table">
          <thead>
            <tr>
              {["ID", "Source", "Type", "Subject", "Reported By",
                "Area", "Priority", "Status", "Date", "Timeline", "Action"
              ].map(h => <th key={h} className="cmt-th">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={11} className="cmt-empty">
                  <span style={{ fontSize: "2rem" }}>✅</span>
                  <p>No complaints found</p>
                </td>
              </tr>
            ) : (
              complaints.map(c => (
                <tr key={c.id} className="cmt-tr">
                  <td className="cmt-td">
                    <span className="cmt-id">{c.id}</span>
                  </td>
                  <td className="cmt-td">
                    <ComplaintSourceBadge source={c.source} size="sm" />
                  </td>
                  <td className="cmt-td">
                    <span className="cmt-type">{c.type}</span>
                  </td>
                  <td className="cmt-td">
                    <div className="cmt-subject">{c.subject}</div>
                  </td>
                  <td className="cmt-td">
                    <div className="cmt-reporter">{c.reportedBy.name}</div>
                    <div className="cmt-ref">{c.reportedBy.ref}</div>
                  </td>
                  <td className="cmt-td">
                    <span className="cmt-area">📍 {c.area}</span>
                  </td>
                  <td className="cmt-td">
                    <ComplaintPriorityBadge priority={c.priority} size="sm" />
                  </td>
                  <td className="cmt-td">
                    <ComplaintStatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="cmt-td">
                    <div className="cmt-date">{c.createdDate}</div>
                    <div className="cmt-time">{c.createdTime}</div>
                  </td>
                  <td className="cmt-td">
                    <span className="cmt-tl-count">🕐 {c.timeline.length}</span>
                  </td>
                  <td className="cmt-td">
                    <button className="cmt-btn" onClick={() => onView(c)}>
                      👁 View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

const css = `
  .cmt-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid #e2e8f0; }
  .cmt-table { width: 100%; border-collapse: collapse; font-size: 0.83rem; min-width: 1050px; }
  .cmt-th {
    text-align: left; padding: 0.65rem 0.9rem;
    background: #f8faff; color: #94a3b8;
    font-size: 0.68rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.06em;
    border-bottom: 1px solid #e2e8f0; white-space: nowrap;
  }
  .cmt-tr { transition: background 0.12s; }
  .cmt-tr:hover .cmt-td { background: #f8faff; }
  .cmt-td {
    padding: 0.75rem 0.9rem;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle; white-space: nowrap;
    background: #fff; transition: background 0.12s;
  }
  .cmt-tr:last-child .cmt-td { border-bottom: none; }

  .cmt-id { font-family: 'Sora', sans-serif; font-weight: 700; color: #1a73e8; font-size: 0.82rem; }
  .cmt-type { font-size: 0.78rem; color: #475569; font-weight: 600; }
  .cmt-subject { font-size: 0.82rem; font-weight: 600; color: #1e293b; max-width: 200px; overflow: hidden; text-overflow: ellipsis; }
  .cmt-reporter { font-size: 0.82rem; font-weight: 600; color: #334155; }
  .cmt-ref { font-size: 0.68rem; color: #94a3b8; margin-top: 1px; }
  .cmt-area { font-size: 0.78rem; color: #475569; }
  .cmt-date { font-size: 0.78rem; font-weight: 600; color: #334155; }
  .cmt-time { font-size: 0.68rem; color: #94a3b8; margin-top: 1px; }
  .cmt-tl-count { font-size: 0.75rem; color: #64748b; }
  .cmt-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 0.35rem 0.85rem;
    background: #e8f0fe; color: #1a73e8;
    border: none; border-radius: 8px;
    font-size: 0.78rem; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: background 0.15s; white-space: nowrap;
  }
  .cmt-btn:hover { background: #d2e3fc; }
  .cmt-empty { text-align: center; padding: 3.5rem 1rem; color: #94a3b8; }
  .cmt-empty p { margin-top: 8px; font-size: 0.88rem; }
`;
