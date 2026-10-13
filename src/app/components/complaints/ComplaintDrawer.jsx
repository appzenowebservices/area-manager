import { useState, useEffect } from "react";
import ComplaintSourceBadge   from "./ComplaintSourceBadge";
import ComplaintPriorityBadge from "./ComplaintPriorityBadge";
import ComplaintStatusBadge   from "./ComplaintStatusBadge";

/**
 * ComplaintDrawer
 * File: src/components/complaints/ComplaintDrawer.jsx
 *
 * Right-side drawer with:
 *  - Full complaint detail
 *  - Full interaction timeline
 *  - Status change actions (In Progress / Resolved / Escalated)
 *  - Resolution note input
 *
 * Props:
 *   complaint   object | null
 *   onClose     fn
 *   onUpdate    fn(updatedComplaint)
 */

const TIMELINE_ICONS = {
  created:   { icon: "🆕", color: "#ae2012", bg: "#fdfbf7" },
  assigned:  { icon: "👤", color: "#4a5d23", bg: "#f5ebe0" },
  update:    { icon: "🔄", color: "#a67a22", bg: "#faedcc" },
  resolved:  { icon: "✅", color: "#0a671a", bg: "#d3ebd8" },
  escalated: { icon: "⬆️", color: "#8b150e", bg: "#fbebe9" },
  lost:      { icon: "❌", color: "#8b150e", bg: "#fbebe9" },
};

function TimelineEntry({ entry }) {
  const style = TIMELINE_ICONS[entry.type] || TIMELINE_ICONS.update;
  return (
    <div className="tl-entry">
      <div className="tl-icon-col">
        <span className="tl-icon" style={{ background: style.bg, color: style.color }}>
          {style.icon}
        </span>
        <span className="tl-line" />
      </div>
      <div className="tl-content">
        <div className="tl-action-row">
          <span className="tl-action">{entry.action}</span>
          <span className="tl-by">by {entry.by}</span>
        </div>
        <p className="tl-note">{entry.note}</p>
        <span className="tl-time">{entry.date} · {entry.time}</span>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="cd-section">
      <div className="cd-section-title">{title}</div>
      {children}
    </div>
  );
}

function InfoRow({ label, val }) {
  return (
    <div className="cd-row">
      <span className="cd-row-label">{label}</span>
      <span className="cd-row-val">{val}</span>
    </div>
  );
}

const STATUS_ACTIONS = [
  { status: "In Progress", label: "🔄 Mark In Progress", bg: "#faedcc", color: "#a67a22", border: "#faedcc" },
  { status: "Resolved",    label: "✅ Mark Resolved",    bg: "#d3ebd8", color: "#0a671a", border: "#93d3a0" },
  { status: "Escalated",   label: "⬆️ Escalate to HQ",  bg: "#fbebe9", color: "#8b150e", border: "#fbebe9" },
];

