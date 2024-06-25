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
          DEFAULT: '#686D76', // Primary color from Angular Material theme
          light: '#686D76',  // Light variant of the primary color
          dark: '#373A40',   // Dark variant of the primary color
        },
        secondary: {
          DEFAULT: '#EEEEEE',
          light: '#EEEEEE',
          dark: '#556060'
        },
        accent: {
          DEFAULT: '#DC5F00', // Accent color from Angular Material theme
          light: '#DC5F00',  // Light variant of the accent color
          dark: '#B34E00',   // Dark variant of the accent color
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
