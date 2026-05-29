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
        brand: {
          green: '#10B981',
          blue: '#3B82F6',
          'light-green': '#D1FAE5',
          'light-blue': '#DBEAFE',
        },
        pastel: {
          pink: '#FFD1DC',
          blue: '#AEC6CF',
          green: '#77DD77',
          yellow: '#FDFD96',
          cream: '#FFFDD0',
          purple: '#B39EB5',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
        'gradient-soft': 'linear-gradient(135deg, #D1FAE5 0%, #DBEAFE 100%)',
      }
    },
  },
  plugins: [],
}
