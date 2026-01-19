import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSiteData } from '@/lib/data/streaming';
import { getHost } from '@/lib/utils/host';

// Cache for 5 minutes with stale-while-revalidate
export const revalidate = 300;

export default async function ServicesPage() {
  const host = await getHost();
  if (!host) {
    return <div>Host not found</div>;
  }
  const data = await getSiteData(host);
  if (!data) {
    return <div>No data found</div>;
  }
  return (
    <section className="container py-16 bg-gray-50">
      <h2 className="text-3xl mb-8 text-center">Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {(data.services || []).map((s: any) => (
          <div key={s.title} className="p-4 border rounded-lg">
            <h3 className="font-bold text-xl mb-2">{s.title}</h3>
            <p>{s.description}</p>
            {(() => {
              const slug = typeof s.slug === 'string' ? s.slug : s?.slug?.current;
              const href = slug ? `/services/${slug}` : undefined;
              return href ? (
                <div className="mt-4">
                  <Button asChild>
                    <Link href={href} aria-label={`Mehr zu ${s.title}`}>
                      Mehr erfahren
                    </Link>
                  </Button>
                </div>
              ) : null;
            })()}
          </div>
        ))}
      </div>
    </section>
  );
}
