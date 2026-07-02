import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy:      '#1e3a5f',
          navyLight: '#2e5282',
          yellow:    '#ffba08',
          brown:     '#d4a373',
          brownDark: '#a0714a',
          sky:       '#7ac7e1',
        },
      },
      keyframes: {
        'scroll-brands': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333%)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'scroll-brands': 'scroll-brands 28s linear infinite',
        'fadeUp':        'fadeUp 0.6s ease-out both',
      },
      boxShadow: {
        header:      '0 1px 0 0 rgba(0,0,0,0.06), 0 4px 16px -4px rgba(0,0,0,0.08)',
        card:        '0 2px 8px -2px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover':'0 12px 32px -8px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
        trust:       '0 -8px 24px -4px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
};

export default config;