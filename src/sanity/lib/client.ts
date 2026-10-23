import "server-only";
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
