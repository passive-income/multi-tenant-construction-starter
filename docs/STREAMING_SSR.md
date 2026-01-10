# Streaming SSR & Suspense Implementation Guide

## Overview

This guide explains the optimal UX strategy for your multi-tenant construction site using Next.js 15+ streaming SSR with React Suspense.

## Architecture Benefits

### ✅ What We're Achieving:
1. **Instant loading UI** - Users see skeleton content immediately
2. **Progressive rendering** - Content streams in as it's ready
3. **No performance impact** - Parallel data fetching with React cache()
4. **SEO maintained** - Full SSR, just with better UX
5. **Works with both** - Sanity CMS and static JSON data

## Implementation Strategy

### 1. Route-Level Loading States (`loading.tsx`)

Next.js automatically shows `loading.tsx` while the page loads:

```tsx
// app/(site)/services/loading.tsx
import { ServicesLoading } from "@/components/loading/ServicesLoading";

export default function Loading() {
  return <ServicesLoading />;
}
```

**Benefits:**
- Instant feedback when navigating
- Automatic integration with Next.js router
- No code changes needed in page components

### 2. Component-Level Suspense Boundaries

For granular streaming within a page:

```tsx
// app/(site)/services/page.tsx
import { Suspense } from "react";

export default function ServicesPage() {
  return (
    <section>
      <h1>Services</h1>
      
      {/* This streams independently */}
      <Suspense fallback={<GridSkeleton />}>
        <ServicesGrid />
      </Suspense>
    </section>
  );
}
```

**Benefits:**
- Different parts of page load independently
- Heavy content doesn't block lighter content
- Better perceived performance

### 3. Optimized Data Fetching with `cache()`

Use React's `cache()` to deduplicate requests:

```typescript
// lib/data/streaming.ts
import { cache } from "react";

export const getSiteData = cache(async (host: string) => {
  // This will only execute once per render, even if called multiple times
  return await fetchData(host);
});
```

**Benefits:**
- Prevents duplicate API calls
- Shares data across components
- No performance penalty for splitting components

## Files Created

### Loading States:
- ✅ `app/(site)/loading.tsx` - Home page loading
- ✅ `app/(site)/services/loading.tsx` - Services page loading
- ✅ `app/(site)/company/loading.tsx` - Company page loading
- ✅ `app/(site)/projects/loading.tsx` - Projects page loading
- ✅ `app/(site)/contact/loading.tsx` - Contact page loading

### Utilities:
- ✅ `lib/data/streaming.ts` - Cached data fetching functions
- ✅ `components/loading/Skeletons.tsx` - Reusable skeleton components

### Examples:
- ✅ `app/(site)/page-optimized.tsx` - Optimized home page example
- ✅ `app/(site)/services/page-optimized.tsx` - Optimized services page example

## Migration Steps

### Step 1: Add Route-Level Loading (Already Done ✅)

Each route now has a `loading.tsx` file that displays instantly.

### Step 2: Refactor Pages to Use Streaming Utils

Replace direct data fetching with cached utilities:

**Before:**
```tsx
const data = await getSanityData(dataset, host);
```

**After:**
```tsx
import { getSiteData } from "@/lib/data/streaming";

const data = await getSiteData(host);
```

### Step 3: Add Granular Suspense Boundaries

Wrap independent sections:

```tsx
<Suspense fallback={<HeroSkeleton />}>
  <HeroSection />
</Suspense>

<Suspense fallback={<GridSkeleton />}>
  <ServicesGrid />
</Suspense>
```

### Step 4: Test Both Data Sources

Ensure it works with:
- ✅ Sanity CMS data
- ✅ Static JSON fallback
- ✅ Error states

## Best Practices

### ✅ DO:
- Use `loading.tsx` for route-level loading states
- Wrap async components in Suspense
- Use `cache()` for shared data fetching
- Create skeleton components matching your actual content layout
- Keep skeleton animations subtle (pulse effect)

### ❌ DON'T:
- Add Suspense around every tiny component (overhead)
- Fetch same data multiple times without cache()
- Use different skeleton layouts than actual content (causes layout shift)
- Block fast content waiting for slow content
- Remove SSR (we're enhancing it, not replacing it)

## Performance Metrics

### Before (Traditional SSR):
- TTFB: Wait for all data → Wait for full HTML
- FCP: After full HTML rendered
- User sees: Blank screen → Full page

### After (Streaming SSR):
- TTFB: Instant (shell with skeletons)
- FCP: Immediate (skeleton visible)
- User sees: Skeleton → Progressive content reveal

## Sanity + JSON Compatibility

The streaming approach works seamlessly with both data sources:

```typescript
export const getSiteData = cache(async (host: string) => {
  try {
    // Try Sanity first
    const data = await getSanityData(dataset, host);
    if (data) return data;
  } catch (error) {
    // Automatic fallback to JSON
  }
  
  return await getJsonData("static-mueller.json");
});
```

## Next Steps

1. **Review Examples**: Check `*-optimized.tsx` files
2. **Test Loading States**: Navigate between pages to see loading UI
3. **Customize Skeletons**: Adjust to match your design
4. **Monitor Performance**: Use React DevTools Profiler
5. **Gradually Migrate**: Update one page at a time

## Questions?

- See: `/docs/CONTENT_ARCHITECTURE.md` for data structure
- See: `/docs/TENANT.md` for multi-tenant setup
- Check: Next.js 15 docs on Streaming and Suspense

## Summary

You now have:
- ✅ Instant loading states for all routes
- ✅ Streaming-ready data fetching utilities
- ✅ Reusable skeleton components
- ✅ Zero performance impact
- ✅ Full SSR + SEO maintained
- ✅ Works with Sanity + JSON

Your pages will feel faster and more responsive while maintaining all the benefits of server-side rendering!
