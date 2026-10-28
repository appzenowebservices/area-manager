"use client";

import { useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import { PageHeader } from "../components/brand/PageHeader";
import SettingsTabBar from "../components/settings/SettingsTabBar";
import ProfileSection from "../components/settings/ProfileSection";
import BankingSection from "../components/settings/BankingSection";
import PasswordSection from "../components/settings/PasswordSection";
import NotificationsSection from "../components/settings/NotificationsSection";
import AppearanceSection from "../components/settings/AppearanceSection";
import AreaInfoSection from "../components/settings/AreaInfoSection";

const SECTIONS = {
  profile: <ProfileSection />,
  banking: <BankingSection />,
  password: <PasswordSection />,
  notifications: <NotificationsSection />,
  appearance: <AppearanceSection />,
  area: <AreaInfoSection />,
};

export default function SettingsPage() {
  const [active, setActive] = useState("profile");

  return (
    <PageWrapper>
      <PageHeader
        kicker="Account"
        title="Settings"
        subtitle="Profile, banking, security and notification preferences"
      />

      <SettingsTabBar active={active} onChange={setActive} />

      <div key={active} className="flex flex-col gap-4">
        {SECTIONS[active]}
      </div>
    </PageWrapper>
  );
}
