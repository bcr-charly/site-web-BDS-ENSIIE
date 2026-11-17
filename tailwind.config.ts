import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bds: {
          black: "#000000",
          white: "#FFFFFF",
          orange: "#FFA500",
          orangeDark: "#E08E00",
          coal: "#0D0D0D",
          smoke: "#1A1A1A",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque"', "Inter", "ui-sans-serif", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
