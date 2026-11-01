const tokens = [
  'bg', 'surface', 'surface-2', 'border', 'text', 'muted', 'accent', 'accent-fg', 'accent-soft',
  'good', 'good-soft', 'bad', 'bad-soft',
]

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: Object.fromEntries(tokens.map(t => [t, `rgb(var(--${t}) / <alpha-value>)`])),
      fontFamily: {
        lexend: ['Lexend', 'system-ui', 'sans-serif'],
        atkinson: ['"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
        sans: ['system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: { DEFAULT: '8px', lg: '14px' },
      boxShadow: { card: '0 1px 2px rgb(0 0 0 / .04), 0 4px 16px rgb(0 0 0 / .05)' },
    },
  },
  plugins: [],
}
