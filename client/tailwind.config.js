/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  important: true,
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        surface: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto Condensed', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Roboto Condensed', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-accent': '0 0 20px rgba(249, 115, 22, 0.5)',
        'inner-glow': 'inset 0 2px 10px rgba(255, 255, 255, 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities, addComponents }) => {
      // Base utilities
      addUtilities({
        '.writing-mode-vertical': {
          'writing-mode': 'vertical-lr',
        },
        '.writing-mode-initial': {
          'writing-mode': 'initial',
        },
        '.link': {
          '@apply text-primary-600 underline dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors': {},
        },
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.glass': {
          '@apply bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border border-white/20 dark:border-white/10': {},
        },
        '.glass-strong': {
          '@apply bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl border border-white/30 dark:border-white/10': {},
        },
      });

      // Button components
      const btnBase = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        fontWeight: '500',
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
        transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        border: '1px solid transparent',
        cursor: 'pointer',
        '&:disabled': {
          opacity: '0.5',
          cursor: 'not-allowed',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineOffset: '2px',
        },
      };

      addComponents({
        '.btn': {
          ...btnBase,
          '@apply bg-surface-100 text-surface-900 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-100 dark:hover:bg-surface-700 focus:outline-primary-500': {},
        },
        '.btn-primary': {
          ...btnBase,
          '@apply bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow focus:outline-primary-500 dark:bg-primary-600 dark:hover:bg-primary-500': {},
        },
        '.btn-accent': {
          ...btnBase,
          '@apply bg-accent-500 text-white hover:bg-accent-600 shadow-sm hover:shadow focus:outline-accent-500': {},
        },
        '.btn-success': {
          ...btnBase,
          '@apply bg-success-600 text-white hover:bg-success-700 shadow-sm focus:outline-success-500': {},
        },
        '.btn-danger': {
          ...btnBase,
          '@apply bg-error-600 text-white hover:bg-error-700 shadow-sm focus:outline-error-500': {},
        },
        '.btn-ghost': {
          ...btnBase,
          '@apply bg-transparent text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800 focus:outline-surface-400': {},
        },
        '.btn-outline': {
          ...btnBase,
          '@apply bg-transparent border-surface-300 text-surface-700 hover:bg-surface-50 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-800 focus:outline-primary-500': {},
        },
        '.btn-sm': {
          padding: '0.375rem 0.75rem',
          fontSize: '0.75rem',
          borderRadius: '0.375rem',
        },
        '.btn-lg': {
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          borderRadius: '0.75rem',
        },
        '.btn-icon': {
          padding: '0.5rem',
          borderRadius: '0.5rem',
        },
      });

      // Card components
      addComponents({
        '.card': {
          '@apply bg-white dark:bg-surface-800 rounded-xl shadow-soft border border-surface-200 dark:border-surface-700 overflow-hidden transition-shadow duration-200 hover:shadow-soft-lg': {},
        },
        '.card-interactive': {
          '@apply card cursor-pointer transform transition-all duration-200 hover:-translate-y-1': {},
        },
      });

      // Input components
      addComponents({
        '.input': {
          '@apply w-full px-4 py-2.5 bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-lg text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:ring-primary-400/50 dark:focus:border-primary-400': {},
        },
        '.input-sm': {
          '@apply px-3 py-2 text-sm rounded-md': {},
        },
        '.input-lg': {
          '@apply px-5 py-3 text-lg rounded-xl': {},
        },
      });

      // Badge components
      addComponents({
        '.badge': {
          '@apply inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium': {},
        },
        '.badge-primary': {
          '@apply badge bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300': {},
        },
        '.badge-accent': {
          '@apply badge bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300': {},
        },
        '.badge-success': {
          '@apply badge bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300': {},
        },
        '.badge-warning': {
          '@apply badge bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300': {},
        },
        '.badge-error': {
          '@apply badge bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300': {},
        },
        '.badge-neutral': {
          '@apply badge bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200': {},
        },
      });

      // Skeleton loading
      addComponents({
        '.skeleton': {
          '@apply bg-surface-200 dark:bg-surface-700 animate-pulse rounded': {},
        },
        '.skeleton-shimmer': {
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          backgroundSize: '200% 100%',
          '@apply animate-shimmer': {},
        },
      });
    }),
  ],
};
