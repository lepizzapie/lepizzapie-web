/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pizza-red': '#DC2626',
        'pizza-orange': '#EA580C',
        'pizza-yellow': '#F59E0B',
        'pizza-cream': '#FEF3C7',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 