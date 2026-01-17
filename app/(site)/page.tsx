import type { Metadata } from 'next';
import { PreloadLCPImage } from '@/components/image/PreloadLCPImage';
import { SectionRenderer } from '@/components/SectionRenderer';
import { MainSection } from '@/components/section/MainSection';
import { getJsonData } from '@/lib/data/json';
import type { SiteData } from '@/lib/types/site';
import { getHost } from '@/lib/utils/host';

// Cache for 5 minutes, revalidate in background
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const host = await getHost();

  // Try to get data from Sanity first
  let siteData: SiteData | null = null;
  try {
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
    const { getClient } = await import('@/sanity/lib/client');
    const client = getClient(dataset);
    const clientDoc = await client.fetch('*[_type == "client" && $host in domains][0]', { host });
    if (clientDoc) {
      const homePage = await client.fetch(
        '*[_type == "page" && slug.current == "home" && clientId == $clientId][0]',
        { clientId: clientDoc.clientId ?? null },
      );
      if (homePage?.seo) {
        return {
          title: homePage.seo.title || clientDoc.name,
          description: homePage.seo.description || clientDoc.description,
          alternates: {
            canonical: `https://${host}`,
          },
        };
      }
    }
  } catch (_error) {
    // Fall back to JSON
  }

  // Fallback to JSON data
  try {
    siteData = await getJsonData('static-mueller.json');
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
