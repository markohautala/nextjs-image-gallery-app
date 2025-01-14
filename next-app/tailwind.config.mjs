/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Include files in `app`
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Include files in `components`
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Include files in `pages` (if used)
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

export default config;
