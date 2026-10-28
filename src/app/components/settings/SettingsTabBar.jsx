export const SETTINGS_TABS = [
  { key: "profile", label: "Profile", icon: "👤" },
  { key: "banking", label: "Account & Banking", icon: "🏦" },
  { key: "password", label: "Password & Security", icon: "🔒" },
  { key: "notifications", label: "Notifications", icon: "🔔" },
  { key: "appearance", label: "Appearance", icon: "🎨" },
  { key: "area", label: "Area & Targets", icon: "📍" },
];

export default function SettingsTabBar({ active, onChange }) {
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-secondary-900 bg-background-section shadow-[4px_4px_0px_var(--color-secondary-900)]">
      <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SETTINGS_TABS.map((tab) => {
          const selected = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap border-r-2 border-secondary-100 px-4 py-3.5 text-sm font-bold transition-colors last:border-r-0 sm:px-5 ${
                selected
                  ? "bg-secondary-900 text-accent-300"
                  : "text-secondary-600 hover:bg-secondary-50 hover:text-primary-600"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
              {selected && (
                <span className="absolute inset-x-3 bottom-0 h-1 rounded-t-full bg-accent-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
