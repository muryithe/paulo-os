import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        gold: '#c9a84c',
        'gold-lt': '#e0c070',
        teal: '#2eb8b8',
        'teal-lt': '#4ed4d4',
        amber: '#d4845a',
      },
    },
  },
  plugins: [],
}
export default config
