import Link from "next/link";
import { getHost, getHeader } from "@/lib/utils/host";
import HoverNavigationMenu from "./HoverNavigationMenu";
import { getJsonData } from "@/lib/data/json";
import { getSanityData } from "@/lib/data/sanity";
import MobileNavigation from "./MobileNavigation";
import staticData from "@/data/static-mueller.json";
import type { MenuData, MenuItem } from "@/lib/types/navigation";
import type { SiteData } from "@/lib/types/site";

/**
 * Minimal header shown when no tenant/client is available (e.g. on /studio or missing cookie)
 */
function MinimalHeader() {
  const logoText = "Construction Multi-Tenant Starter";
  return (
    <header className="w-full h-16 shrink-0 bg-white border-b border-border">
      <div className="container header-nav mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
        <Link
          href="/"
          aria-label="Home"
          className="flex items-center space-x-2"
        >
          <span className="font-bold text-xl hidden lg:block">{logoText}</span>
        </Link>
        <MobileNavigation logoText={logoText} />
      </div>
    </header>
  );
}

export async function Header() {
  const pathname = (await getHeader("x-invoke-pathname")) ?? "/";
  // Prefer resolving tenant via Sanity (single source of truth). If Sanity
  // doesn't provide data for this host, fall back to the repository's
  // static JSON file `data/static-mueller.json`.
  let data: SiteData | null = null;
  try {
    const host = await getHost();
    // Try Sanity first (uses client resolution by host internally)
    data = await getSanityData(process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production", host);
  } catch {
    data = null;
  }

  if (!data) {
    try {
      data = await getJsonData("static-mueller.json");
    } catch {
      return <MinimalHeader />;
    }
  }

  const logoText =
    data?.company?.logoText ||
    data?.company?.name ||
    "Construction Multi-Tenant Starter";

  const navItems: MenuItem[] = ((data?.menuItems as MenuItem[]) || (staticData as unknown as MenuData)?.menuItems || [])
    .map((item) => ({
      ...item,
      href: item.href || "/",
      subItems: item.subItems
        ?.map((sub) => {
          // Convert link object to href
          let href = sub.href;
          if (!href) {
            const maybeLink = (sub as { link?: unknown }).link;
            if (maybeLink && typeof maybeLink === "object") {
              const link = maybeLink as { type?: unknown; slug?: unknown };
              const type = typeof link.type === "string" ? link.type : undefined;
              const slug = typeof link.slug === "string" ? link.slug : undefined;

              if (type === "service" && slug) {
                href = `/services/${slug}`;
              } else if (slug) {
                href = `/${slug}`;
              }
            }
          }
          return { ...sub, href: href || item.href || "/" };
        })
        .filter((sub) => !!sub.href),
    }))
    .filter((item) => !!item.href);

  const navBase =
    "group inline-flex min-h-[44px] min-w-[44px] h-10 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors";
  const activeClass = "bg-accent text-accent-foreground";
  const hoverClass = "hover:bg-accent hover:text-accent-foreground";

  return (
    <header className="w-full h-16 shrink-0 bg-white border-b border-border">
      <div className="container header-nav mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full relative overflow-x-clip">
        <Link
          href="/"
          aria-label="Home"
          className="flex items-center space-x-2"
        >
          <span className="font-bold text-xl hidden md:block">{logoText}</span>
        </Link>

        {/* Desktop Navigation - hidden on tablet and smaller */}
        <HoverNavigationMenu
          items={navItems}
          pathname={pathname}
          navBase={navBase}
          activeClass={activeClass}
          hoverClass={hoverClass}
        />

        <MobileNavigation logoText={logoText} />
      </div>
    </header>
  );
}
