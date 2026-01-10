import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const DEFAULT_STYLE = 'osm-bright';
const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 300;
const DEFAULT_ZOOM = 16;

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

function _slugifyName(name: string) {
  return (
    name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'location'
  );
}

function _pickLatLonFromLocation(loc: any) {
  if (!loc) return null;
  if (typeof loc.lat === 'number' && typeof loc.lon === 'number')
    return { lat: loc.lat, lon: loc.lon };
  if (loc.coordinates && Array.isArray(loc.coordinates) && loc.coordinates.length >= 2)
    return { lon: loc.coordinates[0], lat: loc.coordinates[1] };
  if (loc.address && typeof loc.address.lat === 'number' && typeof loc.address.lon === 'number')
    return { lat: loc.address.lat, lon: loc.address.lon };
  return null;
}

function _buildQueryFromLocation(loc: any) {
  if (!loc) return '';
  const addr = loc.address || {};
  const parts: string[] = [];
  if (addr.housenumber) parts.push(addr.housenumber);
  if (addr.street) parts.push(addr.street);
  if (addr.postcode) parts.push(addr.postcode);
  if (addr.city) parts.push(addr.city);
  if (addr.country) parts.push(addr.country);
  if (loc.title && parts.length === 0) parts.push(loc.title);
  if (parts.length === 0 && typeof loc === 'string') parts.push(loc);
  return parts.join(', ');
}

async function geocode(query: string, apiKey: string) {
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&format=json&limit=1&apiKey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => '<no-body>');
    throw new Error(`Geocode request failed: ${res.status} ${body}`);
  }
  const body = await res.json();
  const r = body.results?.[0];
  if (!r) return null;
  return {
    lat: r.lat,
    lon: r.lon,
    confidence: r.rank?.confidence ?? 0,
    result: r,
  };
}

function buildStaticMapUrl({ lat, lon }: { lat: number; lon: number }, apiKey: string) {
  const params = new URLSearchParams();
  params.set('style', DEFAULT_STYLE);
  params.set('width', String(DEFAULT_WIDTH));
  params.set('height', String(DEFAULT_HEIGHT));
  params.set('center', `lonlat:${lon},${lat}`);
  params.set('zoom', String(DEFAULT_ZOOM));
  params.set('format', 'png');
  params.set('apiKey', apiKey);
  params.append('marker', `lonlat:${lon},${lat};type:material;color:#ff0000;size:48`);
  return `https://maps.geoapify.com/v1/staticmap?${params.toString()}`;
}

async function fetchAndSave(url: string, outFile: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => '<no-body>');
    throw new Error(`Static map fetch failed: ${res.status} ${res.statusText} - ${body}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(outFile, buffer);
}

export async function GET(req: Request) {
  try {
    const apiKey = process.env.GEOAPIFY_API_KEY || process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
    if (!apiKey)
      return NextResponse.json({ error: 'Geoapify API key not configured' }, { status: 500 });

    const url = new URL(req.url);
    const providedAddress = url.searchParams.get('address') || '';
    const clientId = url.searchParams.get('clientId') || 'default';

    if (!providedAddress) {
      return NextResponse.json({ error: 'No address provided' }, { status: 400 });
    }

    const fileBase = `${clientId}-map`;

    const cacheDir = path.join(process.cwd(), 'public', 'generated-maps');
    await ensureDir(cacheDir);

    const fileName = `${fileBase}.png`;
    const pngPath = path.join(cacheDir, fileName);
    const metaPath = path.join(cacheDir, `${fileBase}.json`);

    // serve cached without calling geocoding
    try {
      const stat = await fs.stat(pngPath);
      if (stat && stat.size > 0) {
        const meta = await fs
          .readFile(metaPath, 'utf8')
          .then((m) => JSON.parse(m))
          .catch(() => undefined);
        return NextResponse.json({
          url: `/generated-maps/${fileName}`,
          meta,
          cache: true,
        });
      }
    } catch (_) {
      // miss; proceed
    }

    // resolve coordinates (only when no cached map exists)
    let lat: number | undefined;
    let lon: number | undefined;
    let geoDebug: any = null;

    const queries = [providedAddress];
    if (providedAddress && !/germany/i.test(providedAddress))
      queries.push(`${providedAddress}, Germany`);

    for (const q of queries) {
      const g = await geocode(q, apiKey).catch((e) => {
        geoDebug = { query: q, error: String(e) };
        return null;
      });
      if (g?.lat && g?.lon) {
        lat = g.lat;
        lon = g.lon;
        geoDebug = { query: q, confidence: g.confidence };
        break;
      }
    }

    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return NextResponse.json({ error: 'No coordinates found', debug: geoDebug }, { status: 404 });
    }

    // fetch static map
    const staticMapUrl = buildStaticMapUrl({ lat, lon }, apiKey);
    try {
      await fetchAndSave(staticMapUrl, pngPath);

      // Verify the file was actually saved and has content
      const stat = await fs.stat(pngPath).catch(() => null);
      if (!stat || stat.size === 0) {
        throw new Error('Map image file was not saved or is empty');
      }

      const meta = {
        address: providedAddress,
        lat,
        lon,
        generatedAt: new Date().toISOString(),
        staticMapUrl,
        clientId,
      };
      await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf8');
      console.log(
        `[Map API] Generated and saved map for clientId: ${clientId}, file size: ${stat.size} bytes`,
      );
      return NextResponse.json({ url: `/generated-maps/${fileName}`, meta });
    } catch (e: any) {
      console.error(`[Map API] Failed to generate map for clientId: ${clientId}`, e);
      return NextResponse.json(
        {
          error: 'Failed to fetch static map',
          detail: String(e),
          mapUrl: staticMapUrl,
        },
        { status: 500 },
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'Unhandled server error',
        detail: String(err),
        stack: err?.stack,
      },
      { status: 500 },
    );
  }
}
