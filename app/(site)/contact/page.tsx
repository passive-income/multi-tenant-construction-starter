import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { ServerContactForm } from '@/components/contact/ServerContactForm';
import { FooterMap } from '@/components/footer/FooterMap';
import { Card } from '@/components/ui/card';
import { getJsonData } from '@/lib/data/json';
import type { ContactSettings } from '@/lib/types/contactSettings';
import { getHost } from '@/lib/utils/host';
import { getClient } from '@/sanity/lib/client';
import { contactSettingsQuery } from '@/sanity/queries';

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const host = await getHost();
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
  const client = getClient(dataset);

  let settings: ContactSettings | null = null;

  // Resolve client by host (fallback to default clientId env)
  let clientId: string | undefined = process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID;
  if (host) {
    const clientDoc = await client.fetch('*[_type == "client" && $host in domains][0]', { host });
    // If client explicitly uses a static JSON data source, load contact settings from that file
    const ds = clientDoc?.dataSource || clientDoc?.type || null;
    if (ds === 'json' || ds === 'static') {
      const staticFile = clientDoc?.staticFileName || 'static-mueller.json';
      try {
        const json = await getJsonData(staticFile);
        // json.contactSettings is expected to exist in the static file
        const cs = (json as any)?.contactSettings;
        if (cs) {
          // Use the static settings directly and skip Sanity
          // Normalize shape to ContactSettings
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          settings = cs as ContactSettings;
        }
      } catch (_err) {
        // ignore and fall back to Sanity below
      }
    }
    clientId = clientDoc?.clientId ?? clientId;
  }

  // If settings not provided by static JSON, try Sanity queries (guard clientId)
  if (!settings) {
    try {
      // Always provide the `clientId` param (use null if undefined) to avoid
      // GROQ parse errors when the param is referenced in the query.
      if (clientId) {
        settings = await client.fetch(contactSettingsQuery, { clientId: clientId ?? null });
      } else {
        // If no clientId we still call the param-free fallback query
        settings = await client.fetch(`*[_type == "contactSettings"][0]`);
      }
    } catch (_e) {
      settings = null;
    }
  }

  // Final fallback: load static JSON unconditionally if still missing
  if (!settings) {
    try {
      const json = await getJsonData('static-mueller.json');
      settings = (json as any)?.contactSettings ?? null;
    } catch (_err) {
      settings = null;
    }
  }

  if (!settings) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold">Kontakt</h1>
        <p className="mt-4">Kontaktinformationen werden geladen...</p>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Kontaktieren Sie uns</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Haben Sie Fragen oder möchten Sie ein Angebot einholen? Wir freuen uns auf Ihre
            Nachricht.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Kontaktinformationen</h2>

              {settings.phone && (
                <div className="flex items-start mb-4">
                  <Phone className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Telefon</p>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>
              )}

              {settings.email && (
                <div className="flex items-start mb-4">
                  <Mail className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <p className="font-medium">E-Mail</p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}

              {settings.whatsappNumber && (
                <div className="flex items-start mb-4">
                  <Phone className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <a
                      href={`https://wa.me/${settings.whatsappNumber.replace(/\s/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      {settings.whatsappNumber}
                    </a>
                  </div>
                </div>
              )}

              {settings.mapAddress && (
                <div className="flex items-start mb-4">
                  <MapPin className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-muted-foreground">{settings.mapAddress}</p>
                  </div>
                </div>
              )}

              {settings.openingHours && (
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mr-3 mt-1" />
                  <div>
                    <p className="font-medium">Öffnungszeiten</p>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {settings.openingHours}
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {settings.showMap && settings.mapAddress && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Standort</h3>
                <FooterMap
                  address={settings.mapAddress}
                  clientId={clientId}
                  className="w-full h-64 rounded-md"
                />
              </Card>
            )}
          </div>

          {/* Contact Form - Progressive enhancement: Server form enhanced by client component */}
          <div>
            <noscript>
              <ServerContactForm settings={settings} searchParams={params} />
            </noscript>
            <div className="js-only">
              <ContactForm settings={settings} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
