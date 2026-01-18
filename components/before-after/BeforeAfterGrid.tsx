'use client';

import type React from 'react';
import { BeforeAfterSliderWrapper } from '@/components/before-after/BeforeAfterSliderWrapper';

export interface BeforeAfterItem {
  beforeSrc: string;
  afterSrc: string;
  title?: string;
  subtitle?: string;
  beforeLabel?: string;
  afterLabel?: string;
  minHeight?: number;
}

interface BeforeAfterGridProps {
  items: BeforeAfterItem[];
  /** Optional fixed column count (1 or 2). Defaults to 2. */
  columns?: number;
  /** CSS gap value, e.g. '1rem' or '16px' */
  gap?: string;
  className?: string;
}

export default function BeforeAfterGrid({
  items,
  columns,
  gap = '1rem',
  className = '',
}: BeforeAfterGridProps) {
  // Clamp columns to maximum 2 per row. Mobile will always show 1 per row via Tailwind classes.
  const cols = Math.min(Math.max(1, columns ?? 2), 2);
  const smClass = cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-1';
  const style: React.CSSProperties = { gap };

  // Use CSS-based clamping and wrapping to avoid JS measurement and large whitespace.
  // We'll clamp titles/subtitles to two lines and enable word-break + hyphens so long words wrap.
  const labelScale = cols === 1 ? 1 : 0.85;
  return (
    <div className={`grid grid-cols-1 ${smClass} gap-4 ${className}`} style={style}>
      {items.map((it, index) => (
        <div key={it.beforeSrc || `ba-${index}`} className="flex flex-col">
          {(it.title || it.subtitle) && (
            <div className="mb-2">
              {it.title ? (
                <div className="text-lg font-semibold text-gray-800 title-clamp wrap-break-word hyphens-auto">
                  {it.title}
                </div>
              ) : null}
              {it.subtitle ? (
                <div className="text-sm text-gray-600 subtitle-clamp wrap-break-word hyphens-auto mt-1">
                  {it.subtitle}
                </div>
              ) : null}
            </div>
          )}
          <BeforeAfterSliderWrapper
            beforeSrc={it.beforeSrc}
            afterSrc={it.afterSrc}
            beforeLabel={it.beforeLabel}
            afterLabel={it.afterLabel}
            minHeight={it.minHeight}
            labelScale={labelScale}
          />
        </div>
      ))}
    </div>
  );
}
