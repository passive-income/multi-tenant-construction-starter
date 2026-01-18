import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { normalizeImageSrc } from '@/lib/utils/image';
import { ImageSliderWrapper } from './ImageSliderWrapper';

interface SlideItem {
  image?: string | SanityImageSource | null;
  title?: string;
  description?: string;
  linkText?: string;
  linkHref?: string;
}

interface ImageSliderProps {
  slides: Array<SlideItem>;
}

export function ImageSlider({ slides }: ImageSliderProps) {
  if (!slides || slides.length === 0) {
    return null;
  }

  const headerHeight = '4rem'; // 64px

  // Pre-render first slide for immediate LCP
  const firstSlide = slides[0];
  const firstSlideNormalizedSrc = normalizeImageSrc(firstSlide?.image, { width: 1920 });

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: `calc(100dvh - ${headerHeight})`,
        minHeight: `calc(100dvh - ${headerHeight})`,
      }}
    >
      {/* Static first slide - SSR for LCP */}
      {firstSlideNormalizedSrc && (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            height: `calc(100dvh - ${headerHeight})`,
            minHeight: `calc(100dvh - ${headerHeight})`,
          }}
        >
          <Image
            src={firstSlideNormalizedSrc}
            alt={firstSlide.title || 'Hero image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            loading="eager"
            quality={55}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {(firstSlide.title || firstSlide.description || firstSlide.linkText) && (
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/30 flex items-end justify-center pb-16 md:pb-24 lg:pb-32">
              <div className="text-center text-white px-4 max-w-4xl mb-8">
                {firstSlide.title && (
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 drop-shadow-lg">
                    {firstSlide.title}
                  </h2>
                )}
                {firstSlide.description && (
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 md:mb-8 drop-shadow-md">
                    {firstSlide.description}
                  </p>
                )}
                {firstSlide.linkText &&
                  typeof firstSlide.linkHref === 'string' &&
                  firstSlide.linkHref.trim().length > 0 && (
                    <Button
                      size="lg"
                      variant="secondary"
                      className="shadow-lg text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
                      asChild
                    >
                      <Link href={firstSlide.linkHref}>{firstSlide.linkText}</Link>
                    </Button>
                  )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Client-side carousel - loads after hydration */}
      <ImageSliderWrapper slides={slides} headerHeight={headerHeight} />
    </div>
  );
}
