import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f172a",
        surface: {
          DEFAULT: "#1e293b",
          border: "#334155",
        },
        royal: {
          DEFAULT: "#1a56db",
          bright: "#2563eb",
          dark: "#123a99",
          light: "#eaf1fd",
          soft: "#d6e4fb",
        },
        ink: {
          DEFAULT: "#f1f5f9",
          muted: "#94a3b8",
        },
        success: "#22c55e",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
        card: "16px",
      },
      boxShadow: {
        glow: "0 8px 30px -8px rgba(26, 86, 219, 0.45)",
        "glow-lg": "0 12px 40px -10px rgba(37, 99, 235, 0.55)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      keyframes: {
        "check-pop": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "60%": { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "step-complete": {
          "0%": { boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.5)" },
          "100%": { boxShadow: "0 0 0 12px rgba(34, 197, 94, 0)" },
        },
      },
      animation: {
        "check-pop": "check-pop 0.25s ease-out",
        "step-complete": "step-complete 0.6s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
