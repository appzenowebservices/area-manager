import { NextResponse } from "next/server";
import { setPassword } from "~/server/services/areaManagerAuth";

/** Consumes the single-use set-password link (app-owned auth). */
export async function POST(request: Request) {
  let body: {
    token?: unknown;
    password?: unknown;
    confirmPassword?: unknown;
  } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    /* validation below */
  }

  const result = await setPassword({
    token: typeof body.token === "string" ? body.token : "",
    password: typeof body.password === "string" ? body.password : "",
    confirmPassword:
      typeof body.confirmPassword === "string" ? body.confirmPassword : undefined,
  });

  return NextResponse.json(result, { status: result.status });
}
