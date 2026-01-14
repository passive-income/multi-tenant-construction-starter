import { TestimonialCard } from '@/components/testimonial/TestimonialCard';
import { Card } from '@/components/ui/card';
import { getJsonData } from '@/lib/data/json';
import type { Testimonial } from '@/lib/types/testimonial';
import { getHost } from '@/lib/utils/host';
import { getClient } from '@/sanity/lib/client';
import { testimonialsQuery } from '@/sanity/queries';

interface TestimonialsSectionProps {
  clientId: string;
  dataset?: string;
}

export async function TestimonialsSection({
  clientId,
  dataset = 'production',
}: TestimonialsSectionProps) {
  const client = getClient(dataset);
  const host = await getHost();

  // detect if client is configured to use static JSON
  let intendedStatic = false;
  let staticFile = 'static-mueller.json';
  if (host) {
    try {
      const clientDoc = await client.fetch('*[_type == "client" && $host in domains][0]', { host });
      const ds = clientDoc?.dataSource || clientDoc?.type || null;
      if (ds === 'json' || ds === 'static') {
        intendedStatic = true;
        staticFile = clientDoc?.staticFileName || staticFile;
      }
    } catch (_e) {
      // ignore
    }
  }

  let testimonials: Testimonial[] = [];
  try {
    if (!intendedStatic) {
      testimonials = await client.fetch(testimonialsQuery, { clientId: clientId ?? null });
    }
  } catch (_e) {
    testimonials = [];
  }

  let sourceNote: string | null = null;

  if ((!testimonials || testimonials.length === 0) && intendedStatic) {
    // load intended static
    try {
      const json = await getJsonData(staticFile);
      testimonials = (json as any)?.testimonials || [];
      sourceNote = `Using static data (${staticFile})`;
    } catch (_e) {
      testimonials = [];
    }
  }

  if ((!testimonials || testimonials.length === 0) && !intendedStatic) {
    // fallback to repo static JSON
    try {
      const json = await getJsonData('static-mueller.json');
      testimonials = (json as any)?.testimonials || [];
      if (testimonials && testimonials.length > 0) {
        sourceNote = 'Using static JSON fallback (Sanity missing)';
      }
    } catch (_e) {
      testimonials = [];
    }
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center font-medium">Missing data in sanity</p>
      </Card>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {sourceNote && (
          <p className="text-sm text-muted-foreground text-center mb-4">{sourceNote}</p>
        )}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Kundenbewertungen</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Erfahren Sie, was unsere Kunden über unsere Arbeit sagen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard key={`testimonial-${idx}`} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
