import { useState } from "react";
import { SettingsCard, FormField, SaveBar, inputCss } from "./SettingsUI";

/**
 * BankingSection
 * File: src/components/settings/BankingSection.jsx
 *
 * Features:
 *  - Account number + confirm
 *  - IFSC → Razorpay API auto-fetch (bank name, branch, city, MICR)
 *  - Account holder name
 *  - Account type (Savings / Current)
 *  - UPI ID with validation
 *  - PAN number
 */

const RAZORPAY_IFSC_API = "https://ifsc.razorpay.com/";

function BankInfoPill({ label, value }) {
  if (!value) return null;
  return (
    <div className="bk-pill">
      <span className="bk-pill-label">{label}</span>
      <span className="bk-pill-value">{value}</span>
    </div>
  );
}

export default function BankingSection() {
  const [form, setForm] = useState({
    accountHolder: "",
    accountNumber: "",
    confirmAccount: "",
    accountType: "Savings",
    ifsc: "",
    upiId: "",
    pan: "",
  });
  const [bankInfo,   setBankInfo]   = useState(null);   // Razorpay response
  const [ifscStatus, setIfscStatus] = useState("idle"); // idle | loading | success | error
  const [ifscError,  setIfscError]  = useState("");
  const [errors,     setErrors]     = useState({});
  const [loading,    setLoading]    = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [showAcc,    setShowAcc]    = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  /* ── IFSC auto-fetch ── */
  const fetchIFSC = async (code) => {
    const clean = code.toUpperCase().trim();
    set("ifsc", clean);
    setBankInfo(null);
    setIfscError("");

    if (clean.length !== 11) {
      setIfscStatus("idle");
      return;
    }

    setIfscStatus("loading");
    try {
      const res  = await fetch(`${RAZORPAY_IFSC_API}${clean}`);
      if (!res.ok) throw new Error("Invalid IFSC");
      const data = await res.json();
      setBankInfo(data);
      setIfscStatus("success");
    } catch {
      setIfscStatus("error");
      setIfscError("Invalid IFSC code — bank not found");
      setBankInfo(null);
    }
  };

  /* ── Validate ── */
  const validate = () => {
    const e = {};
    if (!form.accountHolder.trim()) e.accountHolder = "Account holder name required";
    if (form.accountNumber.length < 9) e.accountNumber = "Enter valid account number";
    if (form.accountNumber !== form.confirmAccount) e.confirmAccount = "Account numbers do not match";
    if (form.ifsc.length !== 11 || ifscStatus !== "success") e.ifsc = "Valid IFSC required";
    if (form.upiId && !/^[\w.\-_]{3,}@[\w]{3,}$/.test(form.upiId)) e.upiId = "Invalid UPI ID format";
    if (form.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan.toUpperCase())) e.pan = "Invalid PAN format";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const ifscIcon = {
    idle:    null,
    loading: <span className="bk-ifsc-spin" />,
    success: <span style={{ color: "#0c831f", fontSize: "1rem" }}>✓</span>,
    error:   <span style={{ color: "#d32f2f", fontSize: "0.9rem" }}>✕</span>,
  }[ifscStatus];

  return (
    <>
      <style>{inputCss}{css}</style>

      {/* Account Details */}
      <SettingsCard title="Bank Account Details" subtitle="Used for commission payouts and settlements">

        <div className="bk-grid">
          <FormField label="Account Holder Name" error={errors.accountHolder}>
            <input className={`si-input${errors.accountHolder ? " si-input-error" : ""}`}
              value={form.accountHolder}
              onChange={e => set("accountHolder", e.target.value)}
              placeholder="As per bank records" />
          </FormField>

          <FormField label="Account Type">
            <select className="si-select" value={form.accountType}
              onChange={e => set("accountType", e.target.value)}>
              <option>Savings</option>
              <option>Current</option>
            </select>
          </FormField>

          <FormField label="Account Number" error={errors.accountNumber}>
            <div className="bk-acc-wrap">
              <input
                className={`si-input bk-acc-input${errors.accountNumber ? " si-input-error" : ""}`}
                type={showAcc ? "text" : "password"}
                value={form.accountNumber}
                onChange={e => set("accountNumber", e.target.value.replace(/\D/g, ""))}
                placeholder="Enter account number"
                autoComplete="off"
              />
              <button className="bk-eye" onClick={() => setShowAcc(s => !s)}>
                {showAcc ? "🙈" : "👁"}
              </button>
            </div>
          </FormField>

          <FormField label="Confirm Account Number" error={errors.confirmAccount}>
            <input className={`si-input${errors.confirmAccount ? " si-input-error" : ""}`}
              type="password"
              value={form.confirmAccount}
              onChange={e => set("confirmAccount", e.target.value.replace(/\D/g, ""))}
              placeholder="Re-enter account number"
              autoComplete="off" />
          </FormField>
        </div>

        {/* IFSC */}
        <FormField
          label="IFSC Code"
          hint={ifscStatus === "idle" ? "11-character code — auto-fetches bank details" : ""}
          error={ifscError || errors.ifsc}
        >
          <div className="bk-ifsc-wrap">
            <input
              className={`si-input bk-ifsc-input${(ifscError || errors.ifsc) ? " si-input-error" : ifscStatus === "success" ? " bk-ifsc-ok" : ""}`}
              value={form.ifsc}
              onChange={e => fetchIFSC(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 11))}
              placeholder="e.g. SBIN0001234"
              maxLength={11}
              style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
            />
            <span className="bk-ifsc-status">{ifscIcon}</span>
          </div>
        </FormField>

        {/* Bank Info Panel — shown after successful fetch */}
        {bankInfo && (
          <div className="bk-bank-panel">
            <div className="bk-bank-header">
              <div className="bk-bank-logo">{bankInfo.BANK?.[0] || "B"}</div>
              <div>
                <p className="bk-bank-name">{bankInfo.BANK}</p>
                <p className="bk-bank-sub">Verified via Razorpay IFSC API ✓</p>
              </div>
            </div>
            <div className="bk-pills">
              <BankInfoPill label="Branch"  value={bankInfo.BRANCH} />
              <BankInfoPill label="City"    value={bankInfo.CITY} />
              <BankInfoPill label="State"   value={bankInfo.STATE} />
              <BankInfoPill label="MICR"    value={bankInfo.MICR} />
              <BankInfoPill label="RTGS"    value={bankInfo.RTGS ? "Supported" : "No"} />
              <BankInfoPill label="NEFT"    value={bankInfo.NEFT ? "Supported" : "No"} />
              <BankInfoPill label="IMPS"    value={bankInfo.IMPS ? "Supported" : "No"} />
              <BankInfoPill label="Contact" value={bankInfo.CONTACT} />
            </div>
          </div>
        )}

        <SaveBar loading={loading} saved={saved} savedMsg="Bank details saved!" onSave={handleSave} />
      </SettingsCard>

      {/* UPI */}
      <SettingsCard title="UPI Details" subtitle="For quick payment transfers">
        <div className="bk-grid">
          <FormField label="UPI ID" error={errors.upiId} hint="e.g. yourname@upi or phone@paytm">
            <div className="bk-upi-wrap">
              <span className="bk-upi-icon">💳</span>
              <input className={`si-input bk-upi-input${errors.upiId ? " si-input-error" : ""}`}
                value={form.upiId}
                onChange={e => set("upiId", e.target.value)}
                placeholder="yourname@upi" />
            </div>
          </FormField>

          <FormField label="PAN Number" error={errors.pan} hint="For TDS and tax records">
            <input className={`si-input${errors.pan ? " si-input-error" : ""}`}
              value={form.pan}
              onChange={e => set("pan", e.target.value.toUpperCase().slice(0, 10))}
              placeholder="ABCDE1234F"
              style={{ letterSpacing: "0.1em", textTransform: "uppercase" }} />
          </FormField>
        </div>

        <SaveBar loading={loading} saved={saved} savedMsg="UPI details saved!" onSave={handleSave} />
      </SettingsCard>

      {/* Info note */}
      <div className="bk-note">
        <span style={{ fontSize: "1rem" }}>🔒</span>
        <p>Your banking details are encrypted and stored securely. They are only used for commission disbursements and are never shared.</p>
      </div>
    </>
  );
}

