/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8c7039', // Primary color from Angular Material theme
          light: '#8c7039',  // Light variant of the primary color
          dark: '#735925',   // Dark variant of the primary color
        },
        secondary: {
          DEFAULT: '#AAC1C0',
          light: '#AAC1C0',
          dark: '#556060'
        },
        accent: {
          DEFAULT: '#726794', // Accent color from Angular Material theme
          light: '#726794',  // Light variant of the accent color
          dark: '#392E60',   // Dark variant of the accent color
        },
        warn: {
          DEFAULT: '#e63946', // Warn color from Angular Material theme
          light: '#ff7961',  // Light variant of the warn color
          dark: '#ba000d',   // Dark variant of the warn color
        }
      },
    },
  },
  plugins: [],
};
