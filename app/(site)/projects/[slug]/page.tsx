import { getHost } from "@/lib/utils/host";
import { getClient } from "@/sanity/lib/client";
import Image from "next/image";
import { normalizeImageSrc } from "@/lib/utils/image";

export const dynamic = "force-dynamic";

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const host = await getHost();

  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const client = getClient(dataset);

  // Find client doc by host to scope by clientId
  const clientDoc = await client.fetch('*[_type == "client" && $host in domains][0]', { host });
  const clientId = clientDoc?.clientId;

  const project = await client.fetch(
    '*[_type == "project" && slug.current == $slug && clientId == $clientId][0]',
    { slug, clientId },
  );

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
        .filter((v: unknown): v is string => typeof v === "string" && v.length > 0)
    : [];

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      {coverUrl && (
        <div className="mb-6">
          <Image src={coverUrl} alt={project.title || "Projekt"} width={1200} height={675} className="w-full h-auto rounded" />
        </div>
      )}
      {project.description && <p className="text-lg text-muted-foreground mb-8">{project.description}</p>}
      {gallery.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gallery.map((src, idx: number) => (
            <Image key={src} src={src} alt={`Bild ${idx + 1}`} width={600} height={338} className="w-full h-auto rounded" />
          ))}
        </div>
      )}
    </main>
  );
}
