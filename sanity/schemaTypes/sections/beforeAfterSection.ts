import { defineType } from "sanity";

export default defineType({
  name: "beforeAfterSection",
  title: "Before/After Section",
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
      title: "Section Description",
      type: "text",
    },
    {
      name: "pairs",
      title: "Before/After Pairs",
      type: "array",
      of: [{ type: "beforeAfter" }],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "columns",
      title: "Number of Columns",
      type: "number",
      options: {
        list: [1, 2, 3],
      },
      initialValue: 2,
    },
    {
      name: "gap",
      title: "Gap between items",
      type: "string",
      options: {
        list: ["0.5rem", "1rem", "1.5rem", "2rem"],
      },
      initialValue: "1rem",
    },
  ],
  preview: {
    select: {
      title: "title",
      pairCount: "pairs.length",
    },
    prepare(selection: any) {
      return {
        title: selection.title,
        subtitle: `${selection.pairCount || 0} pairs`,
      };
    },
  },
});
