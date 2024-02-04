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
        "main-80": "rgba(0, 71, 107, 0.8)",
        "main-50": "rgba(0, 71, 107, 0.5)",
        "main-20": "rgba(0, 71, 107, 0.2)",
        "main-5": "rgba(0, 71, 107, 0.05)",
        secondary: "#006187",
        "secondary-80": "rgba(0, 97, 135, 0.8)",
        "secondary-50": "rgba(0, 97, 135, 0.5)",
        "secondary-20": "rgba(0, 97, 135, 0.2)",
        "secondary-5": "rgba(0, 97, 135, 0.05)",
        orange: " #ED6E00",
        "orange-80": "rgba(255, 80, 0, 0.8)",
        "orange-50": "rgba(255, 80, 0, 0.5)",
        "orange-20": "rgba(255, 80, 0, 0.2)",
        "orange-5": "rgba(255, 80, 0, 0.05)",
      }
    },
  },
  plugins: [],
}

