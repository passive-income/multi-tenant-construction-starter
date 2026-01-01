import { Suspense } from "react";
import { getHost } from "@/lib/utils/host";
import type { SiteData } from "@/lib/types/site";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ProjectsLoading } from "@/components/loading/ProjectsLoading";
import { getSanityData } from "@/lib/data/sanity";
import { getJsonData } from "@/lib/data/json";

async function ProjectsContent() {
  let data: SiteData | null = null;
  const host = await getHost();
  try {
    data = await getSanityData(process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production", host);
  } catch (e) {
    data = null;
  }
  if (!data) {
    data = await getJsonData("static-mueller.json");
  }
  return (
    <section className="container py-16">
      <h2 className="text-3xl mb-8 text-center">Projects</h2>
      <ProjectGallery
        images={(
          (data.projects || []).map((p: any) => p.images) as any[]
        ).flat()}
      />
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
