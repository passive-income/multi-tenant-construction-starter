import { defineType } from 'sanity';

export default defineType({
  name: 'testSection',
  title: 'Test Section (Feature Flag Demo)',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'This is a Test Section',
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text',
      initialValue:
        'This section will only appear if "testSection" is in the client\'s enabledFeatures array.',
    },
    {
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      initialValue: 'bg-blue-50',
      description: 'Tailwind color class (e.g., bg-blue-50, bg-green-100)',
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection: any) {
      return {
        title: selection.title || 'Test Section',
        subtitle: '🧪 Feature flag test',
      };
    },
  },
});
