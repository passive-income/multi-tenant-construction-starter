import { defineType } from "sanity";

export default defineType({
  name: "contactSettings",
  title: "Kontakt-Einstellungen",
  type: "document",
  fields: [
    {
      name: "email",
      title: "E-Mail",
      type: "string",
      validation: (Rule) => Rule.email(),
    },
    {
      name: "phone",
      title: "Telefon",
      type: "string",
    },
    {
      name: "whatsappNumber",
      title: "WhatsApp-Nummer",
      type: "string",
      description: "Telefonnummer für WhatsApp (mit Ländercode, z.B. +49...)",
    },
    {
      name: "showMap",
      title: "Karte anzeigen",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "mapAddress",
      title: "Karten-Adresse",
      type: "string",
      description: "Vollständige Adresse für die Karte",
    },
    {
      name: "formFields",
      title: "Formularfelder",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Feldname (technisch)",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "type",
              title: "Feldtyp",
              type: "string",
              options: {
                list: [
                  { title: "Text", value: "text" },
                  { title: "E-Mail", value: "email" },
                  { title: "Telefon", value: "tel" },
                  { title: "Textbereich", value: "textarea" },
                  { title: "Auswahl", value: "select" },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "label",
              title: "Beschriftung",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "placeholder",
              title: "Platzhalter",
              type: "string",
            },
            {
              name: "required",
              title: "Pflichtfeld",
              type: "boolean",
              initialValue: false,
            },
            {
              name: "options",
              title: "Auswahloptionen",
              type: "array",
              of: [{ type: "string" }],
              description: "Nur für Feldtyp 'Auswahl'",
              hidden: ({ parent }) => parent?.fieldType !== "select",
            },
          ],
          preview: {
            select: {
              label: "label",
              fieldType: "fieldType",
              required: "required",
            },
            prepare({ label, fieldType, required }) {
              return {
                title: label,
                subtitle: `${fieldType}${required ? " (Pflicht)" : ""}`,
              };
            },
          },
        },
      ],
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
      email: "email",
      clientId: "clientId",
    },
    prepare({ email, clientId }) {
      return {
        title: `Kontakt-Einstellungen (${clientId})`,
        subtitle: email || "Keine E-Mail",
      };
    },
  },
});
