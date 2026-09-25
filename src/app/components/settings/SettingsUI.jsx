/**
 * SettingsCard + FormField — Shared UI primitives
 * File: src/components/settings/SettingsUI.jsx
 *
 * Exports:
 *   SettingsCard   — white card with title + subtitle
 *   FormField      — label + input wrapper with error
 *   SaveBar        — bottom save row with success feedback
 *   Divider        — horizontal rule
 */

export function SettingsCard({ title, subtitle, children }) {
  return (
    <>
      <style>{cardCss}</style>
      <div className="sc-card">
        {(title || subtitle) && (
          <div className="sc-header">
            {title    && <h3 className="sc-title">{title}</h3>}
            {subtitle && <p  className="sc-sub">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </>
  );
}

export function FormField({ label, hint, error, children, half }) {
  return (
    <>
      <style>{fieldCss}</style>
      <div className={`ff-wrap${half ? " ff-half" : ""}`}>
        {label && <label className="ff-label">{label}</label>}
        {children}
        {hint  && !error && <p className="ff-hint">{hint}</p>}
        {error && <p className="ff-error">{error}</p>}
      </div>
    </>
  );
}

export function SaveBar({ loading, saved, savedMsg = "Saved successfully!", onSave, children }) {
  return (
    <>
      <style>{saveCss}</style>
      <div className="sb-row">
        {children}
        {saved && <span className="sb-saved">✓ {savedMsg}</span>}
        <button className="sb-btn" onClick={onSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </>
  );
}

export function Divider() {
  return <div style={{ height: 1, background: "#f1f5f9", margin: "0.25rem 0" }} />;
}

export const inputCss = `
  .si-input {
    width: 100%;
    padding: 0.65rem 0.9rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.88rem;
    color: #0f172a;
    background: #fff;
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .si-input:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 0 3px rgba(26,115,232,0.1);
  }
  .si-input:disabled {
    background: #f8faff;
    color: #94a3b8;
    cursor: not-allowed;
  }
  .si-input-error { border-color: #ef4444 !important; }
  .si-select {
    width: 100%;
    padding: 0.65rem 0.9rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 0.88rem;
    color: #0f172a;
    background: #fff;
    font-family: inherit;
    outline: none;
    cursor: pointer;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }
  .si-select:focus { border-color: #1a73e8; }
`;

const cardCss = `
  .sc-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 1.3rem 1.4rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .sc-header { border-bottom: 1px solid #f1f5f9; padding-bottom: 0.85rem; }
  .sc-title {
    font-family: 'Sora', sans-serif;
    font-size: 0.95rem; font-weight: 700;
    color: #0f172a; margin: 0 0 3px;
  }
  .sc-sub { font-size: 0.78rem; color: #94a3b8; margin: 0; }
`;

const fieldCss = `
  .ff-wrap { display: flex; flex-direction: column; gap: 5px; }
  .ff-half { }
  .ff-label { font-size: 0.78rem; font-weight: 600; color: #334155; }
  .ff-hint  { font-size: 0.72rem; color: #94a3b8; margin: 0; }
  .ff-error { font-size: 0.72rem; color: #ef4444; margin: 0; }
`;

const saveCss = `
  .sb-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    flex-wrap: wrap;
    padding-top: 0.5rem;
  }
  .sb-saved { font-size: 0.82rem; color: #10b981; font-weight: 600; }
  .sb-btn {
    padding: 0.65rem 1.5rem;
    background: #1a73e8; color: #fff;
    border: none; border-radius: 10px;
    font-size: 0.88rem; font-weight: 700;
    font-family: inherit; cursor: pointer;
    box-shadow: 0 4px 12px rgba(26,115,232,0.3);
    transition: background 0.15s, transform 0.12s;
  }
  .sb-btn:hover:not(:disabled) { background: #1557b0; transform: translateY(-1px); }
  .sb-btn:disabled { background: #93b8fb; cursor: not-allowed; transform: none; box-shadow: none; }
`;
