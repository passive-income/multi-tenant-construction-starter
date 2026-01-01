import { defineType } from "sanity";

export default defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "image",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "linkText",
      title: "Link Text",
      type: "string",
    },
    {
      name: "linkHref",
      title: "Link URL",
      type: "string",
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare(selection: any) {
      return {
        title: selection.title,
        subtitle: selection.subtitle,
      };
    },
  },
});
