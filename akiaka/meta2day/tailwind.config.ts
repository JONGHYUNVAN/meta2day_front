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
        handwriting: ['Dancing Script', 'Pacifico', 'Nanum Pen Script', 'cursive'],
        noto: ['Noto Sans KR', 'sans-serif'],
        nanumGothic: ['Nanum Gothic', 'sans-serif'],
        nanumMyeongjo: ['Nanum Myeongjo', 'serif'],
        nanumPenScript: ['Nanum Pen Script', 'cursive'],
        doHyeon: ['Do Hyeon', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
