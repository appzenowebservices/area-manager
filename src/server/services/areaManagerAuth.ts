import { createHash, createHmac } from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";
import { logManagerAction } from "~/server/api/areaManagerScope";

/**
 * Area-manager auth, owned by this app (same architecture as the vendor
 * panel): Prisma + bcrypt + this app's own HS256 set-password tokens and
 * Patra transactional e-mail.
 *
 * Flow: create (double opt-in e-mail) -> confirm -> admin approves (PIN
 * e-mail) -> set password -> sign in. Login is state-first: the e-mail alone
 * decides which stage message applies.
 */
export interface AreaManagerAuthResult<T = Record<string, unknown>> {
  ok: boolean;
  status: number;
  code?: string;
  message?: string;
  data?: T;
}

const NOT_APPROVED =
  "Your account is verified, but it is not approved yet. The admin team will review it shortly — you can sign in once it is approved.";

const EMAIL_NOT_VERIFIED =
  "Please confirm your email first — we sent you a confirmation link. Open it, then come back and sign in.";

const PASSWORD_NOT_SET =
  "Your account is approved! We've just emailed you a link to create your password — check your inbox, then sign in.";

const INACTIVE =
  "This account has been deactivated. Please contact the admin team to restore access.";

const genericInvite = {
  ok: true,
  status: 200,
  message: "If this email is registered, a password setup link has been sent.",
} as const;

/** Token secret — this app's own, with a dedicated override if provided. */
const tokenSecret = (): string | null =>
  process.env.SET_PASSWORD_JWT_SECRET ?? process.env.JWT_SECRET ?? null;

/** Binds a link to the password state it was issued for (single use). */
const fingerprint = (password: unknown): string =>
  createHash("sha256").update(String(password ?? "")).digest("hex").slice(0, 16);

function mintToken(managerId: string, ph: string): string {
  const secret = tokenSecret();
  if (!secret) throw new Error("JWT_SECRET is not set");
  const b64 = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const header = b64({ alg: "HS256", typ: "JWT" });
  const payload = b64({
    amid: managerId,
    scope: "pwreset",
    ph,
    iat: now,
    exp: now + 1800,
  });
  const sig = createHmac("sha256", secret)
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${sig}`;
}

interface PwTokenPayload {
  amid?: string;
  scope?: string;
  ph?: string;
  exp?: number;
}

function verifyToken(token: string): PwTokenPayload | null {
  const secret = tokenSecret();
  if (!secret) return null;
  const [header, payload, sig] = token.split(".");
  if (!header || !payload || !sig) return null;
  const expected = createHmac("sha256", secret)
    .update(`${header}.${payload}`)
    .digest("base64url");
  if (expected !== sig) return null;
  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as PwTokenPayload;
    if (typeof decoded.exp === "number" && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

/** Sends a transactional e-mail through Patra. */
async function sendTx(input: {
  to: string;
  templateId: number;
  data: Record<string, unknown>;
}) {
  const base = (process.env.PATRA_BASE_URL ?? "").replace(/\/+$/, "");
  const user = process.env.PATRA_API_USER;
  const token = process.env.PATRA_API_TOKEN;
  if (!base || !user || !token) {
    throw new Error(
      "Patra API is not configured (PATRA_BASE_URL / PATRA_API_USER / PATRA_API_TOKEN)",
    );
  }
  const res = await fetch(`${base}/api/tx`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${user}:${token}`).toString("base64")}`,
    },
    body: JSON.stringify({
      template_id: input.templateId,
      subscriber_mode: "external",
      subscriber_emails: [input.to],
      content_type: "html",
      data: input.data,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Patra /api/tx ${res.status}: ${text.slice(0, 300)}`);
  }
}

const appUrl = () => {
  const explicit =
    process.env.AREA_MANAGER_APP_URL ??
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  // Local fallback: this app runs on 3003 (see package.json).
  return `http://localhost:${process.env.PORT ?? 3003}`;
};

/** Which stage an e-mail or mobile number is at — used by the login forms. */
export type LoginStageState =
  | "unknown"
  | "email_not_verified"
  | "not_approved"
  | "inactive"
  | "password_not_set"
  | "ready";

export interface LoginStage {
  state: LoginStageState;
}

/** E-mail or mobile → the Prisma lookup for that identifier. */
function managerWhere(identifier: string) {
  const value = identifier.trim();
  return value.includes("@")
    ? { email: value.toLowerCase() }
    : { phoneNumber: value };
}

