/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Source Sans 3', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f5f0eb',
          100: '#e8ddd2',
          200: '#d4c0a8',
          300: '#bda07e',
          400: '#a8825a',
          500: '#8c6840',
          600: '#714f2a',
          700: '#5a3c1a',
          800: '#42290f',
          900: '#2c1a07',
          950: '#1a0f02',
        },
        parchment: {
          50: '#fdfaf5',
          100: '#faf4e8',
          200: '#f4e9d0',
          300: '#ecddb8',
          400: '#e3d0a0',
          500: '#d9c288',
        },
        rust: {
          400: '#e07a5f',
          500: '#c8603f',
          600: '#b04a2c',
        },
        sage: {
          400: '#7a9e7e',
          500: '#5d8a62',
          600: '#4a7050',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
