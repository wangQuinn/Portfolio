/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",        // all files in app folder
    "./components/**/*.{js,ts,jsx,tsx}", // all files in components folder
    "./pages/**/*.{js,ts,jsx,tsx}",      // in case you have pages folder
  ],
  theme: {
    extend: {
      colors:{
        'portfolio-red':'#eb4034',
        'portfolio-yellow':'#ebd744',
        'portfolio-green':'#63eb44',
        'portfolio-blue': '#4287f5',
      }

    },
  },
  plugins: [],
}
