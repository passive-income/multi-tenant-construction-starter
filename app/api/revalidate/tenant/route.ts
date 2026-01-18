import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/sanity/lib/client';

/**
 * Tenant-scoped revalidation endpoint
 * Use from your dashboard to invalidate caches for a specific tenant.
 *
 * POST /api/revalidate/tenant
 * Body: { clientId?: string, host?: string }
 * Auth: header `x-dashboard-secret: <DASHBOARD_API_SECRET>`
 */
export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-dashboard-secret');
    const expected = process.env.DASHBOARD_API_SECRET;
    if (!expected || secret !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const clientId: string | undefined = body?.clientId;
    const hostOverride: string | undefined = body?.host;

    if (!clientId && !hostOverride) {
      return NextResponse.json({ error: 'Provide clientId or host' }, { status: 400 });
    }

    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
    const client = getClient(dataset);

    // Resolve hosts for the tenant
    const hosts: string[] = [];
    if (hostOverride) {
      hosts.push(String(hostOverride));
    }

    if (clientId) {
      try {
        const doc = await client.fetch(
          '*[_type == "client" && clientId == $clientId][0]{ clientId, domains }',
          { clientId },
        );
        const domains: unknown = doc?.domains;
        if (Array.isArray(domains)) {
          for (const d of domains) {
            if (typeof d === 'string' && d.trim()) hosts.push(d.trim());
          }
        }
      } catch (_e) {
        // ignore, proceed with whatever we have
      }
    }

    // Ensure at least one tag to revalidate — per-tenant only
    const uniqueHosts = Array.from(new Set(hosts));
    const tags: string[] = uniqueHosts.length > 0 ? uniqueHosts.map((h) => `site-${h}`) : [];

    if (tags.length === 0) {
      return NextResponse.json({ error: 'No hosts found for tenant' }, { status: 404 });
    }

    const revalidated = new Set<string>();
    for (const tag of tags) {
      try {
        revalidateTag(tag, '');
        revalidated.add(tag);
      } catch (_err) {
        // continue
      }
    }

    return NextResponse.json({ success: true, tags: Array.from(revalidated) }, { status: 200 });
  } catch (_error) {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    { message: 'OK' },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-dashboard-secret',
      },
    },
  );
}
