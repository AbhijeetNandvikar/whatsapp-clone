// tailwind.config.js
module.exports = {
  purge: [],
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        whatsapp: "url('/src/images/whatsappBg.png')",
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
