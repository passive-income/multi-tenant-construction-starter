import React from "react";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { normalizeImageSrc } from "@/lib/utils/image";

export function PreloadLCPImage({ src }: { src: string | SanityImageSource }) {
  // Normalize to a usable URL string, else return null
  const href = normalizeImageSrc(src, { width: 1600 });

  if (!href) return null;

  let origin: string | null = null;
  try {
    origin = new URL(href).origin;
  } catch {
    origin = null;
  }

  return (
    <>
      <link rel="preload" as="image" href={href} fetchPriority="high" />
      {origin && <link rel="preconnect" href={origin} crossOrigin="anonymous" />}
    </>
  );
}

export default PreloadLCPImage
