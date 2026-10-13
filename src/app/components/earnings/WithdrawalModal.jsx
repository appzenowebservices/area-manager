// src/components/earnings/WithdrawalModal.jsx
import { useState } from "react";
import { MAX_PAYOUTS_PER_MONTH } from "../../data/earningsData";

/**
 * WithdrawalModal
 * Props: available number, usedThisMonth number, onConfirm fn(amount), onClose fn
 */
export default function WithdrawalModal({ available, usedThisMonth, onConfirm, onClose }) {
  const [amount, setAmount] = useState("");
  const [error,  setError]  = useState("");

  const remaining = MAX_PAYOUTS_PER_MONTH - usedThisMonth;
  const isBlocked = remaining <= 0;

  const handleConfirm = () => {
    const amt = Number(amount);
    if (!amt || amt < 100)    { setError("Minimum withdrawal is ₹100"); return; }
    if (amt > available)      { setError(`Cannot exceed available balance ₹${available.toLocaleString()}`); return; }
    onConfirm(amt);
  };

  return (
    <>
      <style>{css}</style>
      <div className="wm-backdrop" onClick={onClose} />
      <div className="wm-modal">

        <div className="wm-header">
          <h3 className="wm-title">💸 Request Withdrawal</h3>
          <button className="wm-close" onClick={onClose}>✕</button>
        </div>

        <div className="wm-body">
          {/* Balance card */}
          <div className="wm-balance-card">
            <div className="wm-balance-label">Available Balance</div>
            <div className="wm-balance-amt">₹{available.toLocaleString()}</div>
          </div>

          {/* Payout limit info */}
          <div className={`wm-limit-info ${isBlocked ? "wm-limit-blocked" : "wm-limit-ok"}`}>
            <span>{isBlocked ? "🚫" : "ℹ️"}</span>
            <div>
              <div className="wm-limit-title">
                {isBlocked
                  ? "Monthly withdrawal limit reached"
                  : `${remaining} withdrawal${remaining > 1 ? "s" : ""} remaining this month`}
              </div>
              <div className="wm-limit-sub">
                {usedThisMonth}/{MAX_PAYOUTS_PER_MONTH} used this month
              </div>
            </div>
          </div>

          {!isBlocked && (
            <>
              <div className="wm-field">
                <label className="wm-label">Enter Amount (₹)</label>
                <div className="wm-input-wrap">
                  <span className="wm-rupee">₹</span>
                  <input
                    className={`wm-input ${error ? "wm-input-err" : ""}`}
                    type="number"
                    placeholder="e.g. 2000"
                    min={100}
                    max={available}
                    value={amount}
                    onChange={e => { setAmount(e.target.value); setError(""); }}
                  />
                </div>
                {error && <span className="wm-error">{error}</span>}
              </div>

              {/* Quick amount buttons */}
              <div className="wm-quick">
                {[500, 1000, 2000, available].filter((v,i,a) => a.indexOf(v) === i && v <= available).map(v => (
                  <button key={v} className={`wm-quick-btn ${Number(amount) === v ? "wm-quick-active" : ""}`}
                    onClick={() => { setAmount(String(v)); setError(""); }}>
                    {v === available ? "Max" : `₹${v.toLocaleString()}`}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="wm-footer">
          <button className="wm-cancel" onClick={onClose}>Cancel</button>
          <button
            className="wm-confirm"
            onClick={handleConfirm}
            disabled={isBlocked || !amount}
          >
            {isBlocked ? "Limit Reached" : "✓ Request Withdrawal"}
          </button>
        </div>
      </div>
    </>
  );
}

const css = `
  .wm-backdrop { position:fixed; inset:0; background:rgba(45, 36, 30,0.5); z-index:1300; backdrop-filter:blur(2px); }
  .wm-modal {
    position:fixed; top:50%; left:50%;
    transform:translate(-50%,-50%);
    z-index:1301; width:min(420px,95vw);
    background:#fff; border-radius:18px;
    box-shadow:0 20px 60px rgba(45, 36, 30,0.2);
    overflow:hidden;
    animation:wmIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes wmIn {
    from { transform:translate(-50%,-48%) scale(0.93); opacity:0; }
    to   { transform:translate(-50%,-50%) scale(1); opacity:1; }
  }
  .wm-header { display:flex; justify-content:space-between; align-items:center; padding:1.1rem 1.3rem; border-bottom:1px solid #f5ebe0; }
  .wm-title { font-family:'Sora',sans-serif; font-size:1rem; font-weight:700; color:#2d241e; margin:0; }
  .wm-close { width:30px; height:30px; background:#fdfbf7; border:none; border-radius:8px; color:#7d6b5d; cursor:pointer; font-size:0.85rem; display:flex; align-items:center; justify-content:center; }
  .wm-close:hover { background:#fbebe9; color:#d32f2f; }
  .wm-body { padding:1.2rem 1.3rem; display:flex; flex-direction:column; gap:14px; }

  .wm-balance-card { background:linear-gradient(135deg,#ae2012,#2d241e); border-radius:14px; padding:1.2rem 1.4rem; text-align:center; }
  .wm-balance-label { font-size:0.75rem; color:rgba(255,255,255,0.75); font-weight:600; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:6px; }
  .wm-balance-amt { font-family:'Sora',sans-serif; font-size:2rem; font-weight:800; color:#fff; letter-spacing:-0.02em; }

  .wm-limit-info { display:flex; align-items:flex-start; gap:10px; padding:0.75rem 0.9rem; border-radius:10px; font-size:0.82rem; }
  .wm-limit-ok      { background:#eaf6ed; border:1px solid #e9d8bf; }
  .wm-limit-blocked { background:#fbebe9; border:1px solid #f6d4ce; }
  .wm-limit-title { font-weight:700; color:#2d241e; font-size:0.82rem; }
  .wm-limit-sub { font-size:0.72rem; color:#7d6b5d; margin-top:2px; }

  .wm-field { display:flex; flex-direction:column; gap:6px; }
  .wm-label { font-size:0.72rem; font-weight:700; color:#7d6b5d; text-transform:uppercase; letter-spacing:0.05em; }
  .wm-input-wrap { display:flex; align-items:center; border:1.5px solid #e9d8bf; border-radius:10px; overflow:hidden; background:#fdfbf7; transition:border-color 0.2s; }
  .wm-input-wrap:focus-within { border-color:#ae2012; background:#fff; }
  .wm-rupee { padding:0 0.75rem; font-size:1rem; font-weight:700; color:#7d6b5d; background:#fdfbf7; border-right:1px solid #e9d8bf; height:44px; display:flex; align-items:center; }
  .wm-input { flex:1; height:44px; border:none; outline:none; background:transparent; font-size:1rem; font-weight:700; color:#2d241e; font-family:'Sora',sans-serif; padding:0 0.85rem; }
  .wm-input-err + .wm-input { border-color:#d32f2f; }
  .wm-error { font-size:0.72rem; color:#d32f2f; font-weight:600; }

  .wm-quick { display:flex; gap:7px; flex-wrap:wrap; }
  .wm-quick-btn { padding:0.38rem 0.85rem; border:1.5px solid #e9d8bf; border-radius:8px; background:#fdfbf7; color:#4a3f35; font-size:0.8rem; font-weight:600; font-family:inherit; cursor:pointer; transition:all 0.15s; }
  .wm-quick-btn:hover { border-color:#ae2012; color:#ae2012; background:#fdfbf7; }
  .wm-quick-active { background:#fdfbf7; border-color:#ae2012; color:#ae2012; }

  .wm-footer { display:flex; gap:10px; padding:1rem 1.3rem; border-top:1px solid #f5ebe0; }
  .wm-cancel { flex:1; padding:0.7rem; background:#fdfbf7; border:none; border-radius:10px; color:#5d4037; font-size:0.88rem; font-weight:600; font-family:inherit; cursor:pointer; }
  .wm-confirm { flex:2; padding:0.7rem; background:#ae2012; border:none; border-radius:10px; color:#fff; font-size:0.88rem; font-weight:700; font-family:inherit; cursor:pointer; transition:background 0.15s; box-shadow:0 4px 12px rgba(12, 131, 31,0.3); }
  .wm-confirm:disabled { background:#eaf6ed; cursor:not-allowed; box-shadow:none; }
  .wm-confirm:hover:not(:disabled) { background:#8b150e; }
`;
