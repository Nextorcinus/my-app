/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        russo: ['var(--font-russo)'],
        vt323: ['var(--font-vt323)'],
      },
    },
  },
  plugins: [],
}
