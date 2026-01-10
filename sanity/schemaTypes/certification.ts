import { defineType } from "sanity";

export default defineType({
  name: "certification",
  title: "Zertifizierung",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "z.B. ISO 9001, Meisterbetrieb",
    },
    {
      name: "issuer",
      title: "Aussteller",
      type: "string",
      description: "Organisation, die das Zertifikat ausgestellt hat",
    },
    {
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "certificateNumber",
      title: "Zertifikatsnummer",
      type: "string",
    },
    {
      name: "validFrom",
      title: "Gültig ab",
      type: "date",
    },
    {
      name: "validUntil",
      title: "Gültig bis",
      type: "date",
      description: "Optional: Ablaufdatum des Zertifikats",
    },
    {
      name: "description",
      title: "Beschreibung",
      type: "text",
      rows: 3,
    },
    {
      name: "clientId",
      title: "Client ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Mandanten-ID für Multi-Tenant-Filtering",
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "issuer",
      media: "logo",
      validUntil: "validUntil",
    },
    prepare({ title, subtitle, media, validUntil }) {
      const isExpired = validUntil && new Date(validUntil) < new Date();
      return {
        title: title,
        subtitle: `${subtitle || ""}${isExpired ? " (abgelaufen)" : ""}`,
        media,
      };
    },
  },
});
