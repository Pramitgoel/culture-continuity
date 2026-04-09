import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#b7862d',
        secondary: '#8f651d',
        accent: '#c96f40',
      },
    },
  },
  plugins: [],
}
export default config
