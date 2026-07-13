module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#e6ecf2",
        surface: "#f0f4f8",
        parchment: "#f0f4f8",
        sage: "#0d9488",
        ember: "#f97316",
        sky: "#0284c7",
      },
      boxShadow: {
        'neu-raised': '7px 7px 15px rgba(163, 177, 198, 0.6), -7px -7px 15px rgba(255, 255, 255, 0.9)',
        'neu-raised-sm': '4px 4px 8px rgba(163, 177, 198, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.85)',
        'neu-raised-lg': '10px 10px 22px rgba(163, 177, 198, 0.65), -10px -10px 22px rgba(255, 255, 255, 0.95)',
        'neu-inset': 'inset 4px 4px 8px rgba(163, 177, 198, 0.55), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
        'neu-inset-sm': 'inset 2px 2px 5px rgba(163, 177, 198, 0.45), inset -2px -2px 5px rgba(255, 255, 255, 0.85)',
      },
    },
  },
  plugins: [],
};

