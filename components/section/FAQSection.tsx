import { getClient } from "@/sanity/lib/client";
import { faqQuery } from "@/sanity/queries";
import type { FAQ, FAQCategory } from "@/lib/types/faq";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { getHost } from "@/lib/utils/host";
import { getJsonData } from "@/lib/data/json";
import { Card } from "@/components/ui/card";

interface FAQSectionProps {
  clientId: string;
  dataset?: string;
}

const categoryLabels: Record<string, string> = {
  allgemein: "Allgemein",
  leistungen: "Leistungen",
  kosten: "Kosten",
  zeitplan: "Zeitplan",
  garantie: "Garantie",
};

export async function FAQSection({ clientId, dataset = "production" }: FAQSectionProps) {
  const client = getClient(dataset);
  const host = await getHost();

  let intendedStatic = false;
  let staticFile = "static-mueller.json";
  if (host) {
    try {
      const clientDoc = await client.fetch('*[_type == "client" && $host in domains][0]', { host });
      const ds = clientDoc?.dataSource || clientDoc?.type || null;
      if (ds === "json" || ds === "static") {
        intendedStatic = true;
        staticFile = clientDoc?.staticFileName || staticFile;
      }
    } catch (e) {}
  }

  let faqs: FAQ[] = [];
  try {
    if (!intendedStatic) {
      if (clientId) {
        faqs = await client.fetch(faqQuery, { clientId: clientId ?? null });
      } else {
        faqs = await client.fetch(`*[_type == "faq"] | order(order asc)`);
      }
    }
  } catch (e) {
    faqs = [];
  }

  let sourceNote: string | null = null;
  if ((!faqs || faqs.length === 0) && intendedStatic) {
    try {
      const json = await getJsonData(staticFile);
      faqs = (json as any)?.faqs || [];
      sourceNote = `Using static data (${staticFile})`;
    } catch (e) {
      faqs = [];
    }
  }

  if ((!faqs || faqs.length === 0) && !intendedStatic) {
    try {
      const json = await getJsonData("static-mueller.json");
      faqs = (json as any)?.faqs || [];
      if (faqs && faqs.length > 0) sourceNote = "Using static JSON fallback (Sanity missing)";
    } catch (e) {
      faqs = [];
    }
  }

  if (!faqs || faqs.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center font-medium">Missing data in sanity</p>
      </Card>
    );
  }

  // Group FAQs by category
  const grouped: Record<string, FAQ[]> = {};
  faqs.forEach((faq) => {
    const cat = faq.category || "allgemein";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(faq);
  });

  const categories: FAQCategory[] = Object.entries(grouped).map(
    ([category, faqs]) => ({
      category,
      faqs,
    })
  );

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Häufig gestellte Fragen</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Finden Sie Antworten auf die am häufigsten gestellten Fragen
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          {categories.map((categoryGroup) => (
            <div key={categoryGroup.category}>
              <h3 className="text-2xl font-semibold mb-6">
                {categoryLabels[categoryGroup.category] || categoryGroup.category}
              </h3>
              <FAQAccordion faqs={categoryGroup.faqs} showSearch={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
