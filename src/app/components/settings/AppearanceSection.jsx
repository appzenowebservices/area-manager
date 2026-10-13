import { useState } from "react";
import { SettingsCard, SaveBar } from "./SettingsUI";

/**
 * AppearanceSection
 * File: src/components/settings/AppearanceSection.jsx
 */

function OptionCard({ label, icon, desc, active, onClick }) {
  return (
    <button className={`ap-card${active ? " ap-active" : ""}`} onClick={onClick}>
      <span className="ap-icon">{icon}</span>
      <span className="ap-label">{label}</span>
      <span className="ap-desc">{desc}</span>
      {active && <span className="ap-check">✓</span>}
    </button>
  );
}

export default function AppearanceSection() {
  const [theme,    setTheme]    = useState("light");
  const [lang,     setLang]     = useState("en");
  const [density,  setDensity]  = useState("comfortable");
  const [fontSize, setFontSize] = useState("medium");
  const [loading,  setLoading]  = useState(false);
  const [saved,    setSaved]    = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <style>{css}</style>

      <SettingsCard title="Theme" subtitle="Choose your preferred color scheme">
        <div className="ap-grid ap-3">
          {[
            { val:"light",  label:"Light",  icon:"☀️",  desc:"Bright, clean look" },
            { val:"dark",   label:"Dark",   icon:"🌙",  desc:"Easy on the eyes" },
            { val:"system", label:"System", icon:"💻",  desc:"Follow device" },
          ].map(o => <OptionCard key={o.val} active={theme===o.val} onClick={()=>setTheme(o.val)} {...o} />)}
        </div>
      </SettingsCard>

      <SettingsCard title="Language" subtitle="Select your preferred language">
        <div className="ap-grid ap-3">
          {[
            { val:"en", label:"English", icon:"🇬🇧", desc:"Default" },
            { val:"hi", label:"हिंदी",   icon:"🇮🇳", desc:"Hindi" },
            { val:"ur", label:"اردو",     icon:"🇵🇰", desc:"Urdu" },
          ].map(o => <OptionCard key={o.val} active={lang===o.val} onClick={()=>setLang(o.val)} {...o} />)}
        </div>
      </SettingsCard>

      <SettingsCard title="Display Density" subtitle="Control how compact the interface feels">
        <div className="ap-grid ap-3">
          {[
            { val:"compact",     label:"Compact",     icon:"▤", desc:"More info, less space" },
            { val:"comfortable", label:"Comfortable", icon:"▣", desc:"Balanced (default)" },
            { val:"spacious",    label:"Spacious",    icon:"□", desc:"More breathing room" },
          ].map(o => <OptionCard key={o.val} active={density===o.val} onClick={()=>setDensity(o.val)} {...o} />)}
        </div>
      </SettingsCard>

      <SettingsCard title="Font Size" subtitle="Adjust text size across the app">
        <div className="ap-grid ap-3">
          {[
            { val:"small",  label:"Small",  icon:<span style={{fontSize:11,fontWeight:700}}>A</span>, desc:"Compact" },
            { val:"medium", label:"Medium", icon:<span style={{fontSize:14,fontWeight:700}}>A</span>, desc:"Default" },
            { val:"large",  label:"Large",  icon:<span style={{fontSize:17,fontWeight:700}}>A</span>, desc:"Readable" },
          ].map(o => <OptionCard key={o.val} active={fontSize===o.val} onClick={()=>setFontSize(o.val)} {...o} />)}
        </div>
      </SettingsCard>

      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <SaveBar loading={loading} saved={saved} savedMsg="Appearance saved!" onSave={handleSave} />
      </div>
    </>
  );
}

const css = `
  .ap-grid { display:grid; gap:8px; }
  .ap-3 { grid-template-columns:repeat(3,minmax(0,1fr)); }
  .ap-card {
    position:relative; display:flex; flex-direction:column;
    align-items:center; gap:5px; padding:0.9rem 0.5rem;
    border:1.5px solid #e9d8bf; border-radius:12px;
    background:#fff; cursor:pointer; font-family:inherit;
    transition:all 0.15s;
  }
  .ap-card:hover { background:#fdfbf7; border-color:#e9d8bf; }
  .ap-active { background:#fdfbf7; border-color:#ae2012; }
  .ap-icon  { font-size:1.3rem; }
  .ap-label { font-size:0.82rem; font-weight:700; color:#2d241e; }
  .ap-active .ap-label { color:#ae2012; }
  .ap-desc  { font-size:0.65rem; color:#a68b66; text-align:center; }
  .ap-check { position:absolute; top:6px; right:8px; font-size:0.7rem; color:#ae2012; font-weight:800; }
  @media (max-width:480px) { .ap-3 { grid-template-columns:repeat(2,minmax(0,1fr)); } }
`;
