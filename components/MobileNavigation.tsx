 'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const MobileNavigation = ({ logoText }: { logoText: string }) => {
    const [open, setOpen] = useState(false)

    const pathname = usePathname() ?? '/'

    const isActive = (href: string) => {
      if (href === '/') return pathname === '/'
      if (href === '/services') return pathname.startsWith('/services')
      return pathname === href
    }

    const menuItems = [
        { label: 'Startseite', href: '/' },
      { label: 'Unternehmen', href: '/company' },
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
        <>
        {/* Mobile/Tablet Navigation - visible on tablet and smaller */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-75 sm:w-100 px-4 sm:px-6">
            <SheetHeader className="pb-4 border-b border-border/50 px-0 sm:px-0">
              <SheetTitle className="text-lg font-bold">{logoText}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col">
              {menuItems.map((item) => (
                <div key={item.label} className="border-b border-border/40 last:border-b-0">
                  {item.subItems ? (
                        <div className="py-3">
                          <div className={`text-base font-semibold mb-3 ${item.subItems.some(si => isActive(si.href)) ? 'text-gray-500' : 'text-foreground'}`}>
                            {item.label}
                          </div>
                          <div className="space-y-2.5">
                            {item.subItems.map((subItem) => {
                              const subActive = isActive(subItem.href)
                              return (
                                <Link
                                  key={subItem.title}
                                  href={subItem.href}
                                  className={`block py-2 hover:opacity-80 transition-opacity ${subActive ? 'text-gray-500 font-semibold' : ''}`}
                                  onClick={() => setOpen(false)}
                                >
                                  <div className="font-semibold text-sm text-foreground mb-0.5 leading-tight">
                                    {subItem.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground leading-relaxed">
                                    {subItem.description}
                                  </div>
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={`block text-base font-semibold py-3 hover:opacity-80 transition-opacity ${isActive(item.href) ? 'text-gray-500 font-semibold' : 'text-foreground'}`}
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
        </>  
    )
}

export default MobileNavigation