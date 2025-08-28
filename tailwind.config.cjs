/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx,astro}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx,astro}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx,astro}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx,astro}',
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        border: 'hsl(var(--border))',
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        muted: 'hsl(var(--muted))',
        terminal: 'hsl(var(--terminal))',
        accent: {
          DEFAULT: 'hsl(var(--primary))',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          orange: '#F97316',
        },
      },
      fontFamily: {
        mono: ['Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      animation: {
        'typing': 'typing 2s steps(30, end), blink-caret .75s step-end infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        typing: {
          from: { width: '0' },
          to: { width: '100%' }
        },
        'blink-caret': {
          'from, to': { 'border-color': 'transparent' },
          '50%': { 'border-color': 'hsl(var(--terminal))' }
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          from: { transform: 'translateY(-20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' }
        },
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 220, 130, 0.5), 0 0 40px rgba(0, 220, 130, 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(0, 220, 130, 0.8), 0 0 60px rgba(0, 220, 130, 0.4)' 
          }
        }
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography'),
  ],
}