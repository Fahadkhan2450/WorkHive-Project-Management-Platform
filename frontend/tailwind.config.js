/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}" // your frontend source files
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "sans-serif"], // your custom font
        gothic: ["'Special Gothic Expanded One'", "sans-serif"], // optional second font
      },
      colors: {
        primary: "#2172f0", // your primary color
      },
      screens: {
        "3xl": "1920px", // custom breakpoint
      },
    },
  },
  plugins: [],
};
