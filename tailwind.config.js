/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          400: '#fbbf24',
          500: '#f59e0b'
        }
      }
    },
  },
  // Include @tailwindcss/animate for extra animation utilities such as
  // fade-in and slide-up effects used in the hero and cards. Ensure
  // this package is installed via npm.
  plugins: [
    require('tailwindcss-animate')
  ],
};