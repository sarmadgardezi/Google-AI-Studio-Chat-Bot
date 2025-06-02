// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}', // If you have a separate components folder outside app
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Add this if you are using a `src` directory
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'brand-primary': '#4f46e5', // Indigo-600
        'brand-secondary': '#10b981', // Emerald-500
        'background-light': '#f9fafb', // gray-50
        'background-dark': '#1f2937',  // gray-800
        'text-light': '#f3f4f6',      // gray-100
        'text-dark': '#111827',       // gray-900
      }
    },
  },
  plugins: [],
}
export default config