const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['"Pretendard Variable"', 'sans-serif'],
    },
    screens: {
      '3xs': '365px',
      '2xs': '440px',
      xs: '525px',
      ...defaultTheme.screens,
    },
    extend: {},
  },
  darkMode: 'media',
  plugins: [require('@tailwindcss/line-clamp')],
};
