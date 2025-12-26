#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "data", "static-mueller.json");
const OUT_DIR = path.join(ROOT, "public", "generated-maps");

const GEOAPIFY_KEY =
  process.env.GEOAPIFY_API_KEY || process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

async function ensureOutDir() {
  await fs.mkdir(OUT_DIR, { recursive: true });
}

function hashKey(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex").slice(0, 12);
}

async function geocode(query: string) {
  if (!GEOAPIFY_KEY) throw new Error("GEOAPIFY_API_KEY not set");
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&format=json&limit=1&apiKey=${GEOAPIFY_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocode request failed: ${res.status}`);
  const body = await res.json();
  const r = body.results && body.results[0];
  if (!r) return null;
  return {
    lat: r.lat,
    lon: r.lon,
    confidence: r.rank?.confidence ?? 0,
    result: r,
  };
}

function buildStaticMapUrl({ lat, lon }: { lat: number; lon: number }) {
  if (!GEOAPIFY_KEY) throw new Error("GEOAPIFY_API_KEY not set");
  const width = 600;
  const height = 300;
  const style = "osm-bright";
  const zoom = 16;
  const center = `lonlat:${lon},${lat}`;

  const params = new URLSearchParams();
  params.set("style", style);
  params.set("width", String(width));
  params.set("height", String(height));
  params.set("center", center);
  params.set("zoom", String(zoom));
  params.set("format", "png");
  params.set("apiKey", GEOAPIFY_KEY);
  // marker as a separate parameter; URLSearchParams will encode values correctly
  params.append(
    "marker",
    `lonlat:${lon},${lat};type:material;color:#ff0000;size:48`,
  );

  const url = `https://maps.geoapify.com/v1/staticmap?${params.toString()}`;
  return { url, width, height, style };
}

async function fetchAndSave(url: string, outFile: string) {
  console.log("Static map URL:", url);
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "<no-body>");
    throw new Error(
      `Static map fetch failed: ${res.status} ${res.statusText} - ${body}`,
    );
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(outFile, buffer);
}

function pickLatLonFromLocation(loc: any) {
  // Try several common shapes used in the repo
  if (!loc) return null;
  if (typeof loc.lat === "number" && typeof loc.lon === "number")
    return { lat: loc.lat, lon: loc.lon };
  if (
    loc.coordinates &&
    Array.isArray(loc.coordinates) &&
    loc.coordinates.length >= 2
  )
    return { lon: loc.coordinates[0], lat: loc.coordinates[1] };
  if (
    loc.address &&
    typeof loc.address.lat === "number" &&
    typeof loc.address.lon === "number"
  )
    return { lat: loc.address.lat, lon: loc.address.lon };
  return null;
}

function buildQueryFromLocation(loc: any) {
  if (!loc) return null;
  const addr = loc.address || {};
  const parts: string[] = [];
  if (addr.housenumber) parts.push(addr.housenumber);
  if (addr.street) parts.push(addr.street);
  if (addr.postcode) parts.push(addr.postcode);
  if (addr.city) parts.push(addr.city);
  if (addr.country) parts.push(addr.country);
  // fallback fields
  if (loc.title && parts.length === 0) parts.push(loc.title);
  if (parts.length === 0 && typeof loc === "string") parts.push(loc);
  return parts.join(", ");
}

async function processLocation(loc: any, index: number) {
  const label = loc.title || loc.name || `location-${index}`;
  console.log("Processing", label);

  let coords = pickLatLonFromLocation(loc);
  let source = coords ? "preset" : "geocode";

  if (!coords) {
    const q =
      buildQueryFromLocation(loc) ||
      (loc.address && loc.address.formatted) ||
      "";
    if (!q) throw new Error(`No address data available for ${label}`);
    console.log("Geocoding query:", q);
    const geo = await geocode(q);
    if (!geo) throw new Error(`Geocoding returned no results for: ${q}`);
    coords = { lat: geo.lat, lon: geo.lon };
    source = `geocode(confidence=${geo.confidence})`;
  }

  const mapSpec = buildStaticMapUrl(coords);
  const key = hashKey(
    `${coords.lat},${coords.lon}|${mapSpec.style}|${mapSpec.width}x${mapSpec.height}`,
  );
  const fileName = `${label.replace(/[^a-z0-9_-]/gi, "_")}-${key}.png`;
  const outPath = path.join(OUT_DIR, fileName);

  console.log("Fetching static map ->", outPath);
  await fetchAndSave(mapSpec.url, outPath);

  const meta = {
    label,
    source,
    lat: coords.lat,
    lon: coords.lon,
    mapUrl: mapSpec.url,
    file: `/generated-maps/${fileName}`,
    createdAt: new Date().toISOString(),
  };
  await fs.writeFile(
    path.join(OUT_DIR, `${fileName}.json`),
    JSON.stringify(meta, null, 2),
    "utf8",
  );

  console.log("Saved map and metadata for", label);
  return meta;
}

async function main() {
  if (!GEOAPIFY_KEY) {
    console.error(
      "GEOAPIFY_API_KEY or NEXT_PUBLIC_GEOAPIFY_API_KEY is required in env",
    );
    process.exit(2);
  }

  await ensureOutDir();
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const data = JSON.parse(raw);

  // try known shapes: footer.locations, locations, an array at top-level
  const candidates =
    data?.footer?.locations ||
    data?.locations ||
    data?.companies ||
    data?.sites ||
    [];
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new Error(
      "No locations array found in data/static-mueller.json (expected footer.locations or locations)",
    );
  }

  const results: any[] = [];
  for (let i = 0; i < candidates.length; i++) {
    try {
      // only generate for entries with an address or explicit lat/lon
      const loc = candidates[i];
      const hasAddress =
        loc.address || loc.street || loc.city || loc.lat || loc.lon;
      if (!hasAddress) continue;
      // generate one map per location
      const meta = await processLocation(loc, i);
      results.push(meta);
    } catch (err) {
      console.error(
        "Skipped location",
        i,
        err instanceof Error ? err.message : err,
      );
    }
  }

  console.log(
    "Done. Generated maps:",
    results.map((r: any) => r.file),
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
