import { cookies } from "next/headers";
import { getHost } from "@/lib/utils/host";
import { getSiteData } from "@/lib/data";
import type { SiteData } from "@/lib/types/site";
import { MainSection } from "@/components/section/MainSection";
import { PreloadLCPImage } from "@/components/image/PreloadLCPImage";
import clients from "@/data/clients";

export default async function HomePage() {
  const clientName = (await cookies()).get("clientId")?.value;
  const clientMeta = clients.find((c: any) => c.name === clientName);

  if (!clientMeta) {
    return (
      <main>
        <p>No client found</p>
      </main>
    );
  }

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
      <MainSection data={data} />
    </>
  );
}
