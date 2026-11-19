import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const tempel = localFont({ src: "../../public/font/TempelGrotesk-Normal-Trial.otf", variable: "--font-tempel", display: "swap" });
const grotesk = localFont({ src: "../../public/font/srcGrotesk-Rg.ttf", variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  title: "Secret Riso Club — Art, Design & Publishing",
  description: "A community focused artist-run bookstore, creative studio and learning space working at the intersection of art, design & publishing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${tempel.variable} ${grotesk.variable}`}><body>{children}</body></html>;
}
