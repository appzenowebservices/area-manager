// src/components/auth/SessionGuard.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import {
  startSessionTimer, getRemainingTime, isSessionExpired,
  scheduleDailyReport, buildDailyDigest, formatDigestEmail,
} from "../../store/sessionStore";
import { ActivityLog } from "../../store/activityStore";

/**
 * SessionGuard
 * Wrap inside ProtectedRoute.
 * - Monitors inactivity → shows lock screen after 1 hour
 * - Schedules 10 PM daily digest
 * - Shows countdown in header (last 5 min warning)
 */
export default function SessionGuard({ children }) {
  const { user, logout } = useAuthStore();
  const navigate         = useNavigate();
  const [locked,        setLocked]        = useState(false);
  const [pinInput,      setPinInput]      = useState("");
  const [pinError,      setPinError]      = useState("");
  const [timeLeft,      setTimeLeft]      = useState(null);
  const [digestNotif,   setDigestNotif]   = useState(null);
  const [showDigest,    setShowDigest]    = useState(false);
  const [digestData,    setDigestData]    = useState(null);

  // Check session on mount
  useEffect(() => {
    if (isSessionExpired()) {
      setLocked(true);
    }
  }, []);

  // Start inactivity timer
  useEffect(() => {
    if (locked) return;
    const cleanup = startSessionTimer(() => setLocked(true));
    return cleanup;
  }, [locked]);

  // Countdown ticker (show last 5 min)
  useEffect(() => {
    if (locked) return;
    const tick = setInterval(() => {
      const rem = getRemainingTime();
      setTimeLeft(rem < 5 * 60 * 1000 ? rem : null);
    }, 10000);
    return () => clearInterval(tick);
  }, [locked]);

  // Schedule 10 PM daily report
  useEffect(() => {
    const cleanup = scheduleDailyReport((digest) => {
      setDigestData(digest);
      setDigestNotif(true);
      // Backend hook: sendEmail(adminEmail, formatDigestEmail(digest))
      console.log("📧 Daily Digest Ready:\n", formatDigestEmail(digest));
    });
    return cleanup;
  }, []);

  const handleUnlock = () => {
    // PIN = last 4 digits of phone or "1234" default
    const correctPin = user?.pin || "1234";
    if (pinInput === correctPin) {
      setLocked(false);
      setPinInput("");
      setPinError("");
      ActivityLog.login(user?.name || "Area Manager");
    } else {
      setPinError("Wrong PIN. Try again.");
      setPinInput("");
    }
  };

  const handleLogout = () => {
    ActivityLog.logout(user?.name || "Area Manager", "From lock screen");
    logout();
    navigate("/login");
  };

  const fmtTime = (ms) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <style>{css}</style>

      {/* ── Lock Screen ── */}
      {locked && (
        <div className="sg-lock-screen">
          <div className="sg-lock-card">
            <div className="sg-lock-icon">🔒</div>
            <h2 className="sg-lock-title">Session Locked</h2>
            <p className="sg-lock-sub">
              Your session was locked due to 1 hour of inactivity.
            </p>
            <div className="sg-lock-user">
              <div className="sg-lu-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <span className="sg-lu-name">{user?.name || "Area Manager"}</span>
            </div>

            <div className="sg-pin-wrap">
              <label className="sg-pin-label">Enter PIN to unlock</label>
              <input
                className={`sg-pin-input ${pinError ? "sg-pin-err" : ""}`}
                type="password"
                maxLength={4}
                placeholder="• • • •"
                value={pinInput}
                onChange={e => { setPinInput(e.target.value); setPinError(""); }}
                onKeyDown={e => e.key === "Enter" && handleUnlock()}
                autoFocus
              />
              {pinError && <p className="sg-pin-error">{pinError}</p>}
            </div>

            <button className="sg-unlock-btn" onClick={handleUnlock} disabled={pinInput.length < 4}>
              🔓 Unlock
            </button>
            <button className="sg-logout-link" onClick={handleLogout}>
              Not you? Sign out
            </button>
          </div>
        </div>
      )}

      {/* ── Session Warning Banner (last 5 min) ── */}
      {!locked && timeLeft !== null && (
        <div className="sg-warning-bar">
          ⏰ Session expires in <strong>{fmtTime(timeLeft)}</strong> — move your mouse to reset
        </div>
      )}

      {/* ── Daily Digest Notification ── */}
      {digestNotif && !showDigest && (
        <div className="sg-digest-notif" onClick={() => { setShowDigest(true); setDigestNotif(false); }}>
          <span className="sg-dn-icon">📧</span>
          <div>
            <div className="sg-dn-title">Daily Report Ready — 10:00 PM</div>
            <div className="sg-dn-sub">Click to view today's activity digest</div>
          </div>
          <button className="sg-dn-close" onClick={e => { e.stopPropagation(); setDigestNotif(false); }}>✕</button>
        </div>
      )}

      {/* ── Daily Digest Modal ── */}
      {showDigest && digestData && (
        <>
          <div className="sg-digest-backdrop" onClick={() => setShowDigest(false)} />
          <div className="sg-digest-modal">
            <div className="sg-dm-header">
              <h3 className="sg-dm-title">📊 Daily Activity Digest — {digestData.date}</h3>
              <button className="sg-dm-close" onClick={() => setShowDigest(false)}>✕</button>
            </div>
            <div className="sg-dm-body">
              <div className="sg-dm-summary">
                <div className="sg-dm-stat"><span className="sg-dm-num">{digestData.totalActions}</span><span className="sg-dm-label">Total Actions</span></div>
                <div className="sg-dm-stat"><span className="sg-dm-num" style={{ color:"#ef4444" }}>{digestData.criticalEvents.length}</span><span className="sg-dm-label">Warnings</span></div>
                <div className="sg-dm-stat"><span className="sg-dm-num" style={{ color:"#10b981" }}>{digestData.orderActions.length}</span><span className="sg-dm-label">Order Actions</span></div>
                <div className="sg-dm-stat"><span className="sg-dm-num" style={{ color:"#7c3aed" }}>{digestData.vendorActions.length}</span><span className="sg-dm-label">Vendor Actions</span></div>
              </div>

              {digestData.criticalEvents.length > 0 && (
                <div className="sg-dm-section">
                  <div className="sg-dm-sec-title">⚠️ Warnings & Critical Events</div>
                  {digestData.criticalEvents.map((l, i) => (
                    <div key={i} className="sg-dm-log-item sg-dm-warn">
                      <span className="sg-dm-time">{new Date(l.timestamp).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" })}</span>
                      <span className="sg-dm-action">{l.action}</span>
                      <span className="sg-dm-detail">{l.detail}</span>
                    </div>
                  ))}
                </div>
              )}

              {digestData.allLogs.slice(0, 15).map((l, i) => (
                <div key={i} className="sg-dm-log-item">
                  <span className="sg-dm-time">{new Date(l.timestamp).toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" })}</span>
                  <span className={`sg-dm-cat sg-cat-${l.category}`}>{l.category}</span>
                  <span className="sg-dm-action">{l.action}</span>
                  <span className="sg-dm-detail">{l.detail}</span>
                </div>
              ))}
            </div>
            <div className="sg-dm-footer">
              <span className="sg-dm-note">📧 Auto-sent to admin@company.com at 10:00 PM</span>
              <button className="sg-dm-copy" onClick={() => {
                navigator.clipboard.writeText(formatDigestEmail(digestData));
              }}>📋 Copy Email Text</button>
            </div>
          </div>
        </>
      )}

      {/* ── Main App Content ── */}
      {!locked && children}
    </>
  );
}

const css = `
  /* Lock Screen */
  .sg-lock-screen {
    position: fixed; inset: 0; z-index: 9999;
    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(10px);
  }
  .sg-lock-card {
    background: #fff; border-radius: 24px;
    padding: 2.5rem 2rem; width: min(380px, 92vw);
    display: flex; flex-direction: column; align-items: center; gap: 16px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.4);
    animation: lockIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes lockIn {
    from { transform: scale(0.8) translateY(40px); opacity: 0; }
    to   { transform: scale(1) translateY(0); opacity: 1; }
  }
  .sg-lock-icon { font-size: 3rem; line-height: 1; }
  .sg-lock-title { font-family:'Sora',sans-serif; font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 0; }
  .sg-lock-sub { font-size: 0.82rem; color: #94a3b8; text-align: center; margin: 0; line-height: 1.5; }
  .sg-lock-user { display:flex; align-items:center; gap:10px; background:#f8faff; border:1px solid #e2e8f0; border-radius:12px; padding:0.6rem 1rem; width:100%; box-sizing:border-box; }
  .sg-lu-avatar { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,#1a73e8,#0d47a1); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.9rem; flex-shrink:0; }
  .sg-lu-name { font-weight:600; color:#0f172a; font-size:0.88rem; }
  .sg-pin-wrap { width:100%; display:flex; flex-direction:column; gap:7px; }
  .sg-pin-label { font-size:0.72rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.05em; }
  .sg-pin-input { width:100%; box-sizing:border-box; height:52px; border:2px solid #e2e8f0; border-radius:12px; text-align:center; font-size:1.5rem; letter-spacing:0.5rem; font-family:'Sora',sans-serif; outline:none; transition:border-color 0.2s; color:#0f172a; background:#f8faff; }
  .sg-pin-input:focus { border-color:#1a73e8; background:#fff; }
  .sg-pin-err { border-color:#ef4444 !important; }
  .sg-pin-error { font-size:0.75rem; color:#ef4444; font-weight:600; text-align:center; margin:0; }
  .sg-unlock-btn { width:100%; padding:0.85rem; background:#1a73e8; color:#fff; border:none; border-radius:12px; font-size:0.95rem; font-weight:700; font-family:inherit; cursor:pointer; transition:background 0.15s; box-shadow:0 4px 14px rgba(26,115,232,0.4); }
  .sg-unlock-btn:disabled { background:#c5d8fd; cursor:not-allowed; box-shadow:none; }
  .sg-unlock-btn:hover:not(:disabled) { background:#1557b0; }
  .sg-logout-link { background:none; border:none; color:#94a3b8; font-size:0.8rem; cursor:pointer; font-family:inherit; text-decoration:underline; }

  /* Warning bar */
  .sg-warning-bar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 8000;
    background: #f59e0b; color: #fff; text-align: center;
    padding: 0.5rem 1rem; font-size: 0.82rem; font-weight: 600;
    animation: slideDown 0.3s ease;
  }
  @keyframes slideDown { from { transform:translateY(-100%); } to { transform:translateY(0); } }

  /* Digest notification */
  .sg-digest-notif {
    position: fixed; bottom: 24px; right: 24px; z-index: 7000;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 16px;
    padding: 1rem 1.1rem; display: flex; align-items: center; gap: 12px;
    box-shadow: 0 8px 30px rgba(15,23,42,0.15); cursor: pointer;
    max-width: 320px;
    animation: slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes slideUp { from { transform:translateY(80px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  .sg-dn-icon { font-size: 1.5rem; flex-shrink:0; }
  .sg-dn-title { font-weight:700; color:#0f172a; font-size:0.85rem; }
  .sg-dn-sub { font-size:0.72rem; color:#94a3b8; margin-top:2px; }
  .sg-dn-close { background:none; border:none; color:#94a3b8; cursor:pointer; font-size:1rem; flex-shrink:0; padding:0; }

  /* Digest Modal */
  .sg-digest-backdrop { position:fixed; inset:0; background:rgba(15,23,42,0.5); z-index:7100; backdrop-filter:blur(2px); }
  .sg-digest-modal {
    position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
    z-index:7101; width:min(640px,95vw); max-height:85vh;
    background:#fff; border-radius:20px;
    box-shadow:0 20px 60px rgba(15,23,42,0.25);
    display:flex; flex-direction:column;
    animation:wmIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes wmIn { from{transform:translate(-50%,-48%) scale(0.93);opacity:0;} to{transform:translate(-50%,-50%) scale(1);opacity:1;} }
  .sg-dm-header { display:flex; justify-content:space-between; align-items:center; padding:1.2rem 1.4rem; border-bottom:1px solid #f1f5f9; flex-shrink:0; }
  .sg-dm-title { font-family:'Sora',sans-serif; font-size:0.95rem; font-weight:700; color:#0f172a; margin:0; }
  .sg-dm-close { width:30px; height:30px; background:#f0f5ff; border:none; border-radius:8px; color:#64748b; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .sg-dm-close:hover { background:#fee2e2; color:#ef4444; }
  .sg-dm-body { flex:1; overflow-y:auto; padding:1.2rem 1.4rem; display:flex; flex-direction:column; gap:14px; }
  .sg-dm-summary { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
  .sg-dm-stat { background:#f8faff; border:1px solid #e2e8f0; border-radius:10px; padding:0.75rem; text-align:center; display:flex; flex-direction:column; gap:4px; }
  .sg-dm-num { font-family:'Sora',sans-serif; font-size:1.4rem; font-weight:800; color:#0f172a; }
  .sg-dm-label { font-size:0.65rem; color:#94a3b8; font-weight:600; text-transform:uppercase; }
  .sg-dm-section { display:flex; flex-direction:column; gap:6px; }
  .sg-dm-sec-title { font-size:0.82rem; font-weight:700; color:#0f172a; margin-bottom:4px; }
  .sg-dm-log-item { display:flex; align-items:center; gap:8px; padding:0.45rem 0.6rem; border-radius:8px; background:#f8faff; font-size:0.76rem; flex-wrap:wrap; }
  .sg-dm-warn { background:#fff1f2; }
  .sg-dm-time { color:#94a3b8; font-weight:600; white-space:nowrap; flex-shrink:0; }
  .sg-dm-cat { padding:1px 7px; border-radius:99px; font-size:0.66rem; font-weight:700; text-transform:uppercase; white-space:nowrap; flex-shrink:0; }
  .sg-cat-auth       { background:#fee2e2; color:#b91c1c; }
  .sg-cat-orders     { background:#dbeafe; color:#1d4ed8; }
  .sg-cat-vendors    { background:#d1fae5; color:#065f46; }
  .sg-cat-leads      { background:#ede9fe; color:#6d28d9; }
  .sg-cat-earnings   { background:#fef3c7; color:#d97706; }
  .sg-cat-navigation { background:#f1f5f9; color:#475569; }
  .sg-cat-reports    { background:#e0f2fe; color:#0284c7; }
  .sg-dm-action { font-weight:600; color:#0f172a; flex:1; }
  .sg-dm-detail { color:#64748b; font-size:0.72rem; }
  .sg-dm-footer { display:flex; justify-content:space-between; align-items:center; padding:1rem 1.4rem; border-top:1px solid #f1f5f9; flex-shrink:0; flex-wrap:wrap; gap:8px; }
  .sg-dm-note { font-size:0.75rem; color:#94a3b8; }
  .sg-dm-copy { padding:0.45rem 1rem; background:#e8f0fe; color:#1a73e8; border:none; border-radius:8px; font-size:0.78rem; font-weight:700; font-family:inherit; cursor:pointer; }
  .sg-dm-copy:hover { background:#d2e3fc; }
`;
