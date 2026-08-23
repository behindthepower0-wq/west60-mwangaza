import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1d4f38",
          50:  "#f0f6f3",
          100: "#d6e8dc",
          200: "#a8ccba",
          300: "#72a98f",
          400: "#448c6a",
          500: "#1d4f38",
          600: "#18402e",
          700: "#123022",
          800: "#0d2018",
          900: "#08120c",
          950: "#040a06",
        },
        secondary: {
          DEFAULT: "#c6912b",
          50:  "#fdf6ec",
          100: "#f5e9cb",
          200: "#edd8a0",
          300: "#e3c272",
          400: "#d9ac4e",
          500: "#c6912b",
          600: "#a07420",
          700: "#7e5618",
          800: "#533a10",
          900: "#29220d",
          950: "#151107",
        },
        warm: {
          white: "#F8F6F0",
          surface: "#F2F0EA",
          muted: "#E8E5DC",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-brand": "linear-gradient(135deg, #1d4f38 0%, #2a6b50 50%, #1d4f38 100%)",
        "gradient-gold": "linear-gradient(135deg, #c6912b 0%, #d9a94e 50%, #9e7420 100%)",
        "gradient-hero": "linear-gradient(to bottom right, rgba(15,48,33,0.85), rgba(29,79,56,0.70))",
      },
      backdropBlur: {
        xs: "2px",
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "28px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)",
        "glass-dark": "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
        card: "0 2px 16px rgba(29,79,56,0.08), 0 1px 4px rgba(29,79,56,0.04)",
        "card-hover": "0 8px 32px rgba(29,79,56,0.16), 0 2px 8px rgba(29,79,56,0.08)",
        gold: "0 4px 20px rgba(198,145,43,0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-up": "fadeUp 0.6s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
        "slide-in-left": "slideInLeft 0.4s ease-out",
        "count-up": "countUp 0.3s ease-out",
        "shimmer": "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      screens: {
        xs: "475px",
        "3xl": "1920px",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
