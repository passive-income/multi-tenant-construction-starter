import { defineType } from 'sanity';

export default defineType({
  name: 'beforeAfter',
  title: 'Before / After Pair',
  type: 'object',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'subtitle', title: 'Subtitle', type: 'string' },
    {
      name: 'before',
      title: 'Before Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'after',
      title: 'After Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule: any) => Rule.required(),
    },
  ],
});
