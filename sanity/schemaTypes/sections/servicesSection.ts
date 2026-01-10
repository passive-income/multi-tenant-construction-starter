import { defineType } from 'sanity';

export default defineType({
  name: 'servicesSection',
  title: 'Services Section',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Section Description',
      type: 'text',
    },
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'service' },
        },
      ],
      description: 'Reference services to display in this section',
    },
  ],
  preview: {
    select: {
      title: 'title',
      serviceCount: 'services.length',
    },
    prepare(selection: any) {
      return {
        title: selection.title,
        subtitle: `${selection.serviceCount || 0} services`,
      };
    },
  },
});
