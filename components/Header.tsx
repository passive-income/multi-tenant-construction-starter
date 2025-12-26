import Link from 'next/link'
import { headers, cookies } from 'next/headers'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import clients from '@/data/clients.json'
import { getSiteData } from '@/lib/data'
import MobileNavigation from './MobileNavigation'

/**
 * Minimal header shown when no tenant/client is available (e.g. on /studio or missing cookie)
 */
function MinimalHeader() {
  const logoText = 'Construction Multi-Tenant Starter'
  return (
    <header className="w-full bg-white border-b border-border">
      <div className="container header-nav mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" aria-label="Home" className="flex items-center space-x-2">
          <span className="font-bold text-xl hidden lg:block">{logoText}</span>
        </Link>
        <MobileNavigation logoText={logoText} />
      </div>
    </header>
  )
}

export async function Header() {
  const pathname = (await headers()).get('x-invoke-pathname') ?? '/'
  const cookieStore = await cookies()
  const clientName = cookieStore.get('clientId')?.value
  const clientMeta = clientName
    ? clients.find((c: any) => c.name === clientName)
    : null

  if (!clientMeta) {
    return <MinimalHeader />
  }

  // Normalize shape for getSiteData
  const clientForSiteData = {
    ...clientMeta,
    type: clientMeta.type ?? 'json',
    source: clientMeta.source ?? clientMeta.name,
  }

  // Defensive: if malformed, fallback to minimal header
  if (!clientForSiteData.type || !clientForSiteData.source) {
    return <MinimalHeader />
  }

  let data: any = null
  try {
    data = await getSiteData(clientForSiteData)
  } catch {
    return <MinimalHeader />
  }

  const logoText =
    data?.company?.logoText || data?.company?.name || 'Construction Multi-Tenant Starter'

    const navBase =
      'group inline-flex min-h-[44px] min-w-[44px] h-10 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
  const activeClass = 'bg-accent text-accent-foreground'
  const hoverClass = 'hover:bg-accent hover:text-accent-foreground'

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href === '/services') return pathname.startsWith('/services')
    return pathname === href
  }

  return (
    <header className="w-full bg-white border-b border-border">
      <div className="container header-nav mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" aria-label="Home" className="flex items-center space-x-2">
          <span className="font-bold text-xl hidden md:block">{logoText}</span>
        </Link>

        {/* Desktop Navigation - hidden on tablet and smaller */}
        <NavigationMenu className="hidden md:flex" aria-label="Main Navigation">
          <NavigationMenuList>
            {/* Startseite: direct link, no chevron */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className={`${navBase} ${isActive('/') ? activeClass : hoverClass}`}
                >
                  Startseite
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Unternehmen: simple link */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/company"
                  className={`${navBase} ${
                    isActive('/company') ? activeClass : hoverClass
                  }`}
                >
                  Unternehmen
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Leistungen: dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={`${isActive('/services') ? activeClass : ''}`}
              >
                Leistungen
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-100 gap-3 p-4 md:w-125 md:grid-cols-2 lg:w-150">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/services"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          Malerarbeiten
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Tapezierarbeiten, Stuck- und Zierprofile, exklusive Malerarbeiten
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/services"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          Bodenbelagsarbeiten
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Bodensanierung, Parkett schleifen, ableitfähige Böden
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/services"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          Fassadenarbeiten
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Fassadenanstrich und Renovierung
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/services"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          Raumausstattung
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          JAB Anstoetz Händler, Akustiklösungen
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Fachmarkt */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/fachmarkt"
                  className={`${navBase} ${
                    isActive('/fachmarkt') ? activeClass : hoverClass
                  }`}
                >
                  Fachmarkt
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Referenzen */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/projects"
                  className={`${navBase} ${
                    isActive('/projects') ? activeClass : hoverClass
                  }`}
                >
                  Referenzen
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Kontakt */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/contact"
                  className={`${navBase} ${
                    isActive('/contact') ? activeClass : hoverClass
                  }`}
                >
                  Kontakt
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <MobileNavigation logoText={logoText} />
      </div>
    </header>
  )
}