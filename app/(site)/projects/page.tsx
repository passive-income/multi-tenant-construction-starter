import { Suspense } from "react";
import { cookies } from "next/headers";
import { getHost } from "@/lib/utils/host";
import { getSiteData } from "@/lib/data";
import type { SiteData } from "@/lib/types/site";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ProjectsLoading } from "@/components/loading/ProjectsLoading";
import clients from "@/data/clients";

async function ProjectsContent() {
  const clientName = (await cookies()).get("clientId")?.value;
  const clientMeta = clients.find((c: any) => c.name === clientName);
  if (!clientMeta) return <p>No client found</p>;

  const clientForSiteData = {
    ...clientMeta,
    type: clientMeta.type || "json",
    source: clientMeta.source ?? clientMeta.name ?? "",
  };
  const host = await getHost();
  const data: SiteData = await getSiteData(clientForSiteData, host);
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
