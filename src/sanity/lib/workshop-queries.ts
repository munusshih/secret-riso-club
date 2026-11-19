import { defineQuery } from "next-sanity";

export const WORKSHOP_QUERY = defineQuery(`
  *[_type == "workshop" && slug.current == $slug][0] {
    _id, title, slug, category, instructor, shortDescription, fullDescription,
    sessions, optionalOfficeHours, timeZone, attendanceNote, ticketUrl,
    registrationStatus, scheduleNotes, sourceUrl,
    coverImage {alt, asset->{url, metadata{dimensions}}},
    gallery[] { _key, alt, asset->{url, metadata{dimensions}} }
  }
`);

export const UPCOMING_WORKSHOPS_QUERY = defineQuery(`
  *[_type == "workshop" && featuredOnHomepage == true && defined(slug.current)
    && registrationStatus in ["open", "waitlist", "soldOut", "closed"]
    && defined(timeZone) && count(sessions) > 0
    && count(sessions[dateStatus == "confirmed" && defined(startsAt) && defined(endsAt)
      && dateTime(endsAt) > dateTime(startsAt)]) == count(sessions)
    && count(sessions[dateTime(startsAt) >= dateTime($now)]) > 0] {
      _id, title, "slug": slug.current, category, shortDescription, timeZone,
      "sessions": sessions[dateTime(startsAt) >= dateTime($now)] { _key, startsAt, endsAt }
  }
`);

// Reference listings are separate from confirmed upcoming sessions.
export const UNCONFIRMED_WORKSHOPS_QUERY = defineQuery(`
  *[_type == "workshop" && featuredOnHomepage == true && defined(slug.current)
    && !(registrationStatus in ["cancelled", "archived"])
    && (count(sessions) == 0 || count(sessions[dateStatus != "confirmed" || !defined(startsAt) || !defined(endsAt)]) > 0)]
    | order(title asc) {
      _id, title, "slug": slug.current, category, shortDescription,
      sessions[] { sourceDateLabel }
    }
`);
