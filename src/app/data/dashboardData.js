// src/data/dashboardData.js

export const STATS = [
  {
    id: "orders_today",
    label: "Orders Today",
    value: 48,
    rawValue: 48,
    prevValue: 42,
    trendPct: "+14.3%",
    trendUp: true,
    iconType: "order",
    color: "#1a73e8",
    bg: "#e8f0fe",
  },
  {
    id: "pending",
    label: "Pending Orders",
    value: 13,
    rawValue: 13,
    prevValue: 18,
    trendPct: "-27.8%",
    trendUp: false,
    iconType: "pending",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
  {
    id: "revenue",
    label: "Today's Revenue",
    value: "₹24,860",
    rawValue: 24860,
    prevValue: 21200,
    trendPct: "+17.3%",
    trendUp: true,
    iconType: "revenue",
    color: "#10b981",
    bg: "#d1fae5",
  },
  {
    id: "vendors",
    label: "Active Vendors",
    value: 31,
    rawValue: 31,
    prevValue: 29,
    trendPct: "+6.9%",
    trendUp: true,
    iconType: "vendor",
    color: "#8b5cf6",
    bg: "#ede9fe",
  },
];

export const CHART_DATA = [
  { day: "Mon", orders: 32, revenue: 14200 },
  { day: "Tue", orders: 45, revenue: 19800 },
  { day: "Wed", orders: 38, revenue: 17300 },
  { day: "Thu", orders: 52, revenue: 23100 },
  { day: "Fri", orders: 61, revenue: 28400 },
  { day: "Sat", orders: 74, revenue: 34600 },
  { day: "Sun", orders: 48, revenue: 24860 },
];

export const ALERTS = [
  {
    id: 1,
    type: "warning",
    emoji: "⚠️",
    title: "3 Vendors Pending Approval",
    desc: "New vendor registrations awaiting your review.",
    action: "Review Now",
    actionRoute: "/vendors",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  {
    id: 2,
    type: "error",
    emoji: "🔴",
    title: "2 Delivery Delays Reported",
    desc: "Orders #ORD‑887 and #ORD‑891 are overdue.",
    action: "View Orders",
    actionRoute: "/orders",
    color: "#ef4444",
    bg: "#fff5f5",
    border: "#fecaca",
  },
  {
    id: 3,
    type: "info",
    emoji: "💬",
    title: "5 Unresolved Complaints",
    desc: "Customer complaints need your attention today.",
    action: "Open Complaints",
    actionRoute: "/complaints",
    color: "#1a73e8",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  {
    id: 4,
    type: "success",
    emoji: "✅",
    title: "Daily Target 80% Achieved",
    desc: "Revenue goal: ₹31,000 — ₹24,860 collected so far.",
    action: "View Earnings",
    actionRoute: "/earnings",
    color: "#10b981",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
];

export const RECENT_ORDERS = [
  { id: "ORD‑901", customer: "Priya Sharma",  phone: "9876543210", area: "Gomti Nagar",   amount: "₹780",   status: "Delivered",  vendor: "Fresh Basket",    delivery: "Ravi Kumar",  time: "10 min ago",  date: "28 Mar 2026" },
  { id: "ORD‑900", customer: "Arjun Mehta",   phone: "9812345678", area: "Hazratganj",    amount: "₹1,240", status: "Processing", vendor: "Spice Garden",    delivery: "Amit Singh",  time: "25 min ago",  date: "28 Mar 2026" },
  { id: "ORD‑899", customer: "Sunita Yadav",  phone: "9898989898", area: "Aliganj",       amount: "₹460",   status: "Pending",    vendor: "Unassigned",      delivery: "Unassigned",  time: "41 min ago",  date: "28 Mar 2026" },
  { id: "ORD‑898", customer: "Rahul Kumar",   phone: "9911223344", area: "Indira Nagar",  amount: "₹990",   status: "Delivered",  vendor: "Daily Needs Co",  delivery: "Suresh Pal",  time: "1 hr ago",    date: "28 Mar 2026" },
  { id: "ORD‑897", customer: "Meena Singh",   phone: "9955667788", area: "Rajajipuram",   amount: "₹540",   status: "Cancelled",  vendor: "Quick Dairy",     delivery: "—",           time: "1.5 hr ago",  date: "28 Mar 2026" },
  { id: "ORD‑896", customer: "Deepak Tiwari", phone: "9900112233", area: "Vikas Nagar",   amount: "₹870",   status: "Processing", vendor: "Fresh Basket",    delivery: "Ravi Kumar",  time: "2 hr ago",    date: "28 Mar 2026" },
  { id: "ORD‑895", customer: "Kavita Dubey",  phone: "9933445566", area: "Alambagh",      amount: "₹1,100", status: "Delivered",  vendor: "Spice Garden",    delivery: "Mohit Verma", time: "2.5 hr ago",  date: "28 Mar 2026" },
  { id: "ORD‑894", customer: "Sanjeev Gupta", phone: "9977889900", area: "Chinhat",       amount: "₹330",   status: "Pending",    vendor: "Unassigned",      delivery: "Unassigned",  time: "3 hr ago",    date: "28 Mar 2026" },
];

export const TOP_VENDORS = [
  { id: "V001", name: "Fresh Basket",    category: "Grocery",    orders: 94, revenue: "₹42,300", rating: 4.8, status: "Active",  area: "Gomti Nagar"  },
  { id: "V002", name: "Spice Garden",    category: "Food",       orders: 76, revenue: "₹35,100", rating: 4.6, status: "Active",  area: "Hazratganj"   },
  { id: "V003", name: "Daily Needs Co",  category: "Essentials", orders: 63, revenue: "₹28,900", rating: 4.5, status: "Active",  area: "Aliganj"      },
  { id: "V004", name: "Quick Dairy",     category: "Dairy",      orders: 55, revenue: "₹19,800", rating: 4.7, status: "Active",  area: "Indira Nagar" },
];

export const DELIVERY_BOYS = [
  { id: "D001", name: "Ravi Kumar",   phone: "9871234560", status: "Busy",      ordersToday: 8,  vehicle: "Bike",   area: "Gomti Nagar"  },
  { id: "D002", name: "Amit Singh",   phone: "9812340987", status: "Busy",      ordersToday: 6,  vehicle: "Bike",   area: "Hazratganj"   },
  { id: "D003", name: "Suresh Pal",   phone: "9898761234", status: "Available", ordersToday: 5,  vehicle: "Cycle",  area: "Indira Nagar" },
  { id: "D004", name: "Mohit Verma",  phone: "9911009988", status: "Available", ordersToday: 7,  vehicle: "Bike",   area: "Alambagh"     },
  { id: "D005", name: "Nitin Bajpai", phone: "9955001122", status: "Offline",   ordersToday: 0,  vehicle: "Bike",   area: "Chinhat"      },
];

export const STATUS_CONFIG = {
  Delivered:  { color: "#10b981", bg: "#d1fae5" },
  Processing: { color: "#1a73e8", bg: "#dbeafe" },
  Pending:    { color: "#f59e0b", bg: "#fef3c7" },
  Cancelled:  { color: "#ef4444", bg: "#fee2e2" },
  Active:     { color: "#10b981", bg: "#d1fae5" },
  Busy:       { color: "#f59e0b", bg: "#fef3c7" },
  Available:  { color: "#10b981", bg: "#d1fae5" },
  Offline:    { color: "#94a3b8", bg: "#f1f5f9" },
};
