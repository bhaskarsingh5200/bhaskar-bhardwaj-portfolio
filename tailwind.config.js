/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "rgb(var(--base) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          2: "rgb(var(--surface-2) / <alpha-value>)",
          3: "rgb(var(--surface-3) / <alpha-value>)"
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          secondary: "rgb(var(--ink-secondary) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)"
        },
        line: {
          DEFAULT: "rgb(var(--line) / 0.12)",
          strong: "rgb(var(--line) / 0.2)"
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          hover: "rgb(var(--accent-hover) / <alpha-value>)",
          soft: "rgb(var(--accent) / 0.12)",
          glow: "rgb(var(--accent) / 0.3)"
        }
      },
      fontFamily: {
        heading: ["Sora", "Manrope", "Inter", "system-ui", "-apple-system", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"]
      },
      borderRadius: {
        card: "14px"
      },
      boxShadow: {
        card: "0 24px 48px -24px rgba(0, 0, 0, 0.5)",
        lift: "0 16px 32px -16px rgba(0, 0, 0, 0.45)",
        "blue-glow": "0 0 0 1px rgb(var(--accent) / 0.25), 0 16px 40px -16px rgb(var(--accent) / 0.45)"
      },
      maxWidth: {
        shell: "1200px"
      },
      keyframes: {
        pulse: {
          "0%": { boxShadow: "0 0 0 0 rgb(var(--accent) / 0.5)" },
          "70%": { boxShadow: "0 0 0 9px rgb(var(--accent) / 0)" },
          "100%": { boxShadow: "0 0 0 0 rgb(var(--accent) / 0)" }
        },
        "glow-breathe": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" }
        }
      },
      animation: {
        pulse: "pulse 2.4s ease-out infinite",
        "glow-breathe": "glow-breathe 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
