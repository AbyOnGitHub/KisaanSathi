/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          primary: "#16a34a",
          dark: "#15803d",
          light: "#dcfce7",
          accent: "#f59e0b",
          hot: "#dc2626",
          bg: "#f3f4f6",
          card: "#ffffff",
          text: "#111827",
          muted: "#6b7280",
          border: "#e5e7eb",
          star: "#fbbf24",
          success: "#10b981",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'sticky-header': '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
