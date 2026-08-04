/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: { sans: ['Space Grotesk', 'sans-serif'] },
      // Colours resolve to the CSS custom properties defined in index.html, so the
      // utility classes and the hand-written rules share one set of theme tokens.
      colors: {
        bg: 'var(--bg)', surface: 'var(--surface)', card: 'var(--card)',
        'card-alt': 'var(--card-alt)', border: 'var(--border)', 'border-lt': 'var(--border-lt)',
        accent: 'var(--accent)', 'accent-h': 'var(--accent-h)', 'accent-soft': 'var(--accent-soft)',
        'accent-border': 'var(--accent-line)', muted: 'var(--muted)', sub: 'var(--sub)',
      },
    },
  },
  plugins: [],
}
