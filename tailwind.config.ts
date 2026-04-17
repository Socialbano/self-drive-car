import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-error-container": "#93000a",
        "surface-tint": "#4d5f7d",
        "primary-container": "#0b1f3a",
        "on-surface-variant": "#44474d",
        "outline-variant": "#c4c6ce",
        "on-primary-container": "#7587a7",
        "on-tertiary-fixed": "#002109",
        "surface-container-low": "#f3f3f3",
        "surface-container-lowest": "#ffffff",
        "error": "#ba1a1a",
        "on-surface": "#1a1c1c",
        "surface-bright": "#f9f9f9",
        "surface-container-highest": "#e2e2e2",
        "surface-variant": "#e2e2e2",
        "on-background": "#1a1c1c",
        "inverse-on-surface": "#f1f1f1",
        "on-tertiary-fixed-variant": "#005322",
        "inverse-surface": "#2f3131",
        "error-container": "#ffdad6",
        "on-primary": "#ffffff",
        "on-secondary-container": "#6b4500",
        "background": "#f9f9f9",
        "tertiary-container": "#00250b",
        "outline": "#75777e",
        "on-secondary-fixed-variant": "#633f00",
        "primary": "#000615",
        "primary-fixed-dim": "#b5c7ea",
        "inverse-primary": "#b5c7ea",
        "on-primary-fixed": "#071c36",
        "on-secondary": "#ffffff",
        "surface-dim": "#dadada",
        "secondary": "#835500",
        "secondary-container": "#feae2a",
        "tertiary": "#000801",
        "on-error": "#ffffff",
        "on-tertiary": "#ffffff",
        "surface-container-high": "#e8e8e8",
        "surface-container": "#eeeeee",
        "tertiary-fixed": "#66ff8e",
        "on-tertiary-container": "#009b46",
        "on-primary-fixed-variant": "#364764",
        "secondary-fixed-dim": "#ffb954",
        "on-secondary-fixed": "#291800",
        "tertiary-fixed-dim": "#3de273",
        "primary-fixed": "#d6e3ff",
        "surface": "#f9f9f9",
        "secondary-fixed": "#ffddb4",
        "whatsapp": "#25D366"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      fontFamily: {
        headline: ['var(--font-heading)', 'var(--font-plus-jakarta)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        label: ['var(--font-body)', 'sans-serif'],
        'plus-jakarta': ['var(--font-plus-jakarta)', 'sans-serif'],
      },
      maxWidth: {
        container: '1280px',
      },
      animation: {
        'pulse-ring': 'pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.4)' },
          '50%':      { boxShadow: '0 0 0 15px rgba(37, 211, 102, 0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
