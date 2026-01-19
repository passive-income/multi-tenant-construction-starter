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

    return NextResponse.json(exportData, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[GET /api/dashboard/gdpr/export]', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
