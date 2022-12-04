/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors : {
        "green":"#1DB954",
        "dark":"#191414",
        "light-black":"#282828",
        "primary":"#FFFFFF",
        "secondary":"#b3b3b3",
        "gray":"#535353"
      }
    },
  },
  plugins: [],
}