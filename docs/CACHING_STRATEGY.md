# Caching & Loading States Strategy

## Overview

Your application now uses intelligent caching to show loading skeletons **only when necessary**, providing instant page loads when data is cached.

## How It Works

### 1. **First Visit (No Cache)**
- User sees loading skeleton immediately
- Data fetches from Sanity/JSON
- Content streams in progressively
- Data is cached for reuse

### 2. **Subsequent Visits (Cached)**
- User sees content **instantly** (no skeleton)
- No loading state shown
- Data served from cache
- Near-instant page loads

### 3. **Stale Cache (Background Revalidation)**
- User sees cached content instantly
- New data fetches in background
- Page updates seamlessly when ready
- No loading interruption

## Caching Configuration

### Page-Level Revalidation

```typescript
// Cache for 5 minutes (300 seconds)
export const revalidate = 300;
```

**Current Settings:**
- Home page: 5 minutes (frequent updates)
- Detail pages: 10 minutes (less frequent changes)
- Services/Projects: 10 minutes

### Data-Level Caching

```typescript
// lib/data/streaming.ts uses unstable_cache
unstable_cache(
  fetchFunction,
  [`cache-key`],
  {
    revalidate: 300,        // Cache duration
    tags: [`invalidation-tag`]  // For manual revalidation
  }
)
```

## When You See Loading Skeletons

✅ **You WILL see skeletons:**
- First visit to a page (cold cache)
- After cache expires (past revalidation time)
- After manual cache invalidation
- In development mode (caching is disabled)

❌ **You WON'T see skeletons:**
- Navigating to previously visited pages
- Within the revalidation window
- When cache is warm
- Background revalidations (shows old content)

## Cache Invalidation

### Automatic (Time-Based)
Cache automatically expires based on `revalidate` setting:
```typescript
export const revalidate = 300; // Auto-refresh every 5 minutes
```

### Manual (On-Demand)
Invalidate cache when content changes in Sanity:

```typescript
import { revalidateTag, revalidatePath } from 'next/cache';

// In your webhook/API route:
revalidateTag('site-example.com');  // Invalidate specific site
revalidatePath('/services');         // Invalidate specific path
```

### Webhook Setup (Recommended)
Add to Sanity Studio to auto-invalidate on content changes:

```typescript
// sanity.config.ts or webhook
export default {
  // ... config
  webhooks: [{
    name: 'revalidate-cache',
    url: 'https://yoursite.com/api/revalidate',
    on: ['create', 'update', 'delete'],
    filter: '_type == "page" || _type == "service"'
  }]
}
```

## Environment-Specific Behavior

### Development (`npm run dev`)
- Caching is **disabled** by default
- You'll always see loading states
- Good for testing loading skeletons
- Set `NODE_ENV=production` to test caching locally

### Production (`npm run build && npm start`)
- Full caching enabled
- Loading states only on cache miss
- Optimal performance
- Real user experience

## Adjusting Cache Duration

### Shorter Cache (More Fresh, More Loading)
```typescript
export const revalidate = 60; // 1 minute - very fresh
```
- ✅ Content updates quickly
- ❌ More frequent loading states
- Use for: Frequently changing content

### Longer Cache (Less Fresh, Less Loading)
```typescript
export const revalidate = 3600; // 1 hour - very stable
```
- ✅ Fewer loading states
- ❌ Content updates slowly
- Use for: Stable content

### No Cache (Always Fresh, Always Loading)
```typescript
export const revalidate = 0; // No caching
// or
export const dynamic = 'force-dynamic';
```
- ✅ Always fresh data
- ❌ Loading state every visit
- Use for: Real-time data only

## Best Practices

### ✅ Recommended Settings

| Page Type | Revalidate | Reason |
|-----------|-----------|---------|
| Home page | 300s (5min) | High traffic, frequent updates |
| Services list | 600s (10min) | Moderate changes |
| Service detail | 600s (10min) | Stable content |
| Projects list | 600s (10min) | Updated regularly |
| Project detail | 600s (10min) | Rarely changes |
| Contact page | 3600s (1h) | Very stable |
| Static pages | 3600s (1h) | Rarely changes |

### ❌ Avoid

- Setting `revalidate = 0` unless absolutely necessary
- Using `force-dynamic` everywhere (current mistake)
- Too short revalidation (< 60s) for most content
- No caching for stable content

## Monitoring Cache Performance

### Check if Cache is Working

1. **First visit:** Should see loading skeleton
2. **Refresh immediately:** Should see content instantly (no skeleton)
3. **Wait past revalidation time:** Should see cached content first, update in background

### Debug Cache Issues

```typescript
// Add logging to see cache behavior
console.log('[Cache] Fetching data for:', host);
console.log('[Cache] From cache or fresh?');
```

### Production Monitoring
Use Next.js built-in analytics or add custom logging:
```typescript
// In your data fetching
const startTime = Date.now();
const data = await getSiteData(host);
console.log('[Perf] Data fetch took:', Date.now() - startTime, 'ms');
```

## Summary

**Before (force-dynamic):**
- ❌ Loading skeleton every visit
- ❌ Slow page loads always
- ❌ Unnecessary server load
- ❌ Poor user experience

**After (smart caching):**
- ✅ Loading skeleton only on first visit
- ✅ Instant page loads when cached
- ✅ Background updates when stale
- ✅ Great user experience
- ✅ Reduced server load

Your pages now intelligently balance freshness with performance, showing loading states only when necessary while keeping content up-to-date.
