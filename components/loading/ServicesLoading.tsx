import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ServicesLoading() {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12 space-y-4 animate-pulse">
          <div className="h-10 w-64 bg-muted-foreground/20 rounded mx-auto"></div>
          <div className="h-6 w-96 bg-muted-foreground/20 rounded mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="hover:shadow-lg">
              <CardHeader>
                <CardTitle className="h-6 w-32 bg-muted-foreground/20 rounded"></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-muted-foreground/20 rounded"></div>
                  <div className="h-4 w-5/6 bg-muted-foreground/20 rounded"></div>
                </div>
                <div className="h-10 w-full bg-muted-foreground/20 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
