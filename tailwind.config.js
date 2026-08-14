/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2f8', 100: '#d7e0ee', 200: '#aebedd', 300: '#7f97c4',
          400: '#4d6aa0', 500: '#2c4676', 600: '#1c2f57',
          700: '#14213f', 800: '#0f1930', 900: '#0B1F3A', 950: '#070f1f'
        },
        brand: {
          blue: '#1D63ED', 'blue-dark': '#134BC0',
          green: '#16A34A', 'green-dark': '#0E7A38',
          amber: '#F59E0B'
        }
      },
      fontFamily: {
        display: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,31,58,0.06), 0 4px 16px rgba(11,31,58,0.06)',
        pop: '0 8px 30px rgba(11,31,58,0.12)'
      },
      borderRadius: { xl2: '1.25rem' }
    },
  },
  plugins: [],
}
