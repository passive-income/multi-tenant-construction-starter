import fs from 'node:fs/promises';
import path from 'node:path';
import type { MenuItem } from '@/lib/types/navigation';
import type { SiteData } from '@/lib/types/site';

export async function getJsonData(fileName: string): Promise<SiteData> {
  const filePath = path.join(process.cwd(), 'data', fileName);
  const file = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(file) as SiteData & {
    navigation?: any;
    pages?: Record<string, any>;
    enabledFeatures?: string[];
  };

  // Transform new pages-based structure into expected SiteData format
  const transformedData = { ...parsed };

  if (parsed.pages?.home?.sections) {
    const sections = parsed.pages.home.sections;

    // Extract slider/imageSliderSection
    const imageSliderSection = sections.find((s: any) => s._type === 'imageSliderSection');
    if (imageSliderSection?.slides) {
      transformedData.slider = {
        slides: imageSliderSection.slides,
        beforeAfter: parsed.pages?.home?.beforeAfter,
      };
    }

    // Extract other sections
    const heroSections = sections.filter((s: any) => s._type === 'heroSection');
    if (heroSections.length > 0) {
      transformedData.heroSections = heroSections;
    }

    // Add sections array for SectionRenderer
    transformedData.sections = sections;
  }

  // Normalize navigation: support either top-level menuItems or navigation.menuItems with `link` objects
  let menuItems: MenuItem[] | undefined = parsed.menuItems as any;
  try {
    const rawNavItems = parsed?.navigation?.menuItems || parsed?.menuItems || [];
    if (Array.isArray(rawNavItems) && rawNavItems.length > 0) {
      const getHref = (lnk: any, fallback?: string) => {
        if (!lnk) return fallback ?? '/';
        if (lnk.externalUrl) return lnk.externalUrl;
        if (lnk.path) return lnk.path;
        if (lnk.type && lnk.slug) {
          switch (lnk.type) {
            case 'service':
              return `/services/${lnk.slug}`;
            case 'project':
              return `/projects/${lnk.slug}`;
            case 'page':
              return `/${lnk.slug}`;
            case 'company':
              return '/company';
          }
        }
        return fallback ?? '/';
      };
      menuItems = rawNavItems.map((item: any) => {
        const href = getHref(item?.link, item?.href);
        const subItems = Array.isArray(item?.subItems)
          ? item.subItems.map((sub: any) => ({
              title: sub?.title,
              description: sub?.description,
              href: getHref(sub?.link, sub?.href ?? href),
            }))
          : undefined;
        return { label: item?.label ?? href, href, subItems } as MenuItem;
      });
    }
  } catch {
    // ignore and fallback to existing parsed.menuItems
  }

  return { ...transformedData, menuItems } as SiteData;
}
