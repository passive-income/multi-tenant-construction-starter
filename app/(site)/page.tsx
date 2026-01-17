import type { Metadata } from 'next';
import { PreloadLCPImage } from '@/components/image/PreloadLCPImage';
import { SectionRenderer } from '@/components/SectionRenderer';
import { MainSection } from '@/components/section/MainSection';
import { getJsonData } from '@/lib/data/json';
import type { SiteData } from '@/lib/types/site';
import { getHost } from '@/lib/utils/host';

// Cache for 5 minutes, revalidate in background
export const revalidate = 300;

/**
 * Shared helper to fetch Sanity data for home page
 * Returns { clientDoc, homePage } if successful, null otherwise
 */
async function getHomePageData(host: string | undefined) {
  if (!host) return null;
  try {
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
    const { getClient } = await import('@/sanity/lib/client');
    const client = getClient(dataset);
    const clientDoc = await client.fetch('*[_type == "client" && $host in domains][0]', { host });
    if (!clientDoc) {
      return null;
    }
    const homePage = await client.fetch(
      '*[_type == "page" && slug.current == "home" && clientId == $clientId][0]',
      { clientId: clientDoc.clientId ?? null },
    );
    return { clientDoc, homePage };
  } catch (_error) {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const host = await getHost();

  // Try to get data from Sanity first
  const sanityData = await getHomePageData(host);
  if (sanityData?.homePage?.seo) {
    const { clientDoc, homePage } = sanityData;
    return {
      title: homePage.seo.title || clientDoc.name,
      description: homePage.seo.description || clientDoc.description,
      alternates: {
        canonical: `https://${host}`,
      },
    };
  }

  // Fallback to JSON data
  try {
    const siteData = await getJsonData('static-mueller.json');
    return {
      title: siteData.company?.name || 'Construction Company',
      description: siteData.company?.description || 'Professional construction services',
      alternates: {
        canonical: `https://${host}`,
      },
    };
  } catch (_error) {
    return {
      title: 'Construction Company',
      description: 'Professional construction services',
      alternates: {
        canonical: `https://${host}`,
      },
    };
  }
}

export default async function HomePage() {
  const host = await getHost();

  // Try Sanity-resolved home page first
  const sanityData = await getHomePageData(host);
  if (sanityData?.homePage?.sections) {
    const { clientDoc, homePage } = sanityData;
    const enabledFeatures = Array.isArray(clientDoc?.enabledFeatures)
      ? clientDoc.enabledFeatures.filter((f: unknown): f is string => typeof f === 'string')
      : undefined;
    return <SectionRenderer sections={homePage.sections} enabledFeatures={enabledFeatures} />;
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
