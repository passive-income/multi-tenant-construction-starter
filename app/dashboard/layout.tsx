import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getCurrentTenant } from '@/lib/dashboard/auth';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  let clientId: string | null = null;
  try {
    const tenant = await getCurrentTenant();
    clientId = tenant.clientId;
  } catch {
    return (
      <div className="min-h-screen bg-red-50 p-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-4">
            Your user account is not yet assigned to a tenant. Please contact your administrator.
          </p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              Dashboard
            </Link>
            <span className="text-sm text-gray-500">Tenant: {clientId}</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Sidebar Navigation */}
      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-gray-900 rounded-lg hover:bg-gray-100 font-medium"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/pages"
              className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Pages
            </Link>
            <Link
              href="/dashboard/services"
              className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Services
            </Link>
            <Link
              href="/dashboard/projects"
              className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Projects
            </Link>
            <Link
              href="/dashboard/team"
              className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Team
            </Link>
            <hr className="my-4" />
            <Link
              href="/dashboard/settings"
              className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Settings
            </Link>
            <Link
              href="/dashboard/data"
              className="block px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Data & Privacy
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
