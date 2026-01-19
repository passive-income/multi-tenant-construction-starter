'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { MenuItem } from '@/lib/types/navigation';

const MobileNavigation = ({ logoText, items }: { logoText: string; items: MenuItem[] }) => {
  const [open, setOpen] = useState(false);

  const pathname = usePathname() ?? '/';

  // Prevent body scroll when sheet is open, preserving previous overflow
  const previousBodyOverflowRef = useRef<string | null>(null);
  useEffect(() => {
    if (open) {
      // store previous value so we can restore it later
      previousBodyOverflowRef.current = document.body.style.overflow || null;
      document.body.style.overflow = 'hidden';
    } else {
      // only restore if we are still the ones who set it to 'hidden'
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = previousBodyOverflowRef.current ?? '';
      }
    }
    return () => {
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = previousBodyOverflowRef.current ?? '';
      }
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/services') return pathname.startsWith('/services');
    return pathname === href;
  };

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
        <SheetContent
          side="right"
          className="w-75 sm:w-100 px-4 sm:px-6 mobile-navigation overflow-y-auto"
        >
          <SheetHeader className="pb-4 border-b border-border/50 px-0 sm:px-0">
            <SheetTitle className="text-lg font-bold">{logoText}</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col overflow-y-auto" aria-label="Mobile Navigation">
            {items.map((item) => (
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
