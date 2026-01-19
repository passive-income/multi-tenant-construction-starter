import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import { cache } from 'react';
import { getHost } from '@/lib/utils/host';
import { normalizeImageSrc } from '@/lib/utils/image';
import { getClient } from '@/sanity/lib/client';

// Cache for 10 minutes, revalidate in background
export const revalidate = 600;

/**
 * Cached project fetcher from Sanity
 */
const getCachedProject = cache((host: string, slug: string) => {
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
          const project = await client.fetch(
            '*[_type == "project" && slug.current == $slug && clientId == $clientId][0]',
            { slug, clientId },
          );
          return project || null;
        }
      } catch (err) {
        console.error('Error loading Sanity project for slug', { host, slug, err });
        // Fallback
      }
      return null;
    },
    [`project-${host}-${slug}`],
    {
      revalidate: 600,
      // Global + per-host tags so webhook can invalidate immediately
      tags: ['all-sites', `site-${host}`],
    },
  )();
});

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const host = await getHost();

  let project = null;
  if (host) {
    project = await getCachedProject(host, slug);
  }

  if (!project) {
    return (
      <main className="container py-8">
        <h1 className="text-2xl font-bold">Projekt nicht gefunden</h1>
      </main>
    );
  }

  const coverUrl = normalizeImageSrc(project?.image, { width: 1600, autoFormat: true });
  const gallery = Array.isArray(project?.images)
    ? project.images
        .map((im: any) => normalizeImageSrc(im, { width: 1200, autoFormat: true }))
        .filter(Boolean)
    : [];

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      {coverUrl && (
        <div className="mb-6">
          <Image
            src={coverUrl}
            alt={project.title || 'Projekt'}
            width={1200}
            height={675}
            className="w-full h-auto rounded"
          />
        </div>
      )}
      {project.description && (
        <p className="text-lg text-muted-foreground mb-8">{project.description}</p>
      )}
      {gallery.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gallery.map((src: any, idx: number) => (
            <Image
              key={typeof src === 'string' ? src : `img-${idx}`}
              src={src as string}
              alt={`Bild ${idx + 1}`}
              width={600}
              height={338}
              className="w-full h-auto rounded"
            />
          ))}
        </div>
      )}
    </main>
  );
}
