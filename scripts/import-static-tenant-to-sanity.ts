import fs from 'node:fs/promises';
import path from 'node:path';

import { createClient } from 'next-sanity';

type JsonRecord = Record<string, unknown>;

type SanityObject = {
  _type: string;
} & Record<string, unknown>;

type SanityTopLevelDocument = SanityObject & {
  _id: string;
};

type SanityWriteClient = {
  createOrReplace: (doc: SanityTopLevelDocument) => Promise<unknown>;
  assets: {
    upload: (
      type: 'image',
      body: Buffer,
      options: { filename: string },
    ) => Promise<{ _id: string }>;
  };
};

type TenantJson = JsonRecord & {
  clientId?: unknown;
  enabledFeatures?: unknown;
  domains?: unknown;
  name?: unknown;
  client?: {
    clientId?: unknown;
    enabledFeatures?: unknown;
    domains?: unknown;
    name?: unknown;
  };
  company?: { name?: unknown };
  services?: unknown;
  projects?: unknown;
  pages?: unknown;
};

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim().length === 0) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return v;
}

function isHttpUrl(v: string): boolean {
  return /^https?:\/\//i.test(v);
}

function guessFilenameFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const base = path.basename(u.pathname);
    return base && base !== '/' ? base : 'image';
  } catch {
    return 'image';
  }
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

async function readLocalImageBytes(
  repoRoot: string,
  raw: string,
): Promise<{ bytes: Buffer; filename: string } | null> {
  // Support values like:
  // - /some.png  -> treated as public/some.png
  // - public/some.png
  // - data/images/some.png
  const clean = raw.trim();
  const candidates: string[] = [];

  if (clean.startsWith('/')) {
    candidates.push(path.join(repoRoot, 'public', clean.slice(1)));
  }
  candidates.push(path.join(repoRoot, clean));
  candidates.push(path.join(repoRoot, 'public', clean));

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      const bytes = await fs.readFile(candidate);
      return { bytes, filename: path.basename(candidate) };
    }
  }
  return null;
}

async function uploadImageFromString(
  client: Pick<SanityWriteClient, 'assets'>,
  repoRoot: string,
  raw: string,
): Promise<SanityObject | null> {
  const value = raw.trim();
  if (!value) return null;

  try {
    if (isHttpUrl(value)) {
      const res = await fetch(value);
      if (!res.ok) {
        throw new Error(
          `Failed to fetch ${value}: ${res.status} ${res.statusText}`,
        );
      }
      const ab = await res.arrayBuffer();
      const bytes = Buffer.from(ab);
      const filename = guessFilenameFromUrl(value);
      const asset = await client.assets.upload('image', bytes, { filename });
      return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
    }

    const local = await readLocalImageBytes(repoRoot, value);
    if (!local) {
      return null;
    }
    const asset = await client.assets.upload('image', local.bytes, {
      filename: local.filename,
    });
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  } catch (e) {
    console.warn('[import] image upload failed:', value, e);
    return null;
  }
}

function toRef(id: string) {
  return { _type: 'reference', _ref: id } satisfies SanityObject;
}

function normalizePages(
  rawPages: unknown,
): Array<{ slug: string; title?: unknown; pageType?: unknown; sections?: unknown[] }> {
  if (!rawPages) return [];

  type NormalizedPage = {
    slug: string | undefined;
    title: unknown | undefined;
    pageType: unknown | undefined;
    sections: unknown[] | undefined;
  };

  if (Array.isArray(rawPages)) {
    const pages: NormalizedPage[] = rawPages.map((p) => {
        const page =
          p && typeof p === 'object' ? (p as Record<string, unknown>) : null;
        return {
          slug: typeof page?.slug === 'string' ? (page.slug as string) : undefined,
          title: page?.title,
          pageType: page?.pageType,
          sections: Array.isArray(page?.sections)
            ? (page.sections as unknown[])
            : undefined,
        };
      });

    return pages.filter(
      (p): p is NormalizedPage & { slug: string } =>
        typeof p.slug === 'string' && p.slug.length > 0,
    );
  }

  if (typeof rawPages === 'object') {
    return Object.entries(rawPages)
      .map(([slug, val]) => {
        const page = (val && typeof val === 'object' ? (val as Record<string, unknown>) : null);
        return {
          slug,
          title: page?.title,
          pageType: page?.pageType,
          sections: Array.isArray(page?.sections) ? (page.sections as unknown[]) : undefined,
        };
      })
      .filter((p) => typeof p.slug === 'string' && p.slug.length > 0);
  }

  return [];
}

