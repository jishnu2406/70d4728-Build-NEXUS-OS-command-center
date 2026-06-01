import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="obsidian"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./stores/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        panel: "rgb(var(--panel) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-2": "rgb(var(--accent-2) / <alpha-value>)",
        positive: "rgb(var(--positive) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
      },
      boxShadow: {
        glass: "0 24px 80px rgb(0 0 0 / 0.26)",
        lift: "0 18px 48px rgb(0 0 0 / 0.18)",
      },
      borderRadius: {
        panel: "20px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["SF Mono", "JetBrains Mono", "Menlo", "monospace"],
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 24px rgb(var(--accent-2) / 0.26)" },
          "50%": { boxShadow: "0 0 44px rgb(var(--accent-2) / 0.5)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
        pulseGlow: "pulseGlow 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
