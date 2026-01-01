import { defineType } from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    {
      name: "pageType",
      title: "Page Type",
      type: "string",
      options: {
        list: [
          { title: "Home", value: "home" },
          { title: "Standard Content Page", value: "standard" },
        ],
      },
      initialValue: "standard",
      validation: (Rule) => Rule.required(),
    },
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
        source: (doc) => (doc?.pageType === "home" ? "home" : doc?.title),
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required().custom((slug: { current?: string } | undefined, context) => {
          const current = slug?.current;
          const doc: any = context?.document || {};
          if (doc.pageType === "home" && current !== "home") {
            return 'Home pages must use slug "home" (routes to "/")';
          }
          if (!current) return true;
          // Enforce per-client uniqueness hint (cannot cross-check here, but ensures clientId presence)
          if (!doc.clientId) {
            return "Set clientId so slug uniqueness is scoped per client.";
          }
          return true;
        }),
      description:
        'For Home pages the slug is forced to "home" and is routed to "/"; other pages use their title-based slug. Slug uniqueness is scoped per clientId.',
    },
    {
      name: "clientId",
      title: "Client ID",
      type: "string",
      description: "Required to scope slug uniqueness per tenant.",
    },
    {
      name: "description",
      title: "Short Description",
      type: "text",
    },
    {
      name: "image",
      title: "Hero Image (fallback for sections)",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "sections",
      title: "Page Sections",
      type: "array",
      of: [
        { type: "imageSliderSection" },
        { type: "heroSection" },
        { type: "beforeAfterSection" },
        { type: "companySection" },
        { type: "servicesSection" },
        { type: "projectsSection" },
        { type: "ctaSection" },
      ],
      description: "Build your page by adding sections in order. Appears for home and standard pages.",
    },
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      pageType: "pageType",
    },
    prepare(selection: any) {
      return {
        title: selection.title,
        subtitle: `/${selection.slug} (${selection.pageType})`,
      };
    },
  },
});
