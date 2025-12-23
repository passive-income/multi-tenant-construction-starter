import { Card, CardContent } from '@/components/ui/card'

export function HeroSectionsLoading() {
  return (
    <section className="container py-12 space-y-8">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-0 shadow-lg bg-muted/50 animate-pulse">
          <CardContent className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="h-4 w-32 bg-muted-foreground/20 rounded"></div>
                <div className="h-8 w-64 bg-muted-foreground/20 rounded"></div>
                <div className="h-4 w-full bg-muted-foreground/20 rounded"></div>
                <div className="h-10 w-40 bg-muted-foreground/20 rounded"></div>
              </div>
              <div className="h-64 md:h-96 bg-muted-foreground/20 rounded-lg"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}




