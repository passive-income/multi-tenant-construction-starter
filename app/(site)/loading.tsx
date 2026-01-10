import { ImageSliderLoading } from "@/components/loading/ImageSliderLoading";
import { HeroSectionsLoading } from "@/components/loading/HeroSectionsLoading";
import { CompanySectionLoading } from "@/components/loading/CompanySectionLoading";
import { ServicesLoading } from "@/components/loading/ServicesLoading";
import { ProjectsLoading } from "@/components/loading/ProjectsLoading";

export default function Loading() {
  return (
    <>
      {/* Image Slider Skeleton */}
      <ImageSliderLoading />
      
      {/* Hero Sections Skeleton */}
      <HeroSectionsLoading />
      
      {/* Company Section Skeleton */}
      <CompanySectionLoading />
      
      {/* Services Section Skeleton */}
      <ServicesLoading />
      
      {/* References/Projects Section Skeleton */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <div className="h-10 w-64 bg-muted animate-pulse rounded mx-auto mb-4"></div>
            <div className="h-6 w-48 bg-muted animate-pulse rounded mx-auto"></div>
          </div>
          <ProjectsLoading />
          <div className="text-center mt-8">
            <div className="h-12 w-56 bg-muted animate-pulse rounded mx-auto"></div>
          </div>
        </div>
      </section>
      
      {/* Contact CTA Section Skeleton */}
      <section className="py-16 bg-primary/10">
        <div className="container text-center">
          <div className="h-10 w-96 bg-muted animate-pulse rounded mx-auto mb-4"></div>
          <div className="h-6 w-full max-w-2xl bg-muted animate-pulse rounded mx-auto mb-8"></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-12 w-48 bg-muted animate-pulse rounded"></div>
            <div className="h-12 w-48 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </section>
    </>
  );
}
