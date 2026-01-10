import { defineType } from 'sanity';

export default defineType({
  name: 'teamMember',
  title: 'Teammitglied',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'position',
      title: 'Position',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'z.B. Geschäftsführer, Projektleiter, Bauleiter',
    },
    {
      name: 'image',
      title: 'Foto',
      type: 'image',
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
    },
    {
      name: 'bio',
      title: 'Biographie',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Kurze Beschreibung des Teammitglieds',
    },
    {
      name: 'phone',
      title: 'Telefon',
      type: 'string',
    },
    {
      name: 'email',
      title: 'E-Mail',
      type: 'string',
      validation: (Rule) => Rule.email(),
    },
    {
      name: 'specializations',
      title: 'Spezialisierungen',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Fachbereiche und Kompetenzen',
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
      title: 'name',
      subtitle: 'position',
      media: 'image',
    },
  },
});
