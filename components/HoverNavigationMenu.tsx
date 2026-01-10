'use client';

import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SubItem {
  title: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  subItems?: SubItem[];
}

interface HoverNavigationMenuProps {
  items: NavItem[];
  pathname: string;
  navBase: string;
  activeClass: string;
  hoverClass: string;
}

function HoverNavItem({
  item,
  pathname,
  navBase,
  activeClass,
  hoverClass,
}: {
  item: NavItem;
  pathname: string;
  navBase: string;
  activeClass: string;
  hoverClass: string;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isActive = pathname === item.href;

  if (!item.subItems || item.subItems.length === 0) {
    return (
      <Link href={item.href} className={`${navBase} ${isActive ? activeClass : hoverClass}`}>
        {item.label}
      </Link>
    );
  }

  return (
    <DropdownMenu open={open} modal={false}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative"
        role="group"
      >
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`${navBase} ${isActive ? activeClass : hoverClass} flex items-center gap-1`}
          >
            {item.label}
            <ChevronDownIcon
              className={`size-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[400px] md:w-[500px]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="grid gap-1 p-2">
            {item.subItems.map((sub) => (
              <DropdownMenuItem key={sub.href} asChild>
                <Link
                  href={sub.href}
                  className="block cursor-pointer rounded-md p-3 transition-colors"
                >
                  <div className="font-medium text-sm">{sub.title}</div>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}

export default function HoverNavigationMenu({
  items,
  pathname,
  navBase,
  activeClass,
  hoverClass,
}: HoverNavigationMenuProps) {
  return (
    <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
      {items.map((item, index) => (
        <HoverNavItem
          key={`${item.href}-${item.label}-${index}`}
          item={item}
          pathname={pathname}
          navBase={navBase}
          activeClass={activeClass}
          hoverClass={hoverClass}
        />
      ))}
    </nav>
  );
}
