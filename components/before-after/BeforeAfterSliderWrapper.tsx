'use client';

import dynamic from 'next/dynamic';
import { BeforeAfterSlider } from './BeforeAfterSlider';

const BeforeAfterSliderClient = dynamic(() => Promise.resolve({ default: BeforeAfterSlider }), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-muted rounded-xl shadow-lg" style={{ minHeight: '360px' }} />
  ),
});

interface BeforeAfterSliderWrapperProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  minHeight?: number;
  labelScale?: number;
}

export function BeforeAfterSliderWrapper({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  className,
  minHeight,
  labelScale,
}: BeforeAfterSliderWrapperProps) {
  return (
    <BeforeAfterSliderClient
      beforeSrc={beforeSrc}
      afterSrc={afterSrc}
      beforeLabel={beforeLabel}
      afterLabel={afterLabel}
      className={className}
      minHeight={minHeight}
      labelScale={labelScale}
    />
  );
}
