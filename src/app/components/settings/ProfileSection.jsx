import { useState } from "react";
import useAuthStore from "../../store/authStore";
import { SettingsCard, FormField, SaveBar, inputCss } from "./SettingsUI";

/**
 * ProfileSection
 * File: src/components/settings/ProfileSection.jsx
 */
export default function ProfileSection() {
  const { user, updateUser } = useAuthStore();

  const [form, setForm] = useState({
    name:     user?.name     || "Area Manager",
    phone:    user?.phone    || "9999999999",
    altPhone: "",
    email:    user?.email    || "manager@add.in",
    area:     "Lucknow Central",
    address:  "",
    city:     "Lucknow",
    state:    "Uttar Pradesh",
    pincode:  "",
    bio:      "",
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [saved,   setSaved]   = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name  = "Name is required";
    if (form.phone.length !== 10) e.phone = "Enter valid 10-digit number";
    if (form.email && !/\S+@\S+/.test(form.email)) e.email = "Enter valid email";
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) e.pincode = "Must be 6 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    updateUser(form);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <style>{inputCss}{css}</style>

      <SettingsCard title="Profile Picture">
        <div className="pf-avatar-row">
          <div className="pf-avatar">{initials}</div>
          <div className="pf-avatar-info">
            <p className="pf-name">{form.name}</p>
            <p className="pf-role">Area Manager · {form.area}</p>
            <div className="pf-avatar-btns">
              <button className="pf-btn-blue">Upload Photo</button>
              <button className="pf-btn-ghost">Remove</button>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Personal Information" subtitle="Your basic details and contact info">
        <div className="pf-grid">
          <FormField label="Full Name" error={errors.name}>
            <input className={`si-input${errors.name ? " si-input-error" : ""}`}
              value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your full name" />
          </FormField>
          <FormField label="Email Address" error={errors.email}>
            <input className={`si-input${errors.email ? " si-input-error" : ""}`}
              type="email" value={form.email}
              onChange={e => set("email", e.target.value)} placeholder="you@add.in" />
          </FormField>
          <FormField label="Primary Phone" error={errors.phone}>
            <input className={`si-input${errors.phone ? " si-input-error" : ""}`}
              type="tel" maxLength={10} value={form.phone}
              onChange={e => set("phone", e.target.value.replace(/\D/g,"").slice(0,10))}
              placeholder="10-digit mobile" />
          </FormField>
          <FormField label="Alternate Phone">
            <input className="si-input" type="tel" maxLength={10}
              value={form.altPhone}
              onChange={e => set("altPhone", e.target.value.replace(/\D/g,"").slice(0,10))}
              placeholder="Optional" />
          </FormField>
        </div>
        <FormField label="Bio" hint="Brief description about your role">
          <textarea className="si-input pf-textarea"
            value={form.bio} onChange={e => set("bio", e.target.value)}
            placeholder="e.g. Managing Lucknow Central area since Jan 2024..." rows={2} />
        </FormField>
        <SaveBar loading={loading} saved={saved} onSave={handleSave} />
      </SettingsCard>

      <SettingsCard title="Address" subtitle="Your office or home address">
        <div className="pf-grid">
          <FormField label="Street Address">
            <input className="si-input" value={form.address}
              onChange={e => set("address", e.target.value)} placeholder="Street, locality" />
          </FormField>
          <FormField label="Coverage Area">
            <input className="si-input" value={form.area}
              onChange={e => set("area", e.target.value)} placeholder="e.g. Lucknow Central" />
          </FormField>
          <FormField label="City">
            <input className="si-input" value={form.city}
              onChange={e => set("city", e.target.value)} placeholder="City" />
          </FormField>
          <FormField label="State">
            <input className="si-input" value={form.state}
              onChange={e => set("state", e.target.value)} placeholder="State" />
          </FormField>
          <FormField label="Pincode" error={errors.pincode}>
            <input className={`si-input${errors.pincode ? " si-input-error" : ""}`}
              maxLength={6} value={form.pincode}
              onChange={e => set("pincode", e.target.value.replace(/\D/g,"").slice(0,6))}
              placeholder="6-digit pincode" />
          </FormField>
        </div>
        <SaveBar loading={loading} saved={saved} savedMsg="Address saved!" onSave={handleSave} />
      </SettingsCard>
    </>
  );
}

const css = `
  .pf-avatar-row { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
  .pf-avatar {
    width:68px; height:68px; border-radius:50%;
    background:linear-gradient(135deg,#1a73e8,#0d47a1);
    color:#fff; font-size:1.3rem; font-weight:700;
    display:flex; align-items:center; justify-content:center;
    font-family:'Sora',sans-serif; flex-shrink:0;
  }
  .pf-name { font-weight:700; color:#0f172a; font-size:1rem; margin:0 0 2px; }
  .pf-role { font-size:0.75rem; color:#94a3b8; margin:0 0 10px; }
  .pf-avatar-btns { display:flex; gap:8px; }
  .pf-btn-blue {
    padding:0.35rem 0.85rem; background:#e8f0fe; color:#1a73e8;
    border:none; border-radius:8px; font-size:0.78rem; font-weight:600;
    font-family:inherit; cursor:pointer; transition:background 0.15s;
  }
  .pf-btn-blue:hover { background:#d2e3fc; }
  .pf-btn-ghost {
    padding:0.35rem 0.85rem; background:transparent; color:#94a3b8;
    border:1.5px solid #e2e8f0; border-radius:8px; font-size:0.78rem;
    font-weight:600; font-family:inherit; cursor:pointer; transition:all 0.15s;
  }
  .pf-btn-ghost:hover { border-color:#ef4444; color:#ef4444; }
  .pf-grid {
    display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:0.9rem;
  }
  .pf-textarea { resize:vertical; min-height:70px; }
  @media (max-width:520px) { .pf-grid { grid-template-columns:minmax(0,1fr); } }
`;
