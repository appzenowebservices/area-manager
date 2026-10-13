import { useRouter } from "next/navigation";
import QuickActionItem from "./QuickActionItem";

/**
 * QuickActions
 * File: src/components/dashboard/QuickActions.jsx
 *
 * Responsive auto-fit grid — never overflows.
 * Uses QuickActionItem for each button.
 */

const ACTIONS = [
  { label: "Assign Vendor",   desc: "Pending orders",      emoji: "🏪", bg: "#fdfbf7", color: "#ae2012", link: "/orders"     },
  { label: "Assign Delivery", desc: "Ready to dispatch",   emoji: "🚴", bg: "#d3ebd8", color: "#0c831f", link: "/orders"     },
  { label: "Add Vendor",      desc: "Onboard new vendor",  emoji: "➕", bg: "#f5ebe0", color: "#4a5d23", link: "/vendors"    },
  { label: "Add Lead",        desc: "Track prospect",      emoji: "👤", bg: "#faedcc", color: "#a67a22", link: "/leads"      },
  { label: "View Reports",    desc: "Performance data",    emoji: "📊", bg: "#eaf6ed", color: "#2196f3", link: "/reports"    },
  { label: "Complaints",      desc: "Resolve issues",      emoji: "⚠️", bg: "#fbebe9", color: "#d32f2f", link: "/complaints" },
];

export default function QuickActions() {
  const navigate = useRouter();

  return (
    <>
      <style>{css}</style>
      <div className="qa-card">
        <div className="qa-header">
          <p className="qa-title">Quick Actions</p>
          <p className="qa-sub">Common tasks at a glance</p>
        </div>
        <div className="qa-grid">
          {ACTIONS.map((a) => (
            <QuickActionItem
              key={a.label}
              emoji={a.emoji}
              label={a.label}
              desc={a.desc}
              bg={a.bg}
              color={a.color}
              onClick={() => navigate(a.link)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

const css = `
  .qa-card {
    background: #fff;
    border: 1px solid #e9d8bf;
    border-radius: 16px;
    padding: 1.1rem;
    box-shadow: 0 1px 4px rgba(45, 36, 30,0.05);
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
  }
  .qa-header { margin-bottom: 0.85rem; }
  .qa-title {
    font-family: 'Sora', sans-serif;
    font-size: 0.92rem;
    font-weight: 700;
    color: #2d241e;
    margin: 0;
  }
  .qa-sub { font-size: 0.72rem; color: #a68b66; margin: 3px 0 0; }
  .qa-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 7px;
    width: 100%;
    box-sizing: border-box;
  }
  @media (max-width: 400px) {
    .qa-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
`;
