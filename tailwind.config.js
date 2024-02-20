/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#00476B",
        secondary: "#006187",
        orange: "#ED6E00",
      }
    },
  },
  plugins: [],
}

