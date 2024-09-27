import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
const colors = require("tailwindcss/colors");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        changeColorRed: {
          "0%": { backgroundColor: colors.red[600] + "30" },
          "100%": {
            backgroundColor: "transparent",
          },
        },
        changeColorGreen: {
          "0%": { backgroundColor: colors.green[600] + "30" },
          "100%": {
            backgroundColor: "transparent",
          },
        },
      },
      animation: {
        changeColorRed: "changeColorRed 0.5s forwards",
        changeColorGreen: "changeColorGreen 0.5s forwards",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
