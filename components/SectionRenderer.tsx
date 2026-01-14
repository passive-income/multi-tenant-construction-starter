import Link from 'next/link';
import { BeforeAfterGridSection } from '@/components/before-after/BeforeAfterGridSection';
import { ImageSlider } from '@/components/image/ImageSlider';
import { ProjectGallery } from '@/components/ProjectGallery';
import { AnimatedSection } from '@/components/section/AnimatedSection';
import { CertificationsSection } from '@/components/section/CertificationsSection';
import CompanySection from '@/components/section/CompanySection';
import { FAQSection } from '@/components/section/FAQSection';
import { HeroSection } from '@/components/section/HeroSection';
import ServicesSection from '@/components/section/ServicesSection';
import { TeamSection } from '@/components/section/TeamSection';
import { TestimonialsSection } from '@/components/section/TestimonialsSection';
import { TestSection } from '@/components/section/TestSection';
import { Button } from '@/components/ui/button';

interface SectionRendererProps {
  sections: any[];
  enabledFeatures?: string[];
  allServices?: any[];
  allProjects?: any[];
  clientId?: string;
  dataset?: string;
  testimonials?: any[];
  faqs?: any[];
  teamMembers?: any[];
  certifications?: any[];
}

export async function SectionRenderer({
  sections,
  enabledFeatures,
  allServices = [],
  allProjects = [],
  clientId = 'mueller',
  dataset = 'production',
  testimonials = [],
  faqs = [],
  teamMembers = [],
  certifications = [],
}: SectionRendererProps) {
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
                    title: slide.title,
                    description: slide.description,
                    linkText: slide.linkText,
                    linkHref: slide.linkHref,
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
                    {section.subtitle && (
                      <p className="text-muted-foreground mt-2">{section.subtitle}</p>
                    )}
                  </div>
                  <BeforeAfterGridSection
                    items={
                      (section.items || section.pairs)?.map((item: any) => ({
                        beforeSrc: item.before,
                        afterSrc: item.after,
                        beforeLabel: item.beforeLabel || 'Vorher',
                        afterLabel: item.afterLabel || 'Nachher',
                        title: item.title,
                        subtitle: item.subtitle,
                        minHeight: item.minHeight ?? 320,
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
              (section.subsections || section.items)?.map((sub: any) => ({
                title: sub.title,
                description: sub.description,
                icon: sub.icon,
                image: sub.image,
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

          case 'servicesSection': {
            // Handle both direct service objects and service slugs
            const services =
              section.services?.map((s: any) => {
                if (typeof s === 'string') {
                  // It's a slug, look it up in allServices
                  return (
                    allServices.find((service: any) => service.slug === s) || {
                      title: s,
                      description: '',
                    }
                  );
                }
                return s;
              }) || [];

            return (
              <ServicesSection
                key={sectionKey}
                services={services}
                title={section.title}
                description={section.description || section.subtitle}
              />
            );
          }

          case 'projectsSection': {
            // Get projects from section.projects, global allProjects, or empty array
            let projects = section.projects || allProjects || [];

            // Apply limit if specified
            if (section.limit && projects.length > section.limit) {
              projects = projects.slice(0, section.limit);
            }

            return (
              <AnimatedSection key={index} className="py-16 bg-white">
                <div className="container">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.title}</h2>
                    {(section.description || section.subtitle) && (
                      <p className="text-muted-foreground">
                        {section.description || section.subtitle}
                      </p>
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
                    {(section.primaryButton?.text || section.primaryButtonText) &&
                      (section.primaryButton?.href || section.primaryButtonHref) && (
                        <Button size="lg" variant="secondary" asChild>
                          <Link href={section.primaryButton?.href || section.primaryButtonHref}>
                            {section.primaryButton?.text || section.primaryButtonText}
                          </Link>
                        </Button>
                      )}
                    {(section.secondaryButton?.text || section.secondaryButtonText) &&
                      (section.secondaryButton?.href || section.secondaryButtonHref) && (
                        <Button
                          size="lg"
                          variant="outline"
                          className={`${section.backgroundColor || 'bg-primary'}-foreground/20 border-current text-current hover:${section.backgroundColor || 'bg-primary'}-foreground/10`}
                          asChild
                        >
                          <Link href={section.secondaryButton?.href || section.secondaryButtonHref}>
                            {section.secondaryButton?.text || section.secondaryButtonText}
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

          case 'testimonialsSection':
            return <TestimonialsSection key={sectionKey} clientId={clientId} dataset={dataset} />;

          case 'teamSection':
            return <TeamSection key={sectionKey} clientId={clientId} dataset={dataset} />;

          case 'faqSection':
            return <FAQSection key={sectionKey} clientId={clientId} dataset={dataset} />;

          case 'certificationsSection':
            return <CertificationsSection key={sectionKey} clientId={clientId} dataset={dataset} />;

          default:
            return null;
        }
      })}
    </>
  );
}
