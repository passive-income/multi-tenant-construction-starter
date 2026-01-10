export default function Loading() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="h-10 w-96 bg-muted animate-pulse rounded mx-auto mb-4"></div>
          <div className="h-6 w-full max-w-2xl bg-muted animate-pulse rounded mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Info Card */}
          <div className="space-y-6">
            <div className="p-6 border rounded-lg bg-muted/50 animate-pulse">
              <div className="h-8 w-48 bg-muted rounded mb-6"></div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-6 w-6 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-4 w-48 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-6 w-6 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-4 w-48 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-6 w-6 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-4 w-full bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map skeleton */}
            <div className="h-64 bg-muted animate-pulse rounded-lg"></div>
          </div>

          {/* Contact Form */}
          <div className="space-y-6">
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
            <div className="h-12 w-full bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
