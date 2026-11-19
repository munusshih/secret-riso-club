import type { UPCOMING_WORKSHOPS_QUERY_RESULT, UNCONFIRMED_WORKSHOPS_QUERY_RESULT } from "../types";

export type CalendarEntry = { id: string; title: string; slug: string; category: string; description: string; startsAt: string | null; date: string; year: string; schedule: string };

export function calendarEntries(workshops: UPCOMING_WORKSHOPS_QUERY_RESULT): CalendarEntry[] {
  return workshops.flatMap(workshop => {
    if (!workshop.timeZone || !workshop.slug) return [];
    try { new Intl.DateTimeFormat("en", { timeZone: workshop.timeZone }); } catch { return []; }
    const timeZone = workshop.timeZone;
    return (workshop.sessions ?? []).flatMap(session => {
      if (!session.startsAt || !session.endsAt) return [];
      const start = new Date(session.startsAt), end = new Date(session.endsAt);
      const date = new Intl.DateTimeFormat("en-US", { timeZone, month: "numeric", day: "numeric" }).format(start);
      const year = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric" }).format(start);
      const format = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit", timeZoneName: "short" });
      return [{ id: `${workshop._id}-${session._key}`, title: workshop.title ?? "Workshop", slug: workshop.slug!, category: workshop.category ?? "Workshop", description: workshop.shortDescription ?? "", startsAt: session.startsAt, date, year, schedule: `${format.format(start)} – ${format.format(end)}` }];
    });
  }).sort((a, b) => Date.parse(a.startsAt!) - Date.parse(b.startsAt!));
}

export function unconfirmedCalendarEntries(workshops: UNCONFIRMED_WORKSHOPS_QUERY_RESULT): CalendarEntry[] {
  return workshops.flatMap(workshop => workshop.slug ? [{
    id: workshop._id, title: workshop.title ?? "Workshop", slug: workshop.slug,
    category: workshop.category ?? "Workshop", description: workshop.shortDescription ?? "",
    startsAt: null, date: "TBC", year: "YEAR TBC",
    schedule: "Dates unconfirmed. " + (workshop.sessions ?? []).map(session => session.sourceDateLabel).filter(Boolean).join(" · "),
  }] : []);
}
