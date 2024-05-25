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
      },
      keyframes: {
        bouncing: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-25%)" },
        }
      },
      animation: {
        bounce1: "bouncing 1s infinite 0s",
        bounce2: "bouncing 1s infinite 0.2s",
        bounce3: "bouncing 1s infinite 0.4s",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

