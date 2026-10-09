/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: 'var(--bg)',
          surface: 'var(--surface)',
          'surface-2': 'var(--surface-2)',
          border: 'var(--border)',
          'border-strong': 'var(--border-strong)',
          text: 'var(--text)',
          muted: 'var(--muted)',
          primary: 'var(--primary)',
          'primary-strong': 'var(--primary-strong)',
          'primary-hover': 'var(--primary-hover)',
          'primary-soft': 'var(--primary-soft)',
          'primary-soft-2': 'var(--primary-soft-2)',
          success: 'var(--success)',
          warning: 'var(--warning)',
          error: 'var(--error)',
          info: 'var(--info)',
          overlay: 'var(--overlay)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],        // 12/16
        sm: ['0.875rem', { lineHeight: '1.25rem' }],    // 14/20
        base: ['1rem', { lineHeight: '1.5rem' }],       // 16/24
        lg: ['1.125rem', { lineHeight: '1.75rem' }],    // 18/28
        xl: ['1.25rem', { lineHeight: '1.75rem' }],     // 20/28
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24/32
        '3xl': ['1.875rem', { lineHeight: '2.375rem' }],// 30/38
        '4xl': ['2.25rem', { lineHeight: '2.75rem' }],  // 36/44
      },
      borderRadius: {
        control: '8px',
        card: '12px',
        modal: '16px',
        pill: '9999px',
      },
      boxShadow: {
        'shadow-1': '0 1px 2px rgba(28,31,35,.06)',
        'shadow-2': '0 4px 12px rgba(28,31,35,.08)',
        'shadow-3': '0 12px 32px rgba(28,31,35,.16)',
      },
      screens: {
        sm: '480px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      }
    },
  },
  plugins: [],
}
