import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      colors: {
        brand: {
          50:  "#f0f7ed",
          100: "#dbedd5",
          200: "#b6dba9",
          300: "#84c277",
          400: "#59a44b",
          500: "#3f8a4f",
          600: "#2f6b3d",
          700: "#265a32",
          800: "#1e4827",
          900: "#173a1f",
        },
        leaf: {
          500: "#3f8a4f",
          600: "#2f6b3d",
          700: "#265a32",
        },
        cream: {
          50:  "#fdfaf5",
          100: "#f7f3eb",
          200: "#f0e9d8",
        },
      },
      boxShadow: {
        card: "0 4px 24px -8px rgba(38, 90, 50, 0.14)",
      },
    },
  },
  plugins: [],
};
export default config;
