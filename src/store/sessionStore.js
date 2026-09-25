// src/store/sessionStore.js
/**
 * SessionStore
 * Manages:
 *  - 1 hour inactivity timeout → auto-lock
 *  - Login attempt tracking → 3 fails = 15 min lockout
 *  - Daily report scheduler → 10 PM trigger
 */

import { ActivityLog } from "./activityStore";

const SESSION_KEY      = "am_session";
const ATTEMPT_KEY      = "am_login_attempts";
const TIMEOUT_MS       = 60 * 60 * 1000;    // 1 hour
const LOCKOUT_MS       = 15 * 60 * 1000;    // 15 minutes
const MAX_ATTEMPTS     = 3;
const REPORT_HOUR      = 22;                 // 10 PM

let inactivityTimer    = null;
let reportTimer        = null;
let lockCallback       = null;               // called when session times out

// ── Inactivity Timer ─────────────────────────────────────────────────────────

export function startSessionTimer(onLock) {
  lockCallback = onLock;
  resetTimer();

  // Listen for any user activity
  const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"];
  events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));

  // Store cleanup function
  return () => {
    clearTimeout(inactivityTimer);
    events.forEach(e => window.removeEventListener(e, resetTimer));
  };
}

function resetTimer() {
  clearTimeout(inactivityTimer);
  updateLastActivity();
  inactivityTimer = setTimeout(() => {
    ActivityLog.sessionTimeout();
    if (lockCallback) lockCallback();
  }, TIMEOUT_MS);
}

function updateLastActivity() {
  try {
    const session = getSession();
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      ...session,
      lastActivity: Date.now(),
    }));
  } catch {}
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function setSession(data) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      ...data,
      lastActivity: Date.now(),
      loginTime: Date.now(),
    }));
  } catch {}
}

export function clearSession() {
  clearTimeout(inactivityTimer);
  localStorage.removeItem(SESSION_KEY);
}

// Check if session is still valid on app load
export function isSessionExpired() {
  const session = getSession();
  if (!session.lastActivity) return true;
  return Date.now() - session.lastActivity > TIMEOUT_MS;
}

export function getRemainingTime() {
  const session = getSession();
  if (!session.lastActivity) return 0;
  const remaining = TIMEOUT_MS - (Date.now() - session.lastActivity);
  return Math.max(0, remaining);
}

// ── Login Attempt Tracker ─────────────────────────────────────────────────────

export function recordLoginAttempt(success) {
  if (success) {
    localStorage.removeItem(ATTEMPT_KEY);
    return { locked: false, attempts: 0 };
  }

  let data = { attempts: 0, lockedUntil: null };
  try {
    const raw = localStorage.getItem(ATTEMPT_KEY);
    if (raw) data = JSON.parse(raw);
  } catch {}

  // Check if still locked
  if (data.lockedUntil && Date.now() < data.lockedUntil) {
    return {
      locked: true,
      attempts: data.attempts,
      lockedUntil: data.lockedUntil,
      remainingMs: data.lockedUntil - Date.now(),
    };
  }

  // Increment attempts
  const newAttempts = (data.attempts || 0) + 1;
  const locked      = newAttempts >= MAX_ATTEMPTS;
  const newData     = {
    attempts: locked ? newAttempts : newAttempts,
    lockedUntil: locked ? Date.now() + LOCKOUT_MS : null,
    lastAttempt: Date.now(),
  };

  localStorage.setItem(ATTEMPT_KEY, JSON.stringify(newData));
  ActivityLog.loginFailed(newAttempts);

  return {
    locked,
    attempts: newAttempts,
    lockedUntil: newData.lockedUntil,
    remainingMs: locked ? LOCKOUT_MS : 0,
  };
}

export function checkLoginLock() {
  try {
    const raw = localStorage.getItem(ATTEMPT_KEY);
    if (!raw) return { locked: false, attempts: 0 };
    const data = JSON.parse(raw);
    if (data.lockedUntil && Date.now() < data.lockedUntil) {
      return {
        locked: true,
        attempts: data.attempts,
        lockedUntil: data.lockedUntil,
        remainingMs: data.lockedUntil - Date.now(),
      };
    }
    // Lock expired — reset
    if (data.lockedUntil && Date.now() >= data.lockedUntil) {
      localStorage.removeItem(ATTEMPT_KEY);
    }
    return { locked: false, attempts: data.attempts || 0 };
  } catch { return { locked: false, attempts: 0 }; }
}

