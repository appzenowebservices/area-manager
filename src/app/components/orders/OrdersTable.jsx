import { Eye } from "lucide-react";
import { BrandBadge, statusTone } from "../brand/BrandBadge";

const paymentTone = (status) => {
  const value = String(status).toLowerCase();
  if (/(paid|success)/.test(value)) return "fresh";
  if (/(fail|cancel)/.test(value)) return "primary";
  return "accent";
};

export default function OrdersTable({ orders, onView }) {
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-secondary-900 bg-background-section shadow-[6px_6px_0px_var(--color-secondary-900)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse text-sm">
          <thead>
            <tr className="bg-secondary-900 text-left text-[10px] font-black uppercase tracking-[0.12em] text-accent-300">
              {[
                "Order ID",
                "Date & Time",
                "Customer",
                "Area",
                "Items",
                "Amount",
                "Payment",
                "Status",
                "Vendor",
                "Delivery",
                "Action",
              ].map((heading) => (
                <th key={heading} className="whitespace-nowrap px-4 py-3">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-14 text-center">
                  <span className="text-4xl">📭</span>
                  <p className="mt-2 text-sm font-semibold text-secondary-500">
                    No orders found for selected filters
                  </p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-secondary-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="font-display text-xs font-black text-primary-600">
                      {order.id}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="text-xs font-bold text-secondary-800">{order.date}</p>
                    <p className="text-[10px] font-semibold text-secondary-400">{order.time}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="text-sm font-bold text-secondary-900">{order.customer.name}</p>
                    <p className="text-[10px] font-semibold text-secondary-400">📞 {order.customer.phone}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-secondary-600">
                    📍 {order.area}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="rounded-full bg-secondary-100 px-2.5 py-1 text-[11px] font-bold text-primary-600">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="font-display text-sm font-black text-secondary-900">
                      ₹{order.finalAmount.toLocaleString("en-IN")}
                    </p>
                    {order.discount > 0 && (
                      <p className="text-[10px] font-semibold text-fresh-600">-₹{order.discount} off</p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="mb-1 text-xs font-bold text-secondary-700">{order.payment}</p>
                    <BrandBadge tone={paymentTone(order.paymentStatus)}>
                      {order.paymentStatus}
                    </BrandBadge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <BrandBadge tone={statusTone(order.status)}>{order.status}</BrandBadge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-secondary-700">
                    {order.vendor.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-secondary-700">
                    {order.delivery.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      onClick={() => onView(order)}
                      className="inline-flex items-center gap-1 rounded-full border-2 border-secondary-900 bg-background-section px-3 py-1.5 text-[11px] font-black text-primary-600 transition-colors hover:bg-accent-400"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
