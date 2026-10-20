import type { NextRequest } from "next/server";

/**
 * Auth.js handlers, imported lazily so `NextAuth()` is not evaluated during
 * the build's page-data collection (a stale v4-style shim breaks that step
 * for this app's bundler setup). At runtime the handlers behave normally.
 */
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { handlers } = await import("~/server/auth");
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  const { handlers } = await import("~/server/auth");
  return handlers.POST(request);
}
