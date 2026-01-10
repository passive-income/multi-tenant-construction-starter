import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import Image from 'next/image';
import { normalizeImageSrc } from '@/lib/utils/image';

export const SanityImage = ({ src, alt }: { src: string | SanityImageSource; alt?: string }) => {
  const href = normalizeImageSrc(src, { width: 1200, autoFormat: true });

  if (!href) {
    return null;
  }

  return <Image src={href} alt={alt || ''} width={1200} height={675} className="w-full h-auto" />;
};
