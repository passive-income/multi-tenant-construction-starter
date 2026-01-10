/**
 * Optimized data fetching utilities for streaming SSR with Suspense
 *
 * These functions are designed to work with React Server Components
 * and provide optimal performance with streaming, Suspense boundaries,
 * and Next.js caching.
 *
 * Caching Strategy:
 * - React cache() deduplicates requests within a single render
 * - Next.js revalidate config controls how long data is cached
 * - Stale-while-revalidate ensures fast responses
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { getJsonData } from '@/lib/data/json';
import { getSanityData } from '@/lib/data/sanity';
import type { SiteData } from '@/lib/types/site';
import { getClient } from '@/sanity/lib/client';

/**
 * Cached function to resolve client by host
 * Uses React's cache() to deduplicate requests within a single render
 */
export const getClientByHost = cache(async (host: string, dataset: string) => {
  const client = getClient(dataset);
  const clientDoc = await client.fetch('*[_type == "client" && $host in domains][0]', { host });
  return clientDoc?.clientId || null;
});

/**
 * Get site data with automatic fallback to JSON
 * Optimized for streaming with proper error boundaries and caching
 * Cached for 5 minutes with stale-while-revalidate
 */
export const getSiteData = cache(async (host: string): Promise<SiteData> => {
  return unstable_cache(
    async () => {
      const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

      try {
        const clientId = await getClientByHost(host, dataset);
        if (clientId) {
          const data = await getSanityData(dataset, host);
          if (data) return data;
        }
      } catch (error) {
        console.error('[getSiteData] Sanity fetch failed:', error);
      }

      // Fallback to static JSON
      return await getJsonData('static-mueller.json');
    },
    [`site-data-${host}`],
    {
      revalidate: 300, // 5 minutes
      tags: [`site-${host}`],
    },
  )();
});

/**
 * Get services only (useful for service pages)
 */
export const getServices = cache(async (host: string) => {
  const data = await getSiteData(host);
  return data.services || [];
});

/**
 * Get projects only (useful for project pages)
 */
export const getProjects = cache(async (host: string) => {
  const data = await getSiteData(host);
  return data.projects || [];
});

/**
 * Get company details only
 */
export const getCompanyDetails = cache(async (host: string) => {
  const data = await getSiteData(host);
  return data.companyDetails || [];
});

/**
 * Get navigation menu items
 */
export const getMenuItems = cache(async (host: string) => {
  const data = await getSiteData(host);
  return data.menuItems || [];
});

/**
 * Get a single service by slug
 */
export const getServiceBySlug = cache(async (host: string, slug: string) => {
  const services = await getServices(host);
  return services.find((s: any) => {
    const serviceSlug = typeof s.slug === 'string' ? s.slug : s?.slug?.current;
    return serviceSlug === slug;
  });
});

/**
 * Get a single project by slug
 */
export const getProjectBySlug = cache(async (host: string, slug: string) => {
  const projects = await getProjects(host);
  return projects.find((p: any) => {
    const projectSlug = typeof p.slug === 'string' ? p.slug : p?.slug?.current;
    return projectSlug === slug;
  });
});