// ── Daily Report Scheduler (10 PM) ───────────────────────────────────────────

export function scheduleDailyReport(onReport) {
  clearTimeout(reportTimer);

  const now     = new Date();
  const target  = new Date();
  target.setHours(REPORT_HOUR, 0, 0, 0);

  // If already past 10 PM today, schedule for tomorrow
  if (now >= target) target.setDate(target.getDate() + 1);

  const msUntil = target.getTime() - now.getTime();

  reportTimer = setTimeout(() => {
    onReport(buildDailyDigest());
    // Reschedule for next day
    scheduleDailyReport(onReport);
  }, msUntil);

  return () => clearTimeout(reportTimer);
}

export function buildDailyDigest() {
  const { getLogs } = require("./activityStore");
  const logs  = getLogs();
  const today = new Date().toDateString();

  const todayLogs = logs.filter(l => new Date(l.timestamp).toDateString() === today);

  const digest = {
    date:       new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" }),
    reportTime: new Date().toLocaleTimeString("en-IN"),
    totalActions: todayLogs.length,
    byCategory: {},
    criticalEvents: todayLogs.filter(l => l.severity === "critical" || l.severity === "warning"),
    loginLogout: todayLogs.filter(l => l.category === "auth"),
    orderActions: todayLogs.filter(l => l.category === "orders"),
    vendorActions: todayLogs.filter(l => l.category === "vendors"),
    leadActions: todayLogs.filter(l => l.category === "leads"),
    earningActions: todayLogs.filter(l => l.category === "earnings"),
    allLogs: todayLogs,
  };

  todayLogs.forEach(l => {
    digest.byCategory[l.category] = (digest.byCategory[l.category] || 0) + 1;
  });

  return digest;
}

// Format digest as email body text
export function formatDigestEmail(digest) {
  const lines = [
    `📊 AREA MANAGER DAILY ACTIVITY REPORT`,
    `Date: ${digest.date}`,
    `Generated: ${digest.reportTime}`,
    `${"─".repeat(50)}`,
    ``,
    `📈 SUMMARY`,
    `Total Actions Today: ${digest.totalActions}`,
    Object.entries(digest.byCategory).map(([k,v]) => `  • ${k}: ${v} actions`).join("\n"),
    ``,
    `⚠️ CRITICAL / WARNING EVENTS (${digest.criticalEvents.length})`,
    digest.criticalEvents.length
      ? digest.criticalEvents.map(l => `  [${l.severity.toUpperCase()}] ${new Date(l.timestamp).toLocaleTimeString("en-IN")} — ${l.action}: ${l.detail}`).join("\n")
      : "  None",
    ``,
    `🔐 AUTH EVENTS (${digest.loginLogout.length})`,
    digest.loginLogout.length
      ? digest.loginLogout.map(l => `  ${new Date(l.timestamp).toLocaleTimeString("en-IN")} — ${l.action}`).join("\n")
      : "  None",
    ``,
    `📦 ORDER ACTIONS (${digest.orderActions.length})`,
    digest.orderActions.length
      ? digest.orderActions.map(l => `  ${new Date(l.timestamp).toLocaleTimeString("en-IN")} — ${l.action}: ${l.detail}`).join("\n")
      : "  None",
    ``,
    `🏪 VENDOR ACTIONS (${digest.vendorActions.length})`,
    digest.vendorActions.length
      ? digest.vendorActions.map(l => `  ${new Date(l.timestamp).toLocaleTimeString("en-IN")} — ${l.action}: ${l.detail}`).join("\n")
      : "  None",
    ``,
    `👥 LEAD ACTIONS (${digest.leadActions.length})`,
    digest.leadActions.length
      ? digest.leadActions.map(l => `  ${new Date(l.timestamp).toLocaleTimeString("en-IN")} — ${l.action}: ${l.detail}`).join("\n")
      : "  None",
    ``,
    `💰 EARNING ACTIONS (${digest.earningActions.length})`,
    digest.earningActions.length
      ? digest.earningActions.map(l => `  ${new Date(l.timestamp).toLocaleTimeString("en-IN")} — ${l.action}: ${l.detail}`).join("\n")
      : "  None",
    ``,
    `${"─".repeat(50)}`,
    `This report was auto-generated by ADD Area Manager System.`,
    `To connect real email delivery, integrate with backend /api/send-daily-report`,
  ];

  return lines.join("\n");
}
