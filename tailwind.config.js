/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2E7D32',
        'primary-dark': '#1B5E20',
        secondary: '#43A047',
        accent: '#66BB6A',
        warning: '#FF5722',
        info: '#2196F3',
        background: '#F5F5F5',
        'dark-bg': '#1A1A1A',
        'dark-surface': '#2D2D2D',
        'dark-border': '#404040',
      },
    },
  },
  plugins: [],
}