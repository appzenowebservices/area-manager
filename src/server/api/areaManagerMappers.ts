const ORDER_STATUS: Record<string, string> = {
  created: "Pending",
  confirmed: "Pending",
  preparing: "Processing",
  ready: "Processing",
  assigned: "Processing",
  arrived_at_pickup: "Processing",
  out_for_delivery: "Processing",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PAYMENT_METHOD: Record<string, string> = {
  cod: "Cash",
  upi: "UPI",
  card: "Card",
  wallet: "Wallet",
};

const PAYMENT_STATUS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

const LEAD_STAGE: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Docs Pending",
  approved: "Approved",
  onboarding: "Approved",
  rejected: "Rejected",
};

const TICKET_STATUS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Resolved",
};

const TICKET_PRIORITY: Record<string, string> = {
  low: "Low",
  normal: "Medium",
  medium: "Medium",
  high: "High",
  urgent: "Critical",
  critical: "Critical",
};

const dateLabel = (value: Date | string | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const timeLabel = (value: Date | string | null | undefined) =>
  value
    ? new Date(value).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

const money = (value: number | null | undefined) =>
  Number(value ?? 0).toLocaleString("en-IN");

export function mapOrder(order: any) {
  const delivery = order.deliveryStatus?.find((entry: any) => entry.assignedTo);
  return {
    id: order.orderId || order.id,
    dbId: order.id,
    date: dateLabel(order.createdAt),
    time: timeLabel(order.createdAt),
    customer: {
      name: order.customer?.name ?? "Customer",
      phone: order.customer?.mobile ?? "",
      email: order.customer?.email ?? "",
      address: [
        order.address?.street,
        order.address?.locality,
        order.address?.city,
        order.address?.zipCode,
      ]
        .filter(Boolean)
        .join(", "),
    },
    area:
      order.address?.locality ||
      order.address?.city ||
      order.address?.zipCode ||
      "—",
    items: (order.items ?? []).map((item: any) => ({
      name: item.name ?? "Item",
      qty: item.quantity ?? 1,
      price: item.price ?? 0,
    })),
    finalAmount: order.grandTotal ?? 0,
    discount: order.discounts ?? 0,
    subtotalAmount: order.subtotalAmount ?? 0,
    taxes: order.taxes ?? 0,
    discounts: order.discounts ?? 0,
    deliveryCharge: order.deliveryCharge ?? 0,
    surcharge: order.surcharge ?? 0,
    platformFee: order.platformFee ?? 0,
    deliveryPartnerFee: order.deliveryPartnerFee ?? 0,
    totalQuantity: order.totalQuantity ?? 0,
    payment: PAYMENT_METHOD[order.paymentMethod] ?? order.paymentMethod ?? "—",
    paymentStatus:
      PAYMENT_STATUS[order.paymentStatus] ?? order.paymentStatus ?? "—",
    rawPaymentMethod: order.paymentMethod,
    rawPaymentStatus: order.paymentStatus,
    status: ORDER_STATUS[order.orderStatus] ?? order.orderStatus ?? "Pending",
    rawStatus: order.orderStatus,
    statusHistory: (order.statusHistory ?? [])
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      )
      .map((entry: any) => ({
        id: entry.id,
        status: ORDER_STATUS[entry.status] ?? entry.status,
        rawStatus: entry.status,
        timestamp: entry.timestamp,
        date: dateLabel(entry.timestamp),
        time: timeLabel(entry.timestamp),
        remarks: entry.remarks ?? "",
        by: entry.updatedByRole ?? "System",
      })),
    vendor: {
      id: order.vendor?.id ?? "",
      name: order.vendor?.name ?? "Unassigned",
      phone: order.vendor?.mobile ?? "",
      email: order.vendor?.email ?? "",
    },
    delivery: {
      id: delivery?.assignedTo?.id ?? "",
      name: delivery?.assignedTo?.name ?? "Unassigned",
      phone: delivery?.assignedTo?.mobile ?? "",
    },
    notes: typeof order.extraMeta?.notes === "string" ? order.extraMeta.notes : "",
    createdAt: order.createdAt,
  };
}

