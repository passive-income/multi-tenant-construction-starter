import crypto from 'node:crypto';
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
      const tx = client.transaction();
      for (const id of itemsToDelete) {
        tx.delete(id);
      }
      await tx.commit();
    }

    // Log deletion for audit trail (GDPR compliance)
    // Extract client IP (first in X-Forwarded-For list), compute an HMAC instead of unsalted hash
    const ipHeader =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const ipRaw = ipHeader.split(',')[0].trim();
    const hmacKey = process.env.AUDIT_LOG_HMAC_KEY || process.env.IP_HASH_SALT;
    if (!hmacKey) {
      console.error('[GDPR] Missing HMAC key for IP hashing (AUDIT_LOG_HMAC_KEY)');
    }
    const ipHash =
      hmacKey && ipRaw ? crypto.createHmac('sha256', hmacKey).update(ipRaw).digest('hex') : null;
    let retentionDays = parseInt(process.env.AUDIT_LOG_RETENTION_DAYS ?? '30', 10);
    if (Number.isNaN(retentionDays) || retentionDays <= 0) retentionDays = 30;
    const retentionTimestamp = new Date(
      Date.now() + retentionDays * 24 * 60 * 60 * 1000,
    ).toISOString();

    const auditLog = await client.create({
      _type: 'auditLog',
      action: 'ACCOUNT_DELETION',
      // store identifiers in structured fields (access-controlled) instead of free-text
      clientId,
      userId,
      timestamp: new Date().toISOString(),
      description: `Account deletion recorded for tenant (referential id stored)`,
      ipHash: ipHash,
      retentionTimestamp,
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
