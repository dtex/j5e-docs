module.exports = {
  purge: [ 
    './docs/**/*.html',
    'index.html',
  ],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    colors: {
      "xiketic": {
        "light": "#ef81d3",
        "dark": "#12020e",
        "DEFAULT": "#170312"
      },
      "seaweed": {
        "light": "#51e5f5",
        "dark": "#022327",
        "DEFAULT": "#087e8b"
      },
      "purple": {
        "light": "#f778ed",
        "dark": "#130112",
        "DEFAULT": "#33032f"
      },
      "orange": {
        "light": "#fad4b2",
        "dark": "#3a1d04",
        "DEFAULT": "#f28f3b"
      },
      "red": "#ff0000",
      "white": "#ffffff",
      "black": "#000000",
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
