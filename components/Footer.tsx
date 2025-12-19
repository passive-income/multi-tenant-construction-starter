import Link from 'next/link'

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

export default function Footer({ footer }: FooterProps) {
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
  const year = new Date().getFullYear()

  return (
    <footer role="contentinfo" className="border-t bg-muted/50 flex-shrink-0">
      {/*
        Use a fixed height so the browser reserves exact space on first paint.
        h-20 = 5rem (80px). Adjust to h-16/h-24 if you need a different visual height.
      */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between overflow-hidden">
        {/* Left: brand / short text — ensure it doesn't wrap */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-medium truncate">MÜLLER BAU GMBH</span>
          <span className="text-xs text-muted/70 hidden sm:inline truncate">— Building since 2025</span>
        </div>

        {/* Right: links and copyright, keep on one line or truncate */}
        <div className="flex items-center gap-6 min-w-0">
          <nav aria-label="Footer links" className="flex items-center gap-4 text-sm whitespace-nowrap">
            {footerData.links?.map((link, idx) => (
              <Link key={idx} href={link.href} className="hover:underline">
                {link.text}
              </Link>
            ))}
          </nav>

          <div className="text-sm text-muted whitespace-nowrap">© {year} Müller Bau</div>
        </div>
      </div>
    </footer>
  )
}