import { type NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest) {
  const host = req.headers.get('host') || '';

  const res = NextResponse.next();

  // Persist the host so server-side code can resolve the tenant from Sanity
  // without relying on an in-repo static clients list.
  if (host) res.cookies.set('clientHost', host);

  return res;
}

export const config = { matcher: ['/:path*'] };
