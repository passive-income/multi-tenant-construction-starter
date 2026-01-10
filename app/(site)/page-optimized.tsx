import { Suspense } from "react";
import { getHost } from "@/lib/utils/host";
import type { SiteData } from "@/lib/types/site";
import { PreloadLCPImage } from "@/components/image/PreloadLCPImage";
import { getClient } from "@/sanity/lib/client";
import { getJsonData } from "@/lib/data/json";
import { SectionRenderer } from "@/components/SectionRenderer";
import { MainSection } from "@/components/section/MainSection";
import { HeroSectionsLoading } from "@/components/loading/HeroSectionsLoading";

export const dynamic = "force-dynamic";

// Separate async component for Sanity content
async function SanityHomeContent() {
  const host = await getHost();
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const client = getClient(dataset);
  
  const clientDoc = await client.fetch(
    '*[_type == "client" && $host in domains][0]',
    { host }
  );
  const clientId = clientDoc?.clientId;
  
  if (!clientId) return null;
  
  const homePage = await client.fetch(
    '*[_type == "page" && slug.current == "home" && clientId == $clientId][0]',
    { clientId }
  );
  
  if (!homePage?.sections) return null;
  
  return <SectionRenderer sections={homePage.sections} />;
}

// Separate async component for JSON fallback
async function JsonHomeContent() {
  const siteData: SiteData = await getJsonData("static-mueller.json");
  const firstSlideImage = siteData.slider?.slides?.[0]?.image;
  
  return (
    <>
      {firstSlideImage && <PreloadLCPImage src={firstSlideImage} />}
      <MainSection data={siteData} />
    </>
  );
}

// Main content wrapper with fallback logic
async function HomeContent() {
  const host = await getHost();
  
  try {
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
    const client = getClient(dataset);
    const clientDoc = await client.fetch(
      '*[_type == "client" && $host in domains][0]',
      { host }
    );
    
    if (clientDoc?.clientId) {
      return (
        <Suspense fallback={<HeroSectionsLoading />}>
          <SanityHomeContent />
        </Suspense>
      );
    }
  } catch (error) {
    // Fall through to JSON
  }
  
  // JSON fallback
  return (
    <Suspense fallback={<HeroSectionsLoading />}>
      <JsonHomeContent />
    </Suspense>
  );
}

export default function HomePage() {
  return (
    <main>
      <Suspense fallback={<HeroSectionsLoading />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
