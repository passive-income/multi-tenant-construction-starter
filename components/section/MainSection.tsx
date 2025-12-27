import { AnimatedSection } from "@/components/section/AnimatedSection";
import { ProjectGallery } from "@/components/ProjectGallery";
import { HeroSection } from "./HeroSection";
import { ImageSlider } from "@/components/image/ImageSlider";
import { BeforeAfterGridSection } from "@/components/before-after/BeforeAfterGridSection";
import CompanySection from "@/components/section/CompanySection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ServicesSection from "./ServicesSection";

interface MainSectionProps {
  data: any;
}

export function MainSection({ data }: MainSectionProps) {
  const sliderSlides = data.slider?.slides || [];
  const beforeAfterArray = data.slider?.beforeAfter || [];

  const makeItemsFromBeforeAfter = (arr: any[]) =>
    arr.map((it: any) => ({
      beforeSrc: it.before,
      afterSrc: it.after,
      beforeLabel: it.beforeLabel || "Vorher",
      afterLabel: it.afterLabel || "Nachher",
      title: it.title,
      subtitle: it.subtitle,
      minHeight: it.minHeight ?? 320,
    }));

  let beforeAfterItems: any[] = [];

  if (beforeAfterArray && beforeAfterArray.length > 0) {
    beforeAfterItems = makeItemsFromBeforeAfter(beforeAfterArray);
  } else {
    // No explicit before/after data provided — do not fall back to slider images.
    beforeAfterItems = [];
  }

  return (
    <main>
      {/* Image Slider - First Component */}
      <ImageSlider slides={sliderSlides} />

      {/* Hero Sections */}
      {data.heroSections && data.heroSections.length > 0 && (
        <section className="container py-12 space-y-8">
          {data.heroSections.map((hero: any, index: number) => (
            <HeroSection
              key={index}
              title={hero.title}
              subtitle={hero.subtitle}
              description={hero.description}
              linkText={hero.linkText}
              linkHref={hero.linkHref}
              imageUrl={hero.image}
              className={`bg-linear-to-r ${
                index % 3 === 0
                  ? "from-primary/10 to-primary/5"
                  : index % 3 === 1
                    ? "from-accent/10 to-accent/5"
                    : "from-secondary/10 to-secondary/5"
              }`}
            />
          ))}
        </section>
      )}

      {/* Before / After showcase (uses first two slider images) */}
      {beforeAfterItems.length > 0 && (
        <AnimatedSection className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Vorher / Nachher - Beispiele
              </h2>
              <p className="text-muted-foreground mt-2">
                Zwei verschiedene Paare nebeneinander.
              </p>
            </div>
            <BeforeAfterGridSection items={beforeAfterItems} columns={2} gap="1rem" />
          </div>
        </AnimatedSection>
      )}

      <CompanySection
        company={data.company}
        companySections={data.companySections}
      />

      {/* Services Section */}
      <ServicesSection services={data.services} />

      {/* Special Services Highlight */}
      {data.specialServices && data.specialServices.length > 0 && (
        <AnimatedSection className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.specialServices.map((service: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{service.description}</p>
                    {service.features && service.features.length > 0 && (
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-4">
                        {service.features.map(
                          (feature: string, idx: number) => (
                            <li
                              key={idx}
                              dangerouslySetInnerHTML={{ __html: feature }}
                            />
                          ),
                        )}
                      </ul>
                    )}
                    {service.description2 && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {service.description2}
                      </p>
                    )}
                    {service.linkText && service.linkHref && (
                      <Button variant="outline" asChild>
                        <Link href={service.linkHref}>{service.linkText}</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* References Section */}
      <AnimatedSection className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Referenzen</h2>
            <p className="text-muted-foreground">
              Von der Idee, bis zur Umsetzung!
            </p>
          </div>

          <div className="mb-8">
            <ProjectGallery
              images={data.projects.map((p: any) => p.images).flat()}
            />
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/projects">Alle Referenzen anzeigen</Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Contact CTA Section */}
      {data.contact && (
        <AnimatedSection className="py-16 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {data.contact.ctaTitle || "ERHALTEN SIE IHR ANGEBOT"}
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              {data.contact.ctaDescription ||
                "Haben Sie eine Idee, einen Wunsch? Wir können Ihnen helfen diesen umzusetzen! Nehmen Sie Kontakt zu uns auf und wir helfen und beraten Sie gerne!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {data.contact.ctaButtonText && data.contact.ctaButtonHref && (
                <Button size="lg" variant="secondary" asChild>
                  <Link href={data.contact.ctaButtonHref}>
                    {data.contact.ctaButtonText}
                  </Link>
                </Button>
              )}
              {data.contact.secondaryButtonText &&
                data.contact.secondaryButtonHref && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                    asChild
                  >
                    <Link href={data.contact.secondaryButtonHref}>
                      {data.contact.secondaryButtonText}
                    </Link>
                  </Button>
                )}
            </div>
          </div>
        </AnimatedSection>
      )}
    </main>
  );
}
