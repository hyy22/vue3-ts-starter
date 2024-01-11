module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: file => {
        return file.indexOf('vant') !== -1 ? 375 : 750;
      },
    },
  },
};
