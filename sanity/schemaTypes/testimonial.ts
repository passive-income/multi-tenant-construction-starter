import { defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Kundenbewertung",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "company",
      title: "Unternehmen",
      type: "string",
    },
    {
      name: "position",
      title: "Position",
      type: "string",
    },
    {
      name: "image",
      title: "Foto",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "rating",
      title: "Bewertung",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
      description: "Sterne-Bewertung von 1 bis 5",
    },
    {
      name: "text",
      title: "Bewertungstext",
      type: "text",
      validation: (Rule) => Rule.required(),
      rows: 5,
    },
    {
      name: "projectRef",
      title: "Projekt",
      type: "reference",
      to: [{ type: "project" }],
      description: "Optional: Referenziertes Projekt",
    },
    {
      name: "serviceRef",
      title: "Leistung",
      type: "reference",
      to: [{ type: "service" }],
      description: "Optional: Referenzierte Leistung",
    },
    {
      name: "date",
      title: "Datum",
      type: "datetime",
    },
    {
      name: "location",
      title: "Ort",
      type: "string",
    },
    {
      name: "clientId",
      title: "Client ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Mandanten-ID für Multi-Tenant-Filtering",
    },
    {
      name: "featured",
      title: "Hervorgehoben",
      type: "boolean",
      description: "Als hervorgehobene Bewertung anzeigen",
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "company",
      rating: "rating",
      featured: "featured",
    },
    prepare({ title, subtitle, rating, featured }) {
      const stars = "⭐".repeat(rating || 0);
      const badge = featured ? " 🌟" : "";
      return {
        title: `${title}${badge}`,
        subtitle: `${subtitle || "Privatkunde"} • ${stars}`,
      };
    },
  },
});
