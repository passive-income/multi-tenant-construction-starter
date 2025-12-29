import { cookies } from "next/headers";
import { getHost } from "@/lib/utils/host";
import { getClient } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import clients from "@/data/clients";
import { getJsonData } from "@/lib/data/json";
import PortableTextLite from "@/components/richtext/PortableTextLite";

export const dynamic = "force-dynamic";

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const host = await getHost();
  const cookieStore = await cookies();
  const clientName = cookieStore.get("clientId")?.value;
  const clientMeta = clientName ? clients.find((c: any) => c.name === clientName) : null;

  if (!clientMeta) {
    return (
      <main className="container py-8">
        <h1 className="text-2xl font-bold">Service nicht gefunden</h1>
      </main>
    );
  }

  if (clientMeta.type === "json") {
    const data = await getJsonData(clientMeta.source);
    const services: any[] = (data as any)?.services || [];
    const service = services.find((s: any) => s?.slug === slug);
    if (!service) {
      return (
        <main className="container py-8">
          <h1 className="text-2xl font-bold">Service nicht gefunden</h1>
        </main>
      );
    }
    return (
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
        {service.image && (
          <div className="mb-6">
            <Image src={service.image} alt={service.title || "Service"} width={1200} height={675} className="w-full h-auto rounded" />
          </div>
        )}
        {service.descriptionHtml ? (
          <div
            className="prose max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: service.descriptionHtml }}
          />
        ) : (
          service.description && (
            <p className="text-lg text-muted-foreground mb-6">{service.description}</p>
          )
        )}
        {Array.isArray(service.measures) && service.measures.length > 0 && (
          <section className="mt-4">
            <h2 className="text-2xl font-semibold mb-2">So gehen wir vor</h2>
            <ul className="list-disc pl-6 space-y-1">
              {service.measures.map((m: string, idx: number) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
    );
  }

  // Sanity client path
  const dataset = clientMeta.source;
  const client = getClient(dataset);
  const clientDoc = await client.fetch('*[_type == "client" && $host in domains][0]', { host });
  const clientId = clientDoc?.clientId;

  const service = await client.fetch(
    '*[_type == "service" && slug.current == $slug && clientId == $clientId][0]',
    { slug, clientId },
  );

  if (!service) {
    return (
      <main className="container py-8">
        <h1 className="text-2xl font-bold">Service nicht gefunden</h1>
      </main>
    );
  }

  const imageUrl = service?.image ? urlFor(service.image).width(1600).auto('format').url() : null;

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
      {imageUrl && (
        <div className="mb-6">
          <Image src={imageUrl} alt={service.title || "Service"} width={1200} height={675} className="w-full h-auto rounded" />
        </div>
      )}
      {Array.isArray((service as any).richDescription) && (service as any).richDescription.length > 0 ? (
        <PortableTextLite value={(service as any).richDescription} />
      ) : (
        service.description && (
          <p className="text-lg text-muted-foreground mb-6">{service.description}</p>
        )
      )}
      {Array.isArray(service.measures) && service.measures.length > 0 && (
        <section className="mt-4">
          <h2 className="text-2xl font-semibold mb-2">So gehen wir vor</h2>
          <ul className="list-disc pl-6 space-y-1">
            {service.measures.map((m: string, idx: number) => (
              <li key={idx}>{m}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
