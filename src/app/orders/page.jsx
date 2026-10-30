"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import { PageHeader } from "../components/brand/PageHeader";
import { BrandStatStrip } from "../components/brand/BrandStatStrip";
import { BrandButton } from "../components/brand/BrandButton";
import OrderFilters from "../components/orders/OrderFilters";
import OrdersTable from "../components/orders/OrdersTable";
import OrderCard from "../components/orders/OrderCard";
import OrderDrawer from "../components/orders/OrderDrawer";
import { api } from "~/trpc/react";

const PAGE_SIZE = 25;

export default function OrdersPage() {
  const { data: apiOrders, isLoading, error, isFetching } =
    api.areaManagerData.orders.list.useQuery();
  const updateStatus = api.areaManagerData.orders.updateStatus.useMutation();
  const utils = api.useUtils();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (apiOrders) setOrders(apiOrders);
  }, [apiOrders]);

  useEffect(() => {
    setPage(1);
  }, [search, status, paymentStatus, dateFrom, dateTo]);

  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const query = search.toLowerCase();
        const matchSearch =
          !search ||
          order.id.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.phone.includes(query) ||
          order.vendor.name.toLowerCase().includes(query);
        const matchStatus = status === "All" || order.status === status;
        const matchPayment =
          paymentStatus === "All" || order.paymentStatus === paymentStatus;

        const created = order.createdAt ? new Date(order.createdAt) : null;
        const matchFrom = !dateFrom || (created && created >= new Date(dateFrom));
        const matchTo =
          !dateTo || (created && created <= new Date(`${dateTo}T23:59:59`));

        return matchSearch && matchStatus && matchPayment && matchFrom && matchTo;
      }),
    [orders, search, status, paymentStatus, dateFrom, dateTo],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => {
    const active = orders.filter((order) => order.status !== "Cancelled");
    const paid = orders.filter(
      (order) => order.paymentStatus === "Paid" && order.status !== "Cancelled",
    );
    return {
      total: orders.length,
      gross: active.reduce((sum, order) => sum + order.finalAmount, 0),
      paid: paid.reduce((sum, order) => sum + order.finalAmount, 0),
      delivered: orders.filter((order) => order.status === "Delivered").length,
      inProgress: orders.filter(
        (order) => order.status === "Pending" || order.status === "Processing",
      ).length,
      cancelled: orders.filter((order) => order.status === "Cancelled").length,
    };
  }, [orders]);

  const rangeLabel = useMemo(() => {
    if (!filtered.length) return "0";
    const start = (page - 1) * PAGE_SIZE + 1;
    const end = Math.min(page * PAGE_SIZE, filtered.length);
    return `${start}–${end} of ${filtered.length}`;
  }, [page, filtered.length]);

  const handleReset = () => {
    setSearch("");
    setStatus("All");
    setPaymentStatus("All");
    setDateFrom("");
    setDateTo("");
    setPage(1);
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

    if (rawStatus) {
      updateStatus.mutate(
        { id: updated.dbId ?? updated.id, status: rawStatus },
        { onSuccess: () => utils.areaManagerData.orders.list.invalidate() },
      );
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        kicker="Order Ops"
        title="Orders"
        subtitle="Every customer order, payment and fulfilment record in your area."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-2xl border-2 border-secondary-950 bg-accent-400 px-4 py-2 text-xs font-display font-black uppercase tracking-widest text-secondary-900">
              ₹{stats.gross.toLocaleString("en-IN")} revenue
            </span>
            <BrandButton
              variant="ghost"
              className="py-2.5"
              onClick={() => void utils.areaManagerData.orders.list.invalidate()}
              disabled={isFetching}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              {isFetching ? "Sync" : "Refresh"}
            </BrandButton>
          </div>
        }
      />

      <BrandStatStrip
        items={[
          { label: "Total Orders", value: stats.total, tone: "primary" },
          {
            label: "Gross Value",
            value: `₹${stats.gross.toLocaleString("en-IN")}`,
            tone: "primary",
          },
          {
            label: "Paid Revenue",
            value: `₹${stats.paid.toLocaleString("en-IN")}`,
            tone: "fresh",
          },
          { label: "Delivered", value: stats.delivered, tone: "fresh" },
          { label: "In Progress", value: stats.inProgress, tone: "accent" },
          { label: "Cancelled", value: stats.cancelled, tone: "danger" },
        ]}
      />

      <OrderFilters
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={setStatus}
        paymentStatus={paymentStatus}
        onPaymentStatus={setPaymentStatus}
        dateFrom={dateFrom}
        onDateFrom={setDateFrom}
        dateTo={dateTo}
        onDateTo={setDateTo}
        total={filtered.length}
        onReset={handleReset}
      />

      <div className="hidden md:block">
        <OrdersTable orders={paginated} onView={setSelectedOrder} />
      </div>

      <div className="md:hidden">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-secondary-300 px-4 py-14 text-secondary-500">
            <span className="text-4xl">📭</span>
            <p className="text-sm font-semibold">No orders found</p>
            <p className="text-xs">Try clearing the search or filters.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {paginated.map((order) => (
              <OrderCard key={order.id} order={order} onView={setSelectedOrder} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border-2 border-secondary-200 bg-background-section px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-bold text-secondary-500">
          Showing <span className="text-primary-600">{rangeLabel}</span> · Page{" "}
          <span className="text-primary-600">{page}</span> of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1 || isLoading}
            className="inline-flex items-center gap-1 rounded-full border-2 border-secondary-200 px-3 py-1.5 text-[11px] font-black text-secondary-700 transition-colors hover:border-secondary-900 disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Previous
          </button>
          <button
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page >= totalPages || isLoading}
            className="inline-flex items-center gap-1 rounded-full border-2 border-secondary-200 px-3 py-1.5 text-[11px] font-black text-secondary-700 transition-colors hover:border-secondary-900 disabled:opacity-40"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-2xl border-2 border-primary-200 bg-primary-50 p-3 text-sm font-semibold text-primary-700">
          Could not load orders: {error.message}
        </p>
      ) : null}

      <OrderDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdate={handleOrderUpdate}
      />
    </PageWrapper>
  );
}
