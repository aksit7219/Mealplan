/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ebecf5", // Very light
          100: "#d7daec", // Light
          200: "#c3c8e3", // Lighter
          300: "#afb5d9", // Soft light
          400: "#9ba3d0", // Softer light
          500: "#8791c7", // Neutral
          600: "#737ebd", // Soft medium
          700: "#5f6cb4", // Medium
          800: "#4b5aab", // Darker medium
          900: "#3848a2", // Dark
          DEFAULT: "#2c3981", // Main brand color
        },
        secondary: {
          light: "#FBBF24",
          DEFAULT: "#F59E0B",
          dark: "#B45309",
        },
        accent: {
          light: "#38BDF8",
          DEFAULT: "#0EA5E9",
          dark: "#0284C7",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
    },
  },
  plugins: [],
});
