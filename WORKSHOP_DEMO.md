# SRC workshop demo

## Run and present

1. Run `npm run dev` in this project. Use the port printed in the terminal (normally http://localhost:3000).
2. Open http://localhost:3000/studio and sign in with access to the existing **SRC Test** Sanity project (`8kwmm0xx`, `production`).
3. Choose **Workshop**, then **TouchDesigner for Print: Riso Edition**.
4. Edit **Title** or **Full description**. Keep the slug unchanged for a stable demo URL. Click **Publish** and wait for publishing to finish.
5. Open or refresh http://localhost:3000/workshops/touchdesigner-for-print-riso-edition to see the published edit. Drafts are intentionally not shown.
6. Restore the original wording and publish again if this was only a demonstration.

The homepage remains at `/`. Scroll down and click **Calendar**. It displays published, featured workshops with verified future sessions and separately labeled unconfirmed reference workshops; each listing links to its workshop detail page. The imported TouchDesigner workshop appears as a reference listing with **TBC / YEAR TBC** and its original July session wording. Click its title to open the detail page. It remains excluded from confirmed upcoming listings.

For the homepage introduction demo, the existing **Homepage → Introduction** field still works. See `SANITY_DEMO.md`.

## Verifying dates before enabling Calendar

Do not infer a year from the source website, day names, file dates or import metadata.

- Verify the full year/date, start/end times and timezone for **every session**.
- Enter each session's **Starts at** and **Ends at**, then set **Date status** to `confirmed`.
- Enter **Verified timezone** as an IANA identifier, such as `America/New_York` only after confirmation. Studio's datetime input may use the editor's local timezone; check the saved instant against the workshop timezone.
- Resolve the optional office-hours discrepancy and update **Schedule notes**. Confirm its datetime separately if applicable.
- Verify ticket availability and set **Registration status** appropriately.
- Enable **Featured on homepage** and publish. Future sessions of eligible published workshops will appear after refreshing the homepage. Cancelled, archived, unconfirmed, unfeatured, past, or partly unconfirmed workshops are excluded.

No upcoming dates were invented for this demo. Unconfirmed workshops are labeled clearly in the Calendar; they are not presented as upcoming. Calendar filtering was tested with local synthetic fixtures, without uploading fake future events.

## Imported information and unresolved details

Source: https://secretrisoclub.com/TouchDesigner-for-Print-Riso-Edition

- One reusable `workshop` document; title, category, instructor, complete five-paragraph Portable Text description, short description copied verbatim from the first paragraph.
- Three original workshop images copied to Sanity assets (cover plus two gallery images).
- Two sessions: July 8, 6–9pm; July 11, 1–5pm. **No year is given.** Both remain `unconfirmed`, without datetime values.
- Instructor: Woody Poulard (aka GRNCH). Both sessions are required.
- Office hours: webpage says March 19, 5–8pm; poster says Thursday, July 9, 6–8pm. Both versions are retained in schedule notes. Neither is confirmed.
- Ticket URL: https://pools.events/t/wcimuk_x/ — retained as “Original ticket page”; current registration availability is unconfirmed.
- No verified timezone was supplied. No year, upcoming status, price or availability was inferred.
- Reference detail page is published; registration is `unconfirmed`; homepage feature is on, displaying the reference listing with unconfirmed dates.

## Implementation and repeatability

The project already fetched Homepage → Introduction from Sanity. Calendar previously used hardcoded preview events; these now come from Sanity. Existing homepage CSS is unchanged. The detail page has its own CSS module.

Source snapshot/mapping: `migration/extracted/touchdesigner.json`. The original HTML was inspected locally; the snapshot retains the relevant extracted content and original image URLs. Only workshop content was imported; global navigation artwork and unrelated site assets were excluded. This is a parallel content demonstration, with no source-site cutover or redirects.

- `npm run import:workshop`: imports one source-backed document and three assets with the current Sanity CLI account. It skips the document when it already exists, preserving editor changes. It never replaces it on reruns.
- `npm run sanity:types`: extracts the schema and regenerates typed queries.
- `npm run verify:workshops`: checks live source fidelity/assets and Calendar filtering (requires Sanity CLI login).
- `npm run lint`, `npm run typecheck`, `npm run build`.

The existing `.env.local` uses `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `NEXT_PUBLIC_SANITY_API_VERSION`. The dataset is publicly readable. No write token is shipped to the browser; Studio uses the signed-in editor's account.

Workshop and homepage requests use the published perspective, `useCdn: false`, `cache: "no-store"`, and request-time rendering via `connection()`. Existing development HMR fetch caching is disabled. Refresh the full page after publishing; no webhook or redeploy is needed. Sanity query indexing may take a brief moment after publishing, so refresh again if necessary.

Vercel is connected to `munusshih/secret-riso-club`; pushing `main` triggers the production deployment.
