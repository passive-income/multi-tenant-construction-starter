import { defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'icon', title: 'Icon', type: 'string' }, // can adjust for an image or icon picker
    // If services belong to a specific client:
    { name: 'clientId', title: 'Client ID', type: 'string' },
  ]
})