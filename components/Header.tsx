import Link from "next/link";
import { cookies } from "next/headers";
import { getHost, getHeader } from "@/lib/utils/host";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import clients from "@/data/clients";
import { getSiteData } from "@/lib/data";
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
    <header className="w-full bg-white border-b border-border">
      <div className="container header-nav mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
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
  const cookieStore = await cookies();
  const clientName = cookieStore.get("clientId")?.value;
  const clientMeta = clientName
    ? clients.find((c: any) => c.name === clientName)
    : null;

  if (!clientMeta) {
    return <MinimalHeader />;
  }

  // Normalize shape for getSiteData
  const clientForSiteData = {
    ...clientMeta,
    type: clientMeta.type ?? "json",
    source: clientMeta.source ?? clientMeta.name ?? "",
  };

  // Defensive: if malformed, fallback to minimal header
  if (!clientForSiteData.type || !clientForSiteData.source) {
    return <MinimalHeader />;
  }

  let data: SiteData | null = null;
  try {
    const host = await getHost();
    data = await getSiteData(clientForSiteData, host);
  } catch {
    return <MinimalHeader />;
  }

  const logoText =
    data?.company?.logoText ||
    data?.company?.name ||
    "Construction Multi-Tenant Starter";

  const navItems: MenuItem[] =
    (data?.menuItems as MenuItem[]) ||
    (staticData as unknown as MenuData)?.menuItems ||
    [];

  const navBase =
    "group inline-flex min-h-[44px] min-w-[44px] h-10 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors";
  const activeClass = "bg-accent text-accent-foreground";
  const hoverClass = "hover:bg-accent hover:text-accent-foreground";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/services") return pathname.startsWith("/services");
    return pathname === href;
  };

  return (
    <header className="w-full bg-white border-b border-border">
      <div className="container header-nav mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          href="/"
          aria-label="Home"
          className="flex items-center space-x-2"
        >
          <span className="font-bold text-xl hidden md:block">{logoText}</span>
        </Link>

        {/* Desktop Navigation - hidden on tablet and smaller */}
        <NavigationMenu className="hidden md:flex" aria-label="Main Navigation">
          <NavigationMenuList>
            {navItems.map((item: any) => (
              <NavigationMenuItem key={item.label || item.href}>
                {item.subItems ? (
                  <>
                    <NavigationMenuTrigger
                      className={`${isActive(item.href) ? activeClass : ""}`}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-100 gap-3 p-4 md:w-125 md:grid-cols-2 lg:w-150">
                        {item.subItems.map((sub: any) => (
                          <li key={sub.title || sub.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={sub.href || item.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {sub.title}
                                </div>
                                {sub.description && (
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {sub.description}
                                  </p>
                                )}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={`${navBase} ${isActive(item.href) ? activeClass : hoverClass}`}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <MobileNavigation logoText={logoText} />
      </div>
    </header>
  );
}
