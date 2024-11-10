/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        scaleDown: {
          '0%': { transform: 'scale(1.5)' },
          '100%': { transform: 'scale(0.5)' },
        },
      },
      animation: {
        scaleDown: 'scaleDown 0.5s ease-out forwards',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
