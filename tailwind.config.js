/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0a0a2e',
        bgCard: 'rgba(30, 30, 100, 0.7)',
        bgCardSolid: '#1a1a5e',
        purpleDeep: '#2d1b69',
        purpleMid: '#4a2c8a',
        purpleLight: '#7c5cbf',
        blueDeep: '#1a237e',
        blueMid: '#283593',
        blueBright: '#3f51b5',
        gold: '#ffc107',
        goldLight: '#ffd54f',
        goldDark: '#f9a825',
        colorSuccess: '#4caf50',
        colorWarning: '#ff7043',
        colorError: '#ef5350',
        colorXp: '#ffc107',
        pvThousands: '#a855f7',
        pvHundreds: '#3b82f6',
        pvTens: '#22c55e',
        pvOnes: '#f97316',
        pvThousandsBg: '#3b0764',
        pvHundredsBg: '#1e3a8a',
        pvTensBg: '#14532d',
        pvOnesBg: '#431407',
      },
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
