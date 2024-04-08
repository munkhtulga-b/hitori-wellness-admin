/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E4DCD5",
        grayLight: "#F4F5F6",
        grayMedium: "#DCDDE0",
        dividerLight: "#EFEFF1",
        dividerMedium: "#D6D7DC",
        aquaLight: "#B7DDFF",
        bgForm: "#FAFAFA",
        bgLayout: "#EBEBEB",
      },
      textColor: {
        primary: "#121316",
        secondary: "#525560",
        support: "#1890FF",
        required: "#D51E27",
        disabled: "#1C20243D",
        grayLight: "#505050",
      },
      borderColor: {
        primary: "#BABCC4",
        form: "#D6D7DC",
        info: "#B7DDFF",
        available: "#1890FF",
        subtle: "#EFEFF1",
        warning: "#F0ACB0",
      },
      ringColor: {
        active: "#B7DDFF",
      },
      placeholderColor: {
        primary: "#838795",
      },
      fontSize: {
        xs: ["10px", "14px"],
        sm: ["12px", "20px"],
        lg: ["16px", "24px"],
        xl: ["18px", "28px"],
        xxl: ["20px", "30px"],
      },
    },
  },
  plugins: [],
};
