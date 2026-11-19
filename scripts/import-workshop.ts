import { getCliClient } from "sanity/cli";
import source from "../migration/extracted/touchdesigner.json";

const client = getCliClient({ apiVersion: "2026-02-01" }).withConfig({ useCdn: false });
const id = "src-import-touchdesigner-for-print-riso-edition";
async function main() {
  if (await client.getDocument(id)) {
    console.log("Workshop already imported. Skipping to preserve editorial changes.");
    return;
  }
  const images = [];
  for (const [index, url] of source.images.entries()) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Image fetch failed: ${response.status} ${url}`);
    const asset = await client.assets.upload("image", Buffer.from(await response.arrayBuffer()), {
      filename: `touchdesigner-frame-${index + 3}.png`, contentType: "image/png",
      source: { id: url, name: "Secret Riso Club", url },
    });
    images.push({ _type: "image", _key: `artwork-${index}`, alt: `Original TouchDesigner for Print: Riso Edition workshop artwork ${index + 1}`, asset: { _type: "reference", _ref: asset._id } });
  }
  const document = await client.createIfNotExists({
    _id: id, _type: "workshop", title: source.title,
    slug: { _type: "slug", current: "touchdesigner-for-print-riso-edition" },
    category: source.category, instructor: source.instructor,
    coverImage: images[0], gallery: images.slice(1),
    shortDescription: source.paragraphs[0],
    fullDescription: source.paragraphs.map((text, index) => ({
      _type: "block", _key: `paragraph-${index}`, style: "normal", markDefs: [],
      children: [{ _type: "span", _key: `text-${index}`, text, marks: ["strong"] }],
    })),
    sessions: source.sessions.map((label, index) => ({ _type: "workshopSession", _key: `day-${index + 1}`, sourceDateLabel: label, dateStatus: "unconfirmed" })),
    optionalOfficeHours: { _type: "workshopSession", sourceDateLabel: source.optionalOfficeHours, dateStatus: "unconfirmed" },
    attendanceNote: source.attendanceNote, ticketUrl: source.ticketUrl,
    registrationStatus: "unconfirmed", featuredOnHomepage: true,
    sourceUrl: source.sourceUrl, scheduleNotes: source.scheduleNotes,
  });
  console.log(`Imported ${document._id}: ${images.length} images, ${source.paragraphs.length} paragraphs, 2 unconfirmed sessions. Shown in Calendar as dates unconfirmed; excluded from upcoming listings.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
