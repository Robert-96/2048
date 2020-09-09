module.exports = {
  purge: {
    content: ['./src/**/*.html'],
    options: {
      whitelistPatterns: [/^bg-/]
    }
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
