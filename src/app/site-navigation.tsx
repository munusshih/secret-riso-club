"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const links = ["Studio", "Store", "Programs", "Printing", "Community", "Join us"];

export function SiteNavigation() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    const outside = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", close); document.removeEventListener("pointerdown", outside); };
  }, [open]);
  return (
    <header className={styles.header}>
      <nav className={styles.navigation} aria-label="Main navigation">{links.map(link => <a key={link} href={`#${link.toLowerCase().replaceAll(" ", "-")}`}>{link}</a>)}<button className={styles.moreLinks} aria-label="More navigation links" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>+</button></nav>
      <div className={styles.menu} ref={menu}>
        <button className={`${styles.menuButton} ${open ? styles.menuOpen : ""}`} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}><span /><span /><span /></button>
        <nav id="site-menu" className={styles.menuPanel} aria-label="Expanded navigation" hidden={!open}>{links.map(link => <a key={link} href={`#${link.toLowerCase().replaceAll(" ", "-")}`} onClick={() => setOpen(false)}>{link}</a>)}</nav>
      </div>
    </header>
  );
}
