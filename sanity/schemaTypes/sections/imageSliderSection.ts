import { defineType } from "sanity";

export default defineType({
  name: "imageSliderSection",
  title: "Image Slider Section",
  type: "object",
  fields: [
    {
      name: "slides",
      title: "Slides",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "image",
              title: "Slide Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "autoplay",
      title: "Autoplay",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "autoplayInterval",
      title: "Autoplay Interval (ms)",
      type: "number",
      initialValue: 5000,
    },
  ],
  preview: {
    select: {
      slideCount: "slides.length",
    },
    prepare(selection: any) {
      return {
        title: "Image Slider",
        subtitle: `${selection.slideCount || 0} slides`,
      };
    },
  },
});
