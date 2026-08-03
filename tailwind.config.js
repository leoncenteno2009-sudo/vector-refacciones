/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          100: '#FFFFFF',
          200: '#F8F9FA',
          300: '#F1F3F5',
        },
        carbon: '#0D0F12',
        graphite: '#16181D',
        'text-secondary': '#525866',
        steel: '#9EA5B0',
        vector: {
          red: '#D92B2B',
          darkRed: '#A81B1B',
          blueDiag: '#0088FF',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        site: '1440px',
      },
    },
  },
  plugins: [],
}
