"use client";

import { useEffect, useMemo, useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import { PageHeader } from "../components/brand/PageHeader";
import { BrandStatStrip } from "../components/brand/BrandStatStrip";
import OrderFilters from "../components/orders/OrderFilters";
import OrdersTable from "../components/orders/OrdersTable";
import OrderCard from "../components/orders/OrderCard";
import OrderDrawer from "../components/orders/OrderDrawer";
import { api } from "~/trpc/react";

export default function OrdersPage() {
  const { data: apiOrders, isLoading, error } = api.areaManagerData.orders.list.useQuery();
  const updateStatus = api.areaManagerData.orders.updateStatus.useMutation();
  const utils = api.useUtils();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [area, setArea] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (apiOrders) setOrders(apiOrders);
  }, [apiOrders]);

  const areas = useMemo(
    () => [...new Set(orders.map((order) => order.area))].sort(),
    [orders],
  );

  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const query = search.toLowerCase();
        const matchSearch =
          !search ||
          order.id.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.phone.includes(query);
        const matchStatus = status === "All" || order.status === status;
        const matchArea = area === "All" || order.area === area;
        return matchSearch && matchStatus && matchArea;
      }),
    [search, status, area, orders],
  );

  const handleReset = () => {
    setSearch("");
    setStatus("All");
    setDateFrom("");
    setDateTo("");
    setArea("All");
  };

  const handleOrderUpdate = (updated) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === updated.id ? updated : order)),
    );
    setSelectedOrder(updated);

    const rawStatus =
      {
        Pending: "created",
        Processing: "preparing",
        Delivered: "delivered",
        Cancelled: "cancelled",
      }[updated.status] ?? updated.rawStatus;

    if (rawStatus && updated.dbId) {
      updateStatus.mutate(
        { id: updated.dbId, status: rawStatus },
        { onSuccess: () => utils.areaManagerData.orders.list.invalidate() },
      );
    }
  };

  const counts = {
    Pending: orders.filter((order) => order.status === "Pending").length,
    Processing: orders.filter((order) => order.status === "Processing").length,
    Delivered: orders.filter((order) => order.status === "Delivered").length,
    Cancelled: orders.filter((order) => order.status === "Cancelled").length,
  };
  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + order.finalAmount, 0);

  return (
    <PageWrapper>
      <PageHeader
        kicker="Order Ops"
        title="Orders"
        subtitle="Track, assign and fulfil every customer order in your area"
        actions={
          <span className="rounded-2xl border-2 border-secondary-950 bg-accent-400 px-4 py-2 text-xs font-display font-black uppercase tracking-widest text-secondary-900">
            ₹{totalRevenue.toLocaleString("en-IN")} revenue
          </span>
        }
      />

      <BrandStatStrip
        items={[
          { label: "Total", value: orders.length, tone: "primary" },
          { label: "Pending", value: counts.Pending, tone: "accent" },
          { label: "Processing", value: counts.Processing, tone: "mehndi" },
          { label: "Delivered", value: counts.Delivered, tone: "fresh" },
          { label: "Cancelled", value: counts.Cancelled, tone: "danger" },
          {
            label: "Revenue",
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            tone: "fresh",
          },
        ]}
      />

      <OrderFilters
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={setStatus}
        dateFrom={dateFrom}
        onDateFrom={setDateFrom}
        dateTo={dateTo}
        onDateTo={setDateTo}
        area={area}
        onArea={setArea}
        areas={areas}
        total={filtered.length}
        onReset={handleReset}
      />

      <div className="hidden md:block">
        <OrdersTable orders={filtered} onView={setSelectedOrder} />
      </div>

      <div className="md:hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-secondary-300 px-4 py-14 text-secondary-500">
            <span className="text-4xl">📭</span>
            <p className="text-sm font-semibold">No orders found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} onView={setSelectedOrder} />
            ))}
          </div>
        )}
      </div>

      <OrderDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdate={handleOrderUpdate}
      />
    </PageWrapper>
  );
}
