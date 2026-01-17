import { ImageSliderLoading } from '@/components/loading/ImageSliderLoading';

export default function Loading() {
  return (
    <>
      {/* Hero/Main visual - most important above-the-fold content */}
      <ImageSliderLoading />

      {/* Generic content placeholder - minimal, won't cause layout shift */}
      <div className="container py-16 space-y-8">
        <div className="h-8 w-48 bg-muted/50 animate-pulse rounded mx-auto" />
        <div className="h-4 w-96 max-w-full bg-muted/30 animate-pulse rounded mx-auto" />
      </div>
    </>
  );
}
