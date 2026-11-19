import { connection } from "next/server";
import { DEFAULT_INTRODUCTION } from "@/content/homepage";
import { getHomepageIntroduction, getCalendarWorkshops } from "@/sanity/lib/client";
import { ScrollBlocks } from "./scroll-blocks";
import { HomeExperience } from "./home-experience";
import styles from "./page.module.css";

function LineDrawing() {
  return (
    <svg className={styles.drawing} viewBox="0 0 560 1080" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M25 15C176 77 174 125 35 181C-34 209 4 222 102 216C225 208 221 232 122 284C22 337 49 364 134 295C205 237 241 229 190 271C85 361 12 489 14 597C16 724 109 808 271 871C415 927 504 978 494 1054C534 932 448 862 280 808C113 754 76 674 93 552C110 422 176 316 269 251C166 371 167 422 237 476C325 544 261 643 188 641C270 686 276 792 210 884C228 786 193 724 120 649C168 743 173 799 148 853C75 794 44 705 50 602C59 443 117 241 347 91C201 176 92 304 54 459C8 650 36 758 142 845C209 902 302 936 363 1059C226 1036 141 949 106 851C50 694 14 751 16 846C18 923 74 1007 198 1059C65 1033-15 940 17 846C53 745-15 707 35 620" />
        <path d="M25 15C185 96 138 131 37 177C135 175 195 213 246 219C318 226 325 162 415 141C504 120 527 70 531 10C522 91 485 106 427 128C343 160 321 224 332 264C357 182 411 147 467 163C545 185 556 315 436 391C516 302 532 211 472 183C421 159 366 184 355 231C421 118 543 166 522 286C507 365 464 371 436 391" />
        <path d="M231 437C288 427 363 472 390 527C421 590 449 638 496 609C540 581 529 532 479 491C538 537 552 625 495 654C413 697 340 621 305 540C275 471 226 459 231 437Z" />
        <path d="M270 537C311 658 358 703 434 701C518 697 518 764 534 836C502 762 446 727 374 735C293 744 242 705 225 647" />
        <path d="M105 783C165 716 256 698 359 741C455 781 507 864 497 970C477 879 434 826 365 805C256 771 203 808 198 901C230 842 278 824 341 840C459 870 513 954 503 1000C536 878 473 808 360 777C245 744 183 785 173 866" />
      </g>
    </svg>
  );
}

export default async function Home() {
  // Render per request so publishing in Studio is visible on the next refresh.
  await connection();
  const [introduction, calendar] = await Promise.all([getHomepageIntroduction(), getCalendarWorkshops()]);
  const description = introduction ?? DEFAULT_INTRODUCTION;

  return (
    <HomeExperience description={description} calendar={calendar}>
        <a className={styles.monogram} href="#top" aria-label="Secret Riso Club home">SRC</a>
        <div className={styles.sidelabel} aria-hidden="true"><span>artist-run bookstore</span><span>artist-run bookstore</span></div>
        <LineDrawing />
        <ScrollBlocks />
        <p className={styles.statement}>
          <span>Secret Riso Club is a community</span>
          <span>focused artist-run bookstore,</span>
          <span>creative studio and learning space</span>
          <span>working at the intersection of</span>
          <span>art, design &amp; publishing.</span>
        </p>
        <div className={styles.serifWordmark} aria-hidden="true"><span>SECRET</span><span>RISO</span><span>CLUB</span></div>
        <div className={styles.bottomLinks}><a href="#printing">Printing</a><a href="#studio">Studio</a></div>
    </HomeExperience>
  );
}
