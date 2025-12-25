'use client'

import * as React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'

interface ImageSliderProps {
  slides: Array<{
    image: string
    title?: string
    description?: string
    linkText?: string
    linkHref?: string
  }>
}

export function ImageSlider({ slides }: ImageSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  const plugin = React.useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: true,
    })
  )

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  if (!slides || slides.length === 0) {
    return null
  }

  // Header height is h-16 (4rem = 64px)
  const headerHeight = '4rem' // 64px

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: `calc(100vh - ${headerHeight})`,
        minHeight: `calc(100vh - ${headerHeight})`,
      }}
    >
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full h-full"
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent className="h-full ml-0 [&>div]:h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-full pl-0 basis-full">
              <div 
                className="relative w-full h-full" 
                style={{ 
                  height: `calc(100vh - ${headerHeight})`,
                  minHeight: `calc(100vh - ${headerHeight})`
                }}
              >
                {slide.image ? (
                  <img
                    src={slide.image}
                    alt={slide.title || `Slide ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ 
                      height: `calc(100vh - ${headerHeight})`,
                      minHeight: `calc(100vh - ${headerHeight})`,
                      width: '100%'
                    }}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div 
                    className="absolute inset-0 w-full h-full bg-linear-to-br from-primary/30 via-primary/20 to-accent/30 flex items-center justify-center"
                    style={{ 
                      height: `calc(100vh - ${headerHeight})`,
                      minHeight: `calc(100vh - ${headerHeight})`
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
                      {slide.linkText && slide.linkHref && (
                        <Button size="lg" variant="secondary" className="shadow-lg text-base md:text-lg px-6 md:px-8 py-3 md:py-4" asChild>
                          <Link href={slide.linkHref}>{slide.linkText}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="left-4 md:left-8 lg:left-12 size-10 md:size-12 cursor-pointer"
          onMouseEnter={() => plugin.current?.stop?.()}
          onMouseLeave={() => plugin.current?.play?.()}
        />
        <CarouselNext
          className="right-4 md:right-8 lg:right-12 size-10 md:size-12 cursor-pointer"
          onMouseEnter={() => plugin.current?.stop?.()}
          onMouseLeave={() => plugin.current?.play?.()}
        />
      </Carousel>
      
      {/* Dots indicator */}
      <div className="absolute bottom-6 md:bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 md:h-2.5 rounded-full transition-all ${
              index === current
                ? 'w-8 md:w-10 bg-white'
                : 'w-2 md:w-2.5 bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

