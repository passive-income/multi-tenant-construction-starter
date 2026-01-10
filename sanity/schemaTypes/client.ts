import { defineType } from "sanity";

export default defineType({
  name: "client",
  title: "Client / Tenant",
  type: "document",
  fields: [
    {
      name: "clientId",
      title: "Client ID",
      type: "string",
      validation: (Rule) => Rule.required().lowercase(),
      description:
        'Unique key, e.g. "mueller". Used for filtering and routing.',
    },
    {
      name: "name",
      title: "Client Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Display name for the client (e.g., 'MÜLLER BAU GMBH'). Used in navigation, footer, etc.",
    },
    {
      name: "domains",
      title: "Domains",
      type: "array",
      of: [{ type: "string" }],
      description: "Custom domains (e.g. muellerbau.de, client1.yoursaas.com)",
    },
    {
      name: "dataSource",
      title: "Data Source",
      type: "string",
      options: {
        list: [
          { title: "Sanity", value: "sanity" },
          { title: "Static", value: "static" },
        ],
        layout: "radio",
      },
      initialValue: "sanity",
      description: "Where the client's site content comes from",
    },
    {
      name: "companyRef",
      title: "Company Data",
      type: "reference",
      to: [{ type: "company" }],
    },
    {
      name: "footerRef",
      title: "Footer Data",
      type: "reference",
      to: [{ type: "footer" }],
    },
    {
      name: "enabledFeatures",
      title: "Enabled Features",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Optional allow-list for section types (e.g. heroSection, servicesSection). If empty, all sections are allowed.",
    },
  ],
  preview: {
    select: {
      name: "name",
      clientId: "clientId",
    },
    prepare(selection) {
      const { name, clientId } = selection as any;
      return { 
        title: String(name || clientId || "Untitled Client"),
        subtitle: String(clientId || ""),
      };
    },
  },
});
