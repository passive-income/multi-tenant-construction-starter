import { AnalyticsWrapper } from "@/components/AnalyticsWrapper";
import { Header } from "@/components/Header";
import Footer from "@/components/footer/Footer";
import { getHost } from "@/lib/utils/host";
import { getSanityData } from "@/lib/data/sanity";
import { getJsonData } from "@/lib/data/json";
import type { SiteData } from "@/lib/types/site";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Resolve tenant via Sanity first; fall back to static JSON file
  let data: SiteData | null = null;
  const host = await getHost();
  try {
    data = await getSanityData(process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production", host);
    console.log(`[Layout] Loaded data from Sanity for host: ${host}`, {
      hasFooter: !!data?.footer,
      footerLinks: data?.footer?.links?.length || 0,
    });
  } catch (e) {
    console.log(`[Layout] Failed to load from Sanity, falling back to JSON:`, e);
    data = null;
  }
  if (!data) {
    data = await getJsonData("static-mueller.json");
    console.log(`[Layout] Loaded data from static JSON`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnalyticsWrapper />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer clientId={data.clientId} footer={data.footer} />
    </div>
  );
}
