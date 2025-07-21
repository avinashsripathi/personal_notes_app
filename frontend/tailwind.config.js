/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // scan all components & pages
  ],
  darkMode: "class", // ✅ enables dark mode using `class` strategy
  theme: {
    extend: {
      colors: {
        // Optional: Custom color palette
        primary: "#3b82f6", // blue-500
        secondary: "#fbbf24", // yellow-400
        danger: "#ef4444", // red-500
      },
      fontFamily: {
        // Optional: Add custom font families
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // ✅ enables `prose` for markdown
    // Add other plugins if needed like forms, aspect-ratio, etc.
  ],
};
