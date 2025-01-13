/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors:{
        'custom-blue':'#074d60',
        'dark-gray':'#212832',
        'blue-text':'#055ca6',
        'sub-text':'#9b9c9e',
        'git-repo-text':'#c3c4c6',
        'input-bg':'#2a343f'
      },
      spacing:{
      'custom':'4rem'
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
};
