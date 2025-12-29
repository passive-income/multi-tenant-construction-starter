import { getClient } from "@/sanity/lib/client";
import {
  siteSettingsQuery,
  servicesQuery,
  projectsQuery,
} from "@/sanity/queries";
import type { SiteData } from "@/lib/types/site";
import { z } from "zod";
import { urlFor } from '@/sanity/lib/image'
import { resolveLink } from '@/lib/utils/links'

// Zod schemas for runtime validation
const companySchema = z
  .object({
    name: z.string().optional(),
    logoText: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
  })
  .passthrough();

const footerLink = z
  .object({ text: z.string(), href: z.string() })
  .passthrough();
const footerSchema = z
  .object({
    locations: z.array(z.any()).optional(),
    openingHours: z.any().optional(),
    links: z.array(footerLink).optional(),
    copyright: z.string().optional(),
  })
  .passthrough();

// Navigation coming from Sanity may contain `link` objects without concrete hrefs.
// Be permissive here; we normalize to concrete hrefs separately at top-level `menuItems`.
const navItem = z
  .object({
    label: z.string(),
    href: z.string().optional(),
    link: z.any().optional(),
    subItems: z.array(z.any()).optional(),
  })
  .passthrough();
const navigationSchema = z
  .object({ menuItems: z.array(z.any()).optional() })
  .passthrough();

const serviceSchema = z
  .object({
    _id: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    clientId: z.string().optional(),
  })
  .passthrough();
const projectSchema = z
  .object({
    _id: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    clientId: z.string().optional(),
  })
  .passthrough();

const siteDataSchema = z
  .object({
    company: companySchema.optional(),
    slider: z.any().optional(),
    footer: footerSchema.optional(),
    navigation: navigationSchema.optional(),
    services: z.array(serviceSchema).optional(),
    projects: z.array(projectSchema).optional(),
  })
  .passthrough();

/**
 * Resolve the `client` document by hostname.
 * Returns null if no matching client is found.
 */
async function resolveClientByHost(client: any, host?: string) {
  if (!host) return null;
  const q = '*[_type == "client" && $host in domains][0]';
  return client.fetch(q, { host });
}

/**
 * Fetch site data scoped to a client resolved by hostname.
 * If no host is provided or no client is found, falls back to the generic site settings queries.
 */
