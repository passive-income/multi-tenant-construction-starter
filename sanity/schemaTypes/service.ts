import { defineType } from "sanity";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    { name: "description", title: "Description", type: "text" },
    {
      name: "richDescription",
      title: "Rich Description",
      description: "Detailed description using Portable Text blocks.",
      type: "array",
      of: [{ type: "block" }],
    },
    { name: "image", title: "Image", type: "image" },
    { name: "imageUrl", title: "External Image URL", type: "url" },
    {
      name: "measures",
      title: "Measures",
      description: "Key steps and measures the company takes to deliver this service.",
      type: "array",
      of: [{ type: "string" }],
    },
    { name: "icon", title: "Icon", type: "string" }, // can adjust for an image or icon picker
    // If services belong to a specific client:
    { name: "clientId", title: "Client ID", type: "string" },
  ],
});
