import { ProjectGallery } from '@/components/ProjectGallery';
import { getSiteData } from '@/lib/data/streaming';
import { getHost } from '@/lib/utils/host';

// Cache for 5 minutes with stale-while-revalidate
export const revalidate = 300;

export default async function ProjectsPage() {
  const host = await getHost();
  if (!host) {
    return <div>Host not found</div>;
  }
  const data = await getSiteData(host);
  if (!data) {
    return <div>No data found</div>;
  }
  return (
    <section className="container py-16">
      <h2 className="text-3xl mb-8 text-center">Projects</h2>
      <ProjectGallery images={((data.projects || []).map((p: any) => p.images) as any[]).flat()} />
    </section>
  );
}
