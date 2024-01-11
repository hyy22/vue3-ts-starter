/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,vue,tsx,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--theme-primary-color)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
