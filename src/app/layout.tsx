import type { Metadata } from "next";
import { Lato, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

/**
 * ------------------------------------------------------------
 *  Font Configuration (Next.js built-in font optimization)
 * ------------------------------------------------------------
 * 
 * Next.js automatically self-hosts Google Fonts when imported
 * through `next/font`. This improves performance vs. loading
 * from an external CDN.
 *
 * We load two families:
 * - Lato → primary UI / body font
 * - Cormorant Garamond → display headings (brand aesthetic)
 *
 * The `variable` key exposes each font via a CSS custom property
 * so Tailwind can reference them in theme configuration.
 */
const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

/**
 * ------------------------------------------------------------
 *  Metadata (used by Next.js for <head> population)
 * ------------------------------------------------------------
 */
export const metadata: Metadata = {
  title: "Solace Candidate Assignment",
  description: "Show us what you got",
};

/**
 * ------------------------------------------------------------
 *  Root Layout
 * ------------------------------------------------------------
 *
 * The "layout" file in Next.js wraps every page of the app.
 * It is responsible for global HTML structure, fonts, and
 * global styles. This file executes once, server-side.
 *
 * - `suppressHydrationWarning` prevents React from complaining
 *   when server and client markup differ (expected due to
 *   font CSS variables applying differently on hydration).
 *
 * - Material Symbols are included globally here so individual
 *   components can use them without re-importing.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${lato.variable} ${cormorant.variable}`}
    >
      <head>
        {/* Google Material Symbols (icon font) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0,0"
          rel="stylesheet"
        />
      </head>

      {/* Main application body */}
      <body>{children}</body>
    </html>
  );
}