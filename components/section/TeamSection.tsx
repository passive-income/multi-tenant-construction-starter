import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { Card } from '@/components/ui/card';
import { getJsonData } from '@/lib/data/json';
import type { TeamMember } from '@/lib/types/teamMember';
import { getHost } from '@/lib/utils/host';
import { getClient } from '@/sanity/lib/client';
import { teamMembersQuery } from '@/sanity/queries';

interface TeamSectionProps {
  clientId: string;
  dataset?: string;
}

export async function TeamSection({ clientId, dataset = 'production' }: TeamSectionProps) {
  const client = getClient(dataset);
  const host = await getHost();

  let intendedStatic = false;
  let staticFile = 'static-mueller.json';
  if (host) {
    try {
      const clientDoc = await client.fetch('*[_type == "client" && $host in domains][0]', { host });
      const ds = clientDoc?.dataSource || clientDoc?.type || null;
      if (ds === 'json' || ds === 'static') {
        intendedStatic = true;
        staticFile = clientDoc?.staticFileName || staticFile;
      }
    } catch (_e) {}
  }

  let teamMembers: TeamMember[] = [];
  try {
    if (!intendedStatic) {
      teamMembers = await client.fetch(teamMembersQuery, { clientId: clientId ?? null });
    }
  } catch (_e) {
    teamMembers = [];
  }

  let sourceNote: string | null = null;
  if ((!teamMembers || teamMembers.length === 0) && intendedStatic) {
    try {
      const json = await getJsonData(staticFile);
      teamMembers = (json as any)?.teamMembers || [];
      sourceNote = `Using static data (${staticFile})`;
    } catch (_e) {
      teamMembers = [];
    }
  }

  if ((!teamMembers || teamMembers.length === 0) && !intendedStatic) {
    try {
      const json = await getJsonData('static-mueller.json');
      teamMembers = (json as any)?.teamMembers || [];
      if (teamMembers && teamMembers.length > 0)
        sourceNote = 'Using static JSON fallback (Sanity missing)';
    } catch (_e) {
      teamMembers = [];
    }
  }

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center font-medium">Missing data in sanity</p>
      </Card>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {sourceNote && (
          <p className="text-sm text-muted-foreground text-center mb-4">{sourceNote}</p>
        )}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Unser Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Lernen Sie die Experten kennen, die Ihr Projekt zum Erfolg führen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, idx: number) => (
            <TeamMemberCard key={`team-member-${idx}`} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
