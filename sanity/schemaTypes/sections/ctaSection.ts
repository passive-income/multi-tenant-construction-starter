import { defineType } from "sanity";

export default defineType({
  name: "ctaSection",
  title: "Call to Action Section",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Section Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "primaryButton",
      title: "Primary Button",
      type: "object",
      fields: [
        {
          name: "text",
          title: "Button Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "href",
          title: "Button URL",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
      ],
    },
    {
      name: "secondaryButton",
      title: "Secondary Button",
      type: "object",
      fields: [
        {
          name: "text",
          title: "Button Text",
          type: "string",
        },
        {
          name: "href",
          title: "Button URL",
          type: "string",
        },
      ],
    },
    {
      name: "backgroundColor",
      title: "Background Color",
      type: "string",
      description: "CSS class or Tailwind color (e.g., 'bg-primary')",
      initialValue: "bg-primary",
    },
    {
      name: "textColor",
      title: "Text Color",
      type: "string",
      initialValue: "text-primary-foreground",
    },
  ],
  preview: {
    select: {
      title: "title",
      buttonText: "primaryButton.text",
    },
    prepare(selection: any) {
      return {
        title: selection.title,
        subtitle: selection.buttonText ? `→ ${selection.buttonText}` : "CTA",
      };
    },
  },
});
