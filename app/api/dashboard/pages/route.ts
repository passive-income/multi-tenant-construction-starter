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
  } catch (error: any) {
    console.error('[GET /api/dashboard/pages]', error);
    if (error.message?.includes('Access denied')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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

    const client = getClient(dataset);

    // Revalidate host/domain before creating the page to avoid orphaned documents
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

    function makeSlug(input: unknown) {
      if (!input) return 'page';
      const raw = String(input);
      // Normalize Unicode, lowercase
      const normalized = raw
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase();
      // Replace non-alphanumeric with hyphens, collapse hyphens, trim
      const slug = normalized
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');
      return slug || 'page';
    }

    const slugValue = body.slug ? makeSlug(body.slug) : makeSlug(body.title);

    const newPage = await client.create({
      _type: 'page',
      clientId,
      title: body.title || 'Untitled Page',
      slug: { current: slugValue },
      sections: body.sections || [],
      seo: body.seo || {},
      _createdAt: new Date().toISOString(),
    });
    revalidateTag(`site-${host}`);

    return NextResponse.json({ success: true, data: newPage }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/dashboard/pages]', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create page';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
