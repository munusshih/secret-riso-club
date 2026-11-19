# Homepage CMS demo

The homepage's long introduction paragraph is now loaded from Sanity. The large
serif opening statement, title, hours, layout, and CSS are unchanged.

## Before the meeting

From this project directory:

```sh
npm run dev
```

Use these two tabs (if Next.js prints a different port, use that port instead):

- Website: http://localhost:3000
- Studio: http://localhost:3000/studio

Sign into Studio using the Sanity account with access to **SRC Test**
(project `8kwmm0xx`, dataset `production`). The local `localhost:3000` origin
is already allowed in Sanity CORS settings.

## Live demonstration

1. In Studio, select **Homepage** in the left navigation.
2. Edit **Introduction**, the single text field. For a small visible change,
   replace “Join us and browse” with “Come in and explore”.
3. Wait for Studio to save the draft. Refresh the website: the published text
   still appears. Saving a draft does not publish it.
4. Click **Publish** in Studio. Wait for the published confirmation.
5. Refresh the website tab. The updated long paragraph now appears without a
   rebuild or restarting Next.js.
6. Restore the original wording and publish again if desired.

The editable paragraph is the smaller bold text below the large title on the
first screen; it moves toward the bottom as you scroll. The large serif opening
statement is intentionally still hardcoded.

## How it works

- `src/sanity/schemaTypes/homepage.ts` defines the `homepage` document with one
  `introduction` text field.
- `sanity.config.ts` registers a Homepage singleton, so there is one document to
  edit rather than a list of competing homepage documents.
- `src/sanity/lib/client.ts` queries the published `homepage` document using
  `useCdn: false`, `perspective: "published"`, and `cache: "no-store"`.
- `next.config.ts` disables the development Server Component HMR fetch cache.
- `src/app/page.tsx` renders on each request using `connection()`, fetches the
  introduction, and passes it into the existing homepage component.
- `src/content/homepage.ts` preserves the exact original introduction. It is
  used when the document/field is missing, empty, or the fetch fails.

No read token, webhook, preview setup, or deployment is required for this demo.
Use a full browser refresh after publishing; drafts stay out of the website.
Sanity can take a moment to make a publication visible to queries. Wait for the
publish confirmation before refreshing; if necessary, wait a second and refresh
again. This is publication/indexing latency, not a cached Next.js page.
The three existing `NEXT_PUBLIC_SANITY_*` variables in `.env.local` must be set.
If running Studio on a new port, add that origin to the project's Sanity CORS
settings first.

## Verification performed

- No published Homepage document: original paragraph rendered as fallback.
- Opened the real embedded Studio and edited Introduction.
- Confirmed the saved draft did not appear on the website.
- Published from Studio and refreshed the website; the edited paragraph appeared.
- Restored and republished the exact original paragraph, then verified it again.
- Homepage responses use `Cache-Control: no-store`.
- Both existing CSS files were checked byte-for-byte and remain unchanged.
