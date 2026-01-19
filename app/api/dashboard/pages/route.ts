import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentTenant } from '@/lib/dashboard/auth';
import { getClient } from '@/sanity/lib/client';

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

/**
 * GET /api/dashboard/pages
 * Fetch all pages for the current tenant
 */
export async function GET() {
  try {
    const { clientId } = await getCurrentTenant();
    const client = getClient(dataset);

    const pages = await client.fetch(
      '*[_type == "page" && clientId == $clientId] | order(_createdAt desc)',
      { clientId },
    );

    return NextResponse.json({ success: true, data: pages });
  } catch (error) {
    console.error('[GET /api/dashboard/pages]', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

/**
 * POST /api/dashboard/pages
 * Create a new page for the current tenant
 */
export async function POST(request: NextRequest) {
  try {
    const { clientId } = await getCurrentTenant();
    const body = await request.json();

    // Validate that the page is being created for the user's tenant
    if (body.clientId !== clientId) {
      return NextResponse.json({ error: 'Invalid clientId' }, { status: 400 });
    }

    const client = getClient(dataset);
    const newPage = await client.create({
      _type: 'page',
      clientId,
      title: body.title || 'Untitled Page',
      slug: { current: body.slug || body.title?.toLowerCase().replace(/\s+/g, '-') || 'page' },
      sections: body.sections || [],
      seo: body.seo || {},
      _createdAt: new Date().toISOString(),
    });

    // Revalidate the site cache — validate host against tenant domains first
    const headersList = await headers();
    const rawHost = headersList.get('x-forwarded-host') || headersList.get('host') || '';
    const host = String(rawHost).split(':')[0].toLowerCase();

    // fetch authorized domains for tenant
    const tenantDoc = await client.fetch(
      '*[_type == "client" && clientId == $clientId][0]{ domains }',
      { clientId },
    );
    const domains = tenantDoc?.domains || [];
    const normalizedDomains = Array.isArray(domains)
      ? domains.map((d: string) => String(d).toLowerCase())
      : [];

    if (!normalizedDomains.includes(host)) {
      return NextResponse.json({ error: 'Unauthorized host for revalidation' }, { status: 403 });
    }

    revalidateTag(`site-${host}`, 'default');

    return NextResponse.json({ success: true, data: newPage }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/dashboard/pages]', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create page';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
