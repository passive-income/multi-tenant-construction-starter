'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface HeaderProps {
  logoText?: string
}

export function Header({ logoText = 'Müller Bau' }: HeaderProps) {
  const [open, setOpen] = React.useState(false)

  const menuItems = [
    { label: 'Startseite', href: '/' },
    { label: 'Unternehmen', href: '/unternehmen' },
    {
      label: 'Leistungen',
      href: '/services',
      subItems: [
        {
          title: 'Malerarbeiten',
          description: 'Tapezierarbeiten, Stuck- und Zierprofile, exklusive Malerarbeiten',
          href: '/services',
        },
        {
          title: 'Bodenbelagsarbeiten',
          description: 'Bodensanierung, Parkett schleifen, ableitfähige Böden',
          href: '/services',
        },
        {
          title: 'Fassadenarbeiten',
          description: 'Fassadenanstrich und Renovierung',
          href: '/services',
        },
        {
          title: 'Raumausstattung',
          description: 'JAB Anstoetz Händler, Akustiklösungen',
          href: '/services',
        },
      ],
    },
    { label: 'Fachmarkt', href: '/fachmarkt' },
    { label: 'Referenzen', href: '/projects' },
    { label: 'Kontakt', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">{logoText}</span>
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
                      <Link href="/services" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Malerarbeiten</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Tapezierarbeiten, Stuck- und Zierprofile, exklusive Malerarbeiten
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/services" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Bodenbelagsarbeiten</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Bodensanierung, Parkett schleifen, ableitfähige Böden
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/services" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-sm font-medium leading-none">Fassadenarbeiten</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Fassadenanstrich und Renovierung
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/services" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
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
                <Link href="/projects" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Referenzen
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/contact" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Kontakt
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile/Tablet Navigation - visible on tablet and smaller */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader className="pb-4 border-b border-border/50">
              <SheetTitle className="text-lg font-bold">{logoText}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col">
              {menuItems.map((item) => (
                <div key={item.label} className="border-b border-border/40 last:border-b-0">
                  {item.subItems ? (
                    <div className="py-3">
                      <div className="text-base font-semibold mb-3 text-foreground">
                        {item.label}
                      </div>
                      <div className="space-y-2.5">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="block py-2 hover:opacity-80 transition-opacity"
                            onClick={() => setOpen(false)}
                          >
                            <div className="font-semibold text-sm text-foreground mb-0.5 leading-tight">
                              {subItem.title}
                            </div>
                            <div className="text-xs text-muted-foreground leading-relaxed">
                              {subItem.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block text-base font-semibold py-3 text-foreground hover:opacity-80 transition-opacity"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

