import { AnimatedSection } from '@/components/AnimatedSection'
import { ProjectGallery } from '@/components/ProjectGallery'
import { HeroSection } from '@/components/HeroSection'
import { ImageSlider } from '@/components/ImageSlider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface DataContentProps {
  data: any
}

export function DataContent({ data }: DataContentProps) {
  const sliderSlides = data.slider?.slides || []

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
              className={`bg-gradient-to-r ${
                index % 3 === 0 ? 'from-primary/10 to-primary/5' :
                index % 3 === 1 ? 'from-accent/10 to-accent/5' :
                'from-secondary/10 to-secondary/5'
              }`}
            />
          ))}
        </section>
      )}

      {/* Main Company Section */}
      <AnimatedSection className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.company.name}</h1>
            <p className="text-xl text-muted-foreground">{data.company.tagline}</p>
            {data.company.description && (
              <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                {data.company.description}
              </p>
            )}
          </div>
          
          {data.companySections && data.companySections.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {data.companySections.map((section: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{section.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Services Section */}
      <AnimatedSection className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">UNSERE LEISTUNGEN</h2>
            <p className="text-muted-foreground">Von der Idee bis zur Umsetzung an Ihrer Seite!</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.services.map((s: any) => (
              <Card key={s.title} className="hover:shadow-lg transition-shadow">
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
                        {service.features.map((feature: string, idx: number) => (
                          <li key={idx} dangerouslySetInnerHTML={{ __html: feature }} />
                        ))}
                      </ul>
                    )}
                    {service.description2 && (
                      <p className="text-sm text-muted-foreground mb-4">{service.description2}</p>
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
            <ProjectGallery images={data.projects.map((p: any) => p.images).flat()} />
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
              {data.contact.ctaTitle || 'ERHALTEN SIE IHR ANGEBOT'}
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              {data.contact.ctaDescription || 'Haben Sie eine Idee, einen Wunsch? Wir können Ihnen helfen diesen umzusetzen! Nehmen Sie Kontakt zu uns auf und wir helfen und beraten Sie gerne!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {data.contact.ctaButtonText && data.contact.ctaButtonHref && (
                <Button size="lg" variant="secondary" asChild>
                  <Link href={data.contact.ctaButtonHref}>{data.contact.ctaButtonText}</Link>
                </Button>
              )}
              {data.contact.secondaryButtonText && data.contact.secondaryButtonHref && (
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href={data.contact.secondaryButtonHref}>{data.contact.secondaryButtonText}</Link>
                </Button>
              )}
            </div>
          </div>
        </AnimatedSection>
      )}
    </main>
  )
}

