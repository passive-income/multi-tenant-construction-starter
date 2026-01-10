import { Suspense } from "react";
import { getHost } from "@/lib/utils/host";
import { getJsonData } from "@/lib/data/json";
import { getSanityData } from "@/lib/data/sanity";
import type { SiteData } from "@/lib/types/site";
import { ServicesLoading } from "@/components/loading/ServicesLoading";
import Image from 'next/image';
import { getClient } from '@/sanity/lib/client';
import { SectionRenderer } from '@/components/SectionRenderer';
import { getJsonPageSections } from '@/lib/data/json';

async function CompanyContent() {
  const host = await getHost();

  // Prefer a Sanity page with sections
  try {
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
    const client = getClient(dataset);
    const clientDoc = await client.fetch(
      '*[_type == "client" && $host in domains][0]{clientId, enabledFeatures}',
      { host },
    );
    const clientId = clientDoc?.clientId;
    if (clientId) {
      const page = await client.fetch(
        '*[_type == "page" && slug.current == "company" && clientId == $clientId][0]',
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
  const jsonPage = await getJsonPageSections('static-mueller.json', 'company');
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

  // Resolve tenant via Sanity first; fall back to static JSON file
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
      <h2 className="text-3xl mb-8 text-center">Unternehmen</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {(data.companyDetails || []).map((c: any) => (
          <div key={c.title} className="p-4 border rounded-lg bg-white">
            {typeof c.image === 'string' && c.image.trim().length > 0 && (
              <div className="w-full h-40 relative mb-4 rounded overflow-hidden">
                <Image src={c.image.trim()} alt={c.title} fill sizes="(max-width:640px) 100vw, 33vw" quality={60} className="object-cover" />
              </div>
            )}
            <h3 className="font-bold text-xl mb-1">{c.title}</h3>
            {c.subtitle && (
              <h4 className="text-sm text-gray-600 mb-2">{c.subtitle}</h4>
            )}
            <p className="text-sm text-gray-700">{c.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CompanyPage() {
  return (
    <Suspense fallback={<ServicesLoading />}>
      <CompanyContent />
    </Suspense>
  );
}
