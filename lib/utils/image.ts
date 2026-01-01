import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

/**
 * Normalize mixed image sources to a usable URL string or null.
 * - Trims empty strings
 * - Converts Sanity image objects using urlFor
 */
export function normalizeImageSrc(
  src: string | SanityImageSource | null | undefined,
  opts?: { width?: number; autoFormat?: boolean },
): string | null {
  if (!src) return null;
  if (typeof src === "string") {
    const s = src.trim();
    return s.length > 0 ? s : null;
  }
  try {
    let builder = urlFor(src as SanityImageSource);
    if (opts?.width) builder = builder.width(opts.width);
    if (opts?.autoFormat !== false) builder = builder.auto("format");
    return builder.url();
  } catch {
    return null;
  }
}
