import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentTenant } from '@/lib/dashboard/auth';
import { verifyDeletionToken } from '@/lib/dashboard/verifyDeletionToken';
import { getClient } from '@/sanity/lib/client';

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

/**
 * POST /api/dashboard/gdpr
 * Delete all data for the current tenant (GDPR Right to be Forgotten)
 * Requires a server-issued one-time deletionToken for confirmation
 */
export async function POST(request: NextRequest) {
  try {
    const { clientId, userId } = await getCurrentTenant();
    const body = await request.json();

    const deletionToken = body?.deletionToken as string | undefined;

    const ok = await verifyDeletionToken(deletionToken);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid or missing deletion token' }, { status: 401 });
    }

    const client = getClient(dataset);

    // Delete all tenant data
    const itemsToDelete = await client.fetch(
      '*[_type in ["page", "service", "project", "teamMember", "contactSettings"] && clientId == $clientId]._id',
      { clientId },
    );

    if (itemsToDelete.length > 0) {
      for (const id of itemsToDelete) {
        await client.delete(id);
      }
    }

    // Log deletion for audit trail (GDPR compliance)
    const auditLog = await client.create({
      _type: 'auditLog',
      action: 'ACCOUNT_DELETION',
      clientId,
      userId,
      timestamp: new Date().toISOString(),
      description: `Account for tenant ${clientId} deleted by user ${userId} - GDPR Right to be Forgotten`,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    });

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
      auditLogId: auditLog._id,
    });
  } catch (error) {
    console.error('[POST /api/dashboard/gdpr/delete-account]', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