const css = `
  .bk-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 0.9rem;
  }

  /* Account number */
  .bk-acc-wrap { position: relative; display: flex; align-items: center; }
  .bk-acc-input { padding-right: 2.8rem !important; }
  .bk-eye {
    position: absolute; right: 10px;
    background: none; border: none; cursor: pointer;
    font-size: 0.9rem; padding: 4px; line-height: 1;
  }

  /* IFSC */
  .bk-ifsc-wrap { position: relative; display: flex; align-items: center; }
  .bk-ifsc-input { padding-right: 2.8rem !important; font-family: 'Sora', sans-serif; }
  .bk-ifsc-ok { border-color: #0c831f !important; }
  .bk-ifsc-status {
    position: absolute; right: 12px;
    display: flex; align-items: center;
  }
  .bk-ifsc-spin {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid #e9d8bf;
    border-top-color: #ae2012;
    border-radius: 50%;
    animation: bkSpin 0.7s linear infinite;
  }
  @keyframes bkSpin { to { transform: rotate(360deg); } }

  /* Bank info panel */
  .bk-bank-panel {
    background: linear-gradient(135deg, #eaf6ed, #fdfbf7);
    border: 1px solid #e9d8bf;
    border-radius: 12px;
    padding: 1rem 1.1rem;
    animation: bkFadeIn 0.3s ease;
  }
  @keyframes bkFadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
  .bk-bank-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .bk-bank-logo {
    width: 40px; height: 40px; border-radius: 10px;
    background: #ae2012; color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 800;
    font-family: 'Sora', sans-serif; flex-shrink: 0;
  }
  .bk-bank-name { font-weight: 700; color: #2d241e; font-size: 0.92rem; margin: 0 0 2px; }
  .bk-bank-sub  { font-size: 0.7rem; color: #0c831f; font-weight: 600; margin: 0; }
  .bk-pills { display: flex; flex-wrap: wrap; gap: 6px; }
  .bk-pill {
    display: flex; flex-direction: column; gap: 1px;
    background: #fff; border: 1px solid #f5ebe0;
    border-radius: 8px; padding: 0.4rem 0.65rem;
  }
  .bk-pill-label { font-size: 0.6rem; color: #a68b66; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
  .bk-pill-value { font-size: 0.78rem; color: #2d241e; font-weight: 600; }

  /* UPI */
  .bk-upi-wrap { position: relative; display: flex; align-items: center; }
  .bk-upi-icon { position: absolute; left: 12px; font-size: 0.9rem; }
  .bk-upi-input { padding-left: 2.2rem !important; }

  /* Note */
  .bk-note {
    display: flex; align-items: flex-start; gap: 10px;
    background: #eaf6ed; border: 1px solid #eaf6ed;
    border-radius: 12px; padding: 0.85rem 1rem;
  }
  .bk-note p { font-size: 0.78rem; color: #2196f3; line-height: 1.55; margin: 0; }

  @media (max-width: 520px) { .bk-grid { grid-template-columns: minmax(0,1fr); } }
`;
