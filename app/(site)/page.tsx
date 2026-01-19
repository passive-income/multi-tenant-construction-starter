import type { Metadata } from 'next';
import { cache } from 'react';
import { PreloadLCPImage } from '@/components/image/PreloadLCPImage';
import { SectionRenderer } from '@/components/SectionRenderer';
import { MainSection } from '@/components/section/MainSection';
import { getSiteData } from '@/lib/data/streaming';
import type { SiteData } from '@/lib/types/site';
import { getHost } from '@/lib/utils/host';

// Cache for 5 minutes, revalidate in background
export const revalidate = 300;

// Wrap in React cache to deduplicate calls within the same request
const getPageData = cache(async (host: string | undefined) => {
  if (!host) return null;
  return getSiteData(host);
});

export async function generateMetadata(): Promise<Metadata> {
  const host = await getHost();
  const siteData = await getPageData(host);

  const canonicalHost = host || process.env.SITE_URL || '';
  const alternates = canonicalHost ? { canonical: `https://${canonicalHost}` } : undefined;

  if (siteData?.company?.name) {
    return {
      title: siteData.company.name,
      description: siteData.company.description || 'Professional construction services',
      ...(alternates ? { alternates } : {}),
    };
  }

  return {
    title: 'Construction Company',
    description: 'Professional construction services',
    ...(alternates ? { alternates } : {}),
  };
}

export default async function HomePage() {
  const host = await getHost();
  const siteData: SiteData | null = await getPageData(host);

  if (!siteData) {
    return (
      <div className="p-8 text-center">
        <h1>No content available</h1>
        <p>Unable to load site data for this domain.</p>
      </div>
    );
  }

  // If we have sections from the transformed data, use SectionRenderer
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
          clientId={siteData.clientId || 'default'}
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
