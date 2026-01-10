import fs from "fs/promises";
import path from "path";
import type { SiteData } from "@/lib/types/site";
import type { MenuItem } from "@/lib/types/navigation";

export async function getJsonData(fileName: string): Promise<SiteData> {
  const filePath = path.join(process.cwd(), "data", fileName);
  const file = await fs.readFile(filePath, "utf-8");
  const parsed = JSON.parse(file) as SiteData & { navigation?: any };

  // Normalize navigation: support either top-level menuItems or navigation.menuItems with `link` objects
  let menuItems: MenuItem[] | undefined = parsed.menuItems as any;
  try {
    const rawNavItems = parsed?.navigation?.menuItems || parsed?.menuItems || [];
    if (Array.isArray(rawNavItems) && rawNavItems.length > 0) {
      const getHref = (lnk: any, fallback?: string) => {
        if (!lnk) return fallback ?? "/";
        if (lnk.externalUrl) return lnk.externalUrl;
        if (lnk.path) return lnk.path;
        if (lnk.type && lnk.slug) {
          switch (lnk.type) {
            case "service":
              return `/services/${lnk.slug}`;
            case "project":
              return `/projects/${lnk.slug}`;
            case "page":
              return `/${lnk.slug}`;
            case "company":
              return "/company";
          }
        }
        return fallback ?? "/";
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

  return { ...parsed, menuItems } as SiteData;
}

export async function getJsonPageSections(
  fileName: string,
  slug: string,
): Promise<{ sections: any[]; enabledFeatures?: string[] } | null> {
  const data: any = await getJsonData(fileName);

  const enabledFeatures: string[] | undefined = Array.isArray(data?.enabledFeatures)
    ? data.enabledFeatures
    : Array.isArray(data?.client?.enabledFeatures)
      ? data.client.enabledFeatures
      : undefined;

  const pages = data?.pages;
  if (!pages) return null;

  // New format: pages as an object map, e.g. { home: { sections: [...] }, services: { sections: [...] } }
  if (typeof pages === "object" && !Array.isArray(pages)) {
    const page = pages?.[slug];
    const sections = page?.sections;
    if (Array.isArray(sections) && sections.length > 0) {
      return { sections, enabledFeatures };
    }
    return null;
  }

  // Legacy format: pages as an array
  if (Array.isArray(pages)) {
    const page = pages.find((p: any) => p?.slug === slug);
    const sections = page?.sections;
    if (Array.isArray(sections) && sections.length > 0) {
      return { sections, enabledFeatures };
    }
  }

  return null;
}
