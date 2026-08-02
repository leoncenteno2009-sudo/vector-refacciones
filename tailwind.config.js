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
          100: '#F4F1EA',
          200: '#E9E5DC',
          300: '#DDD8CE',
        },
        carbon: '#171717',
        graphite: '#1B1F24',
        'text-secondary': '#5E625F',
        steel: '#AAB0B6',
        vector: {
          red: '#B62025',
          darkRed: '#86171B',
          blueDiag: '#78BDE7',
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
