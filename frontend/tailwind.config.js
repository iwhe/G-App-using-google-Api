/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#f0f4f9",
      },
      fontFamily: {
        roboto: `"Roboto Condensed", sans-serif`,
      },
    },
  },
  plugins: [],
};
