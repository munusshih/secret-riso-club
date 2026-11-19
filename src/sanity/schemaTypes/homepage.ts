import { DocumentIcon } from "@sanity/icons/Document";
import { defineField, defineType } from "sanity";
import { DEFAULT_INTRODUCTION } from "../../content/homepage";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 8,
      description: "The long introduction paragraph on the homepage. Publish, then refresh the website to see your change.",
      validation: (rule) => rule.required().max(1000),
    }),
  ],
  initialValue: { introduction: DEFAULT_INTRODUCTION },
  preview: { prepare: () => ({ title: "Homepage", subtitle: "Introduction text" }) },
});
