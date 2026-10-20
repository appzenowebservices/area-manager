import { NextResponse } from "next/server";
import { requestPassword } from "~/server/services/areaManagerAuth";

/**
 * Cross-app password invite: super-admin calls this after approving an area
 * manager so this app (which owns the token + Patra e-mail) sends the
 * single-use set-password link. Generic response either way.
 */
export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim() : "";
  } catch {
    /* fall through to the validation error */
  }

  const result = await requestPassword(email);
  return NextResponse.json(result, { status: result.status });
}
