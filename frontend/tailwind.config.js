/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          50:  '#FAF6F0',
          100: '#F0E6D0',
          200: '#D9C5A0',
          300: '#C4A97A',
          400: '#B08D60',
          500: '#8C6A3C',
          600: '#6B4E2A',
          700: '#4A3420',
          800: '#2C1E12',
          900: '#1A0E08',
          950: '#0D0704',
        },
        gold: {
          300: '#F0D878',
          400: '#D4AF37',
          500: '#C9A227',
          600: '#A8861F',
        },
        cream: '#F5EDD8',
        roast: '#3B1A0D',
        ink:   '#1A0E08',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['Outfit', 'system-ui', 'sans-serif'],
        lato:  ['Lato', 'sans-serif'],
      },
      animation: {
        'fade-in-up':  'fadeInUp 0.8s ease-out forwards',
        'marquee':     'marquee 22s linear infinite',
        'spin-slow':   'spin 3s linear infinite',
        'pulse-slow':  'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
