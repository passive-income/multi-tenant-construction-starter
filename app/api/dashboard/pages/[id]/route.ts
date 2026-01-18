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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    const body = await request.json();
    const client = getClient(dataset);

    // Fetch existing page to verify ownership
    const existingPage = await client.fetch('*[_type == "page" && _id == $id][0]', { id });
    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    validateTenantAccess(clientId, existingPage.clientId);

    // Update page
    const updated = await client.patch(id).set(body).commit();

    // Revalidate the site cache
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') || headersList.get('host') || '';
    revalidateTag(`site-${host}`, 'default');

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

    // Delete page
    await client.delete(id);

    // Revalidate the site cache
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') || headersList.get('host') || '';
    revalidateTag(`site-${host}`, 'default');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message.includes('Access denied')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('[DELETE /api/dashboard/pages/[id]]', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
