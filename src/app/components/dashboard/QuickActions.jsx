import { useRouter } from "next/navigation";
import QuickActionItem from "./QuickActionItem";
import { BrandCard } from "../brand/BrandCard";

const ACTIONS = [
  { label: "Assign Vendor", desc: "Pending orders", emoji: "🏪", tone: "primary", link: "/orders" },
  { label: "Assign Delivery", desc: "Ready to dispatch", emoji: "🚴", tone: "fresh", link: "/orders" },
  { label: "Add Vendor", desc: "Onboard new vendor", emoji: "➕", tone: "mehndi", link: "/vendors" },
  { label: "Add Lead", desc: "Track prospect", emoji: "👤", tone: "accent", link: "/leads" },
  { label: "View Reports", desc: "Performance data", emoji: "📊", tone: "fresh", link: "/reports" },
  { label: "Complaints", desc: "Resolve issues", emoji: "⚠️", tone: "danger", link: "/complaints" },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <BrandCard>
      <div className="mb-3">
        <h2 className="font-display text-xl font-black text-secondary-900">
          Quick Actions
        </h2>
        <p className="mt-0.5 text-sm font-semibold text-secondary-500">
          Common tasks at a glance
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {ACTIONS.map((action) => (
          <QuickActionItem
            key={action.label}
            emoji={action.emoji}
            label={action.label}
            desc={action.desc}
            tone={action.tone}
            onClick={() => router.push(action.link)}
          />
        ))}
      </div>
    </BrandCard>
  );
}
