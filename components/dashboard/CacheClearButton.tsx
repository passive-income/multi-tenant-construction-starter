'use client';

import { useState } from 'react';

export function CacheClearButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleClearCache = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/revalidate/tenant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-dashboard-secret': process.env.NEXT_PUBLIC_DASHBOARD_API_SECRET || '',
        },
        body: JSON.stringify({ host: window.location.hostname }),
      });

      if (response.ok) {
        setMessage('Cache cleared successfully');
      } else {
        setMessage('Failed to clear cache');
      }
    } catch (_error) {
      setMessage('Error clearing cache');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded text-blue-800">
          {message}
        </div>
      )}
      <p className="text-gray-600 mb-4">
        After publishing changes, use the button below to immediately clear your site's cache and
        display the latest content.
      </p>
      <button
        onClick={handleClearCache}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Clearing...' : 'Clear Cache Now'}
      </button>
    </div>
  );
}
