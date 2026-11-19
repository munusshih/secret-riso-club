import "server-only";
import { WORKSHOP_QUERY, UPCOMING_WORKSHOPS_QUERY, UNCONFIRMED_WORKSHOPS_QUERY } from "./workshop-queries";
import { calendarEntries, unconfirmedCalendarEntries } from "./workshop-calendar";
import { createClient, defineQuery } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});

export const SAMPLE_NOTE_QUERY = defineQuery(`
  *[_type == "sampleNote"] | order(_createdAt desc, _id asc)[0] {
    _id, title, message
  }
`);

type SampleNote = { _id: string; title: string; message: string };

export function getSampleNote() {
  // Fetch on each request so publishing + refreshing verifies the integration.
  return client.fetch<SampleNote | null>(SAMPLE_NOTE_QUERY, {}, { cache: "no-store" });
}

const HOMEPAGE_QUERY = defineQuery(`
  *[_type == "homepage" && _id == "homepage"][0] { introduction }
`);

export async function getHomepageIntroduction(): Promise<string | null> {
  try {
    const homepage = await client.fetch<{ introduction?: string | null } | null>(
      HOMEPAGE_QUERY,
      {},
      { cache: "no-store" },
    );
    return homepage?.introduction?.trim() || null;
  } catch (error) {
    console.error("Unable to fetch the homepage introduction from Sanity:", error);
    return null;
  }
}

export async function getWorkshop(slug: string) {
  return client.fetch(WORKSHOP_QUERY, { slug }, { cache: "no-store" });
}

export async function getCalendarWorkshops() {
  try {
    const [workshops, unconfirmed] = await Promise.all([
      client.fetch(UPCOMING_WORKSHOPS_QUERY, { now: new Date().toISOString() }, { cache: "no-store" }),
      client.fetch(UNCONFIRMED_WORKSHOPS_QUERY, {}, { cache: "no-store" }),
    ]);
    return [...calendarEntries(workshops), ...unconfirmedCalendarEntries(unconfirmed)];
  } catch (error) {
    console.error("Unable to fetch workshop Calendar:", error);
    return [];
  }
}
