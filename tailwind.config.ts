import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        main: "var(--main)",
        "main-foreground": "var(--main-foreground)",
        "secondary-background": "var(--secondary-background)",
        border: "var(--border)",
        ring: "var(--ring)",
        overlay: "var(--overlay)",
        "muted-foreground": "var(--muted-foreground)",
        "chart-1": "var(--chart-1)",
        "chart-2": "var(--color-chart-amber-500)",
        "chart-3": "var(--color-chart-blue-500)",
        "chart-4": "var(--chart-4)",
        "chart-5": "var(--chart-5)",
      },
      borderRadius: {
        base: "var(--border-radius)",
      },
      spacing: {
        boxShadowX: "var(--box-shadow-x)",
        boxShadowY: "var(--box-shadow-y)",
        reverseBoxShadowX: "var(--reverse-box-shadow-x)",
        reverseBoxShadowY: "var(--reverse-box-shadow-y)",
      },
      boxShadow: {
        shadow: "var(--shadow)",
        card: "var(--card-shadow)",
      },
      fontWeight: {
        base: "var(--base-font-weight)",
        heading: "var(--heading-font-weight)",
      },
      fontFamily: {
        sans: ["var(--font-ibm-plex-mono)", "monospace"],
        heading: ["var(--font-space-mono)", "monospace"],
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(-100%)" },
        },
        marquee2: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0%)" },
        },
      },
      animation: {
        marquee: "marquee 50s linear infinite",
        marquee2: "marquee2 50s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
