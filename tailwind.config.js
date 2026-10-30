/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfbf7',
          100: '#faf5ec',
          200: '#f4ead6',
          300: '#ebd9b8',
          400: '#dcc18a',
          500: '#c9a462',
        },
        forest: {
          50: '#f0f7f0',
          100: '#dcebd9',
          200: '#bcd6b6',
          300: '#8fb888',
          400: '#5e8f5a',
          500: '#3d6b3a',
          600: '#2f562c',
          700: '#264523',
          800: '#1f371d',
          900: '#172b15',
        },
        gold: {
          50: '#fdfaf0',
          100: '#faf0d4',
          200: '#f3dfa3',
          300: '#eac96b',
          400: '#dcb045',
          500: '#c8982e',
          600: '#a87823',
          700: '#875c1e',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e3ecdf',
          200: '#c7d8c0',
          300: '#a0bd95',
          400: '#7a9d6b',
          500: '#5d8350',
          600: '#4a6b40',
          700: '#3b5634',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0,0,0,0.06)',
        'card': '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.12)',
        'forest': '0 4px 20px rgba(61,107,58,0.15)',
      },
    },
  },
  plugins: [],
};
