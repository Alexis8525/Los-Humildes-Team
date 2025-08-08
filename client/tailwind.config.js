module.exports = {
    content: [
      "./src/**/*.{html,ts,scss}",
    ],
    theme: {
      extend: {
        colors: {
          fondo: 'var(--color-fondo)',
          btns: 'var(--color-btns)',
          blanco: 'var(--color-blanco)',
          // Agrega otras variables según necesites
        },
      },
    },
    plugins: [],
  }
  