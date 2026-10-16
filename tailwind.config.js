/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './cat.html',
    './pages/**/*.html',
    './*.js',
    './pages/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDFA',
        chocolate: '#3C2415',
        blush: '#F2C4CE',
        gold: '#D4AF37'
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
