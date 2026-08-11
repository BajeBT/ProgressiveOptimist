/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        optimist: {
          blue: '#003399',
          royal: '#002266',
          sky: '#0284C7',
          gold: '#F59E0B',
          amber: '#FFBF00',
          pearl: '#FAFAFC',
          light: '#F8FAFC',
          dark: '#0F172A'
        }
      },
      fontFamily: {
        sans: ['"Segoe UI Variable"', '"Segoe UI"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['"Segoe UI Variable"', '"Segoe UI"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'xl': ['1.06rem', { lineHeight: '1.5rem' }],
        '2xl': ['1.275rem', { lineHeight: '1.75rem' }],
        '3xl': ['1.59rem', { lineHeight: '2rem' }],
        '4xl': ['1.91rem', { lineHeight: '2.25rem' }],
        '5xl': ['2.55rem', { lineHeight: '1' }],
        '6xl': ['3.18rem', { lineHeight: '1' }],
        '7xl': ['3.82rem', { lineHeight: '1' }],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
