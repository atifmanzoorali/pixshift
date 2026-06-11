import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          hover: '#6D28D9',
        },
        secondary: {
          DEFAULT: '#1E1B33',
        },
        accent: {
          DEFAULT: '#A78BFA',
        },
        surface: '#131220',
        elevated: '#1A1830',
        muted: '#9490AD',
        border: {
          DEFAULT: '#252342',
          strong: '#3D3A52',
          focus: '#7C3AED',
        },
        neutral: {
          50:  '#F4F4FF',
          100: '#E8E7F5',
          200: '#C5C3D8',
          300: '#A09DB8',
          400: '#7B7894',
          500: '#5A5770',
          600: '#3D3A52',
          700: '#2A2840',
          800: '#1A1830',
          900: '#09090F',
        },
        success: {
          DEFAULT: '#22C55E',
          bg: '#052E16',
        },
        warning: {
          DEFAULT: '#F59E0B',
          bg: '#1C1500',
        },
        error: {
          DEFAULT: '#EF4444',
          bg: '#2A0808',
        },
        info: {
          DEFAULT: '#3B82F6',
          bg: '#0C1A2E',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.06)',
        md: '0 4px 12px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.10)',
        lg: '0 8px 24px rgba(0,0,0,0.6), 0 0 20px rgba(124,58,237,0.12)',
        xl: '0 16px 48px rgba(0,0,0,0.7), 0 0 40px rgba(124,58,237,0.18)',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
};

export default config;
