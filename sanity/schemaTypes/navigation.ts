import { defineType } from "sanity";

export default defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    {
      name: "menuItems",
      title: "Menu Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "link",
              title: "Link",
              type: "link",
              description: "Choose an existing document or enter an external URL",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "subItems",
              title: "Sub Items",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "title", title: "Title", type: "string" },
                    { name: "description", title: "Description", type: "text" },
                    { name: "link", title: "Link", type: "link" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      items: "menuItems",
    },
    prepare({ items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return {
        title: "Navigation Menu",
        subtitle: `${count} menu items`,
      };
    },
  },
});
