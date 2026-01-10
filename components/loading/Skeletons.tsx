/**
 * Reusable skeleton components for consistent loading states
 */

export function CardSkeleton() {
  return (
    <div className="p-4 border rounded-lg bg-muted/50 animate-pulse">
      <div className="h-48 bg-muted rounded mb-4"></div>
      <div className="h-6 bg-muted rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-muted rounded mb-2"></div>
      <div className="h-4 bg-muted rounded mb-4 w-5/6"></div>
      <div className="h-10 w-32 bg-muted rounded"></div>
    </div>
  );
}

export function GridSkeleton({ items = 6, cols = 3 }: { items?: number; cols?: number }) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[cols] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="space-y-4 mb-12">
      <div className="h-10 w-64 bg-muted animate-pulse rounded mx-auto"></div>
      <div className="h-6 w-96 bg-muted animate-pulse rounded mx-auto"></div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-muted animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-12 w-96 bg-muted-foreground/20 rounded mx-auto"></div>
          <div className="h-6 w-64 bg-muted-foreground/20 rounded mx-auto"></div>
          <div className="h-12 w-40 bg-muted-foreground/20 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <section className="py-16">
      <div className="container">
        <PageHeaderSkeleton />
        <GridSkeleton items={6} cols={3} />
      </div>
    </section>
  );
}

export function DetailPageSkeleton() {
  return (
    <article className="container py-16 max-w-4xl">
      <div className="h-12 w-3/4 bg-muted animate-pulse rounded mb-4"></div>
      <div className="h-6 w-1/2 bg-muted animate-pulse rounded mb-8"></div>
      
      <div className="h-96 bg-muted animate-pulse rounded mb-8"></div>
      
      <div className="space-y-4">
        <div className="h-4 bg-muted animate-pulse rounded"></div>
        <div className="h-4 bg-muted animate-pulse rounded"></div>
        <div className="h-4 bg-muted animate-pulse rounded w-5/6"></div>
        <div className="h-4 bg-muted animate-pulse rounded"></div>
        <div className="h-4 bg-muted animate-pulse rounded w-4/5"></div>
      </div>
    </article>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
        <div className="h-12 w-full bg-muted animate-pulse rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
        <div className="h-12 w-full bg-muted animate-pulse rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
        <div className="h-32 w-full bg-muted animate-pulse rounded"></div>
      </div>
      <div className="h-12 w-32 bg-muted animate-pulse rounded"></div>
    </div>
  );
}
