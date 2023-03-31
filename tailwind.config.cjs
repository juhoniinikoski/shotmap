/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "fliiga-yellow": "#C8B437",
      },
      backgroundColor: {
        "fliiga-yellow": "#C8B437",
      },
      width: {
        "5/4": "125%",
      },
      fill: {
        "scatter-green": "#6BD2A7",
        "scatter-yellow": "#F8FA98",
        "scatter-red": "#FAA198",
      },
      animation: {
        "fade-in-scatters": "fade-up-in 0.5s",
      },
      keyframes: {
        // these fades has "strange" directions
        // as scatters are rotated 90 degrees for screen
        "fade-up-in": {
          "0%": {
            opacity: "0",
            transform: "translateX(-10px) scale(0.99)",
            "transform-origin": "left",
          },
          "50%": {
            opacity: "1",
            transform: "translateX(0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};

module.exports = config;
