import { Eye } from "lucide-react";
import { BrandBadge, statusTone } from "../brand/BrandBadge";

export default function OrderCard({ order, onView }) {
  return (
    <div className="rounded-3xl border-2 border-secondary-900 bg-background-section p-4 shadow-[5px_5px_0px_var(--color-secondary-900)]">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-xs font-black text-primary-600">{order.id}</span>
        <BrandBadge tone={statusTone(order.status)}>{order.status}</BrandBadge>
      </div>

      <p className="mt-2 text-sm font-bold text-secondary-900">{order.customer.name}</p>
      <div className="mt-1 flex flex-wrap gap-3 text-[11px] font-semibold text-secondary-500">
        <span>📞 {order.customer.phone}</span>
        <span>📍 {order.area}</span>
        <span>🕐 {order.date}, {order.time}</span>
        <span>📦 {order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
      </div>

      <div className="my-3 h-px bg-secondary-100" />

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Amount", value: `₹${order.finalAmount.toLocaleString("en-IN")}`, cls: "text-secondary-900" },
          { label: "Payment", value: order.payment, cls: "text-secondary-700" },
          { label: "Vendor", value: order.vendor.name, cls: order.vendor.id ? "text-secondary-700" : "text-accent-600" },
          { label: "Delivery", value: order.delivery.name, cls: order.delivery.id ? "text-secondary-700" : "text-accent-600" },
          { label: "Pay Status", value: order.paymentStatus, cls: "text-secondary-700" },
          ...(order.discount > 0
            ? [{ label: "Discount", value: `-₹${order.discount}`, cls: "text-fresh-600" }]
            : []),
        ].map((item) => (
          <div key={item.label}>
            <p className="text-[9px] font-black uppercase tracking-widest text-secondary-400">
              {item.label}
            </p>
            <p className={`truncate text-xs font-bold ${item.cls}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {order.notes && (
        <p className="mt-3 rounded-xl border-2 border-accent-200 bg-accent-50 px-3 py-2 text-[11px] font-semibold text-accent-700">
          📝 {order.notes}
        </p>
      )}

      <button
        onClick={() => onView(order)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-secondary-900 bg-secondary-50 px-4 py-2.5 text-xs font-black text-primary-600 transition-colors hover:bg-accent-400"
      >
        <Eye className="h-4 w-4" /> View Full Details →
      </button>
    </div>
  );
}
