import { NextRequest, NextResponse } from "next/server";
import { resolveClient } from "@/lib/resolveClient";
import clients from "@/data/clients";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const client = resolveClient(host);

  const res = NextResponse.next();

  if (client) {
    if (client.name) res.cookies.set("clientId", client.name);
    return res;
  }

  // Fallback: if middleware couldn't resolve the host, use the first
  // configured client so the site doesn't rewrite to a potentially
  // non-existent `/no-client` route and return 404.
  const fallback =
    Array.isArray(clients) && clients.length > 0 ? clients[0] : null;
  if (fallback) {
    if (fallback.name) res.cookies.set("clientId", fallback.name);
    return res;
  }

  // If no clients are available, keep original behavior and rewrite
  // to /no-client so a clear message can be shown.
  return NextResponse.rewrite(new URL("/no-client", req.url));
}

export const config = { matcher: ["/:path*"] };
