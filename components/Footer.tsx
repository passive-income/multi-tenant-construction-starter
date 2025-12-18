import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

interface FooterProps {
  footer?: {
    locations?: Array<{
      title: string
      companyName: string
      address: {
        street: string
        city: string
        country?: string
      }
      phone: string
      email: string
    }>
    openingHours?: {
      fachmarkt?: {
        title: string
        weekdays: string
        saturday: string
      }
      office?: {
        title: string
        weekdays: string
        friday: string
      }
    }
    copyright?: string
    links?: Array<{
      text: string
      href: string
    }>
  }
}

export function Footer({ footer }: FooterProps) {
  const defaultFooter = {
    locations: [
      {
        title: 'Kontakt Berlin',
        companyName: 'MÜLLER BAU GMBH',
        address: {
          street: 'Hauptstraße 123',
          city: '10709 Berlin',
          country: 'Germany',
        },
        phone: '+49 30 123456',
        email: 'info@muellerbau.de',
      },
    ],
    openingHours: {
      fachmarkt: {
        title: 'FACHMARKT / ONLINESHOPS',
        weekdays: 'Montag – Freitag: 08.30 – 12.30 Uhr, 14.30 – 18.00 Uhr',
        saturday: 'Samstag: 08.30 – 13.00 Uhr',
      },
      office: {
        title: 'BÜRO / VERWALTUNG',
        weekdays: 'Montag – Donnerstag: 07.00 – 17.00 Uhr',
        friday: 'Freitag: 07.00 – 16.00 Uhr',
      },
    },
    copyright: '© Müller Bau 2025 | Alle Rechte vorbehalten.',
    links: [
      { text: 'Impressum', href: '/impressum' },
      { text: 'Datenschutzerklärung', href: '/datenschutz' },
    ],
  }

  const footerData = footer || defaultFooter

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {footerData.locations?.map((location, index) => (
            <div key={index}>
              <h3 className="font-bold text-lg mb-4">{location.title}</h3>
              <p className="font-semibold">{location.companyName}</p>
              <p>{location.address.street}</p>
              <p>{location.address.city}</p>
              {location.address.country && <p>{location.address.country}</p>}
              <p className="mt-2">{location.phone}</p>
              <p>{location.email}</p>
            </div>
          ))}
          
          {footerData.openingHours && (
            <div>
              <h3 className="font-bold text-lg mb-4">Öffnungszeiten</h3>
              <div className="space-y-2">
                {footerData.openingHours.fachmarkt && (
                  <div>
                    <p className="font-semibold">{footerData.openingHours.fachmarkt.title}</p>
                    <p>{footerData.openingHours.fachmarkt.weekdays}</p>
                    <p>{footerData.openingHours.fachmarkt.saturday}</p>
                  </div>
                )}
                {footerData.openingHours.office && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <p className="font-semibold">{footerData.openingHours.office.title}</p>
                      <p>{footerData.openingHours.office.weekdays}</p>
                      <p>{footerData.openingHours.office.friday}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>{footerData.copyright}</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {footerData.links?.map((link, index) => (
              <Link key={index} href={link.href} className="hover:underline">
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

