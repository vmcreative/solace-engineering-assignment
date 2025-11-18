import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-lato)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-cormorant)", "serif"],
      },

      colors: {
        "white": "#ffffff",
        "black": "#101010",

        neutral: {
          DEFAULT: "#9a9a9a",
          "light": "#e9e9e9",
          "dark": "#5a5a5a",
        },

        opal: {
          DEFAULT: "#d4e2dd",
          "transparent": "#d4e2dd4d",
        },

        gold: {
          DEFAULT: "#d7a13b",
          "light": "#e9cc95",
          "dark": "#d39009",
        },

        green: {
          DEFAULT: "#285e50",
          "light": "#347866",
          "dark": "#1d4339",
        },
      },

      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem",
      },

      boxShadow: {
        soft: "0 2px 4px rgba(0,0,0,0.04)",
      },
    },
  },

  plugins: [],
};

export default config;