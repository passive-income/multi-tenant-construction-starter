'use client';

import { useState } from 'react';

export function CacheClearButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleClearCache = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // Call the server-side revalidation route which uses the server secret
      const response = await fetch('/api/revalidate/tenant/server', {
        method: 'POST',
      });

      const json = await response.json().catch(() => null);
      if (response.ok && json?.success) {
        setMessage('Cache cleared successfully');
      } else {
        setMessage(json?.error || 'Failed to clear cache');
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
