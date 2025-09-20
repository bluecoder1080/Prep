/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0b0f13'
      },
      borderRadius: {
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}
