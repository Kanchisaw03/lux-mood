/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Spirit Blossom inspired color palette
        sakura: {
          50: '#fff0f7',
          100: '#ffe5f2',
          200: '#ffd1e8',
          300: '#ffadda',
          400: '#ff80c5',
          500: '#ff5cb0',
          600: '#ff2d8a',
          700: '#ff0066',
          800: '#d90057',
          900: '#b3004a',
        },
        mystic: {
          50: '#f0f4ff',
          100: '#e4ebff',
          200: '#cddaff',
          300: '#a8bfff',
          400: '#8099ff',
          500: '#5c70ff',
          600: '#3a4dff',
          700: '#2d3ae6',
          800: '#2630b8',
          900: '#212a94',
        },
        ethereal: {
          50: '#f5f0ff',
          100: '#ede5ff',
          200: '#dccbff',
          300: '#c3a4ff',
          400: '#aa74ff',
          500: '#9747ff',
          600: '#8520ff',
          700: '#7a0df5',
          800: '#6512c7',
          900: '#5412a0',
        },
        dream: {
          50: '#f0fdff',
          100: '#ccf7ff',
          200: '#99eeff',
          300: '#66e4ff',
          400: '#33daff',
          500: '#00d0ff',
          600: '#00a6cc',
          700: '#007d99',
          800: '#005366',
          900: '#002a33',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia'],
        display: ['Cinzel', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { filter: 'brightness(1) drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))' },
          '100%': { filter: 'brightness(1.2) drop-shadow(0 0 20px rgba(255, 255, 255, 0.9))' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 5px rgba(255, 255, 255, 0.5)',
        'glow': '0 0 10px rgba(255, 255, 255, 0.7)',
        'glow-lg': '0 0 20px rgba(255, 255, 255, 0.9)',
        'glow-xl': '0 0 30px rgba(255, 255, 255, 0.9), 0 0 10px rgba(151, 71, 255, 0.9)',
        'glow-sakura': '0 0 20px rgba(255, 0, 102, 0.7)',
        'glow-mystic': '0 0 20px rgba(92, 112, 255, 0.7)',
        'glow-ethereal': '0 0 20px rgba(151, 71, 255, 0.7)',
        'glow-dream': '0 0 20px rgba(0, 208, 255, 0.7)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

