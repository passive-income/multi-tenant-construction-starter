import { PreloadLCPImage } from '@/components/image/PreloadLCPImage';
import { SectionRenderer } from '@/components/SectionRenderer';
import { MainSection } from '@/components/section/MainSection';
import { getJsonData } from '@/lib/data/json';
import type { SiteData } from '@/lib/types/site';
import { getHost } from '@/lib/utils/host';

// Cache for 5 minutes, revalidate in background
export const revalidate = 300;

export default async function HomePage() {
  const host = await getHost();

  // Try Sanity-resolved home page first (resolve client by host internally)
  try {
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
    const { getClient } = await import('@/sanity/lib/client');
    const client = getClient(dataset);
    const clientDoc = await client.fetch('*[_type == "client" && $host in domains][0]', { host });
    const clientId = clientDoc?.clientId;
    const enabledFeatures = Array.isArray(clientDoc?.enabledFeatures)
      ? clientDoc.enabledFeatures.filter((f: unknown): f is string => typeof f === 'string')
      : undefined;
    if (clientId) {
      const homePage = await client.fetch(
        '*[_type == "page" && slug.current == "home" && clientId == $clientId][0]',
        { clientId: clientId ?? null },
      );
      if (homePage?.sections) {
        return <SectionRenderer sections={homePage.sections} enabledFeatures={enabledFeatures} />;
      }
    }
  } catch (_error) {
    // ignore and fall back to JSON
  }

  // JSON fallback (repo-static)
  const siteData: SiteData = await getJsonData('static-mueller.json');

  // If we have sections from the transformed data, use SectionRenderer instead
  if (siteData.sections && Array.isArray(siteData.sections) && siteData.sections.length > 0) {
    const firstSlideImage = siteData.sections.find((s: any) => s._type === 'imageSliderSection')
      ?.slides?.[0]?.image;
    return (
      <>
        {firstSlideImage && <PreloadLCPImage src={firstSlideImage} />}
        <SectionRenderer
          sections={siteData.sections}
          enabledFeatures={siteData.enabledFeatures}
          allServices={siteData.services}
          allProjects={siteData.projects}
          clientId="mueller"
          dataset="production"
        />
      </>
    );
  }

  // Fallback to MainSection for old JSON format
  const firstSlideImage = siteData.slider?.slides?.[0]?.image;
  return (
    <>
      {firstSlideImage && <PreloadLCPImage src={firstSlideImage} />}
      <MainSection data={siteData} />
    </>
  );
}
