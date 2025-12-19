'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Link, Menu, X } from 'lucide-react'

const MobileNavigation = ({ logoText }: { logoText: string }) => {
    const [open, setOpen] = useState(false)

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
        <>
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
        </>  
    )
}

export default MobileNavigation