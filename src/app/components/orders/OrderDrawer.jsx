"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  Store,
  Truck,
  User,
  X,
  XCircle,
} from "lucide-react";
import { BrandBadge, statusTone } from "../brand/BrandBadge";
import { BrandButton } from "../brand/BrandButton";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value || 0);

const STATUS_ACTIONS = ["Pending", "Processing", "Delivered", "Cancelled"];

function Section({ title, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-secondary-200 bg-background-section p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 border-b border-secondary-100 pb-2">
        <Icon className="h-3.5 w-3.5 text-primary-600" />
        <h3 className="font-display text-[11px] font-black uppercase tracking-widest text-secondary-900">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-secondary-100 py-1.5 text-xs last:border-0">
      <span className="shrink-0 pt-0.5 text-[9px] font-black uppercase tracking-wider text-secondary-500">
        {label}
      </span>
      <span className="min-w-0 break-words text-right font-semibold text-secondary-800">
        {children || "—"}
      </span>
    </div>
  );
}

function Avatar({ name }) {
  return (
    <div className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-secondary-900 bg-fresh-50 font-display text-sm font-black text-secondary-900">
      {name?.trim().charAt(0).toUpperCase() || "?"}
    </div>
  );
}

export default function OrderDrawer({ order: initialOrder, onClose, onUpdate }) {
  const [order, setOrder] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const timer = setTimeout(() => setOrder(null), 250);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [initialOrder]);

  if (!order) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleStatus = (status) => {
    const updated = { ...order, status };
    setOrder(updated);
    onUpdate?.(updated);
  };

  const subtotal = order.subtotalAmount ?? order.items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0,
  );

  return (
    <div
      className={`fixed inset-0 z-[2000] bg-secondary-950/45 backdrop-blur-[2px] transition-opacity ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Order details ${order.id}`}
        className={`ml-auto flex h-full w-full max-w-[560px] flex-col overflow-hidden border-l-2 border-secondary-900 bg-background shadow-2xl transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-secondary-200 bg-background-section px-4 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-base font-black text-primary-600">
                {order.id}
              </span>
              <BrandBadge tone={statusTone(order.status)}>{order.status}</BrandBadge>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-secondary-500">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {order.date} · {order.time}
              </span>
              <span className="inline-flex items-center gap-1">
                <Truck className="h-3 w-3" /> {order.payment}
              </span>
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close order details"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-secondary-200 bg-background text-secondary-500 transition-colors hover:border-primary-300 hover:text-primary-600"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4">
          <Section title="Customer" icon={User}>
            <div className="flex items-start gap-3">
              <Avatar name={order.customer.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-secondary-900">
                  {order.customer.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-secondary-600">
                  <Phone className="h-3 w-3" /> {order.customer.phone || "—"}
                </p>
                {order.customer.email ? (
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-secondary-600">
                    <Mail className="h-3 w-3" /> {order.customer.email}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-secondary-50 p-2.5">
              <p className="text-[9px] font-black uppercase tracking-wider text-secondary-500">
                Address
              </p>
              <p className="mt-0.5 text-[11px] font-semibold leading-relaxed text-secondary-800">
                {order.customer.address || order.area || "No registered address."}
              </p>
            </div>
          </Section>

          <Section title={`Items (${order.items.length})`} icon={Package}>
            <div className="overflow-hidden rounded-xl border border-secondary-200">
              <table className="w-full min-w-[430px] border-collapse">
                <thead className="bg-secondary-50 text-left text-[9px] font-black uppercase tracking-widest text-secondary-500">
                  <tr>
                    <th className="px-3 py-2">Item</th>
                    <th className="px-3 py-2 text-center">Qty</th>
                    <th className="px-3 py-2 text-right">Rate</th>
                    <th className="px-3 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {order.items.map((item, index) => (
                    <tr key={`${item.name}-${index}`}>
                      <td className="px-3 py-2">
                        <p className="truncate text-xs font-bold text-secondary-900">
                          {item.name}
                        </p>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary-900 text-[10px] font-black text-white">
                          {item.qty}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-xs text-secondary-600">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-3 py-2 text-right text-xs font-black text-secondary-900">
                        {formatCurrency(item.qty * item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 space-y-1.5 border-t border-dashed border-secondary-200 pt-3">
              {[
                ["Subtotal", order.subtotalAmount ?? subtotal],
                ["Tax", order.taxes],
                ["Discount", order.discounts],
                ["Delivery", order.deliveryCharge],
                ["Surcharge", order.surcharge],
              ].map(([label, amount]) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-secondary-500">{label}</span>
                  <span className="font-semibold text-secondary-800">
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between border-t border-secondary-200 pt-2 text-sm font-black text-secondary-900">
                <span>Total</span>
                <span className="text-fresh-700">{formatCurrency(order.finalAmount)}</span>
              </div>
            </div>
          </Section>

          <Section title="Payment" icon={CreditCard}>
            <Row label="Method">{order.payment}</Row>
            <Row label="Status">
              <BrandBadge tone={order.paymentStatus === "Paid" ? "fresh" : "accent"}>
                {order.paymentStatus}
              </BrandBadge>
            </Row>
          </Section>

          <Section title="Vendor" icon={Store}>
            <Row label="Name">{order.vendor.name}</Row>
            <Row label="Phone">{order.vendor.phone}</Row>
          </Section>

          <Section title="Delivery" icon={Truck}>
            {order.delivery.id ? (
              <div className="mb-2 flex items-center gap-2.5">
                <Avatar name={order.delivery.name} />
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-secondary-900">
                    {order.delivery.name}
                  </p>
                  <p className="text-[10px] text-secondary-500">{order.delivery.phone}</p>
                </div>
              </div>
            ) : (
              <p className="mb-2 text-xs font-semibold text-accent-600">
                No delivery partner assigned.
              </p>
            )}
            <Row label="Area">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {order.area}
              </span>
            </Row>
          </Section>

          <Section title={`Status history (${order.statusHistory?.length ?? 0})`} icon={CheckCircle2}>
            {order.statusHistory?.length ? (
              <ol className="space-y-2">
                {order.statusHistory.map((entry) => (
                  <li key={entry.id} className="flex gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-secondary-200 bg-secondary-50">
                      {entry.status === "Cancelled" ? (
                        <XCircle className="h-3 w-3 text-primary-700" />
                      ) : (
                        <CheckCircle2 className="h-3 w-3 text-fresh-600" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-secondary-900">{entry.status}</p>
                      <p className="text-[9px] font-semibold text-secondary-500">
                        {entry.date} · {entry.time} · {entry.by}
                      </p>
                      {entry.remarks ? (
                        <p className="mt-0.5 text-[11px] text-secondary-600">{entry.remarks}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-secondary-500">No status history recorded.</p>
            )}
          </Section>

          <div className="grid grid-cols-2 gap-2">
            {STATUS_ACTIONS.filter((status) => status !== order.status).map((status) => (
              <BrandButton
                key={status}
                variant={status === "Cancelled" ? "danger" : status === "Delivered" ? "success" : "ghost"}
                className="py-2 text-xs"
                onClick={() => handleStatus(status)}
              >
                Mark {status}
              </BrandButton>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
