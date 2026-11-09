import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        autumn: {
          50: '#fdf8f4',
          100: '#f9eee5',
          200: '#f3d9c7',
          300: '#e9bca0',
          400: '#dc926e',
          500: '#ce6c42',
          600: '#b85133',
          700: '#993f2a',
          800: '#7c3527',
          900: '#662f23',
          950: '#38160f',
        },
        harvest: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#eab308',
          500: '#ca8a04',
          600: '#a16207',
          700: '#854d0e',
          800: '#713f12',
          900: '#5e3412',
        },
        cranberry: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d2d9',
          300: '#f4adb9',
          400: '#ec7c92',
          500: '#df4e6c',
          600: '#ca3253',
          700: '#a92441',
          800: '#8c2139',
          900: '#771f34',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e6ede6',
          200: '#ceddce',
          300: '#a9c2aa',
          400: '#7ea180',
          500: '#5e8461',
          600: '#49694c',
          700: '#3c543f',
          800: '#334435',
          900: '#2c3a2e',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
} satisfies Config;
