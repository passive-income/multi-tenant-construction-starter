import { Suspense } from "react";
import { getHost } from "@/lib/utils/host";
import type { SiteData } from "@/lib/types/site";
import { ServicesLoading } from "@/components/loading/ServicesLoading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSanityData } from "@/lib/data/sanity";
import { getJsonData, getJsonPageSections } from "@/lib/data/json";
import { getClient } from "@/sanity/lib/client";
import { SectionRenderer } from "@/components/SectionRenderer";

async function ServicesContent() {
  const host = await getHost();

  // Prefer a Sanity page with sections (consistent with static JSON sections)
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
        '*[_type == "page" && slug.current == "services" && clientId == $clientId][0]',
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
  const jsonPage = await getJsonPageSections("static-mueller.json", "services");
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
    <section className="container py-16 bg-gray-50">
      <h2 className="text-3xl mb-8 text-center">Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {(data.services || []).map((s: any) => (
          <div key={s.title} className="p-4 border rounded-lg">
            <h3 className="font-bold text-xl mb-2">{s.title}</h3>
            <p>{s.description}</p>
            {(() => {
              const slug = typeof s.slug === "string" ? s.slug : s?.slug?.current;
              const href = slug ? `/services/${slug}` : undefined;
              return href ? (
                <div className="mt-4">
                  <Button asChild>
                    <Link href={href} aria-label={`Mehr zu ${s.title}`}>Mehr erfahren</Link>
                  </Button>
                </div>
              ) : null;
            })()}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<ServicesLoading />}>
      <ServicesContent />
    </Suspense>
  );
}
