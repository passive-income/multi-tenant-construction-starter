import { defineType } from 'sanity';

export default defineType({
  name: 'company',
  title: 'Company',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Company Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    { name: 'logoText', title: 'Logo Text', type: 'string' },
    { name: 'street', title: 'Street', type: 'string' },
    { name: 'city', title: 'City', type: 'string' },
    { name: 'country', title: 'Country', type: 'string' },
    { name: 'phone', title: 'Phone Number', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'theme', title: 'Theme', type: 'string' },
    {
      name: 'slider',
      title: 'Slider',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'beforeAfter',
      title: 'Before / After Pairs',
      type: 'array',
      of: [{ type: 'beforeAfter' }],
    },
    // Add more fields as needed (e.g. social links)
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
});
