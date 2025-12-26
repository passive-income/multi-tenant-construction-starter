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
              name: "href",
              title: "Href",
              type: "string",
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
                    { name: "href", title: "Href", type: "string" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});
