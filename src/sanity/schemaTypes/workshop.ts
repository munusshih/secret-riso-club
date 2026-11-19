import { defineArrayMember, defineField, defineType } from "sanity";

export const workshopSession = defineType({
  name: "workshopSession", title: "Session", type: "object",
  fields: [
    defineField({ name: "sourceDateLabel", title: "Original date / time wording", type: "string", description: "Keep the original wording when the year or schedule is uncertain." }),
    defineField({ name: "dateStatus", type: "string", initialValue: "unconfirmed", options: { list: ["unconfirmed", "confirmed"] }, validation: r => r.required() }),
    defineField({ name: "startsAt", type: "datetime", description: "Only enter after the full date, year and timezone have been verified." }),
    defineField({ name: "endsAt", type: "datetime" }),
  ],
  validation: r => r.custom(value => {
    if (value?.dateStatus !== "confirmed") return true;
    const start = Date.parse(String(value.startsAt ?? ""));
    const end = Date.parse(String(value.endsAt ?? ""));
    return Number.isFinite(start) && end > start || "Confirmed sessions need a full start and end date, with end after start.";
  }),
  preview: { select: { title: "sourceDateLabel", subtitle: "dateStatus" } },
});

const imageFields = [defineField({ name: "alt", type: "string", title: "Alternative text", validation: r => r.required() })];
export const workshop = defineType({
  name: "workshop", title: "Workshop", type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: r => r.required() }),
    defineField({ name: "category", type: "string", validation: r => r.required() }),
    defineField({ name: "instructor", type: "string", validation: r => r.required() }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true }, fields: imageFields, validation: r => r.required() }),
    defineField({ name: "gallery", type: "array", of: [defineArrayMember({ type: "image", options: { hotspot: true }, fields: imageFields })] }),
    defineField({ name: "shortDescription", type: "text", rows: 4, validation: r => r.required() }),
    defineField({ name: "fullDescription", type: "array", of: [defineArrayMember({ type: "block" })], validation: r => r.required() }),
    defineField({ name: "sessions", type: "array", of: [defineArrayMember({ type: "workshopSession" })], validation: r => r.required().min(1) }),
    defineField({ name: "optionalOfficeHours", type: "workshopSession" }),
    defineField({ name: "timeZone", title: "Verified timezone", type: "string", description: "IANA timezone, e.g. America/New_York. Required for confirmed sessions.", validation: r => r.custom(value => {
      if (!value) return true;
      try { new Intl.DateTimeFormat("en", { timeZone: value }); return true; } catch { return "Enter a valid IANA timezone."; }
    }) }),
    defineField({ name: "attendanceNote", type: "string" }),
    defineField({ name: "ticketUrl", type: "url", validation: r => r.uri({ scheme: ["https", "http"] }) }),
    defineField({ name: "registrationStatus", type: "string", initialValue: "unconfirmed", options: { list: ["unconfirmed", "open", "waitlist", "soldOut", "closed", "cancelled", "archived"] }, validation: r => r.required() }),
    defineField({ name: "featuredOnHomepage", type: "boolean", initialValue: false, description: "Show in the Calendar. Unconfirmed schedules are labeled TBC; upcoming listings require every session to be confirmed, a verified timezone, a known registration status and future dates." }),
    defineField({ name: "sourceUrl", type: "url" }),
    defineField({ name: "scheduleNotes", type: "text", description: "Explain unresolved date conflicts. This note is displayed on the workshop page." }),
  ],
  validation: r => r.custom(doc => {
    const sessions = doc?.sessions as { dateStatus?: string }[] | undefined;
    if (sessions?.some(s => s.dateStatus === "confirmed") && !doc?.timeZone) return "Set the verified timezone before confirming dates.";
    if (doc?.registrationStatus === "open" && (!sessions?.length || sessions.some(s => s.dateStatus !== "confirmed"))) return "Confirm all session dates before opening registration.";
    return true;
  }),
  preview: { select: { title: "title", subtitle: "registrationStatus", media: "coverImage" } },
});
