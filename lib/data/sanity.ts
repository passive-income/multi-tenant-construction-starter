import { getClient } from "@/sanity/lib/client";
import {
  siteSettingsQuery,
  servicesQuery,
  projectsQuery,
} from "@/sanity/queries";
import type { SiteData } from "@/lib/types/site";
import { z } from "zod";

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

const navItem = z
  .object({
    label: z.string(),
    href: z.string(),
    subItems: z.array(z.any()).optional(),
  })
  .passthrough();
const navigationSchema = z
  .object({ menuItems: z.array(navItem).optional() })
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
    const clientId = clientDoc.clientId;

    // company and footer are stored as references on the client doc
    const company = clientDoc.companyRef
      ? await client.fetch("*[_id == $id][0]", {
          id: clientDoc.companyRef._ref,
        })
      : null;

    const footer = clientDoc.footerRef
      ? await client.fetch("*[_id == $id][0]", { id: clientDoc.footerRef._ref })
      : null;

    const navigation = await client.fetch(
      '*[_type == "navigation" && _id == $id][0]',
      { id: `navigation-${clientId}` },
    );

    const services = await client.fetch(
      '*[_type == "service" && clientId == $clientId] | order(title asc)',
      { clientId },
    );
    const projects = await client.fetch(
      '*[_type == "project" && clientId == $clientId] | order(year desc)',
      { clientId },
    );

    const parsed = siteDataSchema.safeParse({
      company,
      footer,
      navigation,
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
