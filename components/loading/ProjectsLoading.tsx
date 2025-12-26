import { Card } from "@/components/ui/card";

export function ProjectsLoading() {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12 space-y-4 animate-pulse">
          <div className="h-10 w-48 bg-muted-foreground/20 rounded mx-auto"></div>
          <div className="h-6 w-64 bg-muted-foreground/20 rounded mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="overflow-hidden p-0">
              <div className="aspect-square bg-muted-foreground/20 animate-pulse"></div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="h-12 w-64 bg-muted-foreground/20 rounded mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
