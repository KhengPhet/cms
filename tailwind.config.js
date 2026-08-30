/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b'
        },
        accent: {
          DEFAULT: '#ef4444',
          light: '#f87171',
          dark: '#b91c1c'
        }
      },
      fontFamily: {
        sans: [
          'Content',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        display: [
          'Playfair Display',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif'
        ]
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 4px 12px 0 rgba(0, 0, 0, 0.05)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 8px 24px -8px rgba(0, 0, 0, 0.08)',
        lift: '0 10px 30px -5px rgba(79, 70, 229, 0.2)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out both',
        'slide-in': 'slideIn 0.3s ease-out both',
        'scale-in': 'scaleIn 0.2s ease-out both',
        'slide-up': 'slideUp 0.4s ease-out both'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
}