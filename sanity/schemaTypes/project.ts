import { defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'image', title: 'Cover Image', type: 'image', options: { hotspot: true } },
    { name: 'clientId', title: 'Client ID', type: 'string' },
    { name: 'link', title: 'Project Link', type: 'url' },
  ]
})