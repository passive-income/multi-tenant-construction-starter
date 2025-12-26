import { Suspense } from "react";
import { cookies } from "next/headers";
import { getHost } from "@/lib/utils/host";
import { getSiteData } from "@/lib/data";
import type { SiteData } from "@/lib/types/site";
import { ServicesLoading } from "@/components/loading/ServicesLoading";
import clients from "@/data/clients";

async function ServicesContent() {
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
    <section className="container py-16 bg-gray-50">
      <h2 className="text-3xl mb-8 text-center">Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {(data.services || []).map((s: any) => (
          <div key={s.title} className="p-4 border rounded-lg">
            <h3 className="font-bold text-xl mb-2">{s.title}</h3>
            <p>{s.description}</p>
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
