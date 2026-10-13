/**
 * SettingsTabBar
 * File: src/components/settings/SettingsTabBar.jsx
 *
 * Horizontal scrollable tab bar for settings sections.
 * Props:  active string, onChange fn(key)
 */

export const SETTINGS_TABS = [
  { key: "profile",       label: "Profile",          icon: "👤" },
  { key: "banking",       label: "Account & Banking", icon: "🏦" },
  { key: "password",      label: "Password & Security", icon: "🔒" },
  { key: "notifications", label: "Notifications",    icon: "🔔" },
  { key: "appearance",    label: "Appearance",       icon: "🎨" },
  { key: "area",          label: "Area & Targets",   icon: "📍" },
];

export default function SettingsTabBar({ active, onChange }) {
  return (
    <>
      <style>{css}</style>
      <div className="stb-wrap">
        <div className="stb-scroll">
          {SETTINGS_TABS.map(t => (
            <button
              key={t.key}
              className={`stb-tab${active === t.key ? " stb-active" : ""}`}
              onClick={() => onChange(t.key)}
            >
              <span className="stb-icon">{t.icon}</span>
              <span className="stb-label">{t.label}</span>
              {active === t.key && <span className="stb-underline" />}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

const css = `
  .stb-wrap {
    background: #fff;
    border: 1px solid #e9d8bf;
    border-radius: 14px;
    padding: 0 0.5rem;
    margin-bottom: 1.25rem;
    overflow: hidden;
  }
  .stb-scroll {
    display: flex;
    gap: 0;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .stb-scroll::-webkit-scrollbar { display: none; }

  .stb-tab {
    position: relative;
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0.9rem 1.1rem;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
    transition: background 0.15s;
    flex-shrink: 0;
  }
  .stb-tab:hover .stb-label { color: #ae2012; }
  .stb-icon { font-size: 1rem; }
  .stb-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #7d6b5d;
    transition: color 0.15s;
  }
  .stb-active .stb-label { color: #ae2012; }
  .stb-underline {
    position: absolute;
    bottom: 0; left: 12px; right: 12px;
    height: 2.5px;
    background: #ae2012;
    border-radius: 2px 2px 0 0;
  }

  @media (max-width: 600px) {
    .stb-tab { padding: 0.8rem 0.75rem; gap: 5px; }
    .stb-label { font-size: 0.78rem; }
    .stb-icon  { font-size: 0.9rem; }
  }
`;
