'use client';

import dynamic from 'next/dynamic';

interface SlideItem {
  image?: any;
  title?: string;
  description?: string;
  linkText?: string;
  linkHref?: string;
}

interface ImageSliderWrapperProps {
  slides: Array<SlideItem>;
  headerHeight: string;
}

const ImageSliderClient = dynamic(
  () => import('./ImageSliderClient').then((m) => m.ImageSliderClient),
  { ssr: false },
);

export function ImageSliderWrapper({ slides, headerHeight }: ImageSliderWrapperProps) {
  return <ImageSliderClient slides={slides} headerHeight={headerHeight} />;
}
