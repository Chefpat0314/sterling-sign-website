module.exports = {
  plugins: {
    // Use the standard Tailwind plugin here. The `tailwindcss/postcss` subpath
    // is not exported by Tailwind, which can cause build errors. This
    // configuration works with Tailwind v3 and later.
    tailwindcss: {},
    autoprefixer: {},
  },
};