import Link from 'next/link';
import { getCurrentTenant } from '@/lib/dashboard/auth';
import { getClient } from '@/sanity/lib/client';

export default async function DashboardOverview() {
  const { clientId } = await getCurrentTenant();
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
  const client = getClient(dataset);

  // Fetch summary data for the tenant
  let pagesCount = 0;
  let servicesCount = 0;
  let projectsCount = 0;
  let teamCount = 0;
  try {
    const results = await Promise.all([
      client.fetch('count(*[_type == "page" && clientId == $clientId])', { clientId }),
      client.fetch('count(*[_type == "service" && clientId == $clientId])', { clientId }),
      client.fetch('count(*[_type == "project" && clientId == $clientId])', { clientId }),
      client.fetch('count(*[_type == "teamMember" && clientId == $clientId])', { clientId }),
    ]);
    [pagesCount, servicesCount, projectsCount, teamCount] = results as number[];
  } catch (err) {
    console.error('[DashboardOverview] failed fetching counts', err);
    // keep sensible defaults
  }

  const stats = [
    { label: 'Pages', value: pagesCount, href: '/dashboard/pages' },
    { label: 'Services', value: servicesCount, href: '/dashboard/services' },
    { label: 'Projects', value: projectsCount, href: '/dashboard/projects' },
    { label: 'Team Members', value: teamCount, href: '/dashboard/team' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <Link
            href="/dashboard/pages?action=create"
            className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Create New Page
          </Link>
          <Link
            href="/dashboard/services?action=create"
            className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Create New Service
          </Link>
          <Link
            href="/dashboard/projects?action=create"
            className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Create New Project
          </Link>
        </div>
      </div>
    </div>
  );
}
