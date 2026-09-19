/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#064E3B",
          primary: "#10B981",
          forest: "#059669",
          amber: "#F59E0B",
          bg: "#F8FAF9",
          card: "#FFFFFF",
          border: "#E2E8F0",
          subtext: "#64748B",
          muted: "#94A3B8"
        }
      },
      fontFamily: {
        number: ["Outfit", "Trebuchet MS", "sans-serif"],
        chinese: ["AlibabaPuHuiTi", "PingFang SC", "Microsoft YaHei", "sans-serif"]
      }
    },
  },
  plugins: [],
};
