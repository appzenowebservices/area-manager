'use client'
import PageWrapper       from "../components/layout/PageWrapper";
import StatsGrid         from "../components/dashboard/StatsGrid";
import OrdersChart       from "../components/dashboard/OrdersChart";
import AlertsSection     from "../components/dashboard/AlertsSection";
import QuickActions      from "../components/dashboard/QuickActions";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";
import useAuthStore      from "../hooks/authStore";

/**
 * DashboardPage
 * File: src/pages/dashboard/DashboardPage.jsx
 *
 * All grid columns use minmax(0, ...) — never overflows.
 */
export default function DashboardPage() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <PageWrapper>
      <style>{css}</style>

      {/* Welcome */}
      <div className="db-welcome">
        <div>
          <h1 className="db-greeting">
            {greeting}, {user?.name?.split(" ")[0] || "Manager"} 👋
          </h1>
          <p className="db-date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long", day: "numeric",
              month: "long", year: "numeric",
            })}
          </p>
        </div>
        <div className="db-badge">
          <span className="db-dot" />
          Area Manager · Active
        </div>
      </div>

      {/* Stats */}
      <StatsGrid />

      {/* Chart + Right Panel */}
      <div className="db-mid">
        <div className="db-left">
          <OrdersChart />
        </div>
        <div className="db-right">
          <AlertsSection />
          {/* <div className="db-qa-wrap">
            <QuickActions />
          </div> */}
        </div>
      </div>

      <div className="db-qa-wrap">
        <QuickActions />
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable />
    </PageWrapper>
  );
}

const css = `
  .db-welcome {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 1.4rem;
  }
  .db-greeting {
    font-family: 'Sora', sans-serif;
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
    margin: 0;
  }
  .db-date { font-size: 0.8rem; color: #94a3b8; margin-top: 3px; }
  .db-badge {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0.4rem 0.9rem;
    background: #d1fae5;
    border: 1px solid #6ee7b7;
    border-radius: 99px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #065f46;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .db-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #10b981;
    animation: dbPulse 2s infinite;
  }
  @keyframes dbPulse {
    0%,100% { box-shadow: 0 0 0 2px rgba(16,185,129,0.3); }
    50%      { box-shadow: 0 0 0 5px rgba(16,185,129,0.1); }
  }

  /* ── Middle: Chart + Right panel ── */
  .db-mid {
    display: grid;
    /* KEY FIX: minmax(0,1fr) prevents overflow, clamp right col */
    grid-template-columns: minmax(0, 1fr) minmax(0, 340px);
    gap: 14px;
    margin-bottom: 1.4rem;
    align-items: start;
    width: 100%;
    box-sizing: border-box;
  }
  .db-left {
    min-width: 0;   /* critical — prevents chart from overflowing */
    width: 100%;
  }
  .db-right {
    min-width: 0;   /* critical — prevents right col from overflowing */
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .db-qa-wrap {
    min-width: 0;
    width: 100%;
  }

  /* Tablet: stack everything */
  @media (max-width: 960px) {
    .db-mid {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    .db-welcome { margin-bottom: 1rem; }
  }
`;
