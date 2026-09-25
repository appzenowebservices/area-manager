// src/store/activityStore.js
/**
 * ActivityStore
 * Logs every important action to localStorage.
 * Backend-ready: replace localStorage calls with API calls later.
 *
 * Log entry shape:
 * {
 *   id:        string   (unique)
 *   timestamp: string   (ISO)
 *   type:      string   (LOGIN | LOGOUT | ORDER_UPDATE | VENDOR_ACTION | ...)
 *   category:  string   (auth | orders | vendors | leads | earnings | navigation)
 *   action:    string   (human readable)
 *   detail:    string   (extra context)
 *   user:      string   (name of area manager)
 *   page:      string   (current route)
 *   severity:  string   (info | warning | critical)
 * }
 */

const STORAGE_KEY  = "am_activity_log";
const MAX_LOG_SIZE = 500; // keep last 500 entries

function getUser() {
  try {
    const auth = localStorage.getItem("am_auth");
    if (auth) return JSON.parse(auth).name || "Area Manager";
  } catch {}
  return "Area Manager";
}

function generateId() {
  return `LOG-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function getLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveLogs(logs) {
  try {
    // Keep only latest MAX_LOG_SIZE entries
    const trimmed = logs.slice(0, MAX_LOG_SIZE);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {}
}

export function logActivity({ type, category, action, detail = "", severity = "info" }) {
  const entry = {
    id:        generateId(),
    timestamp: new Date().toISOString(),
    type,
    category,
    action,
    detail,
    user:     getUser(),
    page:     window.location.pathname,
    severity,
  };

  const logs = getLogs();
  logs.unshift(entry); // newest first
  saveLogs(logs);

  // Backend hook — replace with API call later:
  // await fetch('/api/activity-log', { method: 'POST', body: JSON.stringify(entry) });

  return entry;
}

export function clearLogs() {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Convenience loggers ───────────────────────────────────────────────────────

export const ActivityLog = {

  login: (userName) => logActivity({
    type: "LOGIN", category: "auth",
    action: `${userName} logged in`,
    detail: `Browser: ${navigator.userAgent.split(")")[0].split("(")[1] || "Unknown"}`,
    severity: "info",
  }),

  logout: (userName, reason = "Manual") => logActivity({
    type: "LOGOUT", category: "auth",
    action: `${userName} logged out`,
    detail: `Reason: ${reason}`,
    severity: "info",
  }),

  sessionTimeout: () => logActivity({
    type: "SESSION_TIMEOUT", category: "auth",
    action: "Session locked due to inactivity",
    detail: "1 hour inactivity limit reached",
    severity: "warning",
  }),

  loginFailed: (attempts) => logActivity({
    type: "LOGIN_FAILED", category: "auth",
    action: `Failed login attempt #${attempts}`,
    detail: attempts >= 3 ? "Account locked for 15 minutes" : `${3 - attempts} attempts remaining`,
    severity: attempts >= 3 ? "critical" : "warning",
  }),

  orderUpdate: (orderId, fromStatus, toStatus) => logActivity({
    type: "ORDER_UPDATE", category: "orders",
    action: `Order ${orderId} status changed`,
    detail: `${fromStatus} → ${toStatus}`,
    severity: toStatus === "Cancelled" ? "warning" : "info",
  }),

  vendorAssigned: (orderId, vendorName) => logActivity({
    type: "VENDOR_ASSIGNED", category: "orders",
    action: `Vendor assigned to ${orderId}`,
    detail: `Assigned: ${vendorName}`,
    severity: "info",
  }),

  deliveryAssigned: (orderId, deliveryName) => logActivity({
    type: "DELIVERY_ASSIGNED", category: "orders",
    action: `Delivery boy assigned to ${orderId}`,
    detail: `Assigned: ${deliveryName}`,
    severity: "info",
  }),

  vendorApproved: (vendorName) => logActivity({
    type: "VENDOR_APPROVED", category: "vendors",
    action: `Vendor approved: ${vendorName}`,
    detail: "Added to active vendor list",
    severity: "info",
  }),

  vendorRejected: (vendorName, reason = "") => logActivity({
    type: "VENDOR_REJECTED", category: "vendors",
    action: `Vendor rejected: ${vendorName}`,
    detail: reason || "No reason provided",
    severity: "warning",
  }),

  vendorAdded: (vendorName) => logActivity({
    type: "VENDOR_ADDED", category: "vendors",
    action: `New vendor added: ${vendorName}`,
    detail: "Manually added by Area Manager",
    severity: "info",
  }),

  vendorStatusChanged: (vendorName, status) => logActivity({
    type: "VENDOR_STATUS", category: "vendors",
    action: `Vendor status changed: ${vendorName}`,
    detail: `New status: ${status}`,
    severity: status === "Inactive" ? "warning" : "info",
  }),

  leadStageChanged: (leadId, leadName, fromStage, toStage) => logActivity({
    type: "LEAD_STAGE", category: "leads",
    action: `Lead stage updated: ${leadName}`,
    detail: `${leadId}: ${fromStage} → ${toStage}`,
    severity: toStage === "Rejected" ? "warning" : "info",
  }),

  leadApproved: (leadId, name, type) => logActivity({
    type: "LEAD_APPROVED", category: "leads",
    action: `${type === "vendor" ? "Vendor" : "Delivery"} lead approved: ${name}`,
    detail: `${leadId} onboarded successfully`,
    severity: "info",
  }),

  withdrawalRequested: (amount) => logActivity({
    type: "WITHDRAWAL", category: "earnings",
    action: `Withdrawal requested: ₹${amount.toLocaleString()}`,
    detail: "Pending settlement in 2 business days",
    severity: "info",
  }),

  pageVisit: (page) => logActivity({
    type: "PAGE_VISIT", category: "navigation",
    action: `Visited: ${page}`,
    detail: `Route: ${window.location.pathname}`,
    severity: "info",
  }),

  reportExported: (type, period) => logActivity({
    type: "REPORT_EXPORT", category: "reports",
    action: `Report exported: ${type.toUpperCase()}`,
    detail: `Period: ${period}`,
    severity: "info",
  }),
};
