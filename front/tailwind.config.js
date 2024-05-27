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
        secondary: {
          DEFAULT: "#F3CA52",
          1: "#F6E9B2",
          // 2: "#ADBC9F",
          // 3: "#FBFADA",
        },
        button: {
          DEFAULT: "#ED9455",
          1: "#FFBB70",
          2: "#FFEC9E",
          3: "#FFFBDA",
        },
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
