/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // "./pages/**/*.{html,js}",
    // "./components/**/*.{html,js}",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#12372A",
          1: "#436850",
          2: "#ADBC9F",
          3: "#FBFADA",
        },

        // error: "oklch(54% 0.22 29)",
      },
      spacing: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      screens: {
        sm: "640px",
        md: "768px",
      },
    },
  },
};
