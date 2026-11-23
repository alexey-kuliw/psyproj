/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        graphite: {
          950: '#0b0d10',
          900: '#12151a',
          800: '#1a1f27',
          700: '#242b35',
        },
        navy: {
          900: '#0e1624',
          800: '#152033',
          700: '#1c2b44',
        },
        steel: {
          100: '#d7dde6',
          200: '#b8c2d0',
          300: '#8f9baf',
          400: '#6b788c',
        },
        accent: {
          DEFAULT: '#5b7a95',
          soft: '#7a96ad',
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  safelist: [
    'ml-0',
    'ml-4',
    'ml-8',
    'ml-12',
    'md:ml-24',
    'md:ml-48',
    'md:ml-72',
    'md:col-span-2',
    'tracking-[0.2em]',
    'md:text-3xl',
  ],
  plugins: [],
};
