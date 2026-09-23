/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Emerald palette is aligned to the brand primary (#13795b).
      // emerald-600 is reserved for primary actions only (007 §3).
      colors: {
        emerald: {
          50: '#f0fdf7',
          100: '#dbf9eb',
          200: '#b8f2d8',
          300: '#7fe4bd',
          400: '#41cd9d',
          500: '#19b280',
          600: '#13795b',
          700: '#0e5f48',
          800: '#0c4c3b',
          900: '#0a3f31',
        },
      },
      spacing: {
        'touch': '48px',
      },
    },
  },
  plugins: [],
};