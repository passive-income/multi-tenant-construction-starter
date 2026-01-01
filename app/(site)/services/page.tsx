import { Suspense } from "react";
import { getHost } from "@/lib/utils/host";
import type { SiteData } from "@/lib/types/site";
import { ServicesLoading } from "@/components/loading/ServicesLoading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSanityData } from "@/lib/data/sanity";
import { getJsonData } from "@/lib/data/json";

async function ServicesContent() {
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
