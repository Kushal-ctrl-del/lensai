/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#080810',
        card: 'rgba(255, 255, 255, 0.06)',
        violet: {
          500: '#7C3AED',
        },
        cyan: {
          500: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      }
    },
  },
  plugins: [],
}
