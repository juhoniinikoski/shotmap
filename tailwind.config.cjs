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
    },
  },
  plugins: [],
};

module.exports = config;
