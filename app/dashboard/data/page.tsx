'use client';

import { useState } from 'react';

export default function DataPrivacyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/dashboard/gdpr/export');
      if (!response.ok) {
        let msg = 'Failed to export data';
        try {
          const errJson = await response.json();
          msg = errJson?.error || msg;
        } catch (_e) {
          const txt = await response.text().catch(() => '');
          if (txt) msg = txt;
        }
        setError(msg);
        return;
      }

      const data = await response.json();

      // Trigger download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gdpr-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess('Data exported successfully');
    } catch (_err) {
      setError('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'This action cannot be undone. All your data will be permanently deleted. Do you want to continue?',
    );

    if (!confirmed) return;

    const doubleConfirmed = prompt('Type "DELETE MY ACCOUNT" to confirm irreversible deletion:');

    if (doubleConfirmed !== 'DELETE MY ACCOUNT') {
      setError('Deletion cancelled');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/dashboard/gdpr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmDeletion: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      setSuccess('Account deleted successfully. Redirecting...');
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (_err) {
      setError('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Data & Privacy</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800">{error}</div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-green-800">
          {success}
        </div>
      )}

      {/* GDPR Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">GDPR Compliance</h2>
        <p className="text-blue-800 text-sm mb-3">
          We comply with the General Data Protection Regulation (GDPR) and other data protection
          laws. Your data rights:
        </p>
        <ul className="text-blue-800 text-sm space-y-1 ml-4">
          <li>✓ Right of access - Download your data anytime</li>
          <li>✓ Right to be forgotten - Delete your account permanently</li>
          <li>✓ Data portability - Export in standard format</li>
          <li>✓ Audit logs - We track all data changes</li>
          <li>✓ 3-year retention policy - Data kept only as long as necessary</li>
        </ul>
      </div>

      {/* Export Data */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Export Your Data</h2>
        <p className="text-gray-600 mb-4">
          Download a copy of all your data in JSON format (GDPR Article 15 - Right of Access). This
          includes pages, services, projects, team members, and contact settings.
        </p>
        <button
          onClick={handleExportData}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Exporting...' : 'Export My Data'}
        </button>
      </div>

      {/* Delete Account */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-900 mb-3">Delete Account</h2>
        <p className="text-red-800 mb-4">
          Permanently delete all your data (GDPR Article 17 - Right to be Forgotten). This action
          cannot be undone and will remove all pages, services, projects, and team member
          information.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          {loading ? 'Deleting...' : 'Delete My Account'}
        </button>
      </div>

      {/* Privacy Policy Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-600">
        <p>
          For more information about our data practices, please review our{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>
          .
        </p>
      </div>
    </div>
  );
}
