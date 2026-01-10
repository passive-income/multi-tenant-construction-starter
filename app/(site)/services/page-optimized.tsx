import { Suspense } from "react";
import { getHost } from "@/lib/utils/host";
import { getServices } from "@/lib/data/streaming";
import { ServicesLoading } from "@/components/loading/ServicesLoading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type ServiceLike = {
  _id?: string;
  slug?: string | { current?: string };
  image?: string;
  title?: string;
  description?: string;
};

// Individual service card as async component (can fetch individually if needed)
async function ServiceCard({ service }: { service: ServiceLike }) {
  const slug = typeof service.slug === "string" ? service.slug : service?.slug?.current;
  const href = slug ? `/services/${slug}` : undefined;
  
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      {service.image && (
        <div className="w-full h-48 relative mb-4 rounded overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <h3 className="font-bold text-xl mb-2">{service.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
      {href && (
        <Button asChild variant="outline" size="sm">
          <Link href={href} aria-label={`Mehr zu ${service.title}`}>
            Mehr erfahren
          </Link>
        </Button>
      )}
    </div>
  );
}

// Main services grid - async component
async function ServicesGrid() {
  const host = (await getHost()) ?? "";
  const services = (await getServices(host)) as ServiceLike[];
  
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Keine Leistungen verfügbar</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, index: number) => (
        <Suspense
          key={service._id || service.slug || index}
          fallback={
            <div className="p-4 border rounded-lg bg-muted/50 animate-pulse">
              <div className="h-48 bg-muted rounded mb-4"></div>
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded mb-4"></div>
              <div className="h-10 w-32 bg-muted rounded"></div>
            </div>
          }
        >
          <ServiceCard service={service} />
        </Suspense>
      ))}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <section className="container py-16">
      <h1 className="text-4xl font-bold mb-2 text-center">Unsere Leistungen</h1>
      <p className="text-center text-muted-foreground mb-12">
        Professionelle Bau- und Renovierungsarbeiten
      </p>
      
      <Suspense fallback={<ServicesLoading />}>
        <ServicesGrid />
      </Suspense>
    </section>
  );
}
