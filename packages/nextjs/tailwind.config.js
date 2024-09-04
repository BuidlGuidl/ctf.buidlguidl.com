/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          primary: "#00ff00",
          "primary-content": "#000000",
          secondary: "#0066ff",
          "secondary-content": "#000000",
          accent: "#ff00ff",
          "accent-content": "#000000",
          neutral: "#1a1a1a",
          "neutral-content": "#00ff00",
          "base-100": "#000000",
          "base-200": "#0a0a0a",
          "base-300": "#1a1a1a",
          "base-content": "#00ff00",
          info: "#00ffff",
          success: "#00ff00",
          warning: "#ffff00",
          error: "#ff0000",

          "--rounded-btn": "9999rem",
          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
