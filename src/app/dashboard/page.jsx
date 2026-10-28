"use client";

import PageWrapper from "../components/layout/PageWrapper";
import { PageHeader } from "../components/brand/PageHeader";
import { BrandBadge } from "../components/brand/BrandBadge";
import StatsGrid from "../components/dashboard/StatsGrid";
import OrdersChart from "../components/dashboard/OrdersChart";
import AlertsSection from "../components/dashboard/AlertsSection";
import QuickActions from "../components/dashboard/QuickActions";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";
import useAuthStore from "../hooks/authStore";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <PageWrapper>
      <PageHeader
        kicker="Area Manager Hub"
        title={`${greeting}, ${user?.name?.split(" ")[0] || "Manager"} 👋`}
        subtitle={new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        actions={
          <BrandBadge tone="fresh">
            <span className="h-1.5 w-1.5 rounded-full bg-fresh-600" />
            Area Manager · Active
          </BrandBadge>
        }
      />

      <StatsGrid />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,340px)] xl:items-start">
        <OrdersChart />
        <AlertsSection />
      </div>

      <QuickActions />

      <RecentOrdersTable />
    </PageWrapper>
  );
}
