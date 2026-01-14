'use client';

import { PortableText } from '@portabletext/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { FAQ } from '@/lib/types/faq';

const portableTextComponents = {
  types: {
    // Fallback for unknown types to prevent errors
  },
  block: {
    normal: ({ children }: any) => <p className="mb-4">{children}</p>,
    h1: ({ children }: any) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-lg font-semibold mb-2">{children}</h3>,
  },
  marks: {
    strong: ({ children }: any) => <strong>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
  },
};

interface FAQAccordionProps {
  faqs: FAQ[];
  showSearch?: boolean;
}

export function FAQAccordion({ faqs, showSearch = false }: FAQAccordionProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = searchTerm
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (faq.answer &&
            JSON.stringify(faq.answer).toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : faqs;

  return (
    <div className="w-full">
      {showSearch && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Frage suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      )}

      {filteredFaqs.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Keine passenden Fragen gefunden.</p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {filteredFaqs.map((faq, idx) => {
            return (
              <AccordionItem key={idx} value={String(idx)}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>
                  {faq.answer ? (
                    <div className="prose prose-sm max-w-none">
                      <PortableText value={faq.answer} components={portableTextComponents} />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Keine Antwort verfügbar.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
