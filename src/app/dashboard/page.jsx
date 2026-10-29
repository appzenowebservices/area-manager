"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
  ShoppingBag,
  TrendingUp,
  Truck,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageWrapper from "../components/layout/PageWrapper";
import { PageHeader } from "../components/brand/PageHeader";
import { BrandBadge, statusTone } from "../components/brand/BrandBadge";
import { BrandCard, BrandStat } from "../components/brand/BrandCard";
import { BrandButton } from "../components/brand/BrandButton";
import OrderDrawer from "../components/orders/OrderDrawer";
import useAuthStore from "../hooks/authStore";
import { api } from "~/trpc/react";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data, isLoading, error } = api.areaManagerData.dashboard.overview.useQuery();
  const utils = api.useUtils();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="rounded-3xl border-2 border-secondary-900 bg-background-section p-10 text-center shadow-[6px_6px_0px_var(--color-secondary-900)]">
            <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-secondary-200 border-t-primary-600" />
            <p className="font-display font-black text-secondary-900">Loading your area…</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !data) {
    return (
      <PageWrapper>
        <BrandCard>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-primary-600" />
            <div>
              <p className="font-display font-black text-secondary-900">
                Could not load dashboard
              </p>
              <p className="text-sm font-semibold text-secondary-500">
                {error?.message ?? "Please refresh and try again."}
              </p>
            </div>
          </div>
        </BrandCard>
      </PageWrapper>
    );
  }

  const { stats, chart, alerts, recentOrders } = data;

  return (
    <PageWrapper>
      <PageHeader
        kicker="Area Manager Hub"
        title={`${greeting}, ${data.manager.name?.split(" ")[0] || user?.name?.split(" ")[0] || "Manager"} 👋`}
        subtitle={new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <BrandBadge tone="fresh">
              <span className="h-1.5 w-1.5 rounded-full bg-fresh-600" />
              {data.manager.regions?.join(", ") || "Area live"}
            </BrandBadge>
            <BrandButton variant="accent" className="py-2.5" onClick={() => router.push("/orders")}>
              View Orders →
            </BrandButton>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <BrandStat
          icon={<ShoppingBag className="h-5 w-5" />}
          value={String(stats.total)}
          label="Total Orders"
          tint="primary"
        />
        <BrandStat
          icon={<TrendingUp className="h-5 w-5" />}
          value={`₹${stats.revenue.toLocaleString("en-IN")}`}
          label="Revenue"
          tint="fresh"
        />
        <BrandStat
          icon={<Clock className="h-5 w-5" />}
          value={String(stats.pending + stats.processing)}
          label="Active Orders"
          tint="accent"
        />
        <BrandStat
          icon={<CheckCircle2 className="h-5 w-5" />}
          value={String(stats.delivered)}
          label="Delivered"
          tint="mehndi"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,340px)] xl:items-start">
        <BrandCard>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-black text-secondary-900">
                Orders Trend
              </h2>
              <p className="mt-0.5 text-sm font-semibold text-secondary-500">
                Last 7 days activity
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-secondary-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary-600" /> Orders
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-fresh-600" /> Delivered
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={chart} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ae2012" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ae2012" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="deliveredFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0c831f" stopOpacity={0.16} />
                  <stop offset="95%" stopColor="#0c831f" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5ebe0" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#a68b66", fontFamily: "Poppins, sans-serif" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#a68b66", fontFamily: "Poppins, sans-serif" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 16,
                  border: "2px solid #2d241e",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="Orders"
                stroke="#ae2012"
                strokeWidth={2.5}
                fill="url(#ordersFill)"
              />
              <Area
                type="monotone"
                dataKey="Delivered"
                stroke="#0c831f"
                strokeWidth={2.5}
                fill="url(#deliveredFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </BrandCard>

        <BrandCard>
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary-600" />
            <h2 className="font-display text-xl font-black text-secondary-900">Alerts</h2>
            <span className="rounded-full border-2 border-primary-200 bg-primary-50 px-2 py-0.5 text-[10px] font-black text-primary-700">
              {alerts.length}
            </span>
          </div>
          {alerts.length === 0 ? (
            <div className="flex items-center gap-3 rounded-2xl border-2 border-fresh-200 bg-fresh-50 p-4">
              <CheckCircle2 className="h-6 w-6 text-fresh-600" />
              <div>
                <p className="font-display text-sm font-black text-secondary-900">All clear!</p>
                <p className="text-xs font-semibold text-secondary-500">
                  No pending alerts right now.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {alerts.map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => router.push(alert.link)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left ${
                    alert.type === "danger"
                      ? "border-primary-200 bg-primary-50"
                      : "border-accent-200 bg-accent-50"
                  }`}
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      alert.type === "danger" ? "bg-primary-700" : "bg-accent-400"
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-secondary-900">
                      {alert.title}
                    </span>
                    <span className="block truncate text-xs font-semibold text-secondary-500">
                      {alert.desc || "Tap to review"}
                    </span>
                  </span>
                  <span className="text-[10px] font-black text-primary-600">{alert.action} →</span>
                </button>
              ))}
            </div>
          )}
        </BrandCard>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Processing", value: stats.processing, icon: Package, tint: "accent" },
          { label: "Cancelled", value: stats.cancelled, icon: XCircle, tint: "primary" },
          { label: "Delivery unassigned", value: stats.unassignedDelivery, icon: Truck, tint: "accent" },
          { label: "Delivered", value: stats.delivered, icon: CheckCircle2, tint: "fresh" },
        ].map((item) => (
          <BrandStat
            key={item.label}
            icon={<item.icon className="h-5 w-5" />}
            value={String(item.value)}
            label={item.label}
            tint={item.tint}
          />
        ))}
      </div>

      <BrandCard className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b-2 border-secondary-200 p-5 sm:p-6">
          <div>
            <h2 className="font-display text-xl font-black text-secondary-900">
              Recent Orders
            </h2>
            <p className="mt-0.5 text-sm font-semibold text-secondary-500">
              Latest real orders from your vendors
            </p>
          </div>
          <button
            onClick={() => router.push("/orders")}
            className="rounded-2xl border-2 border-secondary-900 bg-background-section px-4 py-2 text-xs font-display font-black text-secondary-900 hover:bg-accent-400"
          >
            View All →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-14 text-center text-secondary-500">
            <ShoppingBag className="h-10 w-10 text-secondary-300" />
            <p className="text-sm font-semibold">No orders yet</p>
            <p className="text-xs font-medium">New orders will appear here in real time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead>
                <tr className="bg-secondary-900 text-left text-[10px] font-black uppercase tracking-[0.12em] text-accent-300">
                  {["Order", "Customer", "Vendor", "Amount", "Status", "Time", ""].map(
                    (heading) => (
                      <th key={heading} className="px-4 py-3">
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary-50">
                    <td className="px-4 py-3 font-display text-xs font-black text-primary-600">
                      {order.id}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-secondary-900">
                        {order.customer.name}
                      </p>
                      <p className="text-[10px] font-semibold text-secondary-400">
                        {order.customer.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-secondary-700">
                      {order.vendor.name}
                    </td>
                    <td className="px-4 py-3 font-display text-sm font-black text-secondary-900">
                      ₹{order.finalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <BrandBadge tone={statusTone(order.status)}>{order.status}</BrandBadge>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-secondary-500">
                      {order.time}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-full border-2 border-secondary-900 bg-background-section px-3 py-1 text-[11px] font-black text-primary-600 hover:bg-accent-400"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </BrandCard>

      <OrderDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdate={() => {
          setSelectedOrder(null);
          void utils.areaManagerData.dashboard.overview.invalidate();
        }}
      />
    </PageWrapper>
  );
}