export async function getSanityData(
  dataset: string,
  host?: string,
): Promise<SiteData> {
  const client = getClient(dataset);

  // Try to resolve client by host (e.g. "alpha.local" or "localhost:3010")
  const clientDoc = await resolveClientByHost(client, host);

  if (clientDoc) {
    // If the client doc explicitly points to a static JSON data source,
    // return that file directly (useful for staging/prod mappings that
    // should serve the repository's static JSON instead of Sanity docs).
    // Expected fields on the client doc in Sanity:
    // - `dataSource: 'json'` (or 'static')
    // - optional `staticFileName`: e.g. 'static-mueller.json'
    try {
      const ds = clientDoc.dataSource || clientDoc.type || null;
      if (ds === "json" || ds === "static") {
        const staticFile = clientDoc.staticFileName || "static-mueller.json";
        // dynamic import to avoid adding fs at module top-level in browser bundles
        const fs = await import("fs/promises");
        const path = await import("path");
        try {
          const filePath = path.join(process.cwd(), "data", staticFile);
          const file = await fs.readFile(filePath, "utf-8");
          const parsed = JSON.parse(file) as SiteData;
          return parsed;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(`Failed to load static JSON '${staticFile}' for client ${clientDoc._id}:`, err);
          // fall through to attempt normal Sanity-based lookup below
        }
      }
    } catch (e) {
      // ignore and continue with sanity fetch
    }
    const clientId = clientDoc.clientId;

    // company and footer are stored as references on the client doc
    const company = clientDoc.companyRef
      ? await client.fetch("*[_id == $id][0]", {
          id: clientDoc.companyRef._ref,
        })
      : null;

      // Map company slider images if present
      try {
        if (company?.slider && Array.isArray(company.slider)) {
          company.slider = company.slider.map((it: any) => ({
            ...it,
            image: it?.image ? urlFor(it.image).width(1600).auto('format').url() : it?.image,
          }))
        }
        // Map company before/after pairs to URL strings when present
        if (company?.beforeAfter && Array.isArray(company.beforeAfter)) {
          company.beforeAfter = company.beforeAfter.map((it: any) => ({
            ...it,
            before: it?.before ? urlFor(it.before).width(1200).auto('format').url() : it?.before,
            after: it?.after ? urlFor(it.after).width(1200).auto('format').url() : it?.after,
          }))
        }
      } catch (e) {}

    const footer = clientDoc.footerRef
      ? await client.fetch("*[_id == $id][0]", { id: clientDoc.footerRef._ref })
      : null;

    const navigation = await client.fetch(
      '*[_type == "navigation" && _id == $id][0]',
      { id: `navigation-${clientId}` },
    );

    // Resolve navigation links to concrete hrefs
    let menuItems: any[] = [];
    try {
      const rawItems = navigation?.menuItems || [];
      menuItems = await Promise.all(
        rawItems.map(async (item: any) => {
          const href = await resolveLink(client, item.link || { externalUrl: item.href });
          const subItems = Array.isArray(item.subItems)
            ? await Promise.all(
                item.subItems.map(async (sub: any) => ({
                  title: sub.title,
                  description: sub.description,
                  href: await resolveLink(client, sub.link || { externalUrl: sub.href }),
                }))
              )
            : undefined;
          return { label: item.label, href, subItems };
        })
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to resolve navigation links', e);
    }

    let services = await client.fetch(
      '*[_type == "service" && clientId == $clientId] | order(title asc)',
      { clientId },
    );
    let projects = await client.fetch(
      '*[_type == "project" && clientId == $clientId] | order(year desc)',
      { clientId },
    );

    // Map common Sanity image objects to optimized URL strings using urlFor
    try {
      services = (services || []).map((s: any) => ({
        ...s,
        image: s?.image
          ? urlFor(s.image).width(800).auto('format').url()
          : s?.imageUrl ?? s?.image,
      }))
    } catch (e) {
      // continue with un-mapped services
    }

    try {
      projects = (projects || []).map((p: any) => ({
        ...p,
        image: p?.image ? urlFor(p.image).width(1200).auto('format').url() : p?.image,
        images: Array.isArray(p?.images)
          ? p.images.map((im: any) => (im ? urlFor(im).width(1200).auto('format').url() : im))
          : p.images,
      }))
    } catch (e) {
      // continue with un-mapped projects
    }

    const parsed = siteDataSchema.safeParse({
      company,
      slider: company
        ? {
            slides: company.slider,
            beforeAfter: company.beforeAfter,
          }
        : undefined,
      footer,
      navigation,
      menuItems,
      services,
      projects,
    });
    if (!parsed.success) {
      // Log validation issues but return best-effort data to avoid breaking the site
      // eslint-disable-next-line no-console
      console.warn(
        "Sanity site data validation failed:",
        parsed.error.format(),
      );
      return { company, footer, navigation, services, projects } as SiteData;
    }

    return parsed.data as SiteData;
  }

  // Fallback: no client resolved — return generic settings (legacy behavior)
  const settings = await client.fetch(siteSettingsQuery);
  const services = await client.fetch(servicesQuery);
  const projects = await client.fetch(projectsQuery);

  const parsed = siteDataSchema.safeParse({
    company: settings,
    services,
    projects,
  });
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.warn(
      "Sanity generic site data validation failed:",
      parsed.error.format(),
    );
    return { company: settings, services, projects } as SiteData;
  }

  return parsed.data as SiteData;
}
