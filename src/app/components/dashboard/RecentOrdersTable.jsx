"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ORDERS } from "../../data/ordersData";
import OrderDrawer from "../orders/OrderDrawer";
import { BrandCard } from "../brand/BrandCard";
import { BrandBadge, statusTone } from "../brand/BrandBadge";
import { EyeIcon, PhoneIcon, LocationIcon } from "./icons/DashIcons";

const FILTERS = ["All", "Pending", "Processing", "Delivered", "Cancelled"];
const PAGE_SIZE_OPTIONS = [20, 40, 60];

export default function RecentOrdersTable() {
  const [filter, setFilter] = useState("All");
  const [orders, setOrders] = useState(ORDERS);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const router = useRouter();

  const handleFilterChange = (value) => {
    setFilter(value);
    setPage(1);
  };

  const handlePageSize = (value) => {
    setPageSize(Number(value));
    setPage(1);
  };

  const filtered = useMemo(
    () =>
      filter === "All"
        ? orders
        : orders.filter((order) => order.status === filter),
    [filter, orders],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleUpdate = (updated) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === updated.id ? updated : order)),
    );
    setSelected(updated);
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [page - 2, page - 1, page, page + 1, page + 2];
  }, [page, totalPages]);

  return (
    <>
      <BrandCard className="p-0 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b-2 border-secondary-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-display text-xl font-black text-secondary-900">
              Recent Orders
            </h2>
            <p className="mt-0.5 text-sm font-semibold text-secondary-500">
              Latest activity — click View to manage
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs font-bold text-secondary-600">
              Show
              <select
                value={pageSize}
                onChange={(event) => handlePageSize(event.target.value)}
                className="rounded-xl border-2 border-secondary-200 bg-secondary-50 px-2 py-1.5 text-xs font-bold text-secondary-900 outline-none focus:border-primary-600"
              >
                {PAGE_SIZE_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              per page
            </label>
            <button
              onClick={() => router.push("/orders")}
              className="rounded-2xl border-2 border-secondary-900 bg-background-section px-4 py-2 text-xs font-display font-black text-secondary-900 transition-colors hover:bg-accent-400"
            >
              View All →
            </button>
          </div>
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2 px-5 pt-4 sm:px-6">
          {FILTERS.map((value) => {
            const active = filter === value;
            const count =
              value === "All"
                ? orders.length
                : orders.filter((order) => order.status === value).length;

            return (
              <button
                key={value}
                onClick={() => handleFilterChange(value)}
                className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-[11px] font-black transition-colors ${
                  active
                    ? "border-secondary-900 bg-secondary-900 text-accent-300"
                    : "border-secondary-200 bg-background-section text-secondary-600 hover:border-secondary-400"
                }`}
              >
                {value}
                <span
                  className={`rounded-full px-1.5 text-[10px] ${
                    active
                      ? "bg-accent-400 text-secondary-900"
                      : "bg-secondary-100 text-secondary-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto p-5 sm:block sm:p-6">
          <div className="overflow-hidden rounded-3xl border-2 border-secondary-900">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="bg-secondary-900 text-left text-[10px] font-black uppercase tracking-[0.12em] text-accent-300">
                  {[
                    "Order ID",
                    "Customer",
                    "Area",
                    "Vendor",
                    "Delivery",
                    "Amount",
                    "Status",
                    "Time",
                    "Action",
                  ].map((heading) => (
                    <th key={heading} className="whitespace-nowrap px-4 py-3">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100 bg-background-section">
                {paginated.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-secondary-50">
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="font-display text-xs font-black text-primary-600">
                        {order.id}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="font-bold text-secondary-900">
                        {order.customer.name}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-secondary-500">
                        <PhoneIcon /> {order.customer.phone}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1 text-xs font-semibold text-secondary-600">
                        <LocationIcon /> {order.area}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-secondary-700">
                      {order.vendor.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-secondary-700">
                      {order.delivery.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-display text-sm font-black text-secondary-900">
                      ₹{order.finalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <BrandBadge tone={statusTone(order.status)}>
                        {order.status}
                      </BrandBadge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-secondary-500">
                      {order.time}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        onClick={() => setSelected(order)}
                        className="inline-flex items-center gap-1 rounded-full border-2 border-secondary-900 bg-background-section px-3 py-1 text-[11px] font-black text-primary-600 transition-colors hover:bg-accent-400"
                      >
                        <EyeIcon /> View
                      </button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-10 text-center text-sm font-semibold text-secondary-500"
                    >
                      No {filter} orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 p-4 sm:hidden">
          {paginated.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border-2 border-secondary-900 bg-background-section p-4 shadow-[4px_4px_0px_var(--color-secondary-900)]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-xs font-black text-primary-600">
                  {order.id}
                </span>
                <BrandBadge tone={statusTone(order.status)}>
                  {order.status}
                </BrandBadge>
              </div>
              <p className="mt-2 font-bold text-secondary-900">{order.customer.name}</p>
              <div className="mt-1 flex flex-wrap gap-3 text-[11px] font-semibold text-secondary-500">
                <span className="flex items-center gap-1">
                  <PhoneIcon /> {order.customer.phone}
                </span>
                <span className="flex items-center gap-1">
                  <LocationIcon /> {order.area}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-y border-secondary-100 py-2">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-secondary-400">
                    Vendor
                  </p>
                  <p className="text-xs font-bold text-secondary-800">{order.vendor.name}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-secondary-400">
                    Delivery
                  </p>
                  <p className="text-xs font-bold text-secondary-800">{order.delivery.name}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-secondary-400">
                    Amount
                  </p>
                  <p className="font-display text-sm font-black text-secondary-900">
                    ₹{order.finalAmount.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-secondary-500">
                  {order.time}
                </span>
                <button
                  onClick={() => setSelected(order)}
                  className="inline-flex items-center gap-1 rounded-full border-2 border-secondary-900 bg-background-section px-3 py-1 text-[11px] font-black text-primary-600 transition-colors hover:bg-accent-400"
                >
                  <EyeIcon /> View
                </button>
              </div>
            </div>
          ))}
          {paginated.length === 0 && (
            <p className="py-8 text-center text-sm font-semibold text-secondary-500">
              No {filter} orders
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t-2 border-secondary-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-xs font-semibold text-secondary-500">
            Showing{" "}
            <strong className="text-secondary-900">
              {Math.min((page - 1) * pageSize + 1, filtered.length)}–
              {Math.min(page * pageSize, filtered.length)}
            </strong>{" "}
            of <strong className="text-secondary-900">{filtered.length}</strong> orders
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border-2 border-secondary-200 bg-background-section px-2 text-xs font-bold text-secondary-700 disabled:opacity-40"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={page === 1}
              >
                ‹
              </button>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => setPage(number)}
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg border-2 px-2 text-xs font-black transition-colors ${
                    page === number
                      ? "border-secondary-900 bg-primary-600 text-white"
                      : "border-secondary-200 bg-background-section text-secondary-700 hover:border-secondary-400"
                  }`}
                >
                  {number}
                </button>
              ))}
              <button
                className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border-2 border-secondary-200 bg-background-section px-2 text-xs font-bold text-secondary-700 disabled:opacity-40"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                disabled={page === totalPages}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </BrandCard>

      <OrderDrawer
        order={selected}
        onClose={() => setSelected(null)}
        onUpdate={handleUpdate}
      />
    </>
  );
}
