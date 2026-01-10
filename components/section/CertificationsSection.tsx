import { Award, Calendar } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { getJsonData } from '@/lib/data/json';
import type { Certification } from '@/lib/types/certification';
import { getHost } from '@/lib/utils/host';
import { getClient } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { certificationsQuery } from '@/sanity/queries';

interface CertificationsSectionProps {
  clientId: string;
  dataset?: string;
}

export async function CertificationsSection({
  clientId,
  dataset = 'production',
}: CertificationsSectionProps) {
  const client = getClient(dataset);
  const host = await getHost();

  let intendedStatic = false;
  let staticFile = 'static-mueller.json';
  if (host) {
    try {
      const clientDoc = await client.fetch('*[_type == "client" && $host in domains][0]', { host });
      const ds = clientDoc?.dataSource || clientDoc?.type || null;
      if (ds === 'json' || ds === 'static') {
        intendedStatic = true;
        staticFile = clientDoc?.staticFileName || staticFile;
      }
    } catch (_e) {}
  }

  let certifications: Certification[] = [];
  try {
    if (!intendedStatic) {
      if (clientId) {
        certifications = await client.fetch(certificationsQuery, { clientId: clientId ?? null });
      } else {
        certifications = await client.fetch(`*[_type == "certification"] | order(validFrom desc)`);
      }
    }
  } catch (_e) {
    certifications = [];
  }

  let sourceNote: string | null = null;
  if ((!certifications || certifications.length === 0) && intendedStatic) {
    try {
      const json = await getJsonData(staticFile);
      certifications = (json as any)?.certifications || [];
      sourceNote = `Using static data (${staticFile})`;
    } catch (_e) {
      certifications = [];
    }
  }

  if ((!certifications || certifications.length === 0) && !intendedStatic) {
    try {
      const json = await getJsonData('static-mueller.json');
      certifications = (json as any)?.certifications || [];
      if (certifications && certifications.length > 0)
        sourceNote = 'Using static JSON fallback (Sanity missing)';
    } catch (_e) {
      certifications = [];
    }
  }

  if (!certifications || certifications.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center font-medium">Missing data in sanity</p>
      </Card>
    );
  }

  const isExpired = (validUntil?: string) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Zertifizierungen & Qualifikationen</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unsere Zertifikate und Qualifikationen bestätigen unsere hohen Qualitätsstandards
          </p>
          {sourceNote && <p className="text-sm text-muted-foreground mt-4">{sourceNote}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <Card key={cert._id} className="p-6 flex flex-col">
              {cert.logo && (
                <div className="relative w-full h-32 mb-4 flex items-center justify-center">
                  <Image
                    src={urlFor(cert.logo).width(300).height(150).url()}
                    alt={cert.name}
                    width={300}
                    height={150}
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{cert.name}</h3>
                  {isExpired(cert.validUntil) && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                      Abgelaufen
                    </span>
                  )}
                  {!isExpired(cert.validUntil) && cert.validUntil && (
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
                      <span>Gültig ab: {new Date(cert.validFrom).toLocaleDateString('de-DE')}</span>
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
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
