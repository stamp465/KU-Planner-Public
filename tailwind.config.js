function generateGridColumns() {
  let obj = {}
  for (let i = 13; i < 33; i++) {
    obj[`${i}`] = `repeat(${i}, minmax(0, 1fr))`
  }
  return obj
}

function generateGridRow() {
  let obj = {}
  for (let i = 7; i < 33; i++) {
    obj[`span-${i}`] = `span ${i} / span ${i}`
  }
  return obj
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nofill: "transparent",
        neutral: {
          black: "#02000C",
          grey: {
            900: "#212529",
            800: "#343A40",
            700: "#495057",
            600: "#868E96",
            500: "#ADB5BD",
            400: "#CED4DA",
            300: "#DEE2E6",
            200: "#E9ECEF",
            100: "#F1F3F5",
            50: "#F8F9FA",
          },
          white: "#FFFFFF",
        },
        primary: {
          green: {
            900: "#002706",
            700: "#045C11",
            500: "#22A036",
            300: "#72D882",
            100: "#B1EBBA",
            50: "#BBF4C3",
            25: "#ECFFEE",
            10: "#F6FFF7",
          },
        },
        secondary: {
          blue: {
            900: "#0D5942",
            700: "#1A8867",
            500: "#3CAD8B",
            300: "#66C5A8",
            100: "#81D6BC",
            50: "#A9E0D0",
            25: "#DCFCF3",
            10: "#EFFFFA",
          },
        },
        day: {
          sun: {
            DEFAULT: "#E81919",
            500: "#FC3F3F",
            100: "#FFA9A9",
            50: "#FFCFCF",
            10: "#FFE8E8",
          },
          mon: {
            DEFAULT: "#DDCB29",
            500: "#F9E74B",
            100: "#FFF48F",
            50: "#FFF7B7",
            10: "#FFFCE4",
          },
          tue: {
            DEFAULT: "#DC2D96",
            500: "#FF67C2",
            100: "#FF9FD8",
            50: "#FFCBEA",
            10: "#FFEEF7",
          },
          wed: {
            DEFAULT: "#169632",
            500: "#54CE6F",
            100: "#7DDD92",
            50: "#A5EBB5",
            10: "#D3FFDC",
          },
          thu: {
            DEFAULT: "#E06D1A",
            500: "#FF9736",
            100: "#FFB978",
            50: "#FFCEA1",
            10: "#FFEDDC",
          },
          fri: {
            DEFAULT: "#2354D1",
            500: "#5283FF",
            100: "#89AAFF",
            50: "#B6CBFF",
            10: "#E3EBFF",
          },
          sat: {
            DEFAULT: "#A121CE",
            500: "#CB59F3",
            100: "#D179F0",
            50: "#EAB0FF",
            10: "#F6DFFF",
          },
        },
        accent: {
          success: {
            light: "#D3FCCF",
            DEFAULT: "#24B714",
            dark: "#0A4A03",
          },
          error: {
            light: "#FEEDEC",
            DEFAULT: "#EC1E2B",
            dark: "#750800",
          },
          warning: {
            light: "#FFF5CC",
            DEFAULT: "#FBBD1E",
            dark: "#5C4900",
          },
          info: {
            light: "#CCE6FF",
            DEFAULT: "#1469B8",
            dark: "#002F5C",
          },
        },
      },
      gridTemplateColumns: {
        ...generateGridColumns(),
      },
      gridRow: {
        ...generateGridRow(),
      },
      screens: {
        'xs': '480px',
        // => @media (min-width: 480px) { ... }
      },
    },
  },
  plugins: [require("daisyui"), require('tailwindcss-animated')],
};
