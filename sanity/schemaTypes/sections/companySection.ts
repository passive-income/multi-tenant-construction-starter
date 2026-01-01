import { defineType } from "sanity";

export default defineType({
  name: "companySection",
  title: "Company Section",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Section Title",
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
      title: "Company Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "subsections",
      title: "Company Subsections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Subsection Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "description",
              title: "Description",
              type: "text",
            },
            {
              name: "icon",
              title: "Icon Name",
              type: "string",
              description: "Icon identifier for styling",
            },
          ],
        },
      ],
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
