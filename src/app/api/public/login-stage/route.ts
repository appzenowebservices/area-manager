import { NextResponse } from "next/server";
import { stage } from "~/server/services/areaManagerAuth";

/**
 * State-first login hint for the login forms: given an e-mail or mobile
 * number, report where the account sits in the
 * verify → approve → set-password → sign-in flow.
 *
 * Read-only: it never sends e-mail. The login page calls
 * `/api/public/password-invite` when the state is `password_not_set`.
 */
export async function POST(request: Request) {
  let identifier = "";
  try {
    const body = (await request.json()) as {
      identifier?: unknown;
      email?: unknown;
      mobile?: unknown;
    };
    const value = body.identifier ?? body.email ?? body.mobile;
    identifier = typeof value === "string" ? value : "";
  } catch {
    /* fall through to the empty-identifier response */
  }

  const result = await stage(identifier);
  return NextResponse.json(result);
}
