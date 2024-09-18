/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#f0f4f9",
      },
      colors: {
        "brand-text-1": "#ff7f50",
        "brand-text-2": "#ff6347",
        "brand-text-3": "#ff4500",
        surface: "#ffffff",
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(74deg, #4285f4 0, #9b72cb 9%, #d96570 20%, #d96570 24%, #9b72cb 35%, #4285f4 44%, #9b72cb 50%, #9b72cb 56%, #d96570 75%, #d96570 100%)",
        // "linear-gradient(74deg, #4285f4 0%, #9b72cb 9%, #d96570 20% #9b72cb 35%, #ef47ff 44%, #ef47ff 50%, #ef47ff 56%, #00c9ff 75%, #ef47ff 100%)",
        // "linear-gradient(124deg, #ef47ff 0%, #89d01c 35%, #d81bc1 44%, #d81bc1 50%, #ef47ff 56%, #00c9ff 75%, #ef47ff 100%)",
      },
      fontFamily: {
        roboto: `"Roboto Condensed", sans-serif`,
      },
    },
  },
  plugins: [],
};
