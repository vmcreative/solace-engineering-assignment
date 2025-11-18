/**
 * TailwindCSS configuration
 *
 * This project uses Tailwind for rapid UI development and to keep the
 * styling consistent across filters, tables, dropdowns, and transitions.
 *
 * Custom theme tokens (colors, spacing, fonts) are defined here so the UI
 * matches the Solace brand aesthetic used throughout the assignment.
 */

import type { Config } from "tailwindcss";

const config: Config = {
  /**
   * Content paths:
   * Tailwind scans all files in the app, pages, and components directories
   * to tree-shake unused utility classes in production.
   */
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      /**
       * Fonts:
       * Imported in `layout.tsx` using next/font and mapped to Tailwind tokens.
       * 
       * - `sans` is used for general UI
       * - `display` is used for headings and section titles
       */
      fontFamily: {
        sans: ["var(--font-lato)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-cormorant)", "serif"],
      },

      /**
       * Color palette:
       * Matches the Solace brand palette used in the assignment.
       * These are used heavily in filters, table headers, highlights, etc.
       *
       * - `neutral` = soft greys for text & subtle UI
       * - `opal`    = green-tinted grey used for backgrounds & fades
       * - `gold`    = highlight color for tags
       * - `green`   = primary brand color (heading, buttons, header row)
       */
      colors: {
        white: "#ffffff",
        black: "#101010",

        neutral: {
          DEFAULT: "#9a9a9a",
          light: "#e9e9e9",
          dark: "#5a5a5a",
        },

        opal: {
          DEFAULT: "#d4e2dd",
          transparent: "#d4e2dd4d", // 30% opacity variant used in fades & hovers
        },

        gold: {
          DEFAULT: "#d7a13b",
          light: "#e9cc95",
          dark: "#d39009",
        },

        green: {
          DEFAULT: "#285e50",
          light: "#347866",
          dark: "#1d4339",
        },
      },

      /**
       * Border radius:
       * Used for rounded table corners and dropdown panels.
       */
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },

      /**
       * Shadows:
       * Very subtle shadow used for dropdowns and specialty tag expand/collapse button.
       */
      boxShadow: {
        soft: "0 2px 4px rgba(0,0,0,0.04)",
      },
    },
  },

  /**
   * No plugins required for this project.
   * Tailwind core covers everything we need.
   */
  plugins: [],
};

export default config;