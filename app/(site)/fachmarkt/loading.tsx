export default function Loading() {
  return (
    <section className="container py-16">
      <div className="animate-pulse">
        {/* Page placeholder - minimal skeleton for placeholder pages */}
        <div className="h-8 w-64 bg-muted rounded mx-auto mb-8"></div>
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="h-4 w-full bg-muted rounded"></div>
          <div className="h-4 w-5/6 bg-muted rounded"></div>
          <div className="h-4 w-4/6 bg-muted rounded"></div>
        </div>
      </div>
    </section>
  );
}
