import Link from 'next/link';
import { AnimatedSection } from '@/components/section/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanySectionProps {
  company: any;
  companySections?: any[];
}

export default function CompanySection({ company, companySections }: CompanySectionProps) {
  if (!company) return null;

  return (
    <AnimatedSection className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{company.name}</h1>
          <p className="text-xl text-muted-foreground">{company.tagline}</p>
          {company.description && (
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
              {company.description}
            </p>
          )}
        </div>

        {companySections && companySections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {companySections.map((section: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    {typeof section.title === 'string'
                      ? section.title
                      : section.title?.text || 'Untitled'}
                  </CardTitle>
                  <CardDescription>
                    {typeof section.subtitle === 'string'
                      ? section.subtitle
                      : section.subtitle?.text || ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {typeof section.description === 'string'
                      ? section.description
                      : section.description?.text || ''}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {company?.callToAction && (
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href={company.callToAction.href}>{company.callToAction.text}</Link>
            </Button>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
