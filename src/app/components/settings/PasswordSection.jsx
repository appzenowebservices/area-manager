import { useState } from "react";
import { SettingsCard, FormField, SaveBar, inputCss } from "./SettingsUI";

/**
 * PasswordSection
 * File: src/components/settings/PasswordSection.jsx
 */

const EyeIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open
      ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/></>
      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8"/>
          <circle cx="12" cy="12" r="3"/></>}
  </svg>
);

function getStrength(p) {
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8)           s++;
  if (/[A-Z]/.test(p))        s++;
  if (/[0-9]/.test(p))        s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

const STRENGTH_META = [
  null,
  { label: "Weak",   color: "#d32f2f" },
  { label: "Fair",   color: "#e9c46a" },
  { label: "Good",   color: "#ae2012" },
  { label: "Strong", color: "#0c831f" },
];

const SESSIONS = [
  { device: "Chrome · Windows 11",  location: "Lucknow, UP", time: "Active now",        current: true  },
  { device: "Firefox · Android 14", location: "Lucknow, UP", time: "2 hours ago",       current: false },
  { device: "Safari · iPhone 15",   location: "Lucknow, UP", time: "Yesterday, 8:30 PM",current: false },
];

export default function PasswordSection() {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [twoFA,   setTwoFA]   = useState(false);

  const strength = getStrength(form.newPass);
  const smeta    = STRENGTH_META[strength];

  const validate = () => {
    const e = {};
    if (!form.current)           e.current = "Enter your current password";
    if (form.newPass.length < 8) e.newPass  = "At least 8 characters required";
    if (strength < 2)            e.newPass  = "Password is too weak";
    if (form.newPass !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSaved(true);
    setForm({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setSaved(false), 4000);
  };

  const PwField = ({ fkey, label, error, placeholder }) => (
    <FormField label={label} error={error}>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          className={`si-input${error ? " si-input-error" : ""}`}
          type={show[fkey] ? "text" : "password"}
          value={form[fkey]}
          onChange={e => { setForm(f => ({...f, [fkey]: e.target.value})); setErrors(v => ({...v, [fkey]: ""})); }}
          placeholder={placeholder}
          style={{ paddingRight: "2.8rem" }}
          autoComplete="new-password"
        />
        <button style={{ position:"absolute", right:10, background:"none", border:"none",
          color:"#a68b66", cursor:"pointer", display:"flex", alignItems:"center", padding:4 }}
          onClick={() => setShow(s => ({...s, [fkey]: !s[fkey]}))}>
          <EyeIcon open={show[fkey]} />
        </button>
      </div>
    </FormField>
  );

  return (
    <>
      <style>{inputCss}{css}</style>

      {/* Change password */}
      <SettingsCard title="Change Password" subtitle="Use a strong, unique password for your account">
        <PwField fkey="current" label="Current Password"  error={errors.current} placeholder="Enter current password" />
        <PwField fkey="newPass" label="New Password"      error={errors.newPass} placeholder="Min 8 characters" />

        {/* Strength bar */}
        {form.newPass && (
          <div className="pw-strength">
            <div className="pw-bars">
              {[1,2,3,4].map(i => (
                <div key={i} className="pw-bar"
                  style={{ background: i <= strength ? smeta?.color : "#e9d8bf" }} />
              ))}
            </div>
            {smeta && <span style={{ fontSize:"0.72rem", fontWeight:700, color: smeta.color }}>{smeta.label}</span>}
          </div>
        )}

        <PwField fkey="confirm" label="Confirm New Password" error={errors.confirm} placeholder="Re-enter new password" />

        {/* Tips */}
        <div className="pw-tips">
          {["At least 8 characters", "Include UPPERCASE letters", "Add numbers (0-9)",
            "Use special characters (!@#$)"].map(t => (
            <div key={t} className="pw-tip"><span className="pw-dot" />{t}</div>
          ))}
        </div>

        <SaveBar loading={loading} saved={saved} savedMsg="Password updated!" onSave={handleSave} />
      </SettingsCard>

      {/* 2FA */}
      <SettingsCard title="Two-Factor Authentication" subtitle="Add an extra layer of security to your account">
        <div className="pw-twofa-row">
          <div className="pw-twofa-info">
            <div className="pw-twofa-icon">{twoFA ? "🔐" : "🔓"}</div>
            <div>
              <p className="pw-twofa-label">{twoFA ? "2FA is Enabled" : "2FA is Disabled"}</p>
              <p className="pw-twofa-desc">
                {twoFA
                  ? "Your account is secured with OTP verification on every login."
                  : "Enable OTP verification on login for extra security."}
              </p>
            </div>
          </div>
          <button
            className={`pw-twofa-btn ${twoFA ? "pw-twofa-off" : "pw-twofa-on"}`}
            onClick={() => setTwoFA(v => !v)}
          >
            {twoFA ? "Disable" : "Enable 2FA"}
          </button>
        </div>
      </SettingsCard>

      {/* Active sessions */}
      <SettingsCard title="Active Sessions" subtitle="Devices currently logged into your account">
        {SESSIONS.map((s, i) => (
          <div key={i} className="pw-session">
            <div className="pw-session-icon">{s.device.includes("Chrome") ? "🌐" : s.device.includes("Safari") ? "🍎" : "🦊"}</div>
            <div className="pw-session-info">
              <p className="pw-session-device">{s.device}</p>
              <p className="pw-session-meta">📍 {s.location} · {s.time}</p>
            </div>
            {s.current
              ? <span className="pw-session-current">Current</span>
              : <button className="pw-session-revoke">Revoke</button>
            }
          </div>
        ))}
      </SettingsCard>
    </>
  );
}

const css = `
  .pw-strength { display:flex; align-items:center; gap:10px; margin:-6px 0; }
  .pw-bars { display:flex; gap:4px; }
  .pw-bar { width:40px; height:4px; border-radius:2px; transition:background 0.25s; }

  .pw-tips {
    display:grid; grid-template-columns:repeat(2,minmax(0,1fr));
    gap:6px 12px;
    background:#fdfbf7; border:1px solid #e9d8bf;
    border-radius:10px; padding:0.8rem 1rem;
  }
  .pw-tip { display:flex; align-items:center; gap:7px; font-size:0.78rem; color:#7d6b5d; }
  .pw-dot { width:5px; height:5px; border-radius:50%; background:#ae2012; flex-shrink:0; }

  .pw-twofa-row { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
  .pw-twofa-info { display:flex; align-items:center; gap:12px; flex:1; min-width:0; }
  .pw-twofa-icon { font-size:1.8rem; }
  .pw-twofa-label { font-weight:700; color:#2d241e; font-size:0.88rem; margin:0 0 3px; }
  .pw-twofa-desc  { font-size:0.75rem; color:#7d6b5d; margin:0; }
  .pw-twofa-btn {
    padding:0.55rem 1.1rem; border:none; border-radius:9px;
    font-size:0.84rem; font-weight:700; font-family:inherit;
    cursor:pointer; flex-shrink:0; transition:opacity 0.15s;
  }
  .pw-twofa-on  { background:#fdfbf7; color:#ae2012; }
  .pw-twofa-off { background:#fbebe9; color:#d32f2f; }
  .pw-twofa-btn:hover { opacity:0.8; }

  .pw-session {
    display:flex; align-items:center; gap:12px;
    padding:0.75rem 0;
    border-bottom:1px solid #f5ebe0;
  }
  .pw-session:last-child { border-bottom:none; }
  .pw-session-icon { font-size:1.2rem; flex-shrink:0; }
  .pw-session-info { flex:1; min-width:0; }
  .pw-session-device { font-size:0.85rem; font-weight:600; color:#2d241e; margin:0 0 2px; }
  .pw-session-meta   { font-size:0.72rem; color:#a68b66; margin:0; }
  .pw-session-current {
    padding:0.28rem 0.7rem; background:#d3ebd8; color:#0a671a;
    border-radius:99px; font-size:0.7rem; font-weight:700; flex-shrink:0;
  }
  .pw-session-revoke {
    padding:0.28rem 0.7rem; background:#fbebe9; color:#d32f2f;
    border:none; border-radius:99px; font-size:0.7rem; font-weight:700;
    font-family:inherit; cursor:pointer; flex-shrink:0; transition:opacity 0.15s;
  }
  .pw-session-revoke:hover { opacity:0.8; }

  @media (max-width:480px) { .pw-tips { grid-template-columns:minmax(0,1fr); } }
`;
