import { defineType } from "sanity";

export default defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    {
      name: "locations",
      title: "Locations",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Location Title", type: "string" },
            { name: "companyName", title: "Company Name", type: "string" },
            {
              name: "address",
              title: "Address",
              type: "object",
              fields: [
                { name: "street", type: "string", title: "Street" },
                { name: "city", type: "string", title: "City" },
                { name: "country", type: "string", title: "Country" },
              ],
            },
            { name: "phone", title: "Phone", type: "string" },
            { name: "email", title: "Email", type: "string" },
          ],
        },
      ],
    },
    {
      name: "openingHours",
      title: "Opening Hours",
      type: "object",
      fields: [
        {
          name: "fachmarkt",
          title: "Fachmarkt",
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "weekdays", type: "string", title: "Weekdays" },
            { name: "saturday", type: "string", title: "Saturday" },
          ],
        },
        {
          name: "office",
          title: "Office",
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "weekdays", type: "string", title: "Weekdays" },
            { name: "friday", type: "string", title: "Friday" },
          ],
        },
      ],
    },
    {
      name: "links",
      title: "Footer Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "text", title: "Link Text", type: "string" },
            { 
              name: "href", 
              title: "External URL", 
              type: "url",
              description: "Full URL for external links (e.g., https://example.com)",
            },
            {
              name: "pageRef",
              title: "Internal Page",
              type: "reference",
              to: [{ type: "page" }],
              description: "Link to an internal page (takes priority over external URL)",
            },
          ],
        },
      ],
    },
    { name: "copyright", title: "Copyright", type: "string" },
  ],
  preview: {
    select: {
      title: "copyright",
    },
    prepare({ title }) {
      return {
        title: title || "Footer Configuration",
      };
    },
  },
});
