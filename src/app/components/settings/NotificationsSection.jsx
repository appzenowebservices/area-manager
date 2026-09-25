import { useState } from "react";
import { SettingsCard, SaveBar } from "./SettingsUI";

/**
 * NotificationsSection
 * File: src/components/settings/NotificationsSection.jsx
 */

const GROUPS = [
  { group: "Orders", icon: "📦", items: [
    { key: "new_order",    label: "New Order",          desc: "When a new order arrives in your area" },
    { key: "order_status", label: "Order Status Update", desc: "When order status changes" },
    { key: "order_delay",  label: "Delivery Delay",      desc: "When delivery is running late" },
    { key: "order_cancel", label: "Order Cancelled",      desc: "When a customer cancels" },
  ]},
  { group: "Vendors", icon: "🏪", items: [
    { key: "vendor_request", label: "Vendor Request",   desc: "New vendor application received" },
    { key: "vendor_payment", label: "Vendor Payout",    desc: "When vendor settlement is processed" },
    { key: "vendor_complaint",label: "Vendor Complaint",desc: "When a vendor raises an issue" },
  ]},
  { group: "Delivery Partners", icon: "🚴", items: [
    { key: "dp_available", label: "Partner Online",     desc: "When a partner comes available" },
    { key: "dp_complaint",  label: "Partner Issue",     desc: "Complaint from delivery partner" },
  ]},
  { group: "Leads & Targets", icon: "🎯", items: [
    { key: "lead_followup",  label: "Follow-up Reminder", desc: "Daily reminder for pending leads" },
    { key: "lead_converted", label: "Lead Converted",     desc: "When a lead becomes a customer/vendor" },
    { key: "target_hit",     label: "Target Achieved",    desc: "When you hit weekly/monthly goals" },
  ]},
  { group: "System & Alerts", icon: "⚙️", items: [
    { key: "new_complaint",  label: "New Complaint",    desc: "Any complaint filed in your area" },
    { key: "weekly_report",  label: "Weekly Report",    desc: "Every Monday morning summary" },
    { key: "app_update",     label: "App Updates",      desc: "New features and announcements" },
  ]},
];

function Toggle({ on, onChange }) {
  return (
    <button className={`nt-toggle${on ? " nt-on" : ""}`}
      onClick={() => onChange(!on)} role="switch" aria-checked={on}>
      <span className="nt-thumb" />
    </button>
  );
}

export default function NotificationsSection() {
  const allKeys = GROUPS.flatMap(g => g.items).reduce((a, i) => ({...a, [i.key]: true}), {});
  const [prefs,   setPrefs]   = useState(allKeys);
  const [channel, setChannel] = useState({ push: true, sms: false, email: true });
  const [loading, setLoading] = useState(false);
  const [saved,   setSaved]   = useState(false);

  const toggle    = k => setPrefs(p => ({...p, [k]: !p[k]}));
  const toggleAll = (items, val) => setPrefs(p => ({...p, ...Object.fromEntries(items.map(i => [i.key, val]))}));

  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <style>{css}</style>

      {/* Channels */}
      <SettingsCard title="Notification Channels" subtitle="Choose how you want to receive alerts">
        <div className="nt-channels">
          {[
            { key:"push",  label:"Push Notifications", icon:"📱", desc:"In-app alerts" },
            { key:"sms",   label:"SMS Alerts",          icon:"💬", desc:"Text messages" },
            { key:"email", label:"Email Digest",        icon:"📧", desc:"Daily summary" },
          ].map(ch => (
            <div key={ch.key} className={`nt-channel${channel[ch.key] ? " nt-ch-on" : ""}`}>
              <span className="nt-ch-icon">{ch.icon}</span>
              <div className="nt-ch-text">
                <span className="nt-ch-label">{ch.label}</span>
                <span className="nt-ch-desc">{ch.desc}</span>
              </div>
              <Toggle on={channel[ch.key]} onChange={v => setChannel(c => ({...c, [ch.key]: v}))} />
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Per-group toggles */}
      {GROUPS.map(group => {
        const allOn = group.items.every(i => prefs[i.key]);
        return (
          <SettingsCard key={group.group}>
            <div className="nt-group-hdr">
              <span className="nt-group-icon">{group.icon}</span>
              <span className="nt-group-name">{group.group}</span>
              <button className="nt-all-btn" onClick={() => toggleAll(group.items, !allOn)}>
                {allOn ? "Turn off all" : "Turn on all"}
              </button>
            </div>
            {group.items.map(item => (
              <div key={item.key} className="nt-item">
                <div className="nt-item-text">
                  <span className="nt-item-label">{item.label}</span>
                  <span className="nt-item-desc">{item.desc}</span>
                </div>
                <Toggle on={prefs[item.key]} onChange={() => toggle(item.key)} />
              </div>
            ))}
          </SettingsCard>
        );
      })}

      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <SaveBar loading={loading} saved={saved} savedMsg="Preferences saved!" onSave={handleSave} />
      </div>
    </>
  );
}

const css = `
  .nt-channels { display:flex; flex-direction:column; gap:8px; }
  .nt-channel {
    display:flex; align-items:center; gap:12px;
    padding:0.75rem 0.9rem;
    border:1.5px solid #e2e8f0; border-radius:12px;
    background:#fff; transition:all 0.15s;
  }
  .nt-ch-on { border-color:#bfdbfe; background:#f0f7ff; }
  .nt-ch-icon { font-size:1.1rem; }
  .nt-ch-text { flex:1; min-width:0; }
  .nt-ch-label { display:block; font-size:0.85rem; font-weight:600; color:#1e293b; }
  .nt-ch-desc  { display:block; font-size:0.72rem; color:#94a3b8; margin-top:1px; }

  .nt-toggle {
    width:40px; height:22px; border-radius:11px;
    background:#e2e8f0; border:none; cursor:pointer;
    position:relative; transition:background 0.2s; flex-shrink:0; padding:0;
  }
  .nt-on { background:#1a73e8; }
  .nt-thumb {
    position:absolute; top:3px; left:3px;
    width:16px; height:16px; border-radius:50%;
    background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.15);
    transition:transform 0.2s cubic-bezier(0.4,0,0.2,1);
  }
  .nt-on .nt-thumb { transform:translateX(18px); }

  .nt-group-hdr {
    display:flex; align-items:center; gap:8px;
    padding-bottom:10px; margin-bottom:4px;
    border-bottom:1px solid #f1f5f9;
  }
  .nt-group-icon { font-size:1rem; }
  .nt-group-name { flex:1; font-size:0.9rem; font-weight:700; color:#0f172a; }
  .nt-all-btn {
    font-size:0.72rem; font-weight:600; color:#1a73e8;
    background:none; border:none; cursor:pointer; font-family:inherit; padding:0;
  }

  .nt-item {
    display:flex; align-items:center; gap:12px;
    padding:0.65rem 0; border-bottom:1px solid #f8faff;
  }
  .nt-item:last-child { border-bottom:none; }
  .nt-item-text { flex:1; min-width:0; }
  .nt-item-label { display:block; font-size:0.84rem; font-weight:600; color:#1e293b; }
  .nt-item-desc  { display:block; font-size:0.71rem; color:#94a3b8; margin-top:1px; }
`;