async function main() {
  const repoRoot = process.cwd();
  const inputPath = process.argv[2];
  if (!inputPath) {
    throw new Error(
      'Usage: ts-node --esm scripts/import-static-tenant-to-sanity.ts <path-to-tenant-json>',
    );
  }

  const absPath = path.isAbsolute(inputPath) ? inputPath : path.join(repoRoot, inputPath);
  const raw = await fs.readFile(absPath, 'utf-8');
  const data = JSON.parse(raw) as TenantJson;

  const clientId: string = (
    typeof data.clientId === 'string'
      ? data.clientId
      : typeof data.client?.clientId === 'string'
        ? data.client.clientId
        : ''
  ).toString();
  if (!clientId) {
    throw new Error(
      'Tenant JSON must include clientId (top-level clientId or client.clientId).',
    );
  }

  const projectId = requireEnv('SANITY_PROJECT_ID');
  const dataset = requireEnv('SANITY_DATASET');
  const token = requireEnv('SANITY_TOKEN');
  const apiVersion =
    process.env.SANITY_API_VERSION ||
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
    '2025-12-17';

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false }) as unknown as SanityWriteClient;

  const enabledFeatures: string[] | undefined = Array.isArray(data.enabledFeatures)
    ? data.enabledFeatures.filter((v): v is string => typeof v === 'string')
    : Array.isArray(data?.client?.enabledFeatures)
      ? data.client.enabledFeatures.filter((v): v is string => typeof v === 'string')
      : undefined;

  const domains = Array.isArray(data.domains)
    ? data.domains.filter((v): v is string => typeof v === 'string')
    : Array.isArray(data?.client?.domains)
      ? data.client.domains.filter((v): v is string => typeof v === 'string')
      : undefined;

  // 1) Create/Update service docs
  const serviceIdBySlug = new Map<string, string>();
  if (Array.isArray(data.services)) {
    for (const s of data.services) {
      const service = (s && typeof s === 'object' ? (s as Record<string, unknown>) : null);
      const serviceSlug =
        typeof service?.slug === 'string'
          ? (service.slug as string)
          : typeof (service?.slug as { current?: unknown } | undefined)?.current === 'string'
            ? ((service?.slug as { current?: unknown }).current as string)
            : undefined;

      const slug = serviceSlug?.toString();
      if (!slug) continue;

      const docId = `service-${clientId}-${slug}`;
      serviceIdBySlug.set(slug, docId);

      const serviceDoc: SanityTopLevelDocument = {
        _id: docId,
        _type: 'service',
        title: service?.title,
        slug: { _type: 'slug', current: slug },
        description: service?.description,
        richDescription: service?.richDescription,
        measures: service?.measures,
        icon: service?.icon,
        clientId,
      };

      if (typeof service?.imageUrl === 'string') {
        serviceDoc.imageUrl = service.imageUrl;
      }
      if (typeof service?.image === 'string') {
        serviceDoc.imageUrl = service.image;
      }

      await client.createOrReplace(serviceDoc);
    }
  }

  // 2) Create/Update project docs
  const projectIdBySlug = new Map<string, string>();
  if (Array.isArray(data.projects)) {
    for (const p of data.projects) {
      const project = (p && typeof p === 'object' ? (p as Record<string, unknown>) : null);
      const projectSlug =
        typeof project?.slug === 'string'
          ? (project.slug as string)
          : typeof (project?.slug as { current?: unknown } | undefined)?.current === 'string'
            ? ((project?.slug as { current?: unknown }).current as string)
            : undefined;

      const slug = projectSlug?.toString();
      if (!slug) continue;

      const docId = `project-${clientId}-${slug}`;
      projectIdBySlug.set(slug, docId);

      const projectDoc: SanityTopLevelDocument = {
        _id: docId,
        _type: 'project',
        title: project?.title,
        slug: { _type: 'slug', current: slug },
        description: project?.description,
        link: project?.link,
        clientId,
      };

      // Optional cover image
      if (typeof project?.image === 'string') {
        const img = await uploadImageFromString(client, repoRoot, project.image);
        if (img) projectDoc.image = img;
      }

      // Optional gallery images array
      if (Array.isArray(project?.images)) {
        const uploaded: SanityObject[] = [];
        for (const im of project.images) {
          if (typeof im !== 'string') continue;
          const img = await uploadImageFromString(client, repoRoot, im);
          if (img) uploaded.push(img);
        }
        if (uploaded.length > 0) projectDoc.images = uploaded;
      }

      await client.createOrReplace(projectDoc);
    }
  }

  // 3) Create/Update pages with sections
  const pages = normalizePages(data.pages);
  for (const p of pages) {
    const slug = p.slug;
    const isHome = slug === 'home';

    const pageDocId = `page-${clientId}-${slug}`;

    const sectionsIn = Array.isArray(p.sections) ? p.sections : [];
    const sectionsOut: SanityObject[] = [];

    for (const section of sectionsIn) {
      if (!section || typeof section !== 'object') continue;
      const sectionObj = section as Record<string, unknown>;
      if (typeof sectionObj._type !== 'string') continue;

      if (sectionObj._type === 'heroSection') {
        const out: SanityObject = {
          _type: 'heroSection',
          title: sectionObj.title,
          subtitle: sectionObj.subtitle,
          description: sectionObj.description,
          linkText: sectionObj.linkText,
          linkHref: sectionObj.linkHref,
        };
        if (typeof sectionObj.image === 'string') {
          const img = await uploadImageFromString(client, repoRoot, sectionObj.image);
          if (img) out.image = img;
        } else if (sectionObj.image) {
          out.image = sectionObj.image;
        }
        sectionsOut.push(out);
        continue;
      }

      if (sectionObj._type === 'imageSliderSection') {
        const slidesOut: SanityObject[] = [];
        const slides = Array.isArray(sectionObj.slides) ? sectionObj.slides : [];
        for (const slide of slides) {
          if (!slide) continue;
          const slideObj = (slide && typeof slide === 'object' ? (slide as Record<string, unknown>) : null);
          if (!slideObj) continue;
          const outSlide: SanityObject = { _type: 'imageSlide', caption: slideObj.caption };
          if (typeof slideObj.image === 'string') {
            const img = await uploadImageFromString(client, repoRoot, slideObj.image);
            if (img) outSlide.image = img;
          } else if (slideObj.image) {
            outSlide.image = slideObj.image;
          }
          if (outSlide.image) slidesOut.push(outSlide);
        }
        if (slidesOut.length > 0) {
          sectionsOut.push({
            _type: 'imageSliderSection',
            slides: slidesOut,
            autoplay: sectionObj.autoplay,
            autoplayInterval: sectionObj.autoplayInterval,
          });
        }
        continue;
      }

      if (sectionObj._type === 'beforeAfterSection') {
        const pairsOut: SanityObject[] = [];
        const pairs = Array.isArray(sectionObj.pairs) ? sectionObj.pairs : [];
        for (const pair of pairs) {
          if (!pair) continue;
          const pairObj = (pair && typeof pair === 'object' ? (pair as Record<string, unknown>) : null);
          if (!pairObj) continue;
          const before =
            typeof pairObj.before === 'string'
              ? await uploadImageFromString(client, repoRoot, pairObj.before)
              : pairObj.before;
          const after =
            typeof pairObj.after === 'string'
              ? await uploadImageFromString(client, repoRoot, pairObj.after)
              : pairObj.after;
          if (!before || !after) continue;
          pairsOut.push({
            _type: 'beforeAfter',
            title: pairObj.title,
            subtitle: pairObj.subtitle,
            before,
            after,
          });
        }
        if (pairsOut.length > 0) {
          sectionsOut.push({
            _type: 'beforeAfterSection',
            title: sectionObj.title,
            description: sectionObj.description,
            pairs: pairsOut,
            columns: sectionObj.columns,
            gap: sectionObj.gap,
          });
        }
        continue;
      }

      if (sectionObj._type === 'companySection') {
        const out: SanityObject = {
          _type: 'companySection',
          title: sectionObj.title,
          subtitle: sectionObj.subtitle,
          description: sectionObj.description,
          subsections: sectionObj.subsections,
        };
        if (typeof sectionObj.image === 'string') {
          const img = await uploadImageFromString(client, repoRoot, sectionObj.image);
          if (img) out.image = img;
        } else if (sectionObj.image) {
          out.image = sectionObj.image;
        }
        sectionsOut.push(out);
        continue;
      }

      if (sectionObj._type === 'servicesSection') {
        const refs: SanityObject[] = [];
        const services = Array.isArray(sectionObj.services) ? sectionObj.services : [];
        for (const entry of services) {
          const sslug =
            typeof entry === 'string'
              ? entry
              : typeof (entry && typeof entry === 'object' ? (entry as Record<string, unknown>).slug : undefined) === 'string'
                ? ((entry as Record<string, unknown>).slug as string)
                : undefined;
          if (typeof sslug !== 'string') continue;
          const refId = serviceIdBySlug.get(sslug);
          if (refId) refs.push(toRef(refId));
        }
        sectionsOut.push({
          _type: 'servicesSection',
          title: sectionObj.title,
          description: sectionObj.description,
          services: refs,
        });
        continue;
      }

      if (sectionObj._type === 'projectsSection') {
        const refs: SanityObject[] = [];
        const projects = Array.isArray(sectionObj.projects) ? sectionObj.projects : [];
        for (const entry of projects) {
          const pslug =
            typeof entry === 'string'
              ? entry
              : typeof (entry && typeof entry === 'object' ? (entry as Record<string, unknown>).slug : undefined) === 'string'
                ? ((entry as Record<string, unknown>).slug as string)
                : undefined;
          if (typeof pslug !== 'string') continue;
          const refId = projectIdBySlug.get(pslug);
          if (refId) refs.push(toRef(refId));
        }
        sectionsOut.push({
          _type: 'projectsSection',
          title: sectionObj.title,
          description: sectionObj.description,
          projects: refs,
          showViewAllButton: sectionObj.showViewAllButton,
          viewAllButtonText: sectionObj.viewAllButtonText,
          viewAllButtonLink: sectionObj.viewAllButtonLink,
        });
        continue;
      }

      if (sectionObj._type === 'ctaSection') {
        sectionsOut.push({
          _type: 'ctaSection',
          title: sectionObj.title,
          description: sectionObj.description,
          backgroundColor: sectionObj.backgroundColor,
          textColor: sectionObj.textColor,
          primaryButton: sectionObj.primaryButton,
          secondaryButton: sectionObj.secondaryButton,
        });
        continue;
      }
    }

    const pageDoc: SanityTopLevelDocument = {
      _id: pageDocId,
      _type: 'page',
      pageType: isHome ? 'home' : p.pageType || 'standard',
      title: p.title || (isHome ? 'Home' : slug),
      slug: { _type: 'slug', current: slug },
      clientId,
      sections: sectionsOut,
    };

    await client.createOrReplace(pageDoc);
  }

  // 4) Create/Update client doc
  const clientDocId = `client-${clientId}`;
  const clientDoc: SanityTopLevelDocument = {
    _id: clientDocId,
    _type: 'client',
    clientId,
    name:
      (typeof data.company?.name === 'string' && data.company.name) ||
      (typeof data.name === 'string' && data.name) ||
      (typeof data.client?.name === 'string' && data.client.name) ||
      clientId,
    domains,
    dataSource: 'sanity',
    enabledFeatures,
  };
  await client.createOrReplace(clientDoc);

  console.log(`[import] Done. Imported tenant '${clientId}' into dataset '${dataset}'.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
