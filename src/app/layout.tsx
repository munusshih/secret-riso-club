import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SRC Test | Secret Riso Club",
  description: "Secret Riso Club Next.js and Sanity test project.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
