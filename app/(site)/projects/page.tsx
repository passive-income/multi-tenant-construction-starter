import { Suspense } from "react";
import { getHost } from "@/lib/utils/host";
import type { SiteData } from "@/lib/types/site";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ProjectsLoading } from "@/components/loading/ProjectsLoading";
import { getSanityData } from "@/lib/data/sanity";
import { getJsonData, getJsonPageSections } from "@/lib/data/json";
import { getClient } from "@/sanity/lib/client";
import { SectionRenderer } from "@/components/SectionRenderer";

async function ProjectsContent() {
  const host = await getHost();

  // Prefer a Sanity page with sections
  try {
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
    const client = getClient(dataset);
    const clientDoc = await client.fetch(
      '*[_type == "client" && $host in domains][0]{clientId, enabledFeatures}',
      { host },
    );
    const clientId = clientDoc?.clientId;
    if (clientId) {
      const page = await client.fetch(
        '*[_type == "page" && slug.current == "projects" && clientId == $clientId][0]',
        { clientId },
      );
      if (Array.isArray(page?.sections) && page.sections.length > 0) {
        return (
          <main>
            <SectionRenderer
              sections={page.sections}
              enabledFeatures={clientDoc?.enabledFeatures}
            />
          </main>
        );
      }
    }
  } catch (_e) {
    // ignore and fall back
  }

  // Prefer a JSON page with sections
  const jsonPage = await getJsonPageSections("static-mueller.json", "projects");
  if (jsonPage) {
    return (
      <main>
        <SectionRenderer
          sections={jsonPage.sections}
          enabledFeatures={jsonPage.enabledFeatures}
        />
      </main>
    );
  }

  let data: SiteData | null = null;
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
