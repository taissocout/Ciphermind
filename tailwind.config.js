/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#0a0e1a',
        surface: '#0f1626',
        card:    '#141c2e',
        border:  '#1e2d4a',
        accent:  '#00ff88',
        accent2: '#00c4ff',
        warn:    '#ff6b35',
        danger:  '#ff3b5c',
        muted:   '#4a5a7a',
        text:    '#c8d8f0',
      },
      fontFamily: {
        mono:    ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Mono"', 'monospace'],
      },
      animation: {
        pulse_slow: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
