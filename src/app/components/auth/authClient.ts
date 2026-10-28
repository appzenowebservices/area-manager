/**
 * Client helpers shared by the two sign-in screens (`/` and `/auth`) so both
 * apply the same verify → approve → password-set gate before auth.
 */

export type LoginStageState =
  | "unknown"
  | "email_not_verified"
  | "not_approved"
  | "inactive"
  | "password_not_set"
  | "ready";

export async function fetchLoginStage(
  identifier: string,
): Promise<LoginStageState> {
  try {
    const res = await fetch("/api/public/login-stage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      state?: LoginStageState;
    };
    return data.state ?? "unknown";
  } catch {
    // Offline / transient failure: let the credentials check decide.
    return "unknown";
  }
}

export async function requestPasswordInvite(email: string): Promise<string> {
  const fallback =
    "If this e-mail is registered and approved, a password setup link is on its way.";
  try {
    const res = await fetch("/api/public/password-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    return data.message ?? fallback;
  } catch {
    return "Could not send the link right now. Please try again in a moment.";
  }
}

export const STAGE_MESSAGES: Record<
  Exclude<LoginStageState, "ready" | "unknown">,
  string
> = {
  email_not_verified:
    "Please confirm your e-mail first — we sent you a confirmation link. Open it, then come back and sign in.",
  not_approved:
    "Your e-mail is verified, but your account is not approved yet. The admin team will review it shortly — you can sign in once it is approved.",
  inactive:
    "This account has been deactivated. Please contact the admin team to restore access.",
  password_not_set:
    "Your account is approved but no password is set yet. Check your inbox for the secure setup link, then sign in.",
};