export default function ComplaintDrawer({ complaint: initial, onClose, onUpdate }) {
  const [complaint, setComplaint] = useState(null);
  const [visible,   setVisible]   = useState(false);
  const [note,      setNote]      = useState("");
  const [noteError, setNoteError] = useState("");

  useEffect(() => {
    if (initial) {
      setComplaint(initial);
      setNote("");
      setNoteError("");
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const t = setTimeout(() => setComplaint(null), 300);
      document.body.style.overflow = "";
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ""; };
  }, [initial]);

  if (!complaint) return null;

  const handleStatusChange = (newStatus) => {
    if ((newStatus === "Resolved" || newStatus === "Escalated") && !note.trim()) {
      setNoteError("Please add a resolution note before marking as " + newStatus);
      return;
    }
    setNoteError("");

    const newEntry = {
      id: `TL-NEW-${Date.now()}`,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      action: newStatus === "Resolved" ? "Resolved" : newStatus === "Escalated" ? "Escalated to HQ" : "Status Updated",
      note: note.trim() || `Status changed to ${newStatus}`,
      by: "Area Manager",
      type: newStatus.toLowerCase().replace(" ", "_"),
    };

    const updated = {
      ...complaint,
      status: newStatus,
      updatedDate: newEntry.date,
      resolvedDate: newStatus === "Resolved" ? newEntry.date : complaint.resolvedDate,
      resolutionNote: note.trim(),
      timeline: [...complaint.timeline, newEntry],
    };

    setComplaint(updated);
    setNote("");
    onUpdate?.(updated);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const isActionable = complaint.status !== "Resolved";

  return (
    <>
      <style>{css}</style>

      <div className={`cd-backdrop${visible ? " cd-backdrop-in" : ""}`} onClick={handleClose} />

      <div className={`cd-drawer${visible ? " cd-drawer-in" : ""}`}>

        {/* ── Fixed Header ── */}
        <div className="cd-header">
          <div className="cd-header-left">
            <span className="cd-header-id">{complaint.id}</span>
            <ComplaintStatusBadge status={complaint.status} size="sm" />
            <ComplaintPriorityBadge priority={complaint.priority} size="sm" />
          </div>
          <button className="cd-close" onClick={handleClose}>✕</button>
        </div>

        {/* Subject strip */}
        <div className="cd-subject-strip">
          <p className="cd-subject-text">{complaint.subject}</p>
          <ComplaintSourceBadge source={complaint.source} size="sm" />
        </div>

        {/* ── Scrollable Body ── */}
        <div className="cd-body">

          {/* Details */}
          <Section title="📋 Complaint Details">
            <InfoRow label="Type"        val={complaint.type} />
            <InfoRow label="Source"      val={complaint.source} />
            <InfoRow label="Area"        val={`📍 ${complaint.area}`} />
            <InfoRow label="Reported By" val={complaint.reportedBy.name} />
            <InfoRow label="Phone"       val={`📞 ${complaint.reportedBy.phone}`} />
            <InfoRow label="Reference"   val={complaint.reportedBy.ref} />
            <InfoRow label="Assigned To" val={complaint.assignedTo} />
            <InfoRow label="Created"     val={`${complaint.createdDate} · ${complaint.createdTime}`} />
            {complaint.resolvedDate && (
              <InfoRow label="Resolved" val={complaint.resolvedDate} />
            )}
          </Section>

          {/* Description */}
          <Section title="📝 Description">
            <p className="cd-desc">{complaint.description}</p>
            {complaint.resolutionNote && (
              <div className="cd-resolution-note">
                <span className="cd-rn-label">Resolution Note</span>
                <p>{complaint.resolutionNote}</p>
              </div>
            )}
          </Section>

          {/* Timeline */}
          <Section title={`🕐 Timeline (${complaint.timeline.length} interactions)`}>
            <div className="cd-timeline">
              {complaint.timeline.map((entry, i) => (
                <div key={entry.id} className={`tl-entry${i === complaint.timeline.length - 1 ? " tl-last" : ""}`}>
                  <div className="tl-icon-col">
                    <span className="tl-icon" style={{
                      background: (TIMELINE_ICONS[entry.type] || TIMELINE_ICONS.update).bg,
                      color: (TIMELINE_ICONS[entry.type] || TIMELINE_ICONS.update).color,
                    }}>
                      {(TIMELINE_ICONS[entry.type] || TIMELINE_ICONS.update).icon}
                    </span>
                    {i < complaint.timeline.length - 1 && <span className="tl-line" />}
                  </div>
                  <div className="tl-content">
                    <div className="tl-action-row">
                      <span className="tl-action">{entry.action}</span>
                      <span className="tl-by">by {entry.by}</span>
                    </div>
                    <p className="tl-note">{entry.note}</p>
                    <span className="tl-time">{entry.date} · {entry.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Actions */}
          {isActionable && (
            <Section title="⚡ Update Status">
              <textarea
                className="cd-note-input"
                placeholder="Add a note about this status update (required for Resolved & Escalated)..."
                value={note}
                onChange={e => { setNote(e.target.value); setNoteError(""); }}
                rows={3}
              />
              {noteError && <p className="cd-note-error">{noteError}</p>}

              <div className="cd-actions-grid">
                {STATUS_ACTIONS
                  .filter(a => a.status !== complaint.status)
                  .map(a => (
                    <button
                      key={a.status}
                      className="cd-action-btn"
                      style={{ background: a.bg, color: a.color, borderColor: a.border }}
                      onClick={() => handleStatusChange(a.status)}
                    >
                      {a.label}
                    </button>
                  ))}
              </div>
            </Section>
          )}

          {/* Resolved state message */}
          {!isActionable && (
            <div className="cd-resolved-msg">
              ✅ This complaint has been resolved on {complaint.resolvedDate}.
            </div>
          )}

        </div>
      </div>
    </>
  );
}

const css = `
  .cd-backdrop { position:fixed; inset:0; background:rgba(45, 36, 30,0); z-index:300; transition:background 0.28s ease; pointer-events:none; }
  .cd-backdrop-in { background:rgba(45, 36, 30,0.45); backdrop-filter:blur(2px); pointer-events:all; }

  .cd-drawer {
    position: fixed; top:0; right:0; bottom:0;
    width: min(500px, 100vw); height: 100vh;
    background: #fdfbf7; z-index: 301;
    display: flex; flex-direction: column;
    overflow: hidden;
    box-shadow: -8px 0 40px rgba(45, 36, 30,0.15);
    border-left: 1px solid #e9d8bf;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.32,0.72,0,1);
  }
  .cd-drawer-in { transform: translateX(0); }

  /* Header */
  .cd-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1rem 1.3rem; background: #fff;
    border-bottom: 1px solid #e9d8bf; flex-shrink: 0; gap: 8px;
  }
  .cd-header-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex: 1; min-width: 0; }
  .cd-header-id { font-family:'Sora',sans-serif; font-size:1rem; font-weight:800; color:#ae2012; }
  .cd-close {
    width:32px; height:32px; display:flex; align-items:center; justify-content:center;
    background:#fdfbf7; border:none; border-radius:8px;
    font-size:0.9rem; color:#7d6b5d; cursor:pointer;
    transition:background 0.15s, color 0.15s; flex-shrink:0;
  }
  .cd-close:hover { background:#fbebe9; color:#d32f2f; }

  /* Subject strip */
  .cd-subject-strip {
    display: flex; justify-content: space-between;
    align-items: flex-start; gap: 10px;
    padding: 0.75rem 1.3rem; background: #fff;
    border-bottom: 1px solid #f5ebe0; flex-shrink: 0;
  }
  .cd-subject-text { font-size:0.85rem; font-weight:600; color:#4a3f35; flex:1; line-height:1.4; }

  /* Scrollable body */
  .cd-body {
    flex: 1; min-height: 0;
    overflow-y: auto; overflow-x: hidden;
    padding: 1rem; display: flex;
    flex-direction: column; gap: 10px;
  }
  .cd-body::-webkit-scrollbar { width: 4px; }
  .cd-body::-webkit-scrollbar-track { background: transparent; }
  .cd-body::-webkit-scrollbar-thumb { background: #e9d8bf; border-radius: 99px; }

  /* Section */
  .cd-section {
    background: #fff; border: 1px solid #e9d8bf;
    border-radius: 14px; padding: 1rem 1.1rem;
    box-shadow: 0 1px 3px rgba(45, 36, 30,0.04);
  }
  .cd-section-title {
    font-family:'Sora',sans-serif; font-size:0.82rem; font-weight:700;
    color:#2d241e; padding-bottom:8px; margin-bottom:10px;
    border-bottom:1px solid #f5ebe0;
  }

  /* Info rows */
  .cd-row {
    display:flex; justify-content:space-between;
    align-items:flex-start; gap:8px;
    padding:0.38rem 0; border-bottom:1px solid #fdfbf7; font-size:0.83rem;
  }
  .cd-row:last-child { border-bottom: none; }
  .cd-row-label { font-size:0.68rem; color:#a68b66; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; flex-shrink:0; padding-top:2px; min-width:80px; }
  .cd-row-val { color:#4a3f35; font-weight:500; font-size:0.83rem; text-align:right; word-break:break-word; }

  /* Description */
  .cd-desc { font-size:0.84rem; color:#5d4037; line-height:1.65; }
  .cd-resolution-note {
    margin-top:10px; background:#d3ebd8;
    border:1px solid #93d3a0; border-radius:10px;
    padding:0.6rem 0.9rem; font-size:0.82rem; color:#0a671a; line-height:1.55;
  }
  .cd-rn-label { display:block; font-size:0.62rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px; color:#0c831f; }

  /* Timeline */
  .cd-timeline { display:flex; flex-direction:column; }
  .tl-entry { display:flex; gap:10px; padding-bottom:4px; }
  .tl-last  { padding-bottom:0; }
  .tl-icon-col { display:flex; flex-direction:column; align-items:center; flex-shrink:0; }
  .tl-icon {
    width:30px; height:30px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:0.78rem; flex-shrink:0; z-index:1;
  }
  .tl-line { width:2px; flex:1; background:#f5ebe0; min-height:16px; margin:3px 0; }
  .tl-content { flex:1; padding-bottom:14px; min-width:0; }
  .tl-action-row { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px; margin-bottom:3px; }
  .tl-action { font-size:0.82rem; font-weight:700; color:#2d241e; }
  .tl-by { font-size:0.68rem; color:#a68b66; }
  .tl-note { font-size:0.8rem; color:#5d4037; line-height:1.55; margin-bottom:4px; }
  .tl-time { font-size:0.68rem; color:#a68b66; font-weight:600; }

  /* Action area */
  .cd-note-input {
    width:100%; padding:0.7rem 0.9rem;
    border:1.5px solid #e9d8bf; border-radius:10px;
    font-size:0.84rem; font-family:inherit;
    color:#2d241e; background:#fdfbf7;
    outline:none; resize:vertical;
    transition:border-color 0.2s;
    margin-bottom:8px; box-sizing:border-box;
  }
  .cd-note-input:focus { border-color:#ae2012; box-shadow:0 0 0 3px rgba(12, 131, 31,0.1); }
  .cd-note-error { font-size:0.78rem; color:#d32f2f; margin-bottom:8px; }
  .cd-actions-grid { display:flex; flex-direction:column; gap:7px; }
  .cd-action-btn {
    width:100%; padding:0.65rem;
    border:1.5px solid; border-radius:10px;
    font-size:0.84rem; font-weight:700;
    font-family:inherit; cursor:pointer;
    transition:opacity 0.15s, transform 0.12s;
  }
  .cd-action-btn:hover { opacity:0.85; transform:translateY(-1px); }
  .cd-action-btn:active { transform:translateY(0); }

  /* Resolved message */
  .cd-resolved-msg {
    background:#d3ebd8; border:1px solid #93d3a0;
    border-radius:12px; padding:0.85rem 1rem;
    font-size:0.84rem; color:#0a671a; font-weight:600;
    text-align:center;
  }

  @media (max-width:520px) { .cd-drawer { width:100vw; } }
`;
