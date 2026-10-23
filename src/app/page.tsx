import Link from "next/link";
import { getSampleNote } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const note = await getSampleNote();
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-widest">SRC / Test project</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight">Secret Riso Club</h1>
      <p className="mt-4 text-lg text-neutral-600">A small Next.js and Sanity integration test.</p>
      <section aria-labelledby="content-title" className="mt-10 rounded-xl border border-neutral-300 p-6">
        <h2 id="content-title" className="text-xl font-semibold">Content from Sanity</h2>
        {note ? (
          <article className="mt-4">
            <h3 className="text-lg font-medium">{note.title}</h3>
            <p className="mt-2 whitespace-pre-wrap text-neutral-700">{note.message}</p>
          </article>
        ) : (
          <p className="mt-4 text-neutral-600">No published sample note yet. Create and publish one in Studio, then refresh this page.</p>
        )}
      </section>
      <Link href="/studio" className="mt-8 inline-block rounded-lg bg-neutral-900 px-5 py-3 font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4">Open Sanity Studio</Link>
    </main>
  );
}
