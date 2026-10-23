import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";

export const sampleNote = defineType({
  name: "sampleNote",
  title: "Sample Note",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required().max(120) }),
    defineField({ name: "message", title: "Message", type: "text", rows: 4, validation: (rule) => rule.required().max(1000) }),
  ],
  preview: { select: { title: "title", subtitle: "message" } },
});
