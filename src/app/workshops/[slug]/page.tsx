import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PortableText } from "next-sanity";
import { getWorkshop } from "@/sanity/lib/client";
import type { WORKSHOP_QUERY_RESULT, WorkshopSession } from "@/sanity/types";
import styles from "./workshop.module.css";

type WorkshopImage = NonNullable<WORKSHOP_QUERY_RESULT>["coverImage"];
function Artwork({ image, priority = false }: { image: WorkshopImage; priority?: boolean }) {
  if (!image?.asset?.url) return null;
  return <Image className={styles.image} src={image.asset.url} alt={image.alt ?? "Workshop artwork"} width={image.asset.metadata?.dimensions?.width ?? 1620} height={image.asset.metadata?.dimensions?.height ?? 2025} sizes="(max-width: 720px) 100vw, 45vw" priority={priority} />;
}
function Schedule({ session, timeZone }: { session: WorkshopSession; timeZone?: string }) {
  if (session.dateStatus !== "confirmed" || !session.startsAt || !session.endsAt || !timeZone) {
    return <>{session.sourceDateLabel ?? "Schedule to be confirmed"} <strong>— date unconfirmed</strong></>;
  }
  const format = new Intl.DateTimeFormat("en-US", { timeZone, dateStyle: "full", timeStyle: "short" });
  return <><time dateTime={session.startsAt}>{format.format(new Date(session.startsAt))}</time> – <time dateTime={session.endsAt}>{format.format(new Date(session.endsAt))}</time> ({timeZone})</>;
}
export default async function WorkshopPage({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const workshop = await getWorkshop(slug);
  if (!workshop) notFound();
  const unconfirmed = workshop.registrationStatus === "unconfirmed" || !workshop.sessions?.length || workshop.sessions.some(s => s.dateStatus !== "confirmed");
  const ticketLabel = workshop.registrationStatus === "open" && !unconfirmed ? "Get tickets" : "Original ticket page";
  return <main className={styles.page}>
    <nav className={styles.nav}><Link href="/" prefetch={false}>SRC / HOME</Link><span>WORKSHOPS</span></nav>
    <header><p className={styles.eyebrow}>{workshop.category}</p><h1>{workshop.title}</h1><p className={styles.instructor}>Taught by {workshop.instructor}</p></header>
    <div className={styles.columns}>
      <div><Artwork image={workshop.coverImage} priority />{workshop.gallery?.map(image => <Artwork key={image._key} image={image} />)}</div>
      <section className={styles.details} aria-label="Workshop details">
        <h2>THE WORKSHOP</h2>
        {workshop.fullDescription ? <PortableText value={workshop.fullDescription} /> : <p>{workshop.shortDescription}</p>}
        <h2>SESSIONS</h2>
        <ol>{workshop.sessions?.map(session => <li key={session._key}><Schedule session={session} timeZone={workshop.timeZone ?? undefined} /></li>)}</ol>
        {workshop.attendanceNote && <p><strong>{workshop.attendanceNote}</strong></p>}
        {workshop.optionalOfficeHours && <><h2>OPTIONAL OFFICE HOURS</h2><p><Schedule session={workshop.optionalOfficeHours} timeZone={workshop.timeZone ?? undefined} /></p></>}
        {(unconfirmed || workshop.scheduleNotes) && <aside className={styles.notice}><strong>{unconfirmed ? "Schedule and registration unconfirmed." : "Schedule notes"}</strong>{workshop.scheduleNotes && <p>{workshop.scheduleNotes}</p>}</aside>}
        <p>Registration: {workshop.registrationStatus ?? "unconfirmed"}</p>
        {workshop.ticketUrl && <><a className={styles.ticket} href={workshop.ticketUrl} target="_blank" rel="noopener noreferrer">{ticketLabel}</a>{unconfirmed && <p>Verify the dates and availability before booking.</p>}</>}
        {workshop.sourceUrl && <p><a href={workshop.sourceUrl} target="_blank" rel="noopener noreferrer">Original SRC workshop information</a></p>}
      </section>
    </div>
  </main>;
}
