import { useState } from "react";
import PageWrapper          from "../../components/layout/PageWrapper";
import SettingsTabBar, { SETTINGS_TABS } from "../../components/settings/SettingsTabBar";
import ProfileSection       from "../../components/settings/ProfileSection";
import BankingSection       from "../../components/settings/BankingSection";
import PasswordSection      from "../../components/settings/PasswordSection";
import NotificationsSection from "../../components/settings/NotificationsSection";
import AppearanceSection    from "../../components/settings/AppearanceSection";
import AreaInfoSection      from "../../components/settings/AreaInfoSection";

/**
 * SettingsPage
 * File: src/pages/settings/SettingsPage.jsx
 *
 * Layout:
 *  ─ Page header
 *  ─ Horizontal tab bar (top)
 *  ─ Section content (below)
 */

const SECTIONS = {
  profile:       <ProfileSection />,
  banking:       <BankingSection />,
  password:      <PasswordSection />,
  notifications: <NotificationsSection />,
  appearance:    <AppearanceSection />,
  area:          <AreaInfoSection />,
};

export default function SettingsPage() {
  const [active, setActive] = useState("profile");

  return (
    <PageWrapper>
      <style>{css}</style>

      {/* Header */}
      <div className="sp-header">
        <h1 className="sp-title">Settings</h1>
        <p className="sp-sub">Manage your profile, banking, security and preferences</p>
      </div>

      {/* Top Tab Bar */}
      <SettingsTabBar active={active} onChange={setActive} />

      {/* Content area */}
      <div className="sp-content" key={active}>
        {SECTIONS[active]}
      </div>
    </PageWrapper>
  );
}

const css = `
  .sp-header { margin-bottom: 1.25rem; }
  .sp-title {
    font-family: 'Sora', sans-serif;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    font-weight: 800; color: #2d241e;
    letter-spacing: -0.02em; margin: 0;
  }
  .sp-sub { font-size: 0.82rem; color: #a68b66; margin-top: 3px; }

  .sp-content {
    display: flex;
    flex-direction: column;
    gap: 14px;
    animation: spIn 0.25s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes spIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
