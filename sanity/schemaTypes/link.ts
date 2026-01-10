import { defineType } from 'sanity';

export default defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    {
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Full URL for external links (https://...)',
    },
    {
      name: 'internalRef',
      title: 'Reference',
      type: 'reference',
      to: [{ type: 'service' }, { type: 'project' }, { type: 'company' }, { type: 'page' }],
      description: 'Pick an existing document to link to.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      url: 'externalUrl',
      ref: 'internalRef',
    },
    prepare(selection) {
      const { title, url, ref } = selection as any;
      const text = title || ref?._ref || url || '(no link)';
      return { title: text };
    },
  },
});
