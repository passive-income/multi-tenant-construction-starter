import { defineType } from "sanity";

export default defineType({
  name: "projectsSection",
  title: "Projects Section",
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
      name: "projects",
      title: "Featured Projects",
      type: "array",
      of: [
        {
          type: "reference",
          to: { type: "project" },
        },
      ],
      description: "Select projects to feature. Leave empty to show all.",
    },
    {
      name: "showViewAllButton",
      title: "Show 'View All' Button",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "viewAllButtonText",
      title: "View All Button Text",
      type: "string",
      initialValue: "Alle Referenzen anzeigen",
    },
    {
      name: "viewAllButtonLink",
      title: "View All Link",
      type: "string",
      initialValue: "/projects",
    },
  ],
  preview: {
    select: {
      title: "title",
      projectCount: "projects.length",
    },
    prepare(selection: any) {
      return {
        title: selection.title,
        subtitle: `${selection.projectCount || "all"} projects`,
      };
    },
  },
});
