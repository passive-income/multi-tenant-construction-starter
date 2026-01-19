import { headers } from 'next/headers';
import { CacheClearButton } from '@/components/dashboard/CacheClearButton';

export default async function SettingsPage() {
  const host = (await headers()).get('host') || 'Loading...';
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      {/* Tenant Information */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tenant Information</h2>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Domain</dt>
            <dd className="mt-1 text-lg text-gray-900">{host.split(':')[0]}</dd>
          </div>
        </dl>
      </div>

      {/* Cache Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Cache Management</h2>
        <CacheClearButton />
      </div>

      {/* Support */}
      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600">
        <p>
          For support, please contact your administrator or visit our{' '}
          <a href="/support" className="text-blue-600 hover:underline">
            support page
          </a>
          .
        </p>
      </div>
    </div>
  );
}
