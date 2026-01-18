'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewPagePage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
  });

  // Get clientId from Clerk user metadata
  const clientId = (user?.publicMetadata as any)?.clientId as string;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug from title
      if (name === 'title') {
        updated.slug = value
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!clientId) {
      setError('Client ID not found. Please ensure your Clerk user has clientId in metadata.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dashboard/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title || 'Untitled Page',
          slug: formData.slug,
          clientId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create page');
      }

      // Redirect back to pages list
      router.push('/dashboard/pages');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/pages" className="text-blue-600 hover:underline">
          ← Back to Pages
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Page</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Page Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., About Us"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">The main heading for your page</p>
        </div>

        <div className="mb-6">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            placeholder="e.g., about-us"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">Auto-generated from title (URL-friendly)</p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Page'}
          </button>
          <Link
            href="/dashboard/pages"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
