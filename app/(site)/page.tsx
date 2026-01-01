import { getHost } from "@/lib/utils/host";
import type { SiteData } from "@/lib/types/site";
import { MainSection } from "@/components/section/MainSection";
import { PreloadLCPImage } from "@/components/image/PreloadLCPImage";
import { getClient } from "@/sanity/lib/client";
import { getJsonData } from "@/lib/data/json";
import { SectionRenderer } from "@/components/SectionRenderer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const host = await getHost();

  // Try Sanity-resolved home page first (resolve client by host internally)
  try {
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
    const client = getClient(dataset);
    const clientDoc = await client.fetch('*[_type == "client" && $host in domains][0]', { host });
    const clientId = clientDoc?.clientId;
    if (clientId) {
      const homePage = await client.fetch(
        '*[_type == "page" && slug.current == "home" && clientId == $clientId][0]',
        { clientId }
      );
      if (homePage?.sections) {
        return (
          <main>
            <SectionRenderer sections={homePage.sections} />
          </main>
        );
      }
    }
  } catch (error) {
    // ignore and fall back to JSON
  }

  // JSON fallback (repo-static)
  const siteData: SiteData = await getJsonData("static-mueller.json");
  const firstSlideImage = siteData.slider?.slides?.[0]?.image;

  return (
    <>
      {firstSlideImage && <PreloadLCPImage src={firstSlideImage} />}
      <MainSection data={siteData} />
    </>
  );
}
