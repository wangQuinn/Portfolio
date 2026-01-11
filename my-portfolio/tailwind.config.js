module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'portfolio-red':'#eb4034',
        'portfolio-yellow':'#ebd744',
        'portfolio-green':'#63eb44',
        'portfolio-blue': '#4287f5',
      }

    },
  },
  plugins: [],
}
