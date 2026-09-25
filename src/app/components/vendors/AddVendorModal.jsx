// src/components/vendors/AddVendorModal.jsx
import { useState } from "react";
import { VENDOR_CATEGORIES, VENDOR_AREAS } from "../../data/vendorsData";

/**
 * AddVendorModal
 * Props: onConfirm fn(newVendor), onClose fn
 */
export default function AddVendorModal({ onConfirm, onClose }) {
  const [form, setForm] = useState({
    name: "", ownerName: "", phone: "", altPhone: "", email: "",
    area: "", address: "", category: "", commission: 10,
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())      e.name      = "Store name required";
    if (!form.ownerName.trim()) e.ownerName = "Owner name required";
    if (!form.phone.trim() || form.phone.length < 10) e.phone = "Valid phone required";
    if (!form.area)             e.area      = "Area required";
    if (!form.category)         e.category  = "Category required";
    if (!form.address.trim())   e.address   = "Address required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newVendor = {
      ...form,
      id: `V-${String(Date.now()).slice(-3)}`,
      status: "Pending KYC",
      rating: 0,
      totalOrders: 0,
      ordersThisWeek: 0,
      commission: Number(form.commission),
      joinDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      kyc: "Pending",
      documents: { aadhaar: false, pan: false, gst: false, fssai: false },
      revenue: "₹0",
      avgDeliveryTime: "—",
      notes: "",
    };
    onConfirm(newVendor);
  };

  return (
    <>
      <style>{css}</style>
      <div className="avm-backdrop" onClick={onClose} />
      <div className="avm-modal">

        <div className="avm-header">
          <h3 className="avm-title">➕ Add New Vendor</h3>
          <button className="avm-close" onClick={onClose}>✕</button>
        </div>

        <div className="avm-body">
          <div className="avm-grid">

            <Field label="Store Name *" error={errors.name}>
              <input className={`avm-input${errors.name ? " avm-err" : ""}`} placeholder="e.g. Sharma Kirana Store" value={form.name} onChange={e => set("name", e.target.value)} />
            </Field>

            <Field label="Owner Name *" error={errors.ownerName}>
              <input className={`avm-input${errors.ownerName ? " avm-err" : ""}`} placeholder="e.g. Ramesh Sharma" value={form.ownerName} onChange={e => set("ownerName", e.target.value)} />
            </Field>

            <Field label="Phone *" error={errors.phone}>
              <input className={`avm-input${errors.phone ? " avm-err" : ""}`} placeholder="10-digit mobile" maxLength={10} value={form.phone} onChange={e => set("phone", e.target.value)} />
            </Field>

            <Field label="Alt Phone">
              <input className="avm-input" placeholder="Optional" maxLength={10} value={form.altPhone} onChange={e => set("altPhone", e.target.value)} />
            </Field>

            <Field label="Email">
              <input className="avm-input" type="email" placeholder="vendor@gmail.com" value={form.email} onChange={e => set("email", e.target.value)} />
            </Field>

            <Field label="Commission %" >
              <input className="avm-input" type="number" min={1} max={30} value={form.commission} onChange={e => set("commission", e.target.value)} />
            </Field>

            <Field label="Category *" error={errors.category}>
              <select className={`avm-select${errors.category ? " avm-err" : ""}`} value={form.category} onChange={e => set("category", e.target.value)}>
                <option value="">Select category</option>
                {VENDOR_CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Area *" error={errors.area}>
              <select className={`avm-select${errors.area ? " avm-err" : ""}`} value={form.area} onChange={e => set("area", e.target.value)}>
                <option value="">Select area</option>
                {VENDOR_AREAS.filter(a => a !== "All").map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>

          </div>

          <Field label="Address *" error={errors.address}>
            <textarea className={`avm-textarea${errors.address ? " avm-err" : ""}`} placeholder="Full shop address..." rows={2} value={form.address} onChange={e => set("address", e.target.value)} />
          </Field>
        </div>

        <div className="avm-footer">
          <button className="avm-cancel" onClick={onClose}>Cancel</button>
          <button className="avm-confirm" onClick={handleSubmit}>✓ Add Vendor</button>
        </div>
      </div>
    </>
  );
}

function Field({ label, children, error }) {
  return (
    <div className="avm-field">
      <label className="avm-label">{label}</label>
      {children}
      {error && <span className="avm-error">{error}</span>}
    </div>
  );
}

const css = `
  .avm-backdrop { position:fixed; inset:0; background:rgba(15,23,42,0.5); z-index:1300; backdrop-filter:blur(2px); }
  .avm-modal {
    position:fixed; top:50%; left:50%;
    transform:translate(-50%,-50%);
    z-index:1301;
    width:min(560px,95vw);
    background:#fff; border-radius:18px;
    box-shadow:0 20px 60px rgba(15,23,42,0.2);
    overflow:hidden;
    animation:avmIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
    max-height:90vh;
    display:flex; flex-direction:column;
  }
  @keyframes avmIn {
    from { transform:translate(-50%,-48%) scale(0.93); opacity:0; }
    to   { transform:translate(-50%,-50%) scale(1); opacity:1; }
  }
  .avm-header { display:flex; justify-content:space-between; align-items:center; padding:1.1rem 1.3rem; border-bottom:1px solid #f1f5f9; flex-shrink:0; }
  .avm-title { font-family:'Sora',sans-serif; font-size:1rem; font-weight:700; color:#0f172a; margin:0; }
  .avm-close { width:30px; height:30px; background:#f0f5ff; border:none; border-radius:8px; color:#64748b; cursor:pointer; font-size:0.85rem; display:flex; align-items:center; justify-content:center; }
  .avm-close:hover { background:#fee2e2; color:#ef4444; }
  .avm-body { padding:1.1rem 1.3rem; overflow-y:auto; flex:1; }
  .avm-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px 16px; margin-bottom:12px; }
  .avm-field { display:flex; flex-direction:column; gap:5px; }
  .avm-label { font-size:0.72rem; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.05em; }
  .avm-input, .avm-select, .avm-textarea {
    border:1.5px solid #e2e8f0; border-radius:9px;
    padding:0.55rem 0.75rem; font-size:0.85rem;
    font-family:inherit; color:#0f172a; outline:none;
    background:#f8faff; transition:border-color 0.2s;
  }
  .avm-input:focus, .avm-select:focus, .avm-textarea:focus { border-color:#1a73e8; background:#fff; }
  .avm-err { border-color:#ef4444 !important; background:#fff5f5 !important; }
  .avm-error { font-size:0.72rem; color:#ef4444; font-weight:600; }
  .avm-textarea { resize:vertical; }
  .avm-footer { display:flex; gap:10px; padding:1rem 1.3rem; border-top:1px solid #f1f5f9; flex-shrink:0; }
  .avm-cancel { flex:1; padding:0.7rem; background:#f0f5ff; border:none; border-radius:10px; color:#475569; font-size:0.88rem; font-weight:600; font-family:inherit; cursor:pointer; }
  .avm-confirm { flex:2; padding:0.7rem; background:#1a73e8; border:none; border-radius:10px; color:#fff; font-size:0.88rem; font-weight:700; font-family:inherit; cursor:pointer; transition:background 0.15s; box-shadow:0 4px 12px rgba(26,115,232,0.35); }
  .avm-confirm:hover { background:#1557b0; }
  @media (max-width:480px) { .avm-grid { grid-template-columns:1fr; } }
`;
