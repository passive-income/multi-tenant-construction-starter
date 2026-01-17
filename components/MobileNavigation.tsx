'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import staticData from '@/data/static-mueller.json';
import type { MenuData, MenuItem } from '@/lib/types/navigation';

const MobileNavigation = ({ logoText }: { logoText: string }) => {
  const [open, setOpen] = useState(false);

  const pathname = usePathname() ?? '/';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/services') return pathname.startsWith('/services');
    return pathname === href;
  };

  const rawItems: MenuItem[] = ((staticData as unknown as MenuData)?.menuItems as MenuItem[]) || [
    { label: 'Startseite', href: '/' },
    { label: 'Unternehmen', href: '/company' },
    { label: 'Leistungen', href: '/services' },
    { label: 'Fachmarkt', href: '/fachmarkt' },
    { label: 'Referenzen', href: '/projects' },
    { label: 'Kontakt', href: '/contact' },
  ];

  const menuItems: MenuItem[] = rawItems
    .map((item) => ({
      ...item,
      href: item.href || '/',
      subItems: Array.isArray(item.subItems)
        ? item.subItems
            .map((sub) => ({ ...sub, href: sub.href || item.href || '/' }))
            .filter((sub) => !!sub.href)
        : undefined,
    }))
    .filter((item) => !!item.href);

  return (
    <div className="block md:hidden">
      {/* Mobile/Tablet Navigation - visible on tablet and smaller */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-6 w-6"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-75 sm:w-100 px-4 sm:px-6 mobile-navigation">
          <SheetHeader className="pb-4 border-b border-border/50 px-0 sm:px-0">
            <SheetTitle className="text-lg font-bold">{logoText}</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col" aria-label="Mobile Navigation">
            {menuItems.map((item) => (
              <div key={item.label} className="border-b border-border/40 last:border-b-0">
                {item.subItems ? (
                  <div className="py-3">
                    <div
                      className={`text-base font-semibold mb-3 ${item.subItems.some((si) => isActive(si.href)) ? 'text-gray-500' : 'text-foreground'}`}
                    >
                      {item.label}
                    </div>
                    <div className="space-y-2.5">
                      {item.subItems.map((subItem) => {
                        const href = subItem.href || item.href || '/';
                        const subActive = isActive(href);
                        return (
                          <Link
                            key={subItem.title}
                            href={href}
                            className={`block py-2 hover:opacity-80 transition-opacity ${subActive ? 'text-gray-500 font-semibold' : ''}`}
                            onClick={() => setOpen(false)}
                          >
                            <div className="font-semibold text-sm text-foreground mb-0.5 leading-tight">
                              {subItem.title}
                            </div>
                            {subItem.description && (
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                {subItem.description}
                              </div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href || '/'}
                    className={`block text-base font-semibold py-3 hover:opacity-80 transition-opacity ${isActive(item.href || '/') ? 'text-gray-500 font-semibold' : 'text-foreground'}`}
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
  );
};

export default MobileNavigation;
