import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef4f8",
          100: "#d9e6ee",
          200: "#bdd0dd",
          300: "#91adbf",
          400: "#6488a0",
          500: "#456b83",
          600: "#31536a",
          650: "#29485d",
          700: "#16354d",
          800: "#102a40",
          850: "#0d2438",
          900: "#0a1d2e",
          950: "#061522"
        },
        ink: "#172033",
        muted: "#667085",
        ivory: "#F8F5EF",
        parchment: "#F1ECE3",
        line: "#E5DED2",
        gold: {
          50: "#fbf6e8",
          100: "#f5ead0",
          200: "#ead49a",
          400: "#c9a45a",
          450: "#C9A227",
          500: "#ad873f",
          550: "#B8921E",
          700: "#765a2a"
        },
        stonewarm: "#f7f5f0"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
        serif: ["var(--font-lora)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(6, 21, 34, 0.08)",
        premium: "0 24px 70px rgba(7, 24, 39, 0.12)",
        subtle: "0 10px 30px rgba(7, 24, 39, 0.06)"
      },
      backgroundImage: {
        "navy-radial":
          "radial-gradient(circle at 18% 20%, rgba(201,162,39,0.16), transparent 28%), radial-gradient(circle at 82% 8%, rgba(255,255,255,0.08), transparent 26%), linear-gradient(135deg, #071827 0%, #0B1F33 58%, #071827 100%)",
        "ivory-fade": "linear-gradient(180deg, #F8F5EF 0%, #FFFFFF 48%, #F8F5EF 100%)"
      }
    }
  },
  plugins: []
};

export default config;
