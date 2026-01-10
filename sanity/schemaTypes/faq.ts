import { defineType } from 'sanity';

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Frage',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'answer',
      title: 'Antwort',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Ausführliche Antwort (Rich Text)',
    },
    {
      name: 'category',
      title: 'Kategorie',
      type: 'string',
      options: {
        list: [
          { title: 'Allgemein', value: 'allgemein' },
          { title: 'Leistungen', value: 'leistungen' },
          { title: 'Kosten', value: 'kosten' },
          { title: 'Zeitplan', value: 'zeitplan' },
          { title: 'Garantie', value: 'garantie' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'allgemein',
    },
    {
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
      description: 'Sortierreihenfolge (niedrigere Zahl = höher)',
    },
    {
      name: 'clientId',
      title: 'Client ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Mandanten-ID für Multi-Tenant-Filtering',
    },
  ],
  preview: {
    select: {
      title: 'question',
      category: 'category',
      order: 'order',
    },
    prepare({ title, category, order }) {
      return {
        title: title,
        subtitle: `${category || 'Allgemein'} • Reihenfolge: ${order || '–'}`,
      };
    },
  },
});
