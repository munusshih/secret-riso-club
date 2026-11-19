"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { CalendarEntry } from "@/sanity/lib/workshop-calendar";
import styles from "./page.module.css";
import { SiteNavigation } from "./site-navigation";
import { ScrollBlocks } from "./scroll-blocks";

const offerings = ["Bookstore", "(Art Books)", "(Zines)", "Design Studio", "Print Studio", "Risograph", "Screen-Printing", "Book Making", "Publishing", "Memberships", "Public Programs", "Workshops", "Events", "Exhibition", "Music"];


function Hours() {
  return <p className={styles.hours}><span>BOOKSTORE HOURS</span><span>WED–SAT 12–7PM</span><span>SUN 12–6PM</span></p>;
}

function ClubMark({ className }: { className: string }) {
  return <svg className={className} viewBox="0 0 240 210" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"><path d="M38 34c41-33 107-27 91-2-19 30-77 26-97 36-41 20 15 33 44 20 35-15 52-21 42-8-25 32-61 77-100 71 14 22 56 8 80-19 26-30 40-45 50-31 15 23-12 73 12 76 29 5 61-31 69-61M32 62l-5-32 46-9 23-14 39 17 22 20-28 16 18 17-39 12M73 104c-34-15-26-40-8-45l26 6 12-23M151 82c-7-45 28-73 42-45l11 24M118 105l-31 78M63 145l74 17M169 177l35-17" /><path d="M56 192c34-41 38-81 12-88M25 94c14 27 37 27 50 5M184 89l-25 20 20 25 25-21" /></g></svg>;
}

export function HomeExperience({ children, description, calendar }: { children: ReactNode; description: string; calendar: CalendarEntry[] }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const intro = useRef<HTMLElement>(null);
  const identity = useRef<HTMLDivElement>(null);
  const descriptionDock = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = intro.current;
    const dock = descriptionDock.current;
    const title = identity.current;
    if (!section || !dock || !title) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const progress = Math.min(1, Math.max(0, window.scrollY / section.offsetHeight));
      const gap = Math.max(20, title.offsetWidth * 0.012);
      const initialTop = Math.max(viewport * 0.661, viewport * 0.528 + title.offsetHeight + gap);
      let titleTop = viewport * (0.528 - 0.108 * progress);
      const calendar = calendarButton.current?.getBoundingClientRect();
      if (calendar && calendar.top < titleTop + title.offsetHeight + gap && calendar.bottom > titleTop - gap) {
        titleTop = calendar.top - title.offsetHeight - gap;
      }
      title.style.setProperty("--title-offset", `${(titleTop - viewport * 0.528).toFixed(2)}px`);
      dock.style.setProperty("--description-start", `${initialTop.toFixed(2)}px`);
      const bottomTop = viewport * 0.94 - dock.offsetHeight;
      // Match the first composition, then hold the paragraph above the footer.
      dock.style.setProperty("--description-offset", `${((bottomTop - initialTop) * progress).toFixed(2)}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(section);
    observer.observe(dock);
    observer.observe(title);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    if (!calendarOpen) return;
    closeButton.current?.focus({ preventScroll: true });
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCalendarOpen(false);
        calendarButton.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [calendarOpen]);

  return (
    <main className={`${styles.home} ${styles.experience}`} data-calendar={calendarOpen} id="top">
      <div className={styles.pageContent}>
        <SiteNavigation />
        <section ref={intro} className={styles.stage} aria-label="Secret Riso Club introduction">{children}</section>
        <section className={styles.servicesScene} aria-label="About the club" id="about">
          <a className={`${styles.monogram} ${styles.sceneMonogram}`} href="#top" aria-label="Secret Riso Club home">SRC</a>
          <div className={styles.sidelabel} aria-hidden="true"><span>artist-run bookstore</span><span>artist-run bookstore</span></div>
          <ScrollBlocks />
          <p className={styles.what}>WHAT IS THIS PLACE?</p>
          <div className={styles.offeringList}>{offerings.map(item => <span key={item} id={({ Bookstore: "store", "Design Studio": "studio", "Print Studio": "printing", Memberships: "join-us", "Public Programs": "programs", Music: "community" } as Record<string, string>)[item]}>{item}</span>)}</div>
          <div className={styles.visit}><Hours /><p className={styles.address}>122 CENTRAL AVE – BROOKLYN</p><button ref={calendarButton} className={styles.calendarButton} aria-expanded={calendarOpen} aria-controls="calendar-panel" onClick={() => setCalendarOpen(!calendarOpen)}>CALENDAR</button></div>
          <div className={styles.nueva}><p>NUEVA YOL</p><ClubMark className={styles.smallMark} /></div>
          <ClubMark className={styles.largeMark} />
          {calendarOpen && <div className={styles.calendarDecorations} aria-hidden="true"><div className={styles.redTile} /><div className={styles.blueTile} /><div className={styles.workshopPoster}><span>Riso<br />102</span><small>WORKSHOP</small></div><div className={styles.memberPoster}>Membership</div></div>}
          <div className={styles.servicesFooter}><span>BECOME A MEMBER</span><span>FAQ’S</span><span>ABOUT US</span></div>
        </section>
      </div>
      <div ref={identity} className={styles.titleDock}>
        <h1 className={styles.title}>SECRET RISO CLUB</h1>
      </div>
      <div ref={descriptionDock} className={styles.descriptionDock}>
        <p className={styles.description}>{description}</p>
      </div>
      {calendarOpen && <aside className={styles.calendarPanel} id="calendar-panel" aria-labelledby="calendar-title">
        <div className={styles.calendarHeading}><button ref={closeButton} className={styles.closeCalendar} aria-label="Close calendar" onClick={() => { setCalendarOpen(false); calendarButton.current?.focus({ preventScroll: true }); }}>×</button><h2 id="calendar-title">CALENDAR</h2><p>SECRET RISO CLUB</p><address>122 CENTRAL AVE – BROOKLYN</address></div>
        <div className={styles.calendarScroll} tabIndex={0} aria-label="Workshop calendar">
          <p className={styles.calendarNotice}>{calendar.length ? "WORKSHOPS" : "NO WORKSHOPS ANNOUNCED"}</p>
          {calendar.map(event => <article className={styles.event} key={event.id}><h3><Link href={`/workshops/${event.slug}`} prefetch={false}>{event.title}</Link></h3><div className={styles.eventMeta}>{event.startsAt ? <time dateTime={event.startsAt}>{event.date}</time> : <span>{event.date}</span>}<span>{event.category}</span><span>{event.year}</span></div><p>{event.schedule}<br />{event.description}</p></article>)}
          <Hours />
        </div>
      </aside>}
    </main>
  );
}
