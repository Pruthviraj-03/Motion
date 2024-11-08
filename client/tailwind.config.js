/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-color": "#393d46",
        "dark-grey": "#9f9f9f",
        "medium-grey": "#cdcfd1",
        "light-grey": "#dcdcdc",
        "dark-white": "#ffffff",
        "medium-white": "#f5f5f5",
        "light-white": "#f6f7fb",
      },
    },
  },
  plugins: [],
};
