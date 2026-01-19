'use client';

import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { normalizeImageSrc } from '@/lib/utils/image';

interface SlideItem {
  image?: string | SanityImageSource | null;
  title?: string;
  description?: string;
  linkText?: string;
  linkHref?: string;
}

interface ImageSliderClientProps {
  slides: Array<SlideItem>;
  headerHeight: string;
}

export function ImageSliderClient({ slides, headerHeight }: ImageSliderClientProps) {
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);
  const [carouselMod, setCarouselMod] = React.useState<any>(null);
  const [plugin, setPlugin] = React.useState<any>(null);

  // Load carousel module
  React.useEffect(() => {
    (async () => {
      try {
        const mod = await import('@/components/ui/carousel');
        setCarouselMod(mod);
      } catch (_e) {
        // ignore
      }
    })();
  }, []);

  // Load autoplay plugin and set into state so Carousel re-renders with it
  React.useEffect(() => {
    if (!carouselMod) return;
    let mounted = true;
    const timeoutId = setTimeout(() => {
      (async () => {
        try {
          const mod = await import('embla-carousel-autoplay');
          const Autoplay = mod?.default ?? mod;
          const instance = Autoplay({ delay: 5000, stopOnInteraction: true });
          if (mounted) setPlugin(instance);
        } catch (_e) {
          // ignore
        }
      })();
    }, 500);
    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      try {
        setPlugin((p: any) => {
          p?.stop?.();
          return null;
        });
      } catch {}
    };
  }, [carouselMod]);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!carouselMod) return null;

  const { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } = carouselMod;

  return (
    <>
      <Carousel
        setApi={setApi}
        plugins={plugin ? [plugin] : []}
        className="w-full h-full"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent className="h-full ml-0 [&>div]:h-full">
          {slides.map((slide, index) => {
            const normalizedSrc = normalizeImageSrc(slide.image, { width: 1920 });

            return (
              <CarouselItem key={index} className="h-full pl-0 basis-full">
                <div
                  className="relative w-full h-full"
                  style={{
                    height: `calc(100dvh - ${headerHeight})`,
                    minHeight: `calc(100dvh - ${headerHeight})`,
                  }}
                >
                  {normalizedSrc ? (
                    <Image
                      src={normalizedSrc}
                      alt={slide.title || `Slide ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      quality={55}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 w-full h-full bg-linear-to-br from-primary/30 via-primary/20 to-accent/30 flex items-center justify-center"
                      style={{
                        height: `calc(100dvh - ${headerHeight})`,
                        minHeight: `calc(100dvh - ${headerHeight})`,
                      }}
                    >
                      <div className="text-center text-muted-foreground">
                        <p className="text-sm">Bild nicht verfügbar</p>
                      </div>
                    </div>
                  )}

                  {(slide.title || slide.description || slide.linkText) && (
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/30 flex items-end justify-center pb-16 md:pb-24 lg:pb-32">
                      <div className="text-center text-white px-4 max-w-4xl mb-8">
                        {slide.title && (
                          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 drop-shadow-lg">
                            {slide.title}
                          </h2>
                        )}
                        {slide.description && (
                          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 md:mb-8 drop-shadow-md">
                            {slide.description}
                          </p>
                        )}
                        {slide.linkText &&
                          typeof slide.linkHref === 'string' &&
                          slide.linkHref.trim().length > 0 && (
                            <Button
                              size="lg"
                              variant="secondary"
                              className="shadow-lg text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
                              asChild
                            >
                              <Link href={slide.linkHref}>{slide.linkText}</Link>
                            </Button>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious
          className="left-4 md:left-8 lg:left-12 size-10 md:size-12 cursor-pointer"
          onMouseEnter={() => {
            try {
              plugin?.stop?.();
            } catch {}
          }}
          onMouseLeave={() => {
            try {
              plugin?.play?.();
            } catch {}
          }}
        />
        <CarouselNext
          className="right-4 md:right-8 lg:right-12 size-10 md:size-12 cursor-pointer"
          onMouseEnter={() => {
            try {
              plugin?.stop?.();
            } catch {}
          }}
          onMouseLeave={() => {
            try {
              plugin?.play?.();
            } catch {}
          }}
        />
      </Carousel>

      {/* Dots indicator */}
      <div className="absolute bottom-6 md:bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className="slider-dot-button transition-colors"
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span
              className={`slider-dot ${
                index === current ? 'slider-dot-active' : 'slider-dot-inactive'
              }`}
            />
          </button>
        ))}
      </div>
    </>
  );
}
