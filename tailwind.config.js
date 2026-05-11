/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        retro: ['"VT323"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#0a0a0f',
          secondary: '#12121a',
          card: '#16161f',
          border: '#2a2a3a',
        },
        neon: {
          green: '#00ff87',
          cyan: '#00e5ff',
          pink: '#ff00ff',
          yellow: '#ffd700',
          orange: '#ff6b35',
        },
        pixel: {
          light: '#e8e8e8',
          dim: '#8888aa',
          dark: '#444466',
        },
      },
      boxShadow: {
        'neon-green': '0 0 8px #00ff87, 0 0 20px rgba(0, 255, 135, 0.3)',
        'neon-cyan': '0 0 8px #00e5ff, 0 0 20px rgba(0, 229, 255, 0.3)',
        'neon-pink': '0 0 8px #ff00ff, 0 0 20px rgba(255, 0, 255, 0.3)',
        'neon-yellow': '0 0 8px #ffd700, 0 0 20px rgba(255, 215, 0, 0.3)',
        'pixel': '4px 4px 0px #00ff87',
        'pixel-pink': '4px 4px 0px #ff00ff',
        'pixel-cyan': '4px 4px 0px #00e5ff',
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'float': 'float 3s ease-in-out infinite',
        'pixel-pulse': 'pixel-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pixel-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px #00ff87, 0 0 20px rgba(0, 255, 135, 0.3)' },
          '50%': { boxShadow: '0 0 16px #00ff87, 0 0 40px rgba(0, 255, 135, 0.6)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0,255,135,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,135,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
