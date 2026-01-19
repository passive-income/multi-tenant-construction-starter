import { Award, Calendar } from 'lucide-react';
import Link from 'next/link';
import { BeforeAfterGridSection } from '@/components/before-after/BeforeAfterGridSection';
import { FAQAccordion } from '@/components/faq/FAQAccordion';
import { ImageSlider } from '@/components/image/ImageSlider';
import { ProjectGallery } from '@/components/ProjectGallery';
import { AnimatedSection } from '@/components/section/AnimatedSection';
import CompanySection from '@/components/section/CompanySection';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { TestimonialCard } from '@/components/testimonial/TestimonialCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, Card as CertCard } from '@/components/ui/card';
import type { Certification } from '@/lib/types/certification';
import type { TeamMember } from '@/lib/types/teamMember';
import type { Testimonial } from '@/lib/types/testimonial';
import { HeroSection } from './HeroSection';
import ServicesSection from './ServicesSection';

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
      beforeLabel: it.beforeLabel || 'Vorher',
      afterLabel: it.afterLabel || 'Nachher',
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
    <>
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
                  ? 'from-primary/10 to-primary/5'
                  : index % 3 === 1
                    ? 'from-accent/10 to-accent/5'
                    : 'from-secondary/10 to-secondary/5'
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
              <h2 className="text-3xl md:text-4xl font-bold">Vorher / Nachher - Beispiele</h2>
              <p className="text-muted-foreground mt-2">Zwei verschiedene Paare nebeneinander.</p>
            </div>
            <BeforeAfterGridSection items={beforeAfterItems} columns={2} gap="1rem" />
          </div>
        </AnimatedSection>
      )}

      <CompanySection company={data.company} companySections={data.companySections} />

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
                    <CardTitle>
                      {typeof service.title === 'string'
                        ? service.title
                        : service.title?.text || 'Untitled'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      {typeof service.description === 'string'
                        ? service.description
                        : service.description?.text || ''}
                    </p>
                    {service.features && service.features.length > 0 && (
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground mb-4">
                        {service.features.map((feature: string, idx: number) => (
                          <li key={idx} dangerouslySetInnerHTML={{ __html: feature }} />
                        ))}
                      </ul>
                    )}
                    {service.description2 && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {typeof service.description2 === 'string'
                          ? service.description2
                          : service.description2?.text || ''}
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
            <p className="text-muted-foreground">Von der Idee, bis zur Umsetzung!</p>
          </div>

          <div className="mb-8">
            <ProjectGallery images={data.projects.flatMap((p: any) => p.images)} />
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/projects">Alle Referenzen anzeigen</Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      {data.testimonials && data.testimonials.length > 0 && (
        <AnimatedSection className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Was unsere Kunden sagen</h2>
              <p className="text-muted-foreground">
                Erfahrungen und Bewertungen zufriedener Kunden
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.testimonials
                .filter((t: Testimonial) => t.featured)
                .slice(0, 3)
                .map((testimonial: Testimonial, idx: number) => (
                  <TestimonialCard key={idx} testimonial={testimonial} />
                ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Team Section */}
      {data.teamMembers && data.teamMembers.length > 0 && (
        <AnimatedSection className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Unser Team</h2>
              <p className="text-muted-foreground">
                Lernen Sie die Experten kennen, die Ihr Projekt zum Erfolg führen
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.teamMembers.map((member: TeamMember, idx: number) => (
                <TeamMemberCard key={idx} member={member} />
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Certifications Section */}
      {data.certifications && data.certifications.length > 0 && (
        <AnimatedSection className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Zertifizierungen & Qualifikationen
              </h2>
              <p className="text-muted-foreground">
                Unsere Zertifikate bestätigen unsere hohen Qualitätsstandards
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.certifications.map((cert: Certification, idx: number) => {
                const isExpired = cert.validUntil && new Date(cert.validUntil) < new Date();
                return (
                  <CertCard key={idx} className="p-6 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold">{cert.name}</h3>
                        {isExpired && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                            Abgelaufen
                          </span>
                        )}
                        {!isExpired && cert.validUntil && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            Gültig
                          </span>
                        )}
                      </div>
                      {cert.issuer && (
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Award className="h-4 w-4 mr-2" />
                          <span>{cert.issuer}</span>
                        </div>
                      )}
                      {cert.description && (
                        <p className="text-sm text-muted-foreground mb-4">{cert.description}</p>
                      )}
                      {cert.certificateNumber && (
                        <p className="text-xs text-muted-foreground mb-3">
                          Zertifikat-Nr.: {cert.certificateNumber}
                        </p>
                      )}
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {cert.validFrom && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-2" />
                            <span>
                              Gültig ab: {new Date(cert.validFrom).toLocaleDateString('de-DE')}
                            </span>
                          </div>
                        )}
                        {cert.validUntil && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-2" />
                            <span>
                              Gültig bis: {new Date(cert.validUntil).toLocaleDateString('de-DE')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CertCard>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* FAQ Section */}
      {data.faqs && data.faqs.length > 0 && (
        <AnimatedSection className="py-16 bg-white">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Häufig gestellte Fragen</h2>
              <p className="text-muted-foreground">Antworten auf die wichtigsten Fragen</p>
            </div>
            <FAQAccordion faqs={data.faqs} showSearch={false} />
          </div>
        </AnimatedSection>
      )}

      {/* Contact CTA Section */}
      {data.contact && (
        <AnimatedSection className="py-16 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {data.contact.ctaTitle || 'ERHALTEN SIE IHR ANGEBOT'}
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              {data.contact.ctaDescription ||
                'Haben Sie eine Idee, einen Wunsch? Wir können Ihnen helfen diesen umzusetzen! Nehmen Sie Kontakt zu uns auf und wir helfen und beraten Sie gerne!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {data.contact.ctaButtonText && data.contact.ctaButtonHref && (
                <Button size="lg" variant="secondary" asChild>
                  <Link href={data.contact.ctaButtonHref}>{data.contact.ctaButtonText}</Link>
                </Button>
              )}
              {data.contact.secondaryButtonText && data.contact.secondaryButtonHref && (
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
    </>
  );
}
