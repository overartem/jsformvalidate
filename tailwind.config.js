/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      lineHeight: {
        11: "1.125rem",
      },
    },
    container: {
      center: true,
    },
  },
  plugins: [],
}; 

