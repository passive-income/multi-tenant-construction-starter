import { getHost } from "@/lib/utils/host";
import { getClient } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { getJsonData, getJsonPageSections } from "@/lib/data/json";
import { SectionRenderer } from "@/components/SectionRenderer";

export const dynamic = "force-dynamic";

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const host = await getHost();

  // Try Sanity (resolve client by host and fetch page). If not found, fall back
  // to the repo's static JSON data.
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
        '*[_type == "page" && slug.current == $slug && clientId == $clientId][0]',
        { slug, clientId },
      );

      if (page) {
        if (page.sections && page.sections.length > 0) {
          return (
            <main>
              <SectionRenderer
                sections={page.sections}
                enabledFeatures={clientDoc?.enabledFeatures}
              />
            </main>
          );
        }
        const imageUrl = page?.image ? urlFor(page.image).width(1600).auto('format').url() : null;
        return (
          <main className="container py-8">
            <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
            {imageUrl && imageUrl.trim().length > 0 && (
              <div className="mb-6">
                <Image src={imageUrl} alt={page.title || "Seite"} width={1200} height={675} className="w-full h-auto rounded" />
              </div>
            )}
            {page.description && <p className="text-lg text-muted-foreground">{page.description}</p>}
          </main>
        );
      }
    }
  } catch (e) {
    // ignore and fallback to JSON
  }

  // JSON sections (Sanity-like) fallback
  const jsonSections = await getJsonPageSections("static-mueller.json", slug);
  if (jsonSections) {
    return (
      <main>
        <SectionRenderer
          sections={jsonSections.sections}
          enabledFeatures={jsonSections.enabledFeatures}
        />
      </main>
    );
  }

  // JSON fallback
  const data = await getJsonData("static-mueller.json");
  const rawPages: any = (data as any)?.pages || [];
  const pages: any[] = Array.isArray(rawPages)
    ? rawPages
    : typeof rawPages === "object" && rawPages
      ? Object.entries(rawPages).map(([k, v]: any) => ({ slug: k, ...(v || {}) }))
      : [];
  const page = pages.find((p: any) => p?.slug === slug);

  if (!page) {
    return (
      <main className="container py-8">
        <h1 className="text-2xl font-bold">Seite nicht gefunden</h1>
      </main>
    );
  }

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      {typeof page.image === 'string' && page.image.trim().length > 0 && (
        <div className="mb-6">
          <Image src={page.image.trim()} alt={page.title || "Seite"} width={1200} height={675} className="w-full h-auto rounded" />
        </div>
      )}
      {page.contentHtml ? (
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.contentHtml }} />
      ) : page.descriptionHtml ? (
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.descriptionHtml }} />
      ) : (
        page.description && <p className="text-lg text-muted-foreground">{page.description}</p>
      )}
    </main>
  );
}
