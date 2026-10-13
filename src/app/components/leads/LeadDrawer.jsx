' use client';
import { useState, useEffect, useRef } from "react";
import LeadStageBadge from "./LeadStageBadge";
import { LEAD_STAGE_CONFIG } from "../../data/leadsData";

/**
 * LeadDrawer — Full detail panel for a lead (vendor or delivery)
 * Props:
 *   lead        object | null
 *   onClose     fn
 *   onUpdate    fn(updatedLead)
 *   onApprove   fn(lead) — called when stage → Approved
 */
export default function LeadDrawer({ lead: initialLead, onClose, onUpdate, onApprove }) {
  const [lead,    setLead]    = useState(null);
  const [visible, setVisible] = useState(false);
  const [note,    setNote]    = useState("");
  const [action,  setAction]  = useState("Called");
  const bodyRef = useRef(null);

  useEffect(() => {
    if (initialLead) {
      setLead(initialLead);
      setNote("");
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const t = setTimeout(() => setLead(null), 300);
      document.body.style.overflow = "";
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ""; };
  }, [initialLead]);

  if (!lead) return null;

  const handleClose = () => { setVisible(false); setTimeout(onClose, 300); };

  const handleStageChange = (newStage) => {
    const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const updated = {
      ...lead,
      stage: newStage,
      lastContactDate: today,
      followUps: [
        ...lead.followUps,
        { date: today, action: newStage, note: `Stage changed to ${newStage}.` }
      ],
    };
    setLead(updated);
    onUpdate?.(updated);
    if (newStage === "Approved") onApprove?.(updated);
  };

  const handleFollowUp = () => {
    if (!note.trim()) return;
    const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const updated = {
      ...lead,
      lastContactDate: today,
      notes: note,
      followUps: [...lead.followUps, { date: today, action, note }],
    };
    setLead(updated);
    onUpdate?.(updated);
    setNote("");
  };

  const handleDocToggle = (doc) => {
    const updated = {
      ...lead,
      documents: { ...lead.documents, [doc]: !lead.documents[doc] },
    };
    setLead(updated);
    onUpdate?.(updated);
  };

  const isVendor   = lead.type === "vendor";
  const docLabels  = isVendor
    ? { aadhaar: "Aadhaar", pan: "PAN", gst: "GST", fssai: "FSSAI" }
    : { aadhaar: "Aadhaar", license: "DL", rc: "RC Book" };
  const docCount   = Object.values(lead.documents).filter(Boolean).length;
  const docTotal   = Object.keys(lead.documents).length;
  const canApprove = lead.stage !== "Approved" && lead.stage !== "Rejected";
  const canReject  = lead.stage !== "Rejected" && lead.stage !== "Approved";

  return (
    <>
      <style>{css}</style>
      <div className={`ld-backdrop${visible ? " ld-backdrop-in" : ""}`} onClick={handleClose} />

      <div className={`ld-drawer${visible ? " ld-drawer-in" : ""}`}>

        {/* Header */}
        <div className="ld-dh">
          <div className="ld-dh-left">
            <div className="ld-avatar" style={{ background: isVendor ? "linear-gradient(135deg,#ae2012,#2d241e)" : "linear-gradient(135deg,#0c831f,#0a671a)" }}>
              {lead.name.charAt(0)}
            </div>
            <div>
              <div className="ld-dh-name">{lead.name}</div>
              <div className="ld-dh-meta">{lead.id} &nbsp;·&nbsp; {isVendor ? lead.category : lead.vehicle}</div>
            </div>
          </div>
          <button className="ld-close-btn" onClick={handleClose}>✕</button>
        </div>
        <div className="ld-dh-sub">
          <LeadStageBadge stage={lead.stage} size="sm" />
          <span className="ld-applied">Applied: {lead.appliedDate}</span>
          {lead.lastContactDate && <span className="ld-contacted">Last contact: {lead.lastContactDate}</span>}
        </div>

        {/* Body */}
        <div className="ld-body" ref={bodyRef}>

          {/* Pipeline progress */}
          <div className="ld-pipeline">
            {["New","Contacted","Docs Pending","Approved"].map((s, i) => {
              const stages = ["New","Contacted","Docs Pending","Approved","Rejected"];
              const currentIdx = stages.indexOf(lead.stage);
              const stepIdx = stages.indexOf(s);
              const done    = lead.stage === "Approved" || currentIdx > stepIdx;
              const active  = currentIdx === stepIdx && lead.stage !== "Rejected";
              return (
                <div key={s} className="ld-pipe-step">
                  <div className={`ld-pipe-dot ${done || active ? "ld-pipe-active" : ""}`}
                    style={done || active ? { background: LEAD_STAGE_CONFIG[s]?.dot || "#ae2012" } : {}}>
                    {done && lead.stage !== s ? "✓" : i + 1}
                  </div>
                  <div className={`ld-pipe-label ${active ? "ld-pipe-label-active" : ""}`}>{s}</div>
                  {i < 3 && <div className={`ld-pipe-line ${done ? "ld-pipe-line-done" : ""}`} />}
                </div>
              );
            })}
          </div>

          {/* Applicant Info */}
          <Section title={isVendor ? "🏪 Applicant Details" : "🚴 Applicant Details"}>
            <Row label="Name"       val={lead.name} />
            <Row label="Phone"      val={`📞 ${lead.phone}`} />
            {lead.altPhone && <Row label="Alt Phone"  val={`📞 ${lead.altPhone}`} />}
            {lead.email    && <Row label="Email"      val={`✉️ ${lead.email}`} />}
            <Row label="Area"       val={`📍 ${lead.area}`} />
            <Row label="Address"    val={lead.address} full />
            {isVendor ? (
              <>
                <Row label="Category"   val={lead.category} />
                <Row label="Experience" val={lead.experience} />
                <Row label="Commission" val={`${lead.commission}%`} />
              </>
            ) : (
              <>
                <Row label="Vehicle"    val={lead.vehicle} />
                <Row label="Age"        val={`${lead.age} years`} />
                <Row label="Experience" val={lead.experience} />
                {lead.licenseNo && <Row label="License No" val={lead.licenseNo} />}
              </>
            )}
          </Section>

          {/* Documents */}
          <Section title={`📄 Documents (${docCount}/${docTotal})`}>
            <div className="ld-docs-grid">
              {Object.entries(lead.documents).map(([doc, ok]) => (
                <button
                  key={doc}
                  className={`ld-doc-chip ${ok ? "ld-doc-ok" : "ld-doc-missing"}`}
                  onClick={() => handleDocToggle(doc)}
                  title={`Click to toggle ${docLabels[doc]}`}
                >
                  {ok ? "✓" : "✗"} {docLabels[doc]}
                </button>
              ))}
            </div>
            <p className="ld-doc-hint">Click to mark document as received</p>
          </Section>

          {/* Follow-up log */}
          <Section title="📋 Follow-up Log">
            {lead.followUps.length === 0 ? (
              <p className="ld-no-followup">No follow-ups yet.</p>
            ) : (
              <div className="ld-timeline">
                {[...lead.followUps].reverse().map((f, i) => (
                  <div key={i} className="ld-timeline-item">
                    <div className="ld-tl-dot" />
                    <div className="ld-tl-body">
                      <div className="ld-tl-top">
                        <span className="ld-tl-action">{f.action}</span>
                        <span className="ld-tl-date">{f.date}</span>
                      </div>
                      <div className="ld-tl-note">{f.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add follow-up */}
            {canApprove && (
              <div className="ld-followup-form">
                <div className="ld-fu-row">
                  <select className="ld-fu-select" value={action} onChange={e => setAction(e.target.value)}>
                    {["Called","Visited","WhatsApp","Email","Meeting"].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <textarea
                  className="ld-fu-input"
                  placeholder="Add a note about this follow-up..."
                  rows={2}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
                <button className="ld-fu-btn" onClick={handleFollowUp} disabled={!note.trim()}>
                  + Log Follow-up
                </button>
              </div>
            )}
          </Section>

          {/* Stage Actions */}
          {canApprove && (
            <Section title="🔄 Move Stage">
              <div className="ld-stage-grid">
                {["New","Contacted","Docs Pending"].map(s => (
                  <button
                    key={s}
                    className={`ld-stage-btn${lead.stage === s ? " ld-stage-active" : ""}`}
                    style={lead.stage === s ? { background: LEAD_STAGE_CONFIG[s].bg, color: LEAD_STAGE_CONFIG[s].color, borderColor: LEAD_STAGE_CONFIG[s].dot } : {}}
                    onClick={() => lead.stage !== s && handleStageChange(s)}
                  >
                    {stageEmoji(s)} {s}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {/* Approve / Reject */}
          {(canApprove || canReject) && (
            <div className="ld-final-actions">
              {canApprove && (
                <button className="ld-approve-btn" onClick={() => handleStageChange("Approved")}>
                  ✅ Approve & Onboard
                </button>
              )}
              {canReject && (
                <button className="ld-reject-btn" onClick={() => handleStageChange("Rejected")}>
                  ❌ Reject Application
                </button>
              )}
            </div>
          )}

          {/* Approved / Rejected banner */}
          {lead.stage === "Approved" && (
            <div className="ld-banner ld-banner-green">✅ Approved & added to {isVendor ? "Vendors" : "Delivery"} list!</div>
          )}
          {lead.stage === "Rejected" && (
            <div className="ld-banner ld-banner-red">❌ Application rejected.</div>
          )}

        </div>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="ld-section">
      <div className="ld-section-title">{title}</div>
      {children}
    </div>
  );
}
function Row({ label, val, full }) {
  return (
    <div className={`ld-row${full ? " ld-row-full" : ""}`}>
      <span className="ld-row-label">{label}</span>
      <span className="ld-row-val">{val}</span>
    </div>
  );
}
function stageEmoji(s) {
  return { New: "🆕", Contacted: "📞", "Docs Pending": "📄", Approved: "✅", Rejected: "❌" }[s] || "";
}

const css = `
  .ld-backdrop { position:fixed; inset:0; background:rgba(45, 36, 30,0); z-index:1200; transition:background 0.28s ease; pointer-events:none; }
  .ld-backdrop-in { background:rgba(45, 36, 30,0.45); backdrop-filter:blur(2px); pointer-events:all; }
  .ld-drawer { position:fixed; top:0; right:0; width:min(500px,100vw); background:#fdfbf7; z-index:1201; display:flex; flex-direction:column; height:100dvh; max-height:100dvh; overflow:hidden; box-shadow:-8px 0 40px rgba(45, 36, 30,0.15); transform:translateX(100%); transition:transform 0.3s cubic-bezier(0.32,0.72,0,1); border-left:1px solid #e9d8bf; }
  .ld-drawer-in { transform:translateX(0); }

  .ld-dh { display:flex; justify-content:space-between; align-items:center; padding:1rem 1.3rem 0.6rem; background:#fff; border-bottom:1px solid #e9d8bf; flex-shrink:0; }
  .ld-dh-left { display:flex; align-items:center; gap:10px; min-width:0; }
  .ld-avatar { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1rem; font-weight:800; font-family:'Sora',sans-serif; flex-shrink:0; }
  .ld-dh-name { font-family:'Sora',sans-serif; font-size:0.98rem; font-weight:800; color:#2d241e; }
  .ld-dh-meta { font-size:0.72rem; color:#a68b66; margin-top:1px; }
  .ld-dh-sub { padding:0.4rem 1.3rem 0.7rem; background:#fff; border-bottom:1px solid #f5ebe0; flex-shrink:0; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .ld-applied { font-size:0.72rem; color:#a68b66; }
  .ld-contacted { font-size:0.72rem; color:#4a5d23; font-weight:600; }
  .ld-close-btn { width:32px; height:32px; display:flex; align-items:center; justify-content:center; background:#fdfbf7; border:none; border-radius:8px; font-size:0.9rem; color:#7d6b5d; cursor:pointer; flex-shrink:0; }
  .ld-close-btn:hover { background:#fbebe9; color:#d32f2f; }

  .ld-body { flex:1 1 0; min-height:0; overflow-y:auto; overflow-x:hidden; padding:1rem; display:flex; flex-direction:column; gap:10px; }
  .ld-body::-webkit-scrollbar { width:4px; }
  .ld-body::-webkit-scrollbar-thumb { background:#e9d8bf; border-radius:99px; }

  /* Pipeline */
  .ld-pipeline { background:#fff; border:1px solid #e9d8bf; border-radius:14px; padding:1rem 1.1rem; display:flex; align-items:flex-start; justify-content:space-between; position:relative; }
  .ld-pipe-step { display:flex; flex-direction:column; align-items:center; gap:5px; position:relative; flex:1; }
  .ld-pipe-dot { width:28px; height:28px; border-radius:50%; background:#e9d8bf; color:#a68b66; display:flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:800; z-index:1; transition:background 0.2s; }
  .ld-pipe-active { color:#fff; }
  .ld-pipe-label { font-size:0.62rem; font-weight:600; color:#a68b66; text-align:center; line-height:1.3; }
  .ld-pipe-label-active { color:#2d241e; font-weight:700; }
  .ld-pipe-line { position:absolute; top:14px; left:50%; width:100%; height:2px; background:#e9d8bf; z-index:0; }
  .ld-pipe-line-done { background:#ae2012; }

  .ld-section { background:#fff; border-radius:14px; border:1px solid #e9d8bf; padding:1rem 1.1rem; }
  .ld-section-title { font-family:'Sora',sans-serif; font-size:0.82rem; font-weight:700; color:#2d241e; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #f5ebe0; }
  .ld-row { display:flex; justify-content:space-between; align-items:flex-start; gap:8px; padding:0.38rem 0; border-bottom:1px solid #fdfbf7; font-size:0.83rem; }
  .ld-row:last-of-type { border-bottom:none; }
  .ld-row-full { flex-direction:column; gap:2px; }
  .ld-row-label { font-size:0.68rem; color:#a68b66; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; flex-shrink:0; padding-top:2px; }
  .ld-row-val { color:#4a3f35; font-weight:500; text-align:right; font-size:0.83rem; }
  .ld-row-full .ld-row-val { text-align:left; font-size:0.8rem; color:#7d6b5d; }

  /* Docs */
  .ld-docs-grid { display:grid; grid-template-columns:1fr 1fr; gap:7px; margin-bottom:6px; }
  .ld-doc-chip { padding:0.5rem 0.8rem; border-radius:9px; font-size:0.78rem; font-weight:700; text-align:center; cursor:pointer; border:none; transition:opacity 0.15s; }
  .ld-doc-chip:hover { opacity:0.8; }
  .ld-doc-ok { background:#d3ebd8; color:#0a671a; }
  .ld-doc-missing { background:#fbebe9; color:#8b150e; }
  .ld-doc-hint { font-size:0.68rem; color:#a68b66; margin-top:4px; font-style:italic; }

  /* Timeline */
  .ld-timeline { display:flex; flex-direction:column; gap:0; margin-bottom:12px; }
  .ld-timeline-item { display:flex; gap:10px; padding:8px 0; border-bottom:1px solid #fdfbf7; }
  .ld-timeline-item:last-child { border-bottom:none; }
  .ld-tl-dot { width:8px; height:8px; border-radius:50%; background:#ae2012; flex-shrink:0; margin-top:5px; }
  .ld-tl-body { flex:1; }
  .ld-tl-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:2px; }
  .ld-tl-action { font-size:0.76rem; font-weight:700; color:#2d241e; background:#fdfbf7; padding:1px 8px; border-radius:99px; }
  .ld-tl-date { font-size:0.68rem; color:#a68b66; }
  .ld-tl-note { font-size:0.78rem; color:#4a3f35; line-height:1.4; }
  .ld-no-followup { font-size:0.8rem; color:#a68b66; font-style:italic; margin-bottom:8px; }

  /* Follow-up form */
  .ld-followup-form { background:#fdfbf7; border:1px solid #e9d8bf; border-radius:10px; padding:0.75rem; display:flex; flex-direction:column; gap:7px; margin-top:8px; }
  .ld-fu-row { display:flex; gap:8px; }
  .ld-fu-select { flex:1; height:36px; padding:0 0.65rem; border:1.5px solid #e9d8bf; border-radius:8px; background:#fff; font-size:0.82rem; font-family:inherit; color:#4a3f35; outline:none; }
  .ld-fu-input { border:1.5px solid #e9d8bf; border-radius:8px; padding:0.5rem 0.7rem; font-size:0.82rem; font-family:inherit; color:#2d241e; outline:none; resize:none; }
  .ld-fu-input:focus { border-color:#ae2012; }
  .ld-fu-btn { padding:0.5rem; background:#ae2012; color:#fff; border:none; border-radius:8px; font-size:0.8rem; font-weight:700; font-family:inherit; cursor:pointer; transition:background 0.15s; }
  .ld-fu-btn:disabled { background:#eaf6ed; cursor:not-allowed; }
  .ld-fu-btn:hover:not(:disabled) { background:#8b150e; }

  /* Stage grid */
  .ld-stage-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:7px; }
  .ld-stage-btn { padding:0.5rem; border:1.5px solid #e9d8bf; border-radius:9px; background:#fff; color:#7d6b5d; font-size:0.74rem; font-weight:600; font-family:inherit; cursor:pointer; transition:all 0.15s; }
  .ld-stage-btn:hover { background:#fdfbf7; border-color:#e9d8bf; }

  /* Final actions */
  .ld-final-actions { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .ld-approve-btn { padding:0.7rem; background:#d3ebd8; color:#0a671a; border:none; border-radius:10px; font-size:0.85rem; font-weight:700; font-family:inherit; cursor:pointer; transition:opacity 0.15s; }
  .ld-approve-btn:hover { opacity:0.85; }
  .ld-reject-btn { padding:0.7rem; background:#fbebe9; color:#8b150e; border:none; border-radius:10px; font-size:0.85rem; font-weight:700; font-family:inherit; cursor:pointer; transition:opacity 0.15s; }
  .ld-reject-btn:hover { opacity:0.85; }

  /* Banners */
  .ld-banner { padding:0.85rem 1rem; border-radius:12px; font-size:0.88rem; font-weight:700; text-align:center; }
  .ld-banner-green { background:#d3ebd8; color:#0a671a; }
  .ld-banner-red   { background:#fbebe9; color:#8b150e; }

  @media (max-width:520px) { .ld-drawer { width:100vw; } }
`;
