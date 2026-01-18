import { AnalyticsWrapper } from '@/components/AnalyticsWrapper';
import Footer from '@/components/footer/Footer';
import { Header } from '@/components/Header';
import { ScrollRestoration } from '@/components/ScrollRestoration';
import { getSiteData } from '@/lib/data/streaming';
import type { SiteData } from '@/lib/types/site';
import { getHost } from '@/lib/utils/host';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Resolve tenant via Sanity first
  let data: SiteData | null = null;
  const host = await getHost();

  if (host) {
    data = await getSiteData(host);
  }

  if (!data) {
    return (
      <main className="min-h-screen flex flex-col" id="main-content">
        <ScrollRestoration />
        <AnalyticsWrapper />
        <Header />
        <div className="flex-1 relative z-0">{children}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col" id="main-content">
      <ScrollRestoration />
      <AnalyticsWrapper />
      <Header />
      <div className="flex-1 relative z-0">{children}</div>
      {data.footer && <Footer clientId={data.clientId} footer={data.footer} />}
    </main>
  );
}
