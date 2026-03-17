/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        mercadona: {
          green: '#00875a',
          'green-dark': '#005c3c',
          'green-light': '#e6f4ef',
          orange: '#f4720b',
        },
      },
    },
  },
  plugins: [],
}
