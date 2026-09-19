/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          '50': '#f2fbf4',
          '100': '#e0f6e5',
          '200': '#c2ebd0',
          '300': '#95dab3',
          '400': '#5fc18d',
          '500': '#39a46f',
          '600': '#298357',
          '700': '#236947',
          '800': '#1e5339',
          '900': '#194430',
        },
      }
    },
  },
  plugins: [],
}
