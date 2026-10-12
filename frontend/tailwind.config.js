/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef3ff',
          100: '#dce6ff',
          200: '#bccdff',
          300: '#93abff',
          400: '#6580f7',
          500: '#4560ec',
          600: '#2f45d1',
          700: '#2636a8',
          800: '#232f86',
          900: '#212b6a',
        },
        sidebar: {
          DEFAULT: '#0e1628',
          hover: '#18233b',
          active: '#1f2d4d',
          border: '#1b2742',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.05), 0 1px 3px rgba(16,24,40,0.06)',
        pop: '0 12px 32px -8px rgba(16,24,40,0.22), 0 2px 6px rgba(16,24,40,0.08)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'none' },
        },
      },
      animation: {
        'fade-in': 'fade-in 160ms ease-out',
        'slide-in-right': 'slide-in-right 200ms ease-out',
      },
    },
  },
  plugins: [],
};
