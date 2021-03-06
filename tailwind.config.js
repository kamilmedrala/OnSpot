module.exports = {
  
  purge: [
    'public/index.html',
    'public/resources/js/*'
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        main: " 'Nunito', 'ui-sans-serif', 'system-ui' ",
      },
      width: {
        laptop: "1024px",
        tablet: "765px",
        phonewide: "640px",
        phone: "320px",
      },
      minHeight: {
        laptop: "1024px",
        tablet: "765px",
        phonewide: "640px",
        phone: "320px",
      },
    },
  },
  variants: {
    extend: {
      animation: ["hover"],
      filter: ["hover"],
    },
  },
  plugins: [
      require('@tailwindcss/line-clamp'),
  ],
};
