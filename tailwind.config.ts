import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        backdrop: '#0F172A',
        accent: '#6366F1',
        subtle: '#94A3B8',
        success: '#22C55E',
        warning: '#F97316',
      },
      boxShadow: {
        glow: '0 10px 50px rgba(99, 102, 241, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};

export default config;