export function mapVendor(
  vendor: any,
  stats: { totalOrders: number; ordersThisWeek: number; revenue: number },
  commissionPct: number,
) {
  const store = vendor.Store?.[0];
  const category =
    vendor.businessCategory?.[0] || vendor.businessType || "General Store";
  const status =
    vendor.isActive === false
      ? "Inactive"
      : vendor.isApproved
        ? "Active"
        : "Pending KYC";

  return {
    id: vendor.id,
    name: vendor.name,
    ownerName: vendor.name,
    phone: vendor.mobile ?? "",
    email: vendor.email ?? "",
    area: vendor.addressCity || store?.address?.city || "—",
    address: [
      vendor.addressStreet,
      vendor.addressCity,
      vendor.addressState,
      vendor.addressZipCode,
    ]
      .filter(Boolean)
      .join(", "),
    category,
    status,
    rating: store?.ratings?.average ?? 0,
    totalOrders: stats.totalOrders,
    ordersThisWeek: stats.ordersThisWeek,
    commission: commissionPct,
    joinDate: dateLabel(vendor.createdAt),
    kyc: vendor.isVerified?.email ? "Verified" : "Pending",
    documents: {
      aadhaar: Boolean(vendor.govIdNumber),
      pan: Boolean(vendor.govIdNumber),
      gst: Boolean(vendor.gstNumber),
      fssai: Boolean(vendor.fssaiLicense),
    },
    revenue: `₹${money(stats.revenue)}`,
    avgDeliveryTime: "—",
    notes: "",
    isActive: vendor.isActive,
    isApproved: vendor.isApproved,
  };
}

export function mapLead(lead: any, area: string) {
  const isVendor = lead.leadType === "vendor";
  const type =
    lead.leadType === "vendor"
      ? "vendor"
      : lead.leadType === "delivery_agent"
        ? "delivery"
        : lead.leadType;
  return {
    id: lead.id,
    type,
    name: lead.companyName || lead.name,
    ownerName: lead.name,
    phone: lead.phone,
    altPhone: "",
    email: lead.email,
    area,
    address: lead.address ?? "",
    category: lead.details?.businessType || "General",
    vehicle: lead.details?.vehicleType || "—",
    experience: lead.details?.capacity || "—",
    commission: 10,
    age: 0,
    stage: LEAD_STAGE[lead.status] ?? "New",
    appliedDate: dateLabel(lead.createdAt),
    lastContactDate: dateLabel(lead.updatedAt),
    documents: isVendor
      ? {
          aadhaar: Boolean(lead.aadharNumber),
          pan: Boolean(lead.panNumber),
          gst: Boolean(lead.details?.taxId),
          fssai: Boolean(lead.details?.licenseNumber),
        }
      : {
          aadhaar: Boolean(lead.aadharNumber),
          license: Boolean(lead.drivingLicense),
          rc: Boolean(lead.details?.vehicleType),
        },
    licenseNo: lead.drivingLicense ?? "",
    notes: lead.comments ?? "",
    followUps: [],
    timeline: [],
    rawStatus: lead.status,
  };
}

export function mapDeliveryPartner(partner: any, stats: any) {
  return {
    id: partner.id,
    name: partner.name,
    phone: partner.mobile,
    email: partner.email,
    area: partner.address?.city || partner.address?.locality || "—",
    avatar: partner.name
      .split(" ")
      .map((part: string) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    vehicle: partner.vehicleType || "—",
    vehicleNo: partner.vehicleRegNumber || "N/A",
    status: partner.isActive === false ? "Inactive" : "Available",
    rating: 0,
    totalDeliveries: stats.delivered,
    joinedDate: dateLabel(partner.createdAt),
    notes: "",
    documents: {
      license: Boolean(partner.drivingLicense),
      aadhaar: Boolean(partner.aadharNumber),
      pan: Boolean(partner.panNumber),
    },
    isApproved: partner.isApproved,
  };
}

export function mapSupportTicket(
  ticket: any,
  area: string,
  messageCount = 0,
  messages: any[] = [],
) {
  return {
    id: ticket.id,
    source: "Customer",
    type: ticket.category,
    subject: ticket.subject,
    description: ticket.message,
    reportedBy: {
      name: ticket.userName,
      phone: "",
      ref: ticket.userEmail,
    },
    area,
    priority: TICKET_PRIORITY[ticket.priority] ?? "Medium",
    status: TICKET_STATUS[ticket.status] ?? "Open",
    createdDate: dateLabel(ticket.createdAt),
    createdTime: timeLabel(ticket.createdAt),
    assignedTo: "Support Team",
    resolvedDate: ticket.status === "resolved" ? dateLabel(ticket.updatedAt) : null,
    resolutionNote: "",
    timeline: messages.map((message) => ({
      id: message.id,
      type: "update",
      action:
        message.senderRole === "support" ? "Support reply" : "Customer message",
      note: message.message,
      by: message.senderName,
      date: dateLabel(message.createdAt),
      time: timeLabel(message.createdAt),
    })),
    messageCount,
    rawStatus: ticket.status,
  };
}

export function mapAuditLog(log: any, user: string) {
  return {
    id: log.id,
    timestamp: log.createdAt,
    type: "AUDIT",
    category: "audit",
    action: log.action,
    detail: log.details ?? "",
    user,
    page: "—",
    severity: "info",
  };
}

export function ticketStatusToDb(status: string) {
  if (status === "In Progress") return "in_progress";
  if (status === "Resolved") return "resolved";
  if (status === "Closed") return "closed";
  return "open";
}
