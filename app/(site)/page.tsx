import { Suspense } from "react";
import { cookies } from "next/headers";
import { getHost } from "@/lib/utils/host";
import { getSiteData } from "@/lib/data";
import type { SiteData } from "@/lib/types/site";
import { MainSection } from "@/components/section/MainSection";
import { CompanySectionLoading } from "@/components/loading/CompanySectionLoading";
import { PreloadLCPImage } from "@/components/image/PreloadLCPImage";
import clients from "@/data/clients";

async function HomePageContent() {
  const clientName = (await cookies()).get("clientId")?.value;
  const clientMeta = clients.find((c: any) => c.name === clientName);
  if (!clientMeta) return <p>No client found</p>;

  // Transform to the expected shape for getSiteData
  const clientForSiteData = {
    ...clientMeta,
    type: clientMeta.type || "json", // default to 'json' if not set
    source: clientMeta.source ?? clientMeta.name ?? "",
  };

  const host = await getHost();
  const data: SiteData = await getSiteData(clientForSiteData, host);
  return <MainSection data={data} />;
}

export default async function HomePage() {
  const clientName = (await cookies()).get("clientId")?.value;
  const clientMeta = clients.find((c: any) => c.name === clientName);

  if (!clientMeta) {
    return (
      <>
        <main>
          <p>No client found</p>
        </main>
      </>
    );
  }

  // Transform as above
  const clientForSiteData = {
    ...clientMeta,
    type: clientMeta.type || "json",
    source: clientMeta.source ?? clientMeta.name ?? "",
  };
  const host = await getHost();
  const data: SiteData = await getSiteData(clientForSiteData, host);
  const firstSlideImage = data.slider?.slides?.[0]?.image;

  return (
    <>
      {firstSlideImage && <PreloadLCPImage src={firstSlideImage} />}
      <Suspense
        fallback={
          <main className="flex-1 container py-8">
            <CompanySectionLoading />
          </main>
        }
      >
        <HomePageContent />
      </Suspense>
    </>
  );
}
