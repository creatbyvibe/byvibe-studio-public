/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        'vibe-purple': '#7c3aed',
        'vibe-purple-light': '#8b5cf6',
        'vibe-purple-dark': '#6d28d9',
      },
      backgroundColor: {
        'cyber-dark': '#050505',
      },
    },
  },
  plugins: [],
}
