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
          DEFAULT: "#1A3A2A",
          50:  "#F0F5F2",
          100: "#D6E8DC",
          200: "#A8CCBA",
          300: "#72A98F",
          400: "#448C6A",
          500: "#1A3A2A",
          600: "#163222",
          700: "#11261A",
          800: "#0D1E14",
          900: "#08120C",
          950: "#040A06",
        },
        secondary: {
          DEFAULT: "#C9A84C",
          50:  "#FBF7EC",
          100: "#F5EBCB",
          200: "#EDD8A0",
          300: "#E3C272",
          400: "#D9AC4E",
          500: "#C9A84C",
          600: "#A68838",
          700: "#7E6628",
          800: "#53441A",
          900: "#29220D",
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
        "gradient-brand": "linear-gradient(135deg, #1A3A2A 0%, #2D5A3D 50%, #1A3A2A 100%)",
        "gradient-gold": "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #A67C32 100%)",
        "gradient-hero": "linear-gradient(to bottom right, rgba(15,30,20,0.85), rgba(26,58,42,0.70))",
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
        card: "0 2px 16px rgba(26,58,42,0.08), 0 1px 4px rgba(26,58,42,0.04)",
        "card-hover": "0 8px 32px rgba(26,58,42,0.16), 0 2px 8px rgba(26,58,42,0.08)",
        gold: "0 4px 20px rgba(201,168,76,0.25)",
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
