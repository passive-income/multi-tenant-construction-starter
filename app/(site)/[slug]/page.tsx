import { cookies } from "next/headers";
import { getHost } from "@/lib/utils/host";
import clients from "@/data/clients";
import { resolveClient } from "@/lib/resolveClient";
import { getClient } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { getJsonData } from "@/lib/data/json";

export const dynamic = "force-dynamic";

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const host = await getHost();
  const cookieStore = await cookies();
  const clientName = cookieStore.get("clientId")?.value;
  const clientMeta = clientName
    ? clients.find((c: any) => c.name === clientName)
    : resolveClient(host || "") || clients[0];

  if (!clientMeta) {
    return (
      <main className="container py-8">
        <h1 className="text-2xl font-bold">Seite nicht gefunden</h1>
      </main>
    );
  }

  if (clientMeta.type === "sanity") {
    const dataset = clientMeta.source;
    const client = getClient(dataset);
    const clientDoc = await client.fetch('*[_type == "client" && $host in domains][0]', { host });
    const clientId = clientDoc?.clientId;

    const page = await client.fetch(
      '*[_type == "page" && slug.current == $slug && clientId == $clientId][0]',
      { slug, clientId },
    );

    if (!page) {
      return (
        <main className="container py-8">
          <h1 className="text-2xl font-bold">Seite nicht gefunden</h1>
        </main>
      );
    }

    const imageUrl = page?.image ? urlFor(page.image).width(1600).auto('format').url() : null;
    return (
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
        {imageUrl && (
          <div className="mb-6">
            <Image src={imageUrl} alt={page.title || "Seite"} width={1200} height={675} className="w-full h-auto rounded" />
          </div>
        )}
        {page.description && <p className="text-lg text-muted-foreground">{page.description}</p>}
      </main>
    );
  }

  // JSON source: look for pages array (if provided)
  const data = await getJsonData(clientMeta.source);
  const pages: any[] = (data as any)?.pages || [];
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
      {page.image && (
        <div className="mb-6">
          <Image src={page.image} alt={page.title || "Seite"} width={1200} height={675} className="w-full h-auto rounded" />
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
