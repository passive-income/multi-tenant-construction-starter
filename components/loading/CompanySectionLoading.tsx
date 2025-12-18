import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function CompanySectionLoading() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12 space-y-4 animate-pulse">
          <div className="h-12 w-96 bg-muted-foreground/20 rounded mx-auto"></div>
          <div className="h-6 w-64 bg-muted-foreground/20 rounded mx-auto"></div>
          <div className="h-4 w-full max-w-3xl bg-muted-foreground/20 rounded mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="h-6 w-48 bg-muted-foreground/20 rounded"></CardTitle>
                <CardDescription className="h-4 w-32 bg-muted-foreground/20 rounded"></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted-foreground/20 rounded"></div>
                  <div className="h-4 w-full bg-muted-foreground/20 rounded"></div>
                  <div className="h-4 w-3/4 bg-muted-foreground/20 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}


