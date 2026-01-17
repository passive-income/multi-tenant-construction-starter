import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClsLogger from '@/components/ClsLogger';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'Construction Multi-Tenant Starter',
  description: 'Multi-tenant Next.js 16 construction websites',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://staticmap.openstreetmap.de" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
        {process.env.NODE_ENV !== 'production' && <ClsLogger />}
      </body>
    </html>
  );
}
