/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,md}", "./_component-library/**/*.liquid"],
  theme: {
    extend: {
      colors: {
        Example: {
          green: "#B4E89B",
          mutedgreen: "#799C68",
          darkgreen: "#060D02",
          creme: "#E4C590",
          gray: "#242626",
          light: "#474949",
        },
      },
    },
  },
  // safelist: [
  //       {
  //         pattern: /.+/,
  //       },
  //     ],
  plugins: [],
};
