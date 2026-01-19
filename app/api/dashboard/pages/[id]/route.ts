import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentTenant, validateTenantAccess } from '@/lib/dashboard/auth';
import { getClient } from '@/sanity/lib/client';

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

/**
 * GET /api/dashboard/pages/[id]
 * Fetch a single page for the current tenant
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { clientId } = await getCurrentTenant();
    const { id } = await params;
    const client = getClient(dataset);

    const page = await client.fetch('*[_type == "page" && _id == $id][0]', { id });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    validateTenantAccess(clientId, page.clientId);

    return NextResponse.json({ success: true, data: page });
  } catch (error: any) {
    if (error.message.includes('Access denied')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('[GET /api/dashboard/pages/[id]]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * PATCH /api/dashboard/pages/[id]
 * Update a page for the current tenant
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { clientId } = await getCurrentTenant();
    const { id } = await params;
    const rawBody = await request.json();
    const client = getClient(dataset);

    // Fetch existing page to verify ownership early so we can compare clientId and ids
    const existingPage = await client.fetch('*[_type == "page" && _id == $id][0]', { id });
    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    validateTenantAccess(clientId, existingPage.clientId);

    function sanitizeRequestBody(input: any) {
      const sanitized: Record<string, any> = {};

      // Basic validations per field
      if (typeof input !== 'object' || input === null) return sanitized;

      if ('pageType' in input && typeof input.pageType === 'string') {
        const v = input.pageType;
        if (v === 'home' || v === 'standard') sanitized.pageType = v;
      }

      if ('title' in input && typeof input.title === 'string') {
        sanitized.title = input.title;
      }

      if ('slug' in input && input.slug && typeof input.slug === 'object') {
        const current = (input.slug.current ?? input.slug) as unknown;
        if (typeof current === 'string') sanitized.slug = { current: current };
      }

      if (
        'description' in input &&
        (typeof input.description === 'string' || input.description == null)
      ) {
        sanitized.description = input.description;
      }

      if ('image' in input && (typeof input.image === 'object' || input.image == null)) {
        sanitized.image = input.image;
      }

      if ('sections' in input && Array.isArray(input.sections)) {
        sanitized.sections = input.sections;
      }

      return sanitized;
    }

    // Prevent updating protected fields via payload
    if (rawBody && (rawBody._type || rawBody._id || rawBody.clientId || rawBody.id)) {
      if (rawBody._id && rawBody._id !== id) {
        return NextResponse.json({ error: 'Payload document id mismatch' }, { status: 400 });
      }
      if (rawBody.id && rawBody.id !== id) {
        return NextResponse.json({ error: 'Payload document id mismatch' }, { status: 400 });
      }
      if (rawBody.clientId && rawBody.clientId !== existingPage.clientId) {
        return NextResponse.json({ error: 'Cannot change clientId' }, { status: 403 });
      }
    }

    const sanitizedBody = sanitizeRequestBody(rawBody);

    // Revalidate the site cache — validate host against tenant domains first
    const headersList = await headers();
    const rawHost = headersList.get('x-forwarded-host') || headersList.get('host') || '';
    const host = String(rawHost).split(':')[0].toLowerCase();

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

    // Update page (only after host is authorized)
    const updated = await client.patch(id).set(sanitizedBody).commit();

    await revalidateTag(`site-${host}`, {});

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error.message.includes('Access denied')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('[PATCH /api/dashboard/pages/[id]]', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

/**
 * DELETE /api/dashboard/pages/[id]
 * Delete a page for the current tenant
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { clientId } = await getCurrentTenant();
    const { id } = await params;
    const client = getClient(dataset);

    // Fetch existing page to verify ownership
    const existingPage = await client.fetch('*[_type == "page" && _id == $id][0]', { id });
    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    validateTenantAccess(clientId, existingPage.clientId);

    // Revalidate the site cache — validate host against tenant domains first
    const headersList = await headers();
    const rawHost = headersList.get('x-forwarded-host') || headersList.get('host') || '';
    const host = String(rawHost).split(':')[0].toLowerCase();

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

    // Delete page (only after host is authorized)
    await client.delete(id);

    await revalidateTag(`site-${host}`, {});

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message.includes('Access denied')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('[DELETE /api/dashboard/pages/[id]]', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
