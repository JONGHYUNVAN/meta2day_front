import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'Noto Sans KR', 'Gothic A1', 'Nanum Gothic', 'sans-serif'],
        serif: ['Nanum Myeongjo', 'serif'],
        handwriting: ['Dancing Script', 'Pacifico', 'cursive'],
      },
    },
  },
  plugins: [],
};
export default config;
