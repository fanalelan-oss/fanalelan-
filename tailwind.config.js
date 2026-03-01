/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-tajawal)', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(to right, #FDE047, #FBBF24, #F59E0B)',
      },
      boxShadow: {
        'gold': '0 10px 15px -3px rgba(252, 211, 77, 0.2), 0 4px 6px -2px rgba(252, 211, 77, 0.1)',
        'gold-hover': '0 20px 25px -5px rgba(252, 211, 77, 0.3), 0 10px 10px -5px rgba(252, 211, 77, 0.1)',
      },
      keyframes: {
        'shadow-gold': {
          '0%, 100%': { boxShadow: '0 10px 15px -3px rgba(252, 211, 77, 0.2), 0 4px 6px -2px rgba(252, 211, 77, 0.1)' },
          '50%': { boxShadow: '0 20px 25px -5px rgba(252, 211, 77, 0.3), 0 10px 10px -5px rgba(252, 211, 77, 0.1)' },
        },
      },
      animation: {
        'shadow-gold': 'shadow-gold 5s infinite',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/aspect-ratio'),
  ],
}