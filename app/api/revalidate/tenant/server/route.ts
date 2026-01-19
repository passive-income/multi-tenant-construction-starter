import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getCurrentTenant } from '@/lib/dashboard/auth';
import { revalidateTenant } from '@/lib/dashboard/revalidate';

export async function POST() {
  try {
    // Ensure the caller is an authenticated dashboard user and get their tenant
    const { clientId } = await getCurrentTenant();
    const headersList = await headers();
    const rawHost = headersList.get('host') || '';
    const defaultPort = process.env.PORT ?? '3000';
    const host = rawHost || `localhost:${defaultPort}`; // preserve port if provided
    const protocol =
      headersList.get('x-forwarded-proto') ||
      (process.env.NODE_ENV === 'development' ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;

    const secret = process.env.DASHBOARD_API_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const result = await revalidateTenant({ baseUrl, secret, clientId });
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error: any) {
    console.error('[server revalidate tenant]', error);
    return NextResponse.json({ error: error?.message || 'Failed' }, { status: 500 });
  }
}
