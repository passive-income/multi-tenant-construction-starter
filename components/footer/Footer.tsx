import { FooterMap } from "./FooterMap";
import Link from "next/link";

interface FooterProps {
  clientId?: string;
  footer?: {
    locations?: Array<{
      title: string;
      companyName: string;
      address: {
        street: string;
        city: string;
        country?: string;
      };
      phone: string;
      email: string;
    }>;
    openingHours?: {
      fachmarkt?: {
        title: string;
        weekdays: string;
        saturday: string;
      };
      office?: {
        title: string;
        weekdays: string;
        friday: string;
      };
    };
    copyright?: string;
    links?: Array<{
      text: string;
      href?: string;
      pageRef?: {
        _type: string;
        slug?: {
          current: string;
        };
      };
    }>;
  };
}

export default function Footer({ clientId, footer }: FooterProps) {
  const defaultFooter = {
    locations: [
      {
        title: "Kontakt Berlin",
        companyName: "MÜLLER BAU GMBH",
        address: {
          street: "Kurfürstendamm 90",
          city: "10709 Berlin",
          country: "Germany",
        },
        phone: "+49 30 123456",
        email: "info@muellerbau.de",
      },
    ],
    openingHours: {
      fachmarkt: {
        title: "FACHMARKT / ONLINESHOPS",
        weekdays: "Montag – Freitag: 08.30 – 12.30 Uhr, 14.30 – 18.00 Uhr",
        saturday: "Samstag: 08.30 – 13.00 Uhr",
      },
      office: {
        title: "BÜRO / VERWALTUNG",
        weekdays: "Montag – Donnerstag: 07.00 – 17.00 Uhr",
        friday: "Freitag: 07.00 – 16.00 Uhr",
      },
    },
    copyright: "© Müller Bau 2025 | Alle Rechte vorbehalten.",
    links: [
      { text: "Impressum", href: "/impressum" },
      { text: "Datenschutzerklärung", href: "/datenschutz" },
    ],
  };

  const footerData = footer || defaultFooter;
  const year = new Date().getFullYear();

  // derive map link / static image if location available
  const primaryLocation = footerData.locations?.[0];
  let mapHref = undefined;
  if (primaryLocation) {
    const addressParts = [];
    if (primaryLocation.address?.street)
      addressParts.push(primaryLocation.address.street);
    if (primaryLocation.address?.city)
      addressParts.push(primaryLocation.address.city);
    const addressStr = addressParts.join(", ");

    if ((primaryLocation as any).lat && (primaryLocation as any).lon) {
      const lat = (primaryLocation as any).lat;
      const lon = (primaryLocation as any).lon;
      mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lat + "," + lon)}`;
    } else if (addressStr) {
      mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressStr)}`;
    }
  }

  return (
    <footer role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-gray-700" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'}}>
          {/* Column 1: Map / Anfahrt */}
          <div className="min-h-50">
            <h3 className="text-sm font-semibold tracking-wider mb-4">
              ANFAHRT
            </h3>
            <FooterMap
              clientId={clientId}
              address={
                primaryLocation
                  ? [
                      primaryLocation.address?.street,
                      primaryLocation.address?.city,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : ""
              }
              href={mapHref}
            />
          </div>

          {/* Column 2: Kontakt NRW (use first location) */}
          <div className="min-h-50">
            <h3 className="text-sm font-semibold tracking-wider mb-4">
              KONTAKT NRW
            </h3>
            {footerData.locations?.[0] ? (
              <div className="text-sm">
                <div className="font-bold">
                  {footerData.locations[0].companyName ||
                    footerData.locations[0].title}
                </div>
                <div className="mt-2">
                  {footerData.locations[0].address?.street}
                </div>
                <div>{footerData.locations[0].address?.city}</div>
                <div className="mt-2">{footerData.locations[0].phone}</div>
                <div>{footerData.locations[0].email}</div>
              </div>
            ) : (
              <p className="text-sm text-muted">Kontaktdaten nicht vorhanden</p>
            )}
          </div>

          {/* Column 3: Kontakt Berlin (try second location, fallback to first) */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider mb-4">
              KONTAKT BERLIN
            </h3>
            {footerData.locations?.[1] ? (
              <div className="text-sm">
                <div className="font-bold">
                  {footerData.locations[1].companyName ||
                    footerData.locations[1].title}
                </div>
                <div className="mt-2">
                  {footerData.locations[1].address?.street}
                </div>
                <div>{footerData.locations[1].address?.city}</div>
                <div className="mt-2">{footerData.locations[1].phone}</div>
                <div>{footerData.locations[1].email}</div>
              </div>
            ) : footerData.locations?.[0] ? (
              <div className="text-sm">
                <div className="font-bold">
                  {footerData.locations[0].companyName ||
                    footerData.locations[0].title}
                </div>
                <div className="mt-2">
                  {footerData.locations[0].address?.street}
                </div>
                <div>{footerData.locations[0].address?.city}</div>
                <div className="mt-2">{footerData.locations[0].phone}</div>
                <div>{footerData.locations[0].email}</div>
              </div>
            ) : (
              <p className="text-sm text-muted">Kontaktdaten nicht vorhanden</p>
            )}
          </div>

          {/* Column 4: Öffnungszeiten */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider mb-4">
              ÖFFNUNGSZEITEN
            </h3>
            {footerData.openingHours ? (
              <div className="text-sm space-y-3">
                {footerData.openingHours.fachmarkt && (
                  <div>
                    <div className="font-bold">
                      {footerData.openingHours.fachmarkt.title}
                    </div>
                    <div className="mt-1">
                      {footerData.openingHours.fachmarkt.weekdays}
                    </div>
                    <div>{footerData.openingHours.fachmarkt.saturday}</div>
                  </div>
                )}
                {footerData.openingHours.office && (
                  <div>
                    <div className="font-bold mt-2">
                      {footerData.openingHours.office.title}
                    </div>
                    <div className="mt-1">
                      {footerData.openingHours.office.weekdays}
                    </div>
                    <div>{footerData.openingHours.office.friday}</div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted">
                Öffnungszeiten nicht vorhanden
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-muted/50 border-t border-gray-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-sm text-center text-gray-700">
          <div className="hidden sm:block">© {year} Müller Bau</div>
          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            {footerData.links?.map((link, idx) => {
              const href = ('pageRef' in link && link.pageRef?.slug?.current)
                ? `/${link.pageRef.slug.current}` 
                : (link.href || '#');
              return (
                <Link key={idx} href={href} className="hover:underline">
                  {link.text}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
