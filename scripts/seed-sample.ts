import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-02-01" });
const query = '*[_type == "sampleNote"] | order(_createdAt desc, _id asc)[0]{_id, title, message}';

async function main() {
  const existing = await client.fetch(query);
  if (existing) {
    console.log("Existing published sample note:", existing);
    return;
  }
  const note = await client.create({
    _type: "sampleNote",
    title: "Hello from SRC Test",
    message: "Content fetching works. This sample note lives in the Sanity production dataset.",
  });
  const fetched = await client.fetch(query);
  if (fetched?._id !== note._id) throw new Error("Sample note read-back failed");
  console.log("Created and fetched published sample note:", fetched);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
