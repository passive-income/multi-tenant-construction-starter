import { Suspense } from 'react';
import { ProjectsLoading } from '@/components/loading/ProjectsLoading';
import { ProjectGallery } from '@/components/ProjectGallery';
import { getJsonData } from '@/lib/data/json';
import { getSanityData } from '@/lib/data/sanity';
import type { SiteData } from '@/lib/types/site';
import { getHost } from '@/lib/utils/host';

async function ProjectsContent() {
  let data: SiteData | null = null;
  const host = await getHost();
  try {
    data = await getSanityData(process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production', host);
  } catch (_e) {
    data = null;
  }
  if (!data) {
    data = await getJsonData('static-mueller.json');
  }
  return (
    <section className="container py-16">
      <h2 className="text-3xl mb-8 text-center">Projects</h2>
      <ProjectGallery images={((data.projects || []).map((p: any) => p.images) as any[]).flat()} />
    </section>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsLoading />}>
      <ProjectsContent />
    </Suspense>
  );
}
