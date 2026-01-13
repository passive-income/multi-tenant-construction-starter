'use client';

import Link from 'next/link';
import { BeforeAfterGridSection } from '@/components/before-after/BeforeAfterGridSection';
import { ImageSlider } from '@/components/image/ImageSlider';
import { ProjectGallery } from '@/components/ProjectGallery';
import { AnimatedSection } from '@/components/section/AnimatedSection';
import CompanySection from '@/components/section/CompanySection';
import { HeroSection } from '@/components/section/HeroSection';
import ServicesSection from '@/components/section/ServicesSection';
import { TestSection } from '@/components/section/TestSection';
import { Button } from '@/components/ui/button';

interface SectionRendererProps {
  sections: any[];
  enabledFeatures?: string[];
}

export function SectionRenderer({ sections, enabledFeatures }: SectionRendererProps) {
  if (!sections || sections.length === 0) {
    return null;
  }

  // Filter sections if enabledFeatures is provided
  const filteredSections =
    enabledFeatures && enabledFeatures.length > 0
      ? sections.filter((section) => !section._type || enabledFeatures.includes(section._type))
      : sections;

  return (
    <>
      {filteredSections.map((section, index) => {
        if (!section._type) return null;
        const sectionKey =
          (section as any)._key || (section as any)._id || `section-${section._type}-${index}`;

        switch (section._type) {
          case 'imageSliderSection':
            return (
              <ImageSlider
                key={sectionKey}
                slides={
                  section.slides?.map((slide: any) => ({
                    image: slide.image,
                    caption: slide.caption,
                  })) || []
                }
              />
            );

          case 'heroSection':
            return (
              <section key={sectionKey} className="container py-12 space-y-8">
                <HeroSection
                  title={section.title}
                  subtitle={section.subtitle}
                  description={section.description}
                  imageUrl={section.image}
                  linkText={section.linkText}
                  linkHref={section.linkHref}
                  className={`bg-linear-to-r ${
                    index % 3 === 0
                      ? 'from-primary/10 to-primary/5'
                      : index % 3 === 1
                        ? 'from-accent/10 to-accent/5'
                        : 'from-secondary/10 to-secondary/5'
                  }`}
                />
              </section>
            );

          case 'beforeAfterSection':
            return (
              <AnimatedSection key={sectionKey} className="py-16 bg-white">
                <div className="container">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold">{section.title}</h2>
                    {section.description && (
                      <p className="text-muted-foreground mt-2">{section.description}</p>
                    )}
                  </div>
                  <BeforeAfterGridSection
                    items={
                      section.pairs?.map((pair: any) => ({
                        beforeSrc: pair.before,
                        afterSrc: pair.after,
                        beforeLabel: 'Vorher',
                        afterLabel: 'Nachher',
                        title: pair.title,
                        subtitle: pair.subtitle,
                        minHeight: 320,
                      })) || []
                    }
                    columns={section.columns || 2}
                    gap={section.gap || '1rem'}
                  />
                </div>
              </AnimatedSection>
            );

          case 'companySection': {
            const subsections =
              section.subsections?.map((sub: any) => ({
                title: sub.title,
                description: sub.description,
                icon: sub.icon,
              })) || [];

            return (
              <CompanySection
                key={sectionKey}
                company={{
                  name: section.title,
                  logoText: section.title,
                  description: section.description,
                }}
                companySections={subsections}
              />
            );
          }

          case 'servicesSection':
            return (
              <ServicesSection
                key={sectionKey}
                services={section.services || []}
                title={section.title}
                description={section.description}
              />
            );

          case 'projectsSection': {
            const projects =
              section.projects?.map((ref: any) => ({
                ...ref,
              })) || [];

            return (
              <AnimatedSection key={index} className="py-16 bg-white">
                <div className="container">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.title}</h2>
                    {section.description && (
                      <p className="text-muted-foreground">{section.description}</p>
                    )}
                  </div>

                  {projects.length > 0 && (
                    <div className="mb-8">
                      <ProjectGallery images={projects.flatMap((p: any) => p.images || [])} />
                    </div>
                  )}

                  {section.showViewAllButton && (
                    <div className="text-center">
                      <Button size="lg" variant="outline" asChild>
                        <Link href={section.viewAllButtonLink || '/projects'}>
                          {section.viewAllButtonText || 'Alle Referenzen anzeigen'}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            );
          }

          case 'ctaSection':
            return (
              <AnimatedSection
                key={index}
                className={`py-16 ${section.backgroundColor || 'bg-primary'} ${section.textColor || 'text-primary-foreground'}`}
              >
                <div className="container text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.title}</h2>
                  {section.description && (
                    <p className="text-lg mb-8 max-w-2xl mx-auto">{section.description}</p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {section.primaryButton?.text && section.primaryButton?.href && (
                      <Button size="lg" variant="secondary" asChild>
                        <Link href={section.primaryButton.href}>{section.primaryButton.text}</Link>
                      </Button>
                    )}
                    {section.secondaryButton?.text && section.secondaryButton?.href && (
                      <Button
                        size="lg"
                        variant="outline"
                        className={`${section.backgroundColor || 'bg-primary'}-foreground/20 border-current text-current hover:${section.backgroundColor || 'bg-primary'}-foreground/10`}
                        asChild
                      >
                        <Link href={section.secondaryButton.href}>
                          {section.secondaryButton.text}
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            );

          case 'testSection':
            return (
              <TestSection
                key={sectionKey}
                title={section.title}
                message={section.message}
                backgroundColor={section.backgroundColor}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
}
