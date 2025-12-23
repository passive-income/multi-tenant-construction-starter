import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { cookies } from 'next/headers'
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl hidden lg:block">{logoText}</span>
        </Link>

        {/* Keep mobile nav with static logo text */}
        <MobileNavigation logoText={logoText} />
      </div>
    </header>
  )
}

export async function Header() {
  // Read tenant/client from cookie
  const clientName = (await cookies()).get('clientId')?.value

  // If no cookie, render minimal header without trying to load site data
  if (!clientName) {
    return <MinimalHeader />
  }

  // Find static client by name from your registry
  const clientMeta = clients.find((c: any) => c.name === clientName)

  // If not found in static list, render minimal header
  if (!clientMeta) {
    return <MinimalHeader />
  }

  // Normalize the shape expected by getSiteData
  const clientForSiteData = {
    ...clientMeta,
    type: clientMeta.type ?? 'json',
    source: clientMeta.source ?? clientMeta.name,
  }

  // If still malformed, render minimal header
  if (!clientForSiteData.type || !clientForSiteData.source) {
    return <MinimalHeader />
  }

  // Load site data defensively
  let data: any = null
  try {
    data = await getSiteData(clientForSiteData)
  } catch (e) {
    // If anything goes wrong, fall back to minimal header
    return <MinimalHeader />
  }

  const logoText = data?.company?.logoText || data?.company?.name || 'Construction Multi-Tenant Starter'

  return (
    <header className="w-full bg-white border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl hidden lg:block">{logoText}</span>
        </Link>

        {/* Desktop Navigation - hidden on tablet and smaller */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Startseite</NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Unternehmen</NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Leistungen</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/services" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Malerarbeiten</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Tapezierarbeiten, Stuck- und Zierprofile, exklusive Malerarbeiten
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/services" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Bodenbelagsarbeiten</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Bodensanierung, Parkett schleifen, ableitfähige Böden
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/services" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Fassadenarbeiten</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Fassadenanstrich und Renovierung
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/services" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Raumausstattung</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          JAB Anstoetz Händler, Akustiklösungen
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Fachmarkt</NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/projects" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                  Referenzen
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/contact" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
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