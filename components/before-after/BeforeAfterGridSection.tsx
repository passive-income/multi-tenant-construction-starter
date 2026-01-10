'use client';

import type { BeforeAfterItem } from './BeforeAfterGrid';
import BeforeAfterGrid from './BeforeAfterGrid';

interface BeforeAfterGridSectionProps {
  items: BeforeAfterItem[];
  columns?: number;
  gap?: string;
}

export function BeforeAfterGridSection({ items, columns, gap }: BeforeAfterGridSectionProps) {
  if (items.length === 0) return null;

  return <BeforeAfterGrid items={items} columns={columns} gap={gap} />;
}
