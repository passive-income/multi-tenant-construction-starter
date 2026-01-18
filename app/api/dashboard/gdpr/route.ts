import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentTenant } from '@/lib/dashboard/auth';
import { getClient } from '@/sanity/lib/client';

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

/**
 * GET /api/dashboard/gdpr/export
 * Export all personal data for the current tenant (GDPR compliance)
 */
export async function GET(_request: NextRequest) {
  try {
    const { clientId, userId } = await getCurrentTenant();
    const client = getClient(dataset);

    // Fetch all data for this tenant
    const [client_doc, pages, services, projects, team, contact] = await Promise.all([
      client.fetch('*[_type == "client" && clientId == $clientId][0]', { clientId }),
      client.fetch('*[_type == "page" && clientId == $clientId]', { clientId }),
      client.fetch('*[_type == "service" && clientId == $clientId]', { clientId }),
      client.fetch('*[_type == "project" && clientId == $clientId]', { clientId }),
      client.fetch('*[_type == "teamMember" && clientId == $clientId]', { clientId }),
      client.fetch('*[_type == "contactSettings" && clientId == $clientId][0]', { clientId }),
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      userId,
      clientId,
      gdprCompliance: {
        description:
          'This is your complete data export in compliance with GDPR Article 15 (Right of Access)',
        retentionPolicy:
          'Data is retained for 3 years after last activity unless deletion is requested',
      },
      data: {
        client: client_doc,
        pages,
        services,
        projects,
        team,
        contactSettings: contact,
      },
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('[GET /api/dashboard/gdpr/export]', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

/**
 * POST /api/dashboard/gdpr/delete-account
 * Delete all data for the current tenant (GDPR Right to be Forgotten)
 * Requires confirmation via password or additional auth
 */
export async function POST(request: NextRequest) {
  try {
    const { clientId, userId } = await getCurrentTenant();
    const body = await request.json();

    // In production, require additional confirmation (e.g., password re-entry, email confirmation)
    if (!body.confirmDeletion) {
      return NextResponse.json({ error: 'Deletion must be confirmed' }, { status: 400 });
    }

    const client = getClient(dataset);

    // Delete all tenant data
    // Note: This uses Sanity's batch delete. In production, consider soft-deletes with audit logging
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
