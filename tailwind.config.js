/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        navy: { DEFAULT: '#0A1628', light: '#162540', dark: '#060F1A' },
        warm:  '#F5F4F0',
        brand: {
          dulux:      '#CC0000',
          ppg:        '#0066B3',
          sw:         '#007B40',
          bm:         '#B8860B',
          behr:       '#E05020',
          cloverdale: '#007B8A',
          carboline:  '#444',
          glidden:    '#C67000',
          perma:      '#5B4FCF',
          topgun:     '#1E6B9C',
        },
      },
      boxShadow: {
        card:       '0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.06)',
        'card-lg':  '0 8px 24px rgba(0,0,0,.10),0 2px 6px rgba(0,0,0,.07)',
      },
    },
  },
  plugins: [],
}
