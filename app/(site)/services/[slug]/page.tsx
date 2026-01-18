import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import { cache } from 'react';
import PortableTextLite from '@/components/richtext/PortableTextLite';
import { getSiteData } from '@/lib/data/streaming';
import { getHost } from '@/lib/utils/host';
import { getClient } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

// Cache for 10 minutes, revalidate in background
export const revalidate = 600;

/**
 * Cached Sanity service fetcher
 * Uses React cache for deduplication and Next.js unstable_cache for persistence
 */
const getCachedService = cache((host: string, slug: string) => {
  return unstable_cache(
    async () => {
      try {
        const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
        const client = getClient(dataset);
        const clientDoc = await client.fetch('*[_type == "client" && $host in domains][0]', {
          host,
        });
        const clientId = clientDoc?.clientId;

        if (clientId) {
          const service = await client.fetch(
            '*[_type == "service" && slug.current == $slug && clientId == $clientId][0]{ ..., richDescription[] }',
            { slug, clientId },
          );
          return service || null;
        }
      } catch (_e) {
        // Fallback to JSON
      }
      return null;
    },
    [`service-${host}-${slug}`],
    {
      revalidate: 600,
      // Global + per-host tags so webhook can invalidate immediately
      tags: ['all-sites', `site-${host}`],
    },
  )();
});

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const host = await getHost();

  // Try cached Sanity fetch first
  let service = null;
  if (host) {
    service = await getCachedService(host, slug);
  }

  // If no service found, fallback to JSON
  if (!service && host) {
    const data = await getSiteData(host);
    const services: any[] = (data as any)?.services || [];
    service = services.find((s: any) => s?.slug === slug);
  }

  // Service not found
  if (!service) {
    return (
      <main className="container py-8">
        <h1 className="text-2xl font-bold">Service nicht gefunden</h1>
      </main>
    );
  }

  // Render Sanity service with image optimization
  if ((service as any)?.richDescription) {
    const imageUrl = (service as any)?.image
      ? urlFor((service as any).image)
          .width(1600)
          .auto('format')
          .url()
      : null;

    return (
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-4">{(service as any).title}</h1>
        {imageUrl && (
          <div className="mb-6">
            <Image
              src={imageUrl}
              alt={(service as any).title || 'Service'}
              width={1200}
              height={675}
              className="w-full h-auto rounded"
            />
          </div>
        )}
        {Array.isArray((service as any).richDescription) &&
        (service as any).richDescription.length > 0 ? (
          <PortableTextLite value={(service as any).richDescription} />
        ) : (
          (service as any).description && (
            <p className="text-lg text-muted-foreground mb-6">{(service as any).description}</p>
          )
        )}
        {Array.isArray((service as any).measures) && (service as any).measures.length > 0 && (
          <section className="mt-4">
            <h2 className="text-2xl font-semibold mb-2">So gehen wir vor</h2>
            <ul className="list-disc pl-6 space-y-1">
              {(service as any).measures.map((m: string, idx: number) => (
                <li key={`${m.slice(0, 20)}-${idx}`}>{m}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
    );
  }

  // Render JSON service
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-4">{(service as any).title}</h1>
      {typeof (service as any).image === 'string' && (service as any).image.trim().length > 0 && (
        <div className="mb-6">
          <Image
            src={(service as any).image.trim()}
            alt={(service as any).title || 'Service'}
            width={1200}
            height={675}
            className="w-full h-auto rounded"
          />
        </div>
      )}
      {(service as any).descriptionHtml ? (
        <div
          className="prose max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: (service as any).descriptionHtml }}
        />
      ) : (
        (service as any).description && (
          <p className="text-lg text-muted-foreground mb-6">{(service as any).description}</p>
        )
      )}
      {Array.isArray((service as any).measures) && (service as any).measures.length > 0 && (
        <section className="mt-4">
          <h2 className="text-2xl font-semibold mb-2">So gehen wir vor</h2>
          <ul className="list-disc pl-6 space-y-1">
            {(service as any).measures.map((m: string, idx: number) => (
              <li key={`${m.slice(0, 20)}-${idx}`}>{m}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
