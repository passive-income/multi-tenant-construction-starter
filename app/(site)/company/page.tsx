import Image from 'next/image';
import { getSiteData } from '@/lib/data/streaming';
import { getHost } from '@/lib/utils/host';

// Cache for 5 minutes with stale-while-revalidate
export const revalidate = 300;

export default async function CompanyPage() {
  // Resolve tenant via Sanity first; fall back to static JSON file
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
      <h2 className="text-3xl mb-8 text-center">Unternehmen</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {(data.companyDetails || []).map((c: any) => (
          <div key={c.title} className="p-4 border rounded-lg bg-white">
            {typeof c.image === 'string' && c.image.trim().length > 0 && (
              <div className="w-full h-40 relative mb-4 rounded overflow-hidden">
                <Image
                  src={c.image.trim()}
                  alt={c.title}
                  fill
                  sizes="(max-width:640px) 100vw, 33vw"
                  quality={60}
                  className="object-cover"
                />
              </div>
            )}
            <h3 className="font-bold text-xl mb-1">{c.title}</h3>
            {c.subtitle && <h4 className="text-sm text-gray-600 mb-2">{c.subtitle}</h4>}
            <p className="text-sm text-gray-700">{c.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
