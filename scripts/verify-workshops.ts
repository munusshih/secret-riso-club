import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { getCliClient } from "sanity/cli";
import { UPCOMING_WORKSHOPS_QUERY, WORKSHOP_QUERY } from "../src/sanity/lib/workshop-queries";
import { calendarEntries } from "../src/sanity/lib/workshop-calendar";
import source from "../migration/extracted/touchdesigner.json";
import type { UPCOMING_WORKSHOPS_QUERY_RESULT } from "../src/sanity/types";

async function main() {
  const require = createRequire(import.meta.url);
  const { parse, evaluate } = require("groq-js");
  const client = getCliClient({ apiVersion: "2026-02-01" }).withConfig({ useCdn: false, perspective: "published" });
  const document = await client.fetch(WORKSHOP_QUERY, { slug: "touchdesigner-for-print-riso-edition" });
  assert(document);
  assert.equal(document.title, source.title);
  assert.equal(document.instructor, source.instructor);
  assert.equal(document.ticketUrl, source.ticketUrl);
  assert.deepEqual(document.fullDescription?.map(p => p.children?.map(c => "text" in c ? c.text : "").join("")), source.paragraphs);
  assert.equal(document.sessions?.length, 2);
  assert(document.sessions?.every(s => s.dateStatus === "unconfirmed" && !s.startsAt));
  const images = [document.coverImage, ...(document.gallery ?? [])];
  assert.equal(images.length, 3);
  for (const image of images) {
    const url = image?.asset?.url;
    assert(url && url.startsWith("https://cdn.sanity.io/"));
    assert.equal((await fetch(url, { method: "HEAD" })).status, 200);
  }
  const liveCalendar = await client.fetch(UPCOMING_WORKSHOPS_QUERY, { now: new Date().toISOString() });
  assert(!liveCalendar.some(w => w._id === document._id));
  // Synthetic local fixtures only: never write invented dates to Sanity.
  const session = (key: string, day: number) => ({ _key: key, dateStatus: "confirmed", startsAt: `2030-07-${day}T18:00:00Z`, endsAt: `2030-07-${day}T21:00:00Z` });
  const base = { _id: "eligible", _type: "workshop", title: "Fixture", slug: { current: "fixture" }, registrationStatus: "open", featuredOnHomepage: true, timeZone: "America/New_York", sessions: [session("two", 12), session("one", 10)] };
  const fixtures = [base,
    { ...base, _id: "unconfirmed", sessions: [{ ...session("one", 10), dateStatus: "unconfirmed" }] },
    { ...base, _id: "partial", sessions: [session("one", 10), { dateStatus: "unconfirmed" }] },
    { ...base, _id: "past", sessions: [{ ...session("one", 10), startsAt: "2020-07-10T18:00:00Z", endsAt: "2020-07-10T21:00:00Z" }] },
    { ...base, _id: "cancelled", registrationStatus: "cancelled" },
    { ...base, _id: "hidden", featuredOnHomepage: false },
    { ...base, _id: "unknown-registration", registrationStatus: "unconfirmed" },
    { ...base, _id: "no-timezone", timeZone: undefined },
    { ...base, _id: "invalid-range", sessions: [{ ...session("one", 10), endsAt: "2030-07-09T21:00:00Z" }] },
  ];
  const result = await (await evaluate(parse(UPCOMING_WORKSHOPS_QUERY), { dataset: fixtures, params: { now: "2030-07-01T00:00:00Z" } })).get() as UPCOMING_WORKSHOPS_QUERY_RESULT;
  assert.deepEqual(result.map(w => w._id), ["eligible"]);
  const entries = calendarEntries(result);
  assert.equal(entries.length, 2);
  assert.deepEqual(entries.map(e => e.date), ["7/10", "7/12"]);
  console.log("Verified published source content, 3 reachable Sanity images, real workshop exclusion, 9 Calendar eligibility cases and ordered multi-session links.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
