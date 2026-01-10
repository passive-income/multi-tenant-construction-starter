import type { SanityDocument } from 'sanity';

/**
 * Resolve a Sanity `link` object to a concrete href.
 * - externalUrl: returned as-is
 * - internalRef: fetch target to derive route based on `_type` and `slug.current`
 */
export async function resolveLink(
  client: { fetch: (q: string, params?: Record<string, any>) => Promise<any> },
  link: any,
): Promise<string> {
  if (!link) return '/';
  if (link.externalUrl) return link.externalUrl;
  const ref = link.internalRef;
  if (!ref || !ref._ref) return '/';

  const doc: SanityDocument | null = await client.fetch('*[_id == $id][0]', { id: ref._ref });
  if (!doc) return '/';

  const type = doc._type;
  const slug = (doc as any)?.slug?.current;

  switch (type) {
    case 'service':
      return slug ? `/services/${slug}` : '/services';
    case 'project':
      return slug ? `/projects/${slug}` : '/projects';
    case 'company':
      return '/company';
    case 'page':
      return slug ? `/${slug}` : '/';
    default:
      // fallback: generic page by slug if present
      return slug ? `/${slug}` : '/';
  }
}
