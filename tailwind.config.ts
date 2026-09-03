import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        clay: {
          950: "#0E140F",
          900: "#141C15",
          800: "#1E281F",
          700: "#2A3A2C",
          600: "#3B4E3E",
          500: "#516A55",
          400: "#6F8C74",
          300: "#9BB3A0",
          200: "#CAD7CD",
          100: "#E9EFEA",
          50: "#F5F8F5",
        },
        terracotta: {
          900: "#61270B",
          800: "#7F3510",
          700: "#9E4416",
          600: "#BA551E",
          500: "#C26526",
          400: "#D97736",
          300: "#EA9A63",
          200: "#F4C4A3",
          100: "#FCE7D8",
          50: "#FDF6F0",
        },
        sand: {
          900: "#363127",
          850: "#4D4638",
          700: "#766C57",
          500: "#AB9E84",
          400: "#C5B9A1",
          300: "#DDD4C1",
          200: "#EAE4D7",
          100: "#F4F0E8",
          50: "#FBF9F5",
        },
        sage: {
          900: "#232D20",
          700: "#455440",
          500: "#7A8C70",
          400: "#8C9B78",
          300: "#B0BC9F",
          200: "#D4DBC9",
          100: "#EAF0E4",
          50: "#F5F8F1",
        },
        harvest: {
          600: "#B88310",
          500: "#D99B14",
          400: "#E6AF2E",
          300: "#F5C95C",
          200: "#FCE29A",
          100: "#FEF4D5",
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -2px rgba(30, 40, 31, 0.06), 0 1px 4px -1px rgba(194, 101, 38, 0.04)',
        'warm-md': '0 8px 24px -6px rgba(30, 40, 31, 0.08), 0 4px 12px -2px rgba(194, 101, 38, 0.06)',
        'warm-lg': '0 16px 40px -10px rgba(30, 40, 31, 0.12), 0 8px 20px -4px rgba(194, 101, 38, 0.08)',
        'warm-xl': '0 24px 60px -12px rgba(30, 40, 31, 0.16), 0 12px 28px -6px rgba(194, 101, 38, 0.10)',
        'glow-terracotta': '0 0 35px -5px rgba(194, 101, 38, 0.35)',
        'glow-sage': '0 0 35px -5px rgba(140, 155, 120, 0.35)',
      },
      animation: {
        'subtle-drift': 'drift 18s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        drift: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '100%': { transform: 'translate(15px, -15px) scale(1.04)' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
