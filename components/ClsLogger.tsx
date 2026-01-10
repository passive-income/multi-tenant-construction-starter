'use client';

import { useEffect } from 'react';

function getElementSelector(node: Node | null | undefined): string {
  if (!node || !(node as Element).tagName) return '<unknown>';
  let el = node as Element;
  const parts: string[] = [];
  while (el && el.nodeType === 1 && parts.length < 6) {
    const tag = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const classList = (el.className || '')
      .toString()
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .map((c) => `.${c}`)
      .join('');

    let nth = '';
    if (!id) {
      let i = 1;
      let sib = el.previousElementSibling;
      while (sib) {
        if (sib.tagName === el.tagName) i++;
        sib = sib.previousElementSibling as Element | null;
      }
      nth = i > 1 ? `:nth-of-type(${i})` : '';
    }

    parts.unshift(`${tag}${id}${classList}${nth}`);

    if (id) break; // unique enough
    el = (el.parentElement as Element | null) || ({} as Element);
    if (!el.tagName) break;
  }
  return parts.join(' > ');
}

let totalCls = 0;

export default function ClsLogger() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('PerformanceObserver' in window)) return;

    const shouldLog =
      process.env.NEXT_PUBLIC_LOG_CLS === '1' || process.env.NODE_ENV !== 'production';
    if (!shouldLog) return;

    const seen: { largest?: number } = {};

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceEntry[]) {
        // @ts-expect-error layout-shift specific fields
        const ls = entry as any;
        if (ls?.hadRecentInput) continue; // ignore input-driven shifts
        const value = Number(ls?.value || 0);
        totalCls += value;
        if (!seen.largest || value > seen.largest) seen.largest = value;
        const sources = Array.isArray(ls?.sources) ? ls.sources : [];
        const selectors = sources.map((s: any) => getElementSelector(s?.node)).filter(Boolean);
        // Group small logs to avoid spamming console
        // eslint-disable-next-line no-console
        console.log('[CLS] shift:', value.toFixed(4), 'total:', totalCls.toFixed(4), {
          startTime: Math.round(entry.startTime),
          sources: selectors,
        });
      }
    });

    try {
      observer.observe({ type: 'layout-shift', buffered: true } as any);
    } catch {}

    return () => {
      try {
        observer.disconnect();
      } catch {}
    };
  }, []);

  return null;
}
