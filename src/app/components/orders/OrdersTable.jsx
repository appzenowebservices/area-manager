import { Eye, IndianRupee } from "lucide-react";
import { BrandBadge, statusTone } from "../brand/BrandBadge";

function Avatar({ name, image, className = "h-9 w-9 rounded-xl text-xs" }) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden border-2 border-secondary-900 bg-fresh-50 ${className}`}
    >
      <span className="absolute inset-0 grid place-items-center font-display font-black text-secondary-900">
        {name?.trim().charAt(0).toUpperCase() || "?"}
      </span>
      {image ? (
        <img
          src={image}
          alt=""
          className="relative h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}
    </div>
  );
}

const paymentTone = (status) => {
  const value = String(status).toLowerCase();
  if (/(paid|success)/.test(value)) return "fresh";
  if (/(fail|cancel|refund)/.test(value)) return "primary";
  return "accent";
};

export default function OrdersTable({ orders, onView }) {
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-secondary-900 bg-background-section shadow-[6px_6px_0px_var(--color-secondary-900)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-[135px]" />
            <col className="w-[85px]" />
            <col className="w-[145px]" />
            <col className="w-[85px]" />
            <col className="w-[105px]" />
            <col className="w-[95px]" />
            <col className="w-[95px]" />
            <col className="w-[100px]" />
            <col className="w-[115px]" />
            <col className="w-[105px]" />
            <col className="w-[65px]" />
          </colgroup>
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
                <td colSpan={11} className="px-4 py-16 text-center">
                  <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full border border-dashed border-secondary-300">
                    <span className="text-2xl">📭</span>
                  </div>
                  <p className="text-sm font-bold text-secondary-700">No orders found</p>
                  <p className="mt-1 text-xs text-secondary-500">
                    Try clearing the search or filters.
                  </p>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const itemNames = order.items
                  .map((item) => item.name)
                  .filter(Boolean)
                  .slice(0, 1)
                  .join(", ");
                const itemCount = order.items.reduce(
                  (sum, item) => sum + (item.qty ?? 0),
                  0,
                );

                return (
                  <tr
                    key={order.id}
                    onClick={() => onView(order)}
                    className="cursor-pointer transition-colors hover:bg-secondary-50"
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className="block max-w-full truncate font-display text-xs font-black text-primary-600"
                        title={order.id}
                      >
                        {order.id}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="text-xs font-bold text-secondary-800">{order.date}</p>
                      <p className="text-[10px] font-semibold text-secondary-400">{order.time}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={order.customer.name} image={order.customer.image} />
                        <div className="min-w-0">
                          <p className="max-w-[150px] truncate text-sm font-bold text-secondary-900">
                            {order.customer.name}
                          </p>
                          <p className="max-w-[150px] truncate text-[10px] font-semibold text-secondary-400">
                            {order.customer.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-secondary-600">
                      📍 {order.area}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-full bg-secondary-100 px-2.5 py-1 text-[10px] font-bold text-primary-600">
                        {itemCount || order.items.length} item
                        {(itemCount || order.items.length) === 1 ? "" : "s"}
                      </span>
                      <p className="mt-1 max-w-[150px] truncate text-[9px] text-secondary-400">
                        {itemNames}
                        {order.items.length > 1 ? ` +${order.items.length - 1} more` : ""}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex items-center gap-0.5 rounded-lg border-2 border-secondary-200 bg-background px-2.5 py-1 font-display text-xs font-black text-secondary-900">
                        <IndianRupee className="h-3 w-3 text-secondary-400" />
                        {order.finalAmount.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="mb-1 text-xs font-bold capitalize text-secondary-700">
                        {order.payment}
                      </p>
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
                    <td className="whitespace-nowrap px-4 py-3">
                      {order.delivery.id ? (
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={order.delivery.name}
                            image={order.delivery.image}
                            className="h-7 w-7 rounded-lg text-[9px]"
                          />
                          <div>
                            <p className="max-w-[110px] truncate text-[11px] font-bold text-secondary-800">
                              {order.delivery.name}
                            </p>
                            <p className="text-[9px] font-semibold text-secondary-400">
                              Assigned
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-semibold text-secondary-400">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onView(order);
                        }}
                        className="inline-flex items-center gap-1 rounded-full border-2 border-secondary-900 bg-background-section px-3 py-1.5 text-[10px] font-black text-primary-600 transition-colors hover:bg-accent-400"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
