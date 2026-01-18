import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import { cache } from 'react';
import { SectionRenderer } from '@/components/SectionRenderer';
import { getSiteData } from '@/lib/data/streaming';
import { getHost } from '@/lib/utils/host';
import { getClient } from '@/sanity/lib/client';

// Cache for 10 minutes, revalidate in background
export const revalidate = 600;

/**
 * Cached page fetcher from Sanity
 */
const getCachedPage = cache((host: string, slug: string) => {
  return unstable_cache(
    async () => {
      try {
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
        const client = getClient(dataset);
        const clientDoc = await client.fetch('*[_type == "client" && $host in domains][0]', {
          host,
        });
        const clientId = clientDoc?.clientId;
        const enabledFeatures = Array.isArray(clientDoc?.enabledFeatures)
          ? clientDoc.enabledFeatures.filter((f: unknown): f is string => typeof f === 'string')
          : undefined;

        if (clientId) {
          const page = await client.fetch(
            '*[_type == "page" && slug.current == $slug && clientId == $clientId][0]',
            { slug, clientId },
          );
          return { page, enabledFeatures };
        }
      } catch (_e) {
        // Fallback
      }
      return null;
    },
    [`page-${host}-${slug}`],
    {
      revalidate: 600,
      // Global + per-host tags so webhook can invalidate immediately
      tags: ['all-sites', `site-${host}`],
    },
  )();
});

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const host = await getHost();

  // Try cached Sanity fetch first
  let result = null;
  if (host) {
    result = await getCachedPage(host, slug);
  }

  if (result?.page) {
    const { page, enabledFeatures } = result;
    return <SectionRenderer sections={page.sections} enabledFeatures={enabledFeatures} />;
  }

  // Fallback to JSON
  if (!host) {
    return <div>Host not found</div>;
  }
  const jsonData = await getSiteData(host);
  if (!jsonData) {
    return <div>No data found</div>;
  }
  const pages: any[] = Array.isArray((jsonData as any)?.pages) ? (jsonData as any).pages : [];
  const jsonPage = pages.find((p: any) => p?.slug === slug);

  if (!jsonPage) {
    return (
      <main className="container py-8">
        <h1 className="text-2xl font-bold">Seite nicht gefunden</h1>
      </main>
    );
  }

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-4">{jsonPage.title}</h1>
      {typeof jsonPage.image === 'string' && jsonPage.image.trim().length > 0 && (
        <div className="mb-6">
          <Image
            src={jsonPage.image.trim()}
            alt={jsonPage.title || 'Seite'}
            width={1200}
            height={675}
            className="w-full h-auto rounded"
          />
        </div>
      )}
      {jsonPage.contentHtml ? (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: jsonPage.contentHtml }}
        />
      ) : jsonPage.descriptionHtml ? (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: jsonPage.descriptionHtml }}
        />
      ) : (
        jsonPage.description && (
          <p className="text-lg text-muted-foreground">{jsonPage.description}</p>
        )
      )}
    </main>
  );
}
