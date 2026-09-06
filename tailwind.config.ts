import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Paleta LuckyHouse — ver specs/technical (branding, definida con el usuario 2026-08-30)
        brand: {
          DEFAULT: "#0F5843", // Primary — verde profundo
          dark: "#0A4535", // Primary Hover
          light: "#E7F3EE", // Primary Light
          surface: "#F2F8F5", // Primary Surface
        },
        secondary: "#2F8067",
        accent: "#A8D76E", // solo para badges/acentos, nunca botones (ver guía del usuario)
        gold: {
          DEFAULT: "#A67C3D", // Acento cálido — dorado/bronce envejecido, armónico con el verde (esmeralda+oro), ajuste UX 2026-09-06
          dark: "#7C5A26",
          light: "#F3E6C9",
        },
        cta: {
          DEFAULT: "#16865F",
          hover: "#0F6D4D",
        },
        success: "#208A5A",
        warning: "#D99A22",
        danger: "#C94343",
        info: "#3478A8",
        ink: {
          DEFAULT: "#17221E",
          secondary: "#5F6F68",
        },
        line: "#DCE5E0",
        app: "#FAFCFB",
      },
    },
  },
  plugins: [],
};

export default config;
