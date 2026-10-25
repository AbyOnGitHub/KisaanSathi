/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'oswald': ['Oswald', 'sans-serif'],
        'work-sans': ['"Work Sans"', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.125rem', // 2px
        'md': '0.25rem',  // 4px
        'lg': '0.375rem', // 6px
      },
      colors: {
        'agri-primary': '#16a34a', // green-600
        'agri-dark': '#15803d', // green-700
        'agri-accent': '#d97706', // amber-600
        'agri-hot': '#dc2626', // red-600
        'agri-border': '#e5e7eb', // gray-200
      }
    },
  },
  plugins: [],
}
