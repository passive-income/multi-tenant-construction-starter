import Link from 'next/link';
import { AnimatedSection } from '@/components/section/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ServicesSectionProps {
  services?: any[];
  title?: string;
  description?: string;
}

export default function ServicesSection({
  services = [],
  title = 'UNSERE LEISTUNGEN',
  description = 'Von der Idee bis zur Umsetzung an Ihrer Seite!',
}: ServicesSectionProps) {
  if (!services || services.length === 0) return null;

  return (
    <AnimatedSection className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((s: any, idx: number) => (
            <Card key={s._id ?? s.slug ?? idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{s.description}</CardDescription>
                <Button variant="ghost" className="mt-4 w-full" asChild>
                  <Link href="/services">Mehr erfahren</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/services">Alle Leistungen anzeigen</Link>
          </Button>
        </div>
      </div>
    </AnimatedSection>
  );
}