export async function stage(identifier: string): Promise<LoginStage> {
  const value = identifier.trim();
  if (!value) return { state: "unknown" };

  const manager = await db.areaManager.findFirst({
    where: managerWhere(value),
  });
  if (!manager || manager.isDeleted === true) return { state: "unknown" };
  if (manager.isVerified?.email !== true) return { state: "email_not_verified" };
  if (!manager.isApproved) return { state: "not_approved" };
  if (manager.isActive === false) return { state: "inactive" };
  if (!manager.passwordSetAt) return { state: "password_not_set" };
  return { state: "ready" };
}

export async function login(input: {
  email: string;
  password?: string;
}): Promise<AreaManagerAuthResult> {
  const email = input.email.trim().toLowerCase();
  const manager = await db.areaManager.findFirst({ where: { email } });

  if (!manager || manager.isDeleted === true) {
    return { ok: false, status: 401, code: "invalid_credentials", message: "Invalid email or password." };
  }
  if (manager.isVerified?.email !== true) {
    return { ok: false, status: 403, code: "email_not_verified", message: EMAIL_NOT_VERIFIED };
  }
  if (!manager.isApproved) {
    return { ok: false, status: 403, code: "not_approved", message: NOT_APPROVED };
  }
  if (manager.isActive === false) {
    return { ok: false, status: 403, code: "inactive", message: INACTIVE };
  }
  if (!manager.passwordSetAt) {
    await requestPassword(manager.email);
    return { ok: false, status: 403, code: "password_not_set", message: PASSWORD_NOT_SET };
  }

  const matches = await bcrypt.compare(input.password ?? "", manager.password);
  if (!matches) {
    return { ok: false, status: 401, code: "invalid_credentials", message: "Invalid email or password." };
  }

  await logManagerAction(manager.id, "LOGIN", "Area manager signed in");

  return {
    ok: true,
    status: 200,
    data: {
      id: manager.id,
      name: manager.fullName,
      email: manager.email,
      mobile: manager.phoneNumber,
    },
  };
}

export async function requestPassword(email: string): Promise<AreaManagerAuthResult> {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return { ok: false, status: 400, message: "A valid email is required" };
  }

  const manager = await db.areaManager.findFirst({
    where: { email: email.trim().toLowerCase() },
  });
  if (
    !manager ||
    manager.isDeleted === true ||
    manager.isVerified?.email !== true ||
    !manager.isApproved ||
    manager.isActive === false
  ) {
    // No link before verification + approval; never leak account existence.
    return { ...genericInvite };
  }

  try {
    const token = mintToken(manager.id, fingerprint(manager.password));
    const setPasswordUrl = `${appUrl()}/set-password?token=${encodeURIComponent(token)}`;
    await sendTx({
      to: manager.email,
      templateId: Number(process.env.PATRA_PASSWORD_TEMPLATE_ID ?? 7),
      data: { setPasswordUrl },
    });
  } catch (error) {
    console.error("areaManager requestPassword: invite failed:", error);
  }

  return { ...genericInvite };
}

export async function setPassword(input: {
  token: string;
  password: string;
  confirmPassword?: string;
}): Promise<AreaManagerAuthResult> {
  const { token, password, confirmPassword } = input;

  if (!token) {
    return { ok: false, status: 400, code: "invalid_token", message: "The password setup token is missing" };
  }
  if (!password || password.length < 8) {
    return { ok: false, status: 400, message: "Password must be at least 8 characters" };
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return { ok: false, status: 400, message: "Password and confirm password must match" };
  }

  const payload = verifyToken(token);
  if (!payload || payload.scope !== "pwreset" || !payload.amid) {
    return {
      ok: false,
      status: 400,
      code: "invalid_token",
      message: "This link is invalid or has expired. Please request a new one.",
    };
  }

  const manager = await db.areaManager.findUnique({ where: { id: payload.amid } });
  if (!manager || manager.isDeleted === true) {
    return { ok: false, status: 400, code: "invalid_token", message: "Invalid password setup link" };
  }
  if (!manager.isApproved) {
    return { ok: false, status: 403, code: "not_approved", message: NOT_APPROVED };
  }
  if (manager.isActive === false) {
    return { ok: false, status: 403, code: "inactive", message: INACTIVE };
  }
  if (manager.isVerified?.email !== true) {
    return { ok: false, status: 403, code: "email_not_verified", message: EMAIL_NOT_VERIFIED };
  }
  if (fingerprint(manager.password) !== payload.ph) {
    return {
      ok: false,
      status: 400,
      code: "used_token",
      message: "This link has already been used. Please request a new one.",
    };
  }

  await db.areaManager.update({
    where: { id: manager.id },
    data: {
      password: await bcrypt.hash(password, 10),
      passwordSetAt: new Date(),
    },
  });

  return {
    ok: true,
    status: 200,
    message: "Password set successfully. You can now sign in.",
  };
}
