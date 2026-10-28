import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { ORDERS } from "../../data/ordersData";
import { BrandCard } from "../brand/BrandCard";

/**
 * OrdersChart — 7-day order/delivery trend.
 * Chart internals use Recharts props (hex colors) but the card, header and
 * summary use the same Tailwind brand pattern as the vendor panel.
 */
function buildChartData() {
  const days = [];
  for (let index = 6; index >= 0; index--) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    days.push({
      label: date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    });
  }

  const spread = [2, 3, 1, 4, 3, 5, ORDERS.length - 18 > 0 ? ORDERS.length - 18 : 2];

  return days.map((day, index) => ({
    day: day.label,
    Orders: spread[index],
    Revenue: spread[index] * 420,
    Delivered: Math.max(0, spread[index] - 1),
    Pending: Math.min(1, spread[index]),
  }));
}

const chartData = buildChartData();

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-40 rounded-2xl border-2 border-secondary-900 bg-background-section px-4 py-3 shadow-[4px_4px_0px_var(--color-secondary-900)]">
      <p className="mb-1.5 text-xs font-bold text-secondary-500">{label}</p>
      {payload.map((item) => (
        <div
          key={item.name}
          className="flex items-center justify-between gap-4 text-xs"
        >
          <span className="font-bold" style={{ color: item.color }}>
            {item.name}
          </span>
          <span className="font-display font-black text-secondary-900">
            {item.name === "Revenue"
              ? `₹${item.value.toLocaleString("en-IN")}`
              : item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function OrdersChart() {
  return (
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

      <div className="-mx-1">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
          >
            <defs>
              <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ae2012" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#ae2012" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="gradDelivered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0c831f" stopOpacity={0.15} />
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
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="Orders"
              stroke="#ae2012"
              strokeWidth={2.5}
              fill="url(#gradOrders)"
              dot={{ r: 3, fill: "#ae2012", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#ae2012" }}
            />
            <Area
              type="monotone"
              dataKey="Delivered"
              stroke="#0c831f"
              strokeWidth={2.5}
              fill="url(#gradDelivered)"
              dot={{ r: 3, fill: "#0c831f", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#0c831f" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-6 border-t-2 border-secondary-100 pt-4">
        {[
          {
            label: "Total Orders",
            value: chartData.reduce((sum, day) => sum + day.Orders, 0),
            color: "text-primary-600",
          },
          {
            label: "Delivered",
            value: chartData.reduce((sum, day) => sum + day.Delivered, 0),
            color: "text-fresh-600",
          },
          {
            label: "Est. Revenue",
            value: `₹${chartData
              .reduce((sum, day) => sum + day.Revenue, 0)
              .toLocaleString("en-IN")}`,
            color: "text-accent-600",
          },
        ].map((item) => (
          <div key={item.label}>
            <p className={`font-display text-lg font-black ${item.color}`}>
              {item.value}
            </p>
            <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-secondary-500">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </BrandCard>
  );
}
